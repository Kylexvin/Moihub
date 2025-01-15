import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowLeft } from 'lucide-react';
import { Card, ProgressBar } from './Card';



const MoiLink = () => {
  const [step, setStep] = useState(1);
  const [routes, setRoutes] = useState([]);
  const [matatus, setMatatus] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedMatatu, setSelectedMatatu] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matatuCount, setMatatuCount] = useState(0);




  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/routes');
      setRoutes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch routes. Please try again.');
      console.error('Error fetching routes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSelect = async (route) => {
    setSelectedRoute(route);
    try {
        setLoading(true);

        // Fetch matatus by route
        const response = await axios.get(`http://localhost:5000/api/route/matatu/${route._id}`);
        
        // Update state with matatus and their count
        setMatatus(response.data.matatus || []);
        setMatatuCount(response.data.count || 0);

        setStep(2);
        setError(null);
    } catch (err) {
        setError('Failed to fetch matatus for this route. Please try again.');
        console.error('Error fetching matatus:', err);
    } finally {
        setLoading(false);
    }
};




  const handleMatatuSelect = async (matatu) => {
    setSelectedMatatu(matatu);
    const today = new Date().toISOString().split('T')[0];
    try {
      setLoading(true);
      const seatPromises = Array.from({ length: matatu.totalSeats }, async (_, index) => {
        const seatNumber = index + 1;
        const response = await axios.get(
          `http://localhost:5000/api/bookings/check-availability`,
          {
            params: {
              matatuId: matatu._id,
              seatNumber,
              travelDate: today
            }
          }
        );
        return {
          id: seatNumber,
          isAvailable: response.data.isAvailable
        };
      });

      const seatAvailability = await Promise.all(seatPromises);
      setSeats(seatAvailability);
      setStep(3);
      setError(null);
    } catch (err) {
      setError('Failed to check seat availability. Please try again.');
      console.error('Error checking seat availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = (seat) => {
    if (seat.isAvailable) {
      setSelectedSeat(seat);
      setStep(4);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const bookingResponse = await axios.post('http://localhost:5000/api/bookings/book', {
        matatuId: selectedMatatu._id,
        seatNumber: selectedSeat.id,
        travelDate: new Date().toISOString().split('T')[0],
      });
      setStep(5);
      setError(null);
    } catch (err) {
      setError('Failed to process booking. Please try again.');
      console.error('Error processing booking:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <ProgressBar currentStep={step} />

      
      
{/* Step 1: Route Selection */}
{step === 1 && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-6"
  >
    <h2 className="text-2xl font-bold text-center mb-6">Available Routes</h2>

    <div className="relative">
      <input
        type="text"
        placeholder="Search destinations..."
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
      />
    </div>

    <div className="grid gap-4">
      {routes.map((route) => {
        // Fetch matatu details from the API
        const activeMatatus = route.matatus?.filter(
          matatu => matatu.status === 'active' && !matatu.seatLayout.every(seat => seat.isBooked)
        ) || [];

        // Find the next departure time
        const nextDeparture = activeMatatus
          .map(m => m.departureTime)
          .sort()[0];

        // Calculate time until next departure
        const getTimeUntilDeparture = (departureTime) => {
          if (!departureTime) return null;
          const [hours, minutes] = departureTime.split(':').map(Number);
          const departure = new Date();
          departure.setHours(hours, minutes, 0);
          const now = new Date();
          
          let diff = departure - now;
          if (diff < 0) {
            departure.setDate(departure.getDate() + 1);
            diff = departure - now;
          }
          
          const minutesUntil = Math.floor(diff / (1000 * 60));
          if (minutesUntil < 60) {
            return `${minutesUntil} mins`;
          }
          return `${Math.floor(minutesUntil / 60)}h ${minutesUntil % 60}m`;
        };

        const timeUntilDeparture = getTimeUntilDeparture(nextDeparture);

        return (
          <div
            key={route._id}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer ${
              selectedRoute?._id === route._id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleRouteSelect(route)}
          >
            <div className="p-4">
              {/* Route Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
                  <p className="text-sm text-blue-600">
                    {activeMatatus.length > 0 ? 'Active Route' : 'No Vehicles Available'}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-bold text-gray-900">
                    Ksh {route.basePrice}
                  </span>
                  <span className="text-sm text-gray-500">per person</span>
                </div>
              </div>

              {/* Route Details */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <MapPin size={18} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">From:</span>
                      <span className="text-sm text-gray-600">{route.pickupPoint}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-medium text-gray-700">To:</span>
                      <span className="text-sm text-gray-600">{route.droppingPoint}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock size={18} className="text-gray-400" />
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{route.distance} km</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-600">{route.estimatedDuration}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                {activeMatatus.length > 0 && (
                  <>
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                      {activeMatatus.length} vehicle{activeMatatus.length !== 1 ? 's' : ''} available
                    </span>
                    {timeUntilDeparture && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        Next departure in {timeUntilDeparture}
                      </span>
                    )}
                  </>
                )}
                {activeMatatus.length === 0 && (
                  <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                    No vehicles currently available
                  </span>
                )}
                <span className="text-xs text-gray-400 ml-auto">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Quick Stats */}
    <div className="mt-8 bg-gray-50 rounded-lg p-4">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500">Total Routes</p>
          <p className="text-xl font-semibold text-gray-900">{routes.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Active Routes</p>
          <p className="text-xl font-semibold text-gray-900">
            {routes.filter(r => r.matatus?.some(m => m.status === 'active')).length}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
)}


        {/* Step 2: Matatu Selection */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Choose your ride</h2>
            <div className="grid gap-4">
              {map matatu of the clicked route ((matatu) => (
                <Card
                  key={matatu._id}
                  className={`p-6 cursor-pointer ${
                    !matatu.isAvailable ? 'opacity-50' : ''
                  }`}
                  onClick={() => matatu.isAvailable && handleMatatuSelect(matatu)}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span>🚐</span>
                          <span className="font-semibold">{matatu details here}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-600">
                          <span>Departure: {departureTime here}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-lg font-semibold text-gray-900">
                      Price: Ksh {price here}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Available Seats: {availableSeats here}
                    </div>
                    
                    <div className={`text-sm ${!matatu.isAvailable ? 'text-red-600' : 'text-green-600'}`}>
                      {!matatu.isAvailable ? "Fully Booked" : "Available"}
                    </div>
                    
                   
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Seat Selection */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Pick your seat</h2>
            <Card className="p-6">
              <div className="mb-6">
                <div className="flex justify-center space-x-8">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                    <span>Selected</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {seats.map((seat) => (
                  <button
                    key={seat.id}
                    className={`p-4 rounded-lg ${
                      seat.isAvailable
                        ? selectedSeat?.id === seat.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-100 hover:bg-blue-200'
                        : 'bg-gray-200 cursor-not-allowed'
                    }`}
                    onClick={() => handleSeatSelect(seat)}
                    disabled={!seat.isAvailable}
                  >
                    {seat.id}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Complete your booking</h2>
            <Card className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-600">Route</span>
                    <span className="font-medium">{selectedRoute.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-600">Matatu</span>
                    <span className="font-medium">{selectedMatatu.plateNumber}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-600">Seat Number</span>
                    <span className="font-medium">{selectedSeat.id}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-600">Departure Time</span>
                    <span className="font-medium">{selectedMatatu.departureTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Price</span>
                    <span className="text-xl font-bold text-blue-600">Ksh {selectedRoute.price}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Payment Method</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <button className="p-4 border-2 border-blue-500 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-50">
                      <span>💳</span>
                      <span>M-PESA</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Pay Now
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">✓</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold">Booking Confirmed!</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <p className="text-lg font-medium">
                  Ticket #{Math.floor(Math.random() * 100000)}
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>Route: {selectedRoute.name}</p>
                  <p>Matatu: {selectedMatatu.plateNumber}</p>
                  <p>Seat: {selectedSeat.id}</p>
                  <p>Departure: {selectedMatatu.departureTime}</p>
                </div>
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-gray-500">
                  A confirmation has been sent to your email and phone number.
                    Show this ticket to the driver before boarding.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setStep(1);
                        setSelectedRoute(null);
                        setSelectedMatatu(null);
                        setSelectedSeat(null);
                        setSeats([]);
                      }}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      Book Another Ticket
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        // Add download ticket functionality here
                        console.log('Download ticket');
                      }}
                      className="w-full border border-blue-500 text-blue-500 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                    >
                      Download Ticket
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MoiLink;