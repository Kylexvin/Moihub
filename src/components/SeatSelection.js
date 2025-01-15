import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const SeatSelection = ({ selectedMatatu, selectedRoute, selectedSeat, setSelectedSeat, setBookingDetails, setStep, setPaymentStatus, setUserHeldSeats, setTemporaryBookings, setLockedSeats, setSeatCheckLoading, getBookedSeats, checkUserTemporaryBookings, handleBooking }) => {
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seatCheckLoading, setLocalSeatCheckLoading] = useState(false);
  const [localUserHeldSeats, setLocalUserHeldSeats] = useState([]); // Renamed
  const [temporaryBookings, setLocalTemporaryBookings] = useState([]); // Renamed
  const [lockedSeats, setLocalLockedSeats] = useState({}); // Renamed
  const navigate = useNavigate();

  const checkSeatAvailability = async (matatuId, seatNumber) => {
    try {
      const travelDate = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `http://localhost:5000/api/bookings/check-availability?matatuId=${matatuId}&seatNumber=${seatNumber}&travelDate=${travelDate}`
      );
      const data = await response.json();
      const isLocked = isSeatLocked(seatNumber);
      return data.available || isLocked;
    } catch (err) {
      console.error('Error checking seat availability:', err);
      throw new Error('Failed to check seat availability');
    }
  };

  useEffect(() => {
    if (selectedMatatu) {
      getBookedSeats(selectedMatatu._id);
      checkUserTemporaryBookings();
    }
  }, [selectedMatatu]);

  const isSeatBooked = (seatNumber) => {
    return bookedSeats.includes(seatNumber) && !localUserHeldSeats.includes(seatNumber);
  };

  const isSeatAvailable = (seatNumber) => {
    return !bookedSeats.includes(seatNumber) || localUserHeldSeats.includes(seatNumber);
  };

  const isSeatLocked = (seatNumber) => {
    const lockExpiry = lockedSeats[seatNumber];
    return lockExpiry && new Date(lockExpiry) > new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/vehicle-selection')}
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
                  const isBooked = isSeatBooked(seatNumber);
                  const isUserHeld = localUserHeldSeats.includes(seatNumber);
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
    </div>
  );
};

export default SeatSelection;