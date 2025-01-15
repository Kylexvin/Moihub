import React, { useState, useEffect } from 'react';
import { MapPin, Clock, AlertCircle } from 'lucide-react';  // Add AlertCircle to the import

const MoiLink = () => {
  const [routes, setRoutes] = useState([]);
  const [matatus, setMatatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedMatatu, setSelectedMatatu] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null); 
  const [bookedSeats, setBookedSeats] = useState([]);
  const [step, setStep] = useState(1);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [userHeldSeats, setUserHeldSeats] = useState([]);
  const [temporaryBookings, setTemporaryBookings] = useState([]);
  const [seatCheckLoading, setSeatCheckLoading] = useState(false);
  const [lockedSeats, setLockedSeats] = useState({});

  const fetchRoutes = async () => {
    try {
      setLoading(true);

      // Fetch routes
      const response = await fetch('http://localhost:5000/api/routes');
      const data = await response.json();

      if (!Array.isArray(data)) throw new Error('Invalid routes data');

      // Set routes state once
      setRoutes(data);

      // Fetch matatus for all routes
      const matatuPromises = data.map((route) => fetchMatatusForRoute(route._id));
      const matatusData = await Promise.all(matatuPromises);

      // Combine all matatus into a single state update
      const matatusByRoute = matatusData.reduce((acc, matatus, index) => {
        acc[data[index]._id] = matatus;
        return acc;
      }, {});

      setMatatus(matatusByRoute);

      setError(null);
    } catch (err) {
      setError('Failed to fetch routes. Please try again.');
      console.error('Error fetching routes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMatatu) {
      checkUserTemporaryBookings();
    }
  }, [selectedMatatu]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (selectedMatatu) {
      getBookedSeats(selectedMatatu._id);
    }
  }, [selectedMatatu]);

  useEffect(() => {
    if (selectedMatatu && step === 3) {
      getBookedSeats(selectedMatatu._id);
      checkUserTemporaryBookings();
    }
  }, [selectedMatatu, step]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tempBookings = localStorage.getItem('temporaryBookings');
      if (tempBookings) {
        setTemporaryBookings(JSON.parse(tempBookings));
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      setUserHeldSeats([]);
      setTemporaryBookings([]);
    };
  }, []);

  const fetchMatatusForRoute = async (routeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/routes/matatu/${routeId}`);
      const data = await response.json();

      if (!data || !Array.isArray(data.matatus)) throw new Error('Invalid matatus data');

      // Process matatus and calculate seat availability
      return data.matatus.map((matatu) => {
        const availableSeats = matatu.seatLayout?.filter((seat) => !seat.isBooked).length || 0;
        return {
          ...matatu,
          availableSeats,
          isAvailable: matatu.status === 'active' && availableSeats > 0,
        };
      });
    } catch (err) {
      console.error(`Error fetching matatus for route ${routeId}:`, err);
      return [];
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setStep(2);
  };

  const handleMatatuSelect = async (matatu) => {
    setSelectedMatatu(matatu);
    await getBookedSeats(matatu._id);
    setStep(3);
  };
 
const checkSeatAvailability = async (matatuId, seatNumber) => {
    try {
      const travelDate = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `http://localhost:5000/api/bookings/check-availability?matatuId=${matatuId}&seatNumber=${seatNumber}&travelDate=${travelDate}`
      );
      const data = await response.json();
  
      // Check if the seat is locked by the user
      const isLocked = isSeatLocked(seatNumber);
      return data.available || isLocked;
  
    } catch (err) {
      console.error('Error checking seat availability:', err);
      throw new Error('Failed to check seat availability');
    }
  };

  const getBookedSeats = async (matatuId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `http://localhost:5000/api/bookings/booked-seats/${matatuId}/${today}`
      );
      const data = await response.json();
      setBookedSeats(data.bookedSeats || []);
    } catch (err) {
      console.error('Error fetching booked seats:', err);
      setBookedSeats([]);
    }
  };

  const checkUserTemporaryBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      console.log('Checking temporary bookings for matatu:', selectedMatatu._id);
      const response = await fetch(`http://localhost:5000/api/bookings/temporary/${selectedMatatu._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Temporary bookings response:', data);
      
      if (data.temporaryBookings) {
        setTemporaryBookings(data.temporaryBookings);
        // If user has any temporary bookings, set their held seats
        const userSeats = data.temporaryBookings
          .filter(booking => booking.status === 'pending')
          .map(booking => booking.seatNumber);
        console.log('User held seats:', userSeats);
        setUserHeldSeats(userSeats);

        // Update locked seats
        const lockedSeats = data.temporaryBookings
          .filter(booking => booking.status === 'pending')
          .reduce((acc, booking) => {
            acc[booking.seatNumber] = booking.bookingExpiry;
            return acc;
          }, {});
        setLockedSeats(lockedSeats);
      }
    } catch (err) {
      console.error('Error fetching temporary bookings:', err);
    }
  };

  const handleBooking = async (seatNumber) => {
    try {
      setSeatCheckLoading(true);
      
      // First check availability
      const isAvailable = await checkSeatAvailability(selectedMatatu._id, seatNumber);
      
      if (!isAvailable) {
        alert('Sorry, this seat is no longer available.');
        await getBookedSeats(selectedMatatu._id); // Refresh booked seats
        setSeatCheckLoading(false);
        return;
      }
  
      // Get the user token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to continue with booking');
        // Redirect to login page here
        window.location.href = '/login';
        setSeatCheckLoading(false);
        return;
      }
  
      // Confirm booking
      const confirmBooking = window.confirm('Do you want to proceed with booking this seat?');
      if (!confirmBooking) {
        setSeatCheckLoading(false);
        return;
      }
  
      // Proceed with booking
      const response = await fetch('http://localhost:5000/api/bookings/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          matatuId: selectedMatatu._id,
          routeId: selectedRoute._id,
          seatNumber,
          travelDate: new Date().toISOString().split('T')[0],
          price: selectedMatatu.currentPrice || selectedRoute.basePrice
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking failed');
      }
  
      const data = await response.json();
      
      // Update booking details with more information
      setBookingDetails({
        ...data.booking,
        matatu: {
          ...selectedMatatu,
          route: selectedRoute
        },
        expiresIn: 900, // 15 minutes in seconds
        price: selectedMatatu.currentPrice || selectedRoute.basePrice
      });
  
      // Update local state to reflect the new booking
      setBookedSeats([...bookedSeats, seatNumber]);
      setSelectedSeat(null);
      
      // Store temporary booking in local storage
      const tempBookings = localStorage.getItem('temporaryBookings') ? JSON.parse(localStorage.getItem('temporaryBookings')) : [];
      tempBookings.push({ matatuId: selectedMatatu._id, seatNumber, status: 'pending', bookingExpiry: data.booking.bookingExpiry });
      localStorage.setItem('temporaryBookings', JSON.stringify(tempBookings));
  
      // Move to payment step
      setStep(4);
      
    } catch (err) {
      console.error('Error creating booking:', err);
      alert(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setSeatCheckLoading(false);
    }
  };

  const handleMpesaPayment = async () => {
    try {
      setPaymentStatus('processing');
      // Simulate MPesa payment API call
      const response = await fetch('http://localhost:5000/api/payments/mpesa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bookingId: bookingDetails.bookingId,
          amount: bookingDetails.price
        })
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      setPaymentStatus('completed');
      setTimeout(() => setStep(5), 1000); // Move to ticket step after payment
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentStatus('failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" aria-label="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 text-center bg-white rounded shadow">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchRoutes}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Define the seat availability functions
  const isSeatBooked = (seatNumber) => {
    // Check if the seat is in bookedSeats but not in userHeldSeats
    return bookedSeats.includes(seatNumber) && !userHeldSeats.includes(seatNumber);
  };

  const isSeatAvailable = (seatNumber) => {
    // Check if the seat is not in bookedSeats and not in userHeldSeats
    return !bookedSeats.includes(seatNumber) || userHeldSeats.includes(seatNumber);
  };

  const isSeatLocked = (seatNumber) => {
    // Check if the seat is locked and the lock has not expired
    const lockExpiry = lockedSeats[seatNumber];
    return lockExpiry && new Date(lockExpiry) > new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {['Select Route', 'Choose Vehicle', 'Book Seats', 'Payment'].map((stepName, idx) => (
              <div key={idx} className="flex flex-col items-center w-1/4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                  ${idx + 1 === step ? 'bg-indigo-600 text-white' : 
                    idx + 1 < step ? 'bg-green-500 text-white' : 
                    'bg-gray-200 text-gray-600'}`}>
                  {idx + 1 < step ? '✓' : idx + 1}
                </div>
                <span className="text-xs text-center font-medium text-gray-600">{stepName}</span>
              </div>
            ))}
          </div>
          <div className="relative">
            <div className="absolute h-1 w-full bg-gray-200 rounded"></div>
            <div 
              className="absolute h-1 bg-indigo-600 rounded transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          </div>
        </div>
        
        {/* Step 1: Route Selection */}
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Available Routes
            </h2>
            <div className="space-y-6">
              {routes.map((route) => {
                const routeMatatus = matatus[route._id] || [];
                const availableMatatus = routeMatatus.filter(m => m.availableSeats > 0);

                return (
                  <div
                    key={route._id}
                    onClick={() => handleRouteSelect(route)}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className="p-6 border border-gray-100 rounded-2xl hover:border-indigo-100">
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {route.name}
                          </h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                            ${availableMatatus.length > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'}`}>
                            {availableMatatus.length > 0 ? '🚌 Active Route' : '⚠️ No Vehicles Available'}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-2xl font-bold text-indigo-600">
                            Ksh {route.basePrice}
                          </span>
                          <span className="text-sm text-gray-500">per person</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-full">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                              <MapPin size={18} className="text-indigo-600" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-semibold text-gray-700">From:</span>
                              <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                                {route.pickupPoint}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-semibold text-gray-700">To:</span>
                              <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                                {route.droppingPoint}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Step 2: Vehicle Selection */}
        {step === 2 && selectedRoute && (
          <>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setStep(1)}
                className="text-blue-600 hover:text-blue-700"
              >
                ← Back to Routes
              </button>
              <h2 className="text-2xl font-bold">Choose your ride</h2>
            </div>
            <div className="space-y-4">
              {matatus[selectedRoute._id]?.map((matatu) => {
                const availableSeats = matatu.seatLayout?.filter(seat => !seat.isBooked).length || 0;
                const isAvailable = matatu.status === 'active' && availableSeats > 0;

                return (
                  <div
                    key={matatu._id}
                    onClick={() => isAvailable && handleMatatuSelect(matatu)}
                    className={`bg-white rounded-lg shadow p-6 ${
                      isAvailable ? 'cursor-pointer hover:shadow-lg' : 'opacity-75 cursor-not-allowed'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span>🚐</span>
                            <span className="font-semibold">{matatu.registrationNumber}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-gray-600">
                            <Clock size={18} />
                            <span>Departure: {matatu.departureTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-lg font-semibold text-gray-900">
                        Price: Ksh {matatu.currentPrice}
                      </div>

                      <div className="text-sm text-gray-600">
                        Available Seats: {availableSeats}
                      </div>

                      <div className="text-sm">
                        Status: <span className={matatu.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                          {matatu.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {step === 3 && selectedMatatu && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setStep(2)}
                className="text-blue-600 hover:text-blue-700"
              >
                ← Back to Vehicles
              </button>
              <h2 className="text-2xl font-bold">Select Your Seat</h2>
            </div>
        
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold">{selectedMatatu.registrationNumber}</h3>
                <p className="text-gray-600">Departure: {selectedMatatu.departureTime}</p>
                <p className="text-gray-600">Price: Ksh {selectedMatatu.currentPrice || selectedRoute.basePrice}</p>
              </div>
        
              {/* Add the legend here, before the loading check */}
              <div className="mb-6 flex items-center space-x-6 justify-center bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-600">Booked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-gray-600">Your Hold</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">Selected</span>
                </div>
              </div>
        
              {loading || seatCheckLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : (
                <>
                  {/* Driver's Seat Indication */}
                  <div className="mb-6 flex justify-end">
                    <div className="bg-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">
                      👤 Driver's Seat
                    </div>
                  </div>
        
                  <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: selectedMatatu.totalSeats || 14 }, (_, index) => {
                      const seatNumber = index + 1;
                      const isBooked = bookedSeats.includes(seatNumber);
                      const isUserHeld = userHeldSeats.includes(seatNumber);
                      const isSelected = selectedSeat === seatNumber;
                      const isLocked = isSeatLocked(seatNumber);
        
                      return (
                        <button
                          key={seatNumber}
                          onClick={() => {
                            if (isSeatAvailable(seatNumber) || isLocked) {
                              const token = localStorage.getItem('token');
                              if (!token) {
                                const confirmLogin = window.confirm('Please log in to select a seat. Would you like to go to the login page?');
                                if (confirmLogin) {
                                  localStorage.setItem('pendingBooking', JSON.stringify({
                                    routeId: selectedRoute._id,
                                    matatuId: selectedMatatu._id,
                                    seatNumber,
                                    step: 3
                                  }));
                                  window.location.href = '/login';
                                  return;
                                }
                                return;
                              }
                              setSelectedSeat(seatNumber);
                            }
                          }}
                          disabled={isBooked && !isLocked}
                          className={`relative p-4 rounded-lg text-center transition-all duration-200 
                            ${isBooked && !isLocked
                              ? 'bg-red-500 text-white cursor-not-allowed hover:bg-red-600'
                              : isUserHeld
                              ? 'bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer'
                              : isSelected
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                            } transform hover:scale-105`}
                        >
                          <span className="font-medium">{`Seat ${seatNumber}`}</span>
                          {isBooked && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                              Taken
                            </span>
                          )}
                          {isUserHeld && (
                            <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                              Your Hold
                            </span>
                          )}
                          {isLocked && (
                            <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                              Locked
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
        
                  {selectedSeat && (
                    <div className="mt-6 flex flex-col items-center space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center w-full">
                        <p className="text-blue-800 font-medium">
                          You've selected Seat {selectedSeat}
                        </p>
                        <p className="text-sm text-blue-600">
                          Click confirm to proceed with booking
                        </p>
                      </div>
                      <button
                        onClick={() => handleBooking(selectedSeat)}
                        disabled={loading || seatCheckLoading}
                        className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 w-full sm:w-auto"
                      >
                        {loading || seatCheckLoading ? 'Checking...' : 'Confirm Booking'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && bookingDetails && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold">Complete Your Payment</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Booking Reference</p>
                    <p className="font-medium">{bookingDetails.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-medium">KSH {bookingDetails.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vehicle</p>
                    <p className="font-medium">{bookingDetails.matatu.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Departure</p>
                    <p className="font-medium">{bookingDetails.matatu.departureTime}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Payment expires in: {Math.floor(bookingDetails.expiresIn / 60)} minutes
                </div>
              </div>
              
              <button
                onClick={handleMpesaPayment}
                disabled={paymentStatus === 'processing'}
                className={`w-full p-4 rounded-lg ${
                  paymentStatus === 'processing'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white font-semibold transition-colors duration-200`}
              >
                {paymentStatus === 'processing' ? 'Processing...' : 'Pay with M-Pesa'}
              </button>

              {paymentStatus === 'failed' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800">Payment Failed</h3>
                    <p className="text-sm text-red-600">
                      Please try again or contact support if the problem persists.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Ticket */}
        {step === 5 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold">Ticket Generated Successfully</h2>
            </div>

            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Travel Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Vehicle</p>
                    <p className="font-medium">{bookingDetails.matatu.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Departure</p>
                    <p className="font-medium">{bookingDetails.matatu.departureTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Booking ID</p>
                    <p className="font-medium">{bookingDetails.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount Paid</p>
                    <p className="font-medium">KSH {bookingDetails.price}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-200"
              >
                Download Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoiLink;