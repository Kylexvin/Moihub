import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, AlertCircle } from 'lucide-react';

const SeatSelectionPage = () => {
  const { matatuId } = useParams();
  const [matatu, setMatatu] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState({});
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userHeldSeats, setUserHeldSeats] = useState([]);
  const [heldSeats, setHeldSeats] = useState({});

  const fetchMatatuDetails = async (matatuId) => {
    try {
      console.log('Fetching matatu details for ID:', matatuId);
      const response = await fetch(`http://localhost:5000/api/matatus/${matatuId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch matatu details');
      }
      const data = await response.json();
      console.log('Fetched matatu details:', data);
      setMatatu(data);
    } catch (err) {
      setError('Failed to fetch matatu details. Please try again.');
      console.error('Error fetching matatu details:', err);
    }
  };

  const getBookedSeats = async (matatuId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `http://localhost:5000/api/bookings/booked-seats/${matatuId}/${today}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch booked seats');
      }
      const data = await response.json();
      console.log('Fetched booked seats:', data);
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
      const response = await fetch(`http://localhost:5000/api/bookings/temporary/${matatuId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      const data = await response.json();

      if (data.temporaryBookings) {
        setTemporaryBookings(data.temporaryBookings);
        const userSeats = data.temporaryBookings
          .filter(booking => booking.status === 'pending')
          .map(booking => booking.seatNumber);
        setUserHeldSeats(userSeats);

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

  useEffect(() => {
    const fetchMatatuData = async () => {
      try {
        setLoading(true);
        if (matatuId) {
          await fetchMatatuDetails(matatuId);
          await getBookedSeats(matatuId);
          await checkUserTemporaryBookings();
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatatuData();
  }, [matatuId]);

  const getSeatStatus = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return 'booked';
    if (userHeldSeats.includes(seatNumber)) return 'held';
    if (selectedSeat === seatNumber) return 'selected';
    return 'available';
  };

  const formatExpiryTime = (expiryDate) => {
    if (!expiryDate) return '';
    const date = new Date(expiryDate);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSeatSelect = (seatNumber) => {
    if (getSeatStatus(seatNumber) === 'booked') return;
    setSelectedSeat(seatNumber);
  };

  const holdSeat = async (seatNumber) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to continue with booking');
        window.location.href = '/login';
        return;
      }

      const confirmHold = window.confirm('Do you want to hold this seat?');
      if (!confirmHold) {
        return;
      }

      const response = await fetch('http://localhost:5000/api/bookings/lock-seat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          matatuId,
          seatNumber,
          travelDate: new Date().toISOString().split('T')[0]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to hold seat');
      }

      const data = await response.json();

      const heldSeat = data.lockedSeat;
      setHeldSeats((prevHeldSeats) => ({
        ...prevHeldSeats,
        [heldSeat.seatNumber]: heldSeat
      }));

      setUserHeldSeats((prevHeldSeats) => [...prevHeldSeats, seatNumber]);
      setSelectedSeat(null);
      alert(`Seat ${heldSeat.seatNumber} held successfully. You have 5 minutes to confirm the booking.`);
    } catch (err) {
      console.error('Error holding seat:', err);
      alert(err.message || 'Failed to hold seat. Please try again.');
    }
  };

  const handleBooking = async (seatNumber) => {
    try {
      const heldSeat = heldSeats[seatNumber];
      if (!heldSeat) {
        alert('This seat is not held. Please select and hold a seat first.');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to continue with booking');
        window.location.href = '/login';
        return;
      }

      const confirmBooking = window.confirm('Do you want to proceed with booking this seat?');
      if (!confirmBooking) {
        return;
      }

      const response = await fetch('http://localhost:5000/api/bookings/confirm-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: heldSeat.bookingId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking failed');
      }

      const data = await response.json();

      const bookingDetails = {
        ...data.booking,
        matatu: {
          ...matatu,
          route: matatu.route
        },
        price: matatu.currentPrice,
        expiresIn: 900 // 15 minutes in seconds
      };

      setBookedSeats([...bookedSeats, seatNumber]);
      setHeldSeats((prevHeldSeats) => {
        const newHeldSeats = { ...prevHeldSeats };
        delete newHeldSeats[seatNumber];
        return newHeldSeats;
      });

      setUserHeldSeats((prevHeldSeats) => prevHeldSeats.filter(seat => seat !== seatNumber));

      navigate('/payment', { state: { bookingDetails } });
    } catch (err) {
      console.error('Error creating booking:', err);
      alert(err.message || 'Failed to create booking. Please try again.');
    }
  };

  const cancelHold = async (seatNumber) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to continue with booking');
        window.location.href = '/login';
        return;
      }

      const confirmCancel = window.confirm('Do you want to cancel the hold for this seat?');
      if (!confirmCancel) {
        return;
      }

      const response = await fetch(`http://localhost:5000/api/bookings/cancel-hold/${seatNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel hold');
      }

      const data = await response.json();

      if (data.message === 'Hold cancelled successfully') {
        setHeldSeats((prevHeldSeats) => {
          const newHeldSeats = { ...prevHeldSeats };
          delete newHeldSeats[seatNumber];
          return newHeldSeats;
        });

        setUserHeldSeats((prevHeldSeats) => prevHeldSeats.filter(seat => seat !== seatNumber));
        alert('Hold cancelled successfully.');
      }
    } catch (err) {
      console.error('Error cancelling hold:', err);
      alert(err.message || 'Failed to cancel hold. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !matatu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {error || 'Matatu Not Found'}
          </h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Select Your Seat</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>{matatu.route}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Departure: {matatu.departureTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">KSH {matatu.currentPrice}</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="p-6 border-b">
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-red-500"></div>
                <span>Booked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
                <span>Held</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-green-500"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>

          {/* Seats Grid */}
          <div className="p-6">
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              {Array.from({ length: matatu.totalSeats }, (_, index) => {
                const seatNumber = index + 1;
                const status = getSeatStatus(seatNumber);
                const isDisabled = status === 'booked';

                return (
                  <button
                    key={seatNumber}
                    onClick={() => !isDisabled && handleSeatSelect(seatNumber)}
                    disabled={isDisabled}
                    className={`relative p-6 rounded-lg text-white font-medium transform transition-all duration-200
                      ${status === 'booked' ? 'bg-red-500 cursor-not-allowed' :
                        status === 'held' ? 'bg-yellow-500 hover:bg-yellow-600' :
                        status === 'selected' ? 'bg-green-500 hover:bg-green-600' :
                        'bg-blue-500 hover:bg-blue-600'}
                      ${!isDisabled && 'hover:scale-105'}`}
                  >
                    <span className="text-lg">{seatNumber}</span>
                    {status === 'held' && heldSeats[seatNumber] && (
                      <div className="absolute -top-3 -right-3 bg-yellow-600 text-xs px-2 py-1 rounded-full">
                        Expires: {formatExpiryTime(heldSeats[seatNumber].expiresAt)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          {selectedSeat && (
            <div className="p-6 bg-gray-50 border-t">
              <div className="max-w-md mx-auto">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-blue-800 font-medium text-center">
                    Selected: Seat {selectedSeat}
                  </p>
                </div>
                <button
                  onClick={() => holdSeat(selectedSeat)}
                  className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold
                    hover:bg-yellow-600 transition-colors duration-200"
                >
                  Hold Seat
                </button>
              </div>
            </div>
          )}

          {/* Held Seats Section */}
          {Object.keys(heldSeats).length > 0 && (
            <div className="p-6 bg-gray-50 border-t">
              <div className="max-w-md mx-auto">
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Your Held Seats</h3>
                  <div className="space-y-2">
                    {Object.entries(heldSeats).map(([seatNumber, info]) => (
                      <div key={seatNumber} className="flex justify-between items-center">
                        <span>Seat {seatNumber}</span>
                        <span className="text-yellow-600">
                          Expires at {formatExpiryTime(info.expiresAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {Object.keys(heldSeats).map(seatNumber => (
                  <div key={seatNumber} className="mb-2">
                    <button
                      onClick={() => handleBooking(seatNumber)}
                      className="w-full bg-green-500 text-white py-3 rounded-lg font-bold
                        hover:bg-green-600 transition-colors duration-200 mb-2"
                    >
                      Confirm Booking for Seat {seatNumber}
                    </button>
                    <button
                      onClick={() => cancelHold(seatNumber)}
                      className="w-full bg-red-500 text-white py-3 rounded-lg font-bold
                        hover:bg-red-600 transition-colors duration-200"
                    >
                      Cancel Hold for Seat {seatNumber}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;