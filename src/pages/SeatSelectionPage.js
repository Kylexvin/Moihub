import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://moihub.onrender.com/api';

const SeatSelectionPage = () => {
  const { matatuId } = useParams();
  const navigate = useNavigate();
  const [matatu, setMatatu] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seatLoading, setSeatLoading] = useState(null); // For individual seat loading
  const [error, setError] = useState(null);
  const [seatStatuses, setSeatStatuses] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  // Check authentication status and get user ID
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    setIsAuthenticated(!!token);
    setUserId(storedUserId);
  }, []);

  // Add auth token to requests
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Fetch initial matatu data
  useEffect(() => {
    const fetchMatatu = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/matatus/${matatuId}`);
        setMatatu(response.data);
        
        const statuses = {};
        response.data.seatLayout.forEach(seat => {
          statuses[seat.seatNumber] = {
            isBooked: seat.isBooked,
            locked_by: seat.locked_by,
            lock_expiry: seat.lock_expiry
          };
        });
        setSeatStatuses(statuses);
      } catch (err) {
        console.error('Error fetching matatu:', err);
        setError('Failed to fetch matatu details');
      } finally {
        setLoading(false);
      }
    };

    fetchMatatu();
  }, [matatuId]);

  const handleSeatClick = async (seat) => {
    if (!isAuthenticated) {
      const confirmLogin = window.confirm('You need to be logged in to select seats. Would you like to log in now?');
      if (confirmLogin) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        navigate('/login');
      }
      return;
    }

    try {
      setSeatLoading(seat.seatNumber);

      // If clicking the same seat, deselect it
      if (selectedSeat?.seatNumber === seat.seatNumber) {
        setSelectedSeat(null);
        setSeatLoading(null);
        return;
      }

      // If another seat is selected, deselect it first
      if (selectedSeat) {
        setSelectedSeat(null);
      }

      const response = await axios.post(`${API_BASE_URL}/bookings/${matatuId}/lock/${seat._id}`);
      
      if (response.data.message.includes('successfully')) {
        const { seat: lockedSeat, lock_expiry, matatu_details } = response.data;
        
        setSelectedSeat({
          ...lockedSeat,
          seatNumber: seat.seatNumber,
          lock_expiry,
          matatu_details
        });

        setSeatStatuses(prev => ({
          ...prev,
          [seat.seatNumber]: {
            isBooked: lockedSeat.isBooked,
            locked_by: lockedSeat.locked_by,
            lock_expiry: lock_expiry
          }
        }));
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        console.error('Error handling seat selection:', err);
        const message = err.response?.data?.message || 'Failed to select seat. Please try again.';
        alert(message);
      }
    } finally {
      setSeatLoading(null);
    }
  };

  const proceedToBooking = () => {
    if (!isAuthenticated) {
      const confirmLogin = window.confirm('You need to be logged in to proceed with booking. Would you like to log in now?');
      if (confirmLogin) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        navigate('/login');
      }
      return;
    }

    if (!selectedSeat) {
      alert('Please select a seat');
      return;
    }

    // Check if the seat is still locked by the current user
    const now = new Date().toISOString();
    const isStillLocked = selectedSeat.lock_expiry > now && 
                         selectedSeat.locked_by === userId;

    if (!isStillLocked) {
      alert('Your seat lock has expired. Please select the seat again.');
      setSelectedSeat(null);
      return;
    }

    // Store selected seat in session storage
    sessionStorage.setItem('selectedSeats', JSON.stringify({
      matatuId,
      seats: [selectedSeat.seatNumber],
      seatIds: [selectedSeat._id],
      price: matatu.currentPrice,
      registration: matatu.registrationNumber,
      departure_time: selectedSeat.matatu_details.departure_time,
      route: selectedSeat.matatu_details.route
    }));

    // Navigate to booking page
    navigate(`/booking-confirmation/${matatuId}/${selectedSeat._id}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
    </div>
  );

  if (error) return (
    <div className="p-4 text-red-500 text-center">
      {error}
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>
  );

  if (!matatu) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-bold">Select Your Seat - {matatu.registrationNumber}</h1>
          <p className="text-sm text-gray-600 mt-2">
            {!isAuthenticated && 'Please log in to select a seat and make a booking'}
          </p>
        </div>

        <div className="p-6">
          {/* Vehicle Info */}
          <div className="mb-6 space-y-2 text-sm bg-white p-4 rounded-lg shadow-sm">
            <p className="font-medium">Route: {matatu.route?.origin} - {matatu.route?.destination}</p>
            <p className="font-medium">Departure Time: {matatu.departureTime}</p>
            <p className="font-medium">Price per seat: KSH {matatu.currentPrice}</p>
            <p>Selected seat: {selectedSeat ? selectedSeat.seatNumber : 'None'}</p>
            <p className="font-medium">Total amount: KSH {selectedSeat ? matatu.currentPrice : 0}</p>
          </div>

          {/* Seat Layout */}
          <div className="grid grid-cols-2 gap-4 p-6 bg-gray-200 rounded-lg">
            <div className="col-span-2 p-4 bg-gray-400 rounded-lg mb-4 text-center font-medium text-white">
              Driver's Area
            </div>

            <div className="grid grid-cols-2 gap-4 col-span-2">
              {matatu.seatLayout.map((seat) => {
                const status = seatStatuses[seat.seatNumber];
                const isLocked = status?.locked_by && status.lock_expiry > new Date().toISOString();
                const isLockedByMe = isLocked && status.locked_by === userId;
                const isSelected = selectedSeat?.seatNumber === seat.seatNumber;
                const isLoading = seatLoading === seat.seatNumber;

                return (
                  <button
                    key={seat._id}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.isBooked || (isLocked && !isLockedByMe) || isLoading}
                    className={`
                      relative p-6 rounded-lg text-center transition-all
                      border-2 shadow-md
                      ${isLoading 
                        ? 'bg-gray-100 border-gray-300 cursor-wait' 
                        : seat.isBooked 
                          ? 'bg-red-100 border-red-500 text-red-700 cursor-not-allowed' 
                          : isLocked && !isLockedByMe
                            ? 'bg-yellow-100 border-yellow-500 text-yellow-700 cursor-not-allowed'
                            : isSelected
                              ? 'bg-green-500 border-green-600 text-white shadow-lg'
                              : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'}
                    `}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {isLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : seat.isBooked ? (
                        <X size={16} className="text-red-500" />
                      ) : isSelected ? (
                        <Check size={16} />
                      ) : null}
                      <span className="font-medium text-lg">Seat {seat.seatNumber}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm bg-white p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-50 border-2 border-blue-300 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 border-2 border-green-600 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-100 border-2 border-red-500 rounded"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
              <span>Locked by Another User</span>
            </div>
          </div>

          {/* Continue Button */}
          <button 
            className={`w-full mt-6 px-6 py-4 rounded-lg text-white transition-colors shadow-md
              ${!isAuthenticated || !selectedSeat
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'}`}
            disabled={!isAuthenticated || !selectedSeat}
            onClick={proceedToBooking}
          >
            {!isAuthenticated 
              ? 'Please Log In to Book Seat'
              : !selectedSeat
                ? 'Select a Seat to Continue'
                : 'Proceed to Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;