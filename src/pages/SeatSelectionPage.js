import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, Loader2, Clock, Info } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'https://moihub.onrender.com/api';
const STORAGE_KEY = 'seatSelectionData';

const SeatSelectionPage = () => {
  const { matatuId } = useParams();
  const navigate = useNavigate();
  const [matatu, setMatatu] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seatLoading, setSeatLoading] = useState(null);
  const [error, setError] = useState(null);
  const [seatStatuses, setSeatStatuses] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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

  // Load persisted seat selection from session storage
  const loadPersistedSeatSelection = useCallback(async () => {
    if (!isAuthenticated || !userId) return;
    
    try {
      const storedData = sessionStorage.getItem(STORAGE_KEY);
      if (!storedData) return;
      
      const { seatData, matatuIdStored, expiryTime } = JSON.parse(storedData);
      
      // Check if data is for current matatu and still valid
      if (matatuIdStored !== matatuId || new Date(expiryTime) < new Date()) {
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }
      
      // Verify seat lock is still valid on server
      const checkResponse = await axios.get(
        `${API_BASE_URL}/bookings/${matatuId}/check-seat?seat_number=${seatData.seatNumber}`
      );
      
      if (checkResponse.data.status === 'locked' && checkResponse.data.locked_by_you) {
        setSelectedSeat({
          ...seatData,
          lock_expiry: checkResponse.data.lock_expiry
        });
        
        // Show toast notification that selection was restored
        toast.info('Your previous seat selection has been restored');
      } else {
        // Clear invalid selection
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error loading persisted seat selection:', error);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [matatuId, isAuthenticated, userId]);

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
            lock_expiry: seat.lock_expiry,
            _id: seat._id
          };
        });
        setSeatStatuses(statuses);
        
        // Once matatu data is loaded, try to restore persisted seat selection
        await loadPersistedSeatSelection();
      } catch (err) {
        console.error('Error fetching matatu:', err);
        setError('Failed to fetch matatu details');
      } finally {
        setLoading(false);
      }
    };

    fetchMatatu();
  }, [matatuId, loadPersistedSeatSelection]);

  // Store selected seat in session storage when it changes
  useEffect(() => {
    if (selectedSeat && selectedSeat.lock_expiry) {
      const dataToStore = {
        seatData: selectedSeat,
        matatuIdStored: matatuId,
        expiryTime: selectedSeat.lock_expiry
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } else if (!selectedSeat) {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedSeat, matatuId]);

  // Periodically refresh seat statuses
  useEffect(() => {
    const refreshSeatStatuses = async () => {
      if (!matatuId) return;
      
      try {
        const response = await axios.get(`${API_BASE_URL}/matatus/${matatuId}`);
        
        const statuses = {};
        response.data.seatLayout.forEach(seat => {
          statuses[seat.seatNumber] = {
            isBooked: seat.isBooked,
            locked_by: seat.locked_by,
            lock_expiry: seat.lock_expiry,
            _id: seat._id
          };
        });
        setSeatStatuses(statuses);
        
        // If selected seat is no longer valid, deselect it
        if (selectedSeat) {
          const currentSeat = response.data.seatLayout.find(s => s._id === selectedSeat._id);
          const now = new Date().toISOString();
          if (!currentSeat || 
              currentSeat.isBooked || 
              !currentSeat.locked_by || 
              currentSeat.locked_by !== userId ||
              (currentSeat.lock_expiry && new Date(currentSeat.lock_expiry) < new Date(now))) {
            setSelectedSeat(null);
            toast.warn('Your seat reservation has expired');
          }
        }
      } catch (err) {
        console.error('Error refreshing seat statuses:', err);
      }
    };

    const refreshInterval = setInterval(refreshSeatStatuses, 20000); // Refresh every 20 seconds
    return () => clearInterval(refreshInterval);
  }, [matatuId, selectedSeat, userId]);

  // Watch for seat lock expiry and notify user
  useEffect(() => {
    if (!selectedSeat || !selectedSeat.lock_expiry) return;
    
    const checkExpiryApproaching = () => {
      const now = new Date();
      const expiry = new Date(selectedSeat.lock_expiry);
      const timeRemaining = expiry - now;
      
      // Notify when 30 seconds left
      if (timeRemaining > 0 && timeRemaining <= 30000) {
        toast.warn('Your seat reservation will expire soon!', {
          autoClose: 5000
        });
      }
    };
    
    const timer = setInterval(checkExpiryApproaching, 5000);
    return () => clearInterval(timer);
  }, [selectedSeat]);

  const showModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const handleLoginRedirect = () => {
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    navigate('/login');
    hideModal();
  };

  const handleSeatClick = async (seat) => {
    if (!isAuthenticated) {
      showModal('You need to be logged in to select seats. Would you like to log in now?');
      return;
    }

    try {
      setSeatLoading(seat.seatNumber);

      // If clicking the same seat, deselect it
      if (selectedSeat && selectedSeat._id === seat._id) {
        setSelectedSeat(null);
        setSeatLoading(null);
        return;
      }

      // If another seat is selected, deselect it first
      if (selectedSeat) {
        setSelectedSeat(null);
      }

      // Check seat availability first
      const checkResponse = await axios.get(
        `${API_BASE_URL}/bookings/${matatuId}/check-seat?seat_number=${seat.seatNumber}`
      );
      
      if (checkResponse.data.status === 'booked') {
        toast.error('This seat is already booked');
        setSeatLoading(null);
        return;
      }
      
      if (checkResponse.data.status === 'locked' && !checkResponse.data.locked_by_you) {
        toast.warning('This seat is temporarily locked by another user');
        setSeatLoading(null);
        return;
      }
      
      // If it's already locked by this user, just select it
      if (checkResponse.data.status === 'locked' && checkResponse.data.locked_by_you) {
        setSelectedSeat({
          ...checkResponse.data.seat,
          matatu_details: checkResponse.data.matatu_details,
          lock_expiry: checkResponse.data.lock_expiry
        });
        toast.success(`Seat ${seat.seatNumber} selected`);
        setSeatLoading(null);
        return;
      }

      // If available, lock the seat
      const lockResponse = await axios.post(`${API_BASE_URL}/bookings/${matatuId}/lock/${seat._id}`);
      
      if (lockResponse.data.message.includes('successfully')) {
        const { seat: lockedSeat, lock_expiry, matatu_details } = lockResponse.data;
        
        setSelectedSeat({
          ...lockedSeat,
          matatu_details,
          lock_expiry
        });

        toast.success(`Seat ${lockedSeat.seatNumber} reserved for 3 minutes`);

        // Update seat statuses to reflect the lock
        setSeatStatuses(prev => {
          const newStatuses = {...prev};
          Object.keys(newStatuses).forEach(seatNum => {
            if (newStatuses[seatNum].locked_by === userId) {
              newStatuses[seatNum] = {
                ...newStatuses[seatNum],
                locked_by: null,
                lock_expiry: null
              };
            }
          });
          
          newStatuses[lockedSeat.seatNumber] = {
            isBooked: lockedSeat.isBooked,
            locked_by: userId,
            lock_expiry: lock_expiry,
            _id: lockedSeat._id
          };
          
          return newStatuses;
        });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        showModal('Your session has expired. Please log in again.');
      } else {
        console.error('Error handling seat selection:', err);
        const message = err.response?.data?.message || 'Failed to select seat. Please try again.';
        toast.error(message);
      }
    } finally {
      setSeatLoading(null);
    }
  };

  const proceedToBooking = async () => {
    if (!isAuthenticated) {
      showModal('You need to be logged in to proceed with booking. Would you like to log in now?');
      return;
    }

    if (!selectedSeat) {
      toast.info('Please select a seat');
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading('Verifying seat reservation...');
      
      // Double-check seat lock before proceeding
      const response = await axios.get(
        `${API_BASE_URL}/bookings/${matatuId}/check-seat?seat_number=${selectedSeat.seatNumber}`
      );
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      if (response.data.status !== 'locked' || !response.data.locked_by_you) {
        toast.error('Your seat lock has expired. Please select the seat again.');
        setSelectedSeat(null);
        return;
      }
      
      // All checks passed, proceed to booking
      sessionStorage.setItem('selectedSeats', JSON.stringify({
        matatuId,
        seats: [selectedSeat.seatNumber],
        seatIds: [selectedSeat._id],
        price: matatu.currentPrice,
        registration: matatu.registrationNumber,
        departure_time: selectedSeat.matatu_details.departure_time,
        route: selectedSeat.matatu_details.route
      }));

      navigate(`/booking-confirmation/${matatuId}/${selectedSeat._id}`);
    } catch (err) {
      console.error('Error verifying seat lock:', err);
      if (err.response?.status === 401) {
        showModal('Your session has expired. Please log in again.');
      } else {
        toast.error('Failed to verify seat status. Please try again.');
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50">
      <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      <p className="text-gray-600 font-medium">Loading seat information...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-4">{error}</h2>
        <p className="text-gray-600 mb-6">There was a problem loading the seat layout. Please try again.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (!matatu) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ToastContainer position="top-right" theme="colored" />
      
      {/* Modal for login prompts */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold mb-3">Login Required</h3>
            <p className="mb-4 text-gray-700">{modalMessage}</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={hideModal}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleLoginRedirect}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Log In
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h1 className="text-2xl font-bold text-gray-800">Select Your Seat - {matatu.registrationNumber}</h1>
          <div className="mt-2 flex items-center">
            {!isAuthenticated && (
              <span className="text-sm text-gray-600 flex items-center">
                <Info size={16} className="text-blue-500 mr-1" />
                Please log in to select a seat and make a booking
              </span>
            )}
            {isAuthenticated && selectedSeat && (
              <span className="text-sm font-medium text-green-600 flex items-center">
                <Check size={16} className="mr-1" />
                Seat {selectedSeat.seatNumber} reserved for you
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Vehicle Info */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 space-y-3 bg-blue-50 p-5 rounded-xl border border-blue-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Route</p>
                <p className="font-medium">{matatu.route?.origin} - {matatu.route?.destination}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Departure Time</p>
                <p className="font-medium">{matatu.departureTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price per seat</p>
                <p className="font-medium">KSH {matatu.currentPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Selected seat</p>
                <p className="font-medium">{selectedSeat ? selectedSeat.seatNumber : 'None'}</p>
              </div>
            </div>
            
            {selectedSeat && (
              <div className="border-t border-blue-200 pt-3 mt-3">
                <p className="font-medium text-lg text-blue-800">Total amount: KSH {matatu.currentPrice}</p>
              </div>
            )}
          </motion.div>

          {/* Seat Layout */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="bg-gray-100 rounded-xl p-6 shadow-inner"
          >
            <div className="relative p-4 bg-gray-700 rounded-lg mb-6 text-center font-medium text-white">
              <p>Driver's Area</p>
              <div className="absolute left-1/2 bottom-0 w-16 h-3 bg-gray-600 rounded-t-lg transform -translate-x-1/2 translate-y-3"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {matatu.seatLayout.map((seat) => {
                const status = seatStatuses[seat.seatNumber];
                const now = new Date().toISOString();
                const isLocked = status?.locked_by && status.lock_expiry > now;
                const isLockedByMe = isLocked && status.locked_by === userId;
                const isSelected = selectedSeat && selectedSeat._id === seat._id;
                const isLoading = seatLoading === seat.seatNumber;

                let tooltipText = "Available";
                if (seat.isBooked) tooltipText = "Booked";
                else if (isLocked && !isLockedByMe) tooltipText = "Reserved by another user";
                else if (isSelected) tooltipText = "Your selection";

                return (
                  <div 
                    key={seat._id} 
                    className="relative"
                    onMouseEnter={() => setShowTooltip(seat.seatNumber)}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <motion.button
                      whileHover={!seat.isBooked && !isLocked && !isLockedByMe && !isLoading ? { scale: 1.05 } : {}}
                      whileTap={!seat.isBooked && !isLocked && !isLockedByMe && !isLoading ? { scale: 0.95 } : {}}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.isBooked || (isLocked && !isLockedByMe) || isLoading}
                      className={`
                        relative w-full p-6 rounded-xl text-center transition-all
                        border-2 shadow-sm
                        ${isLoading 
                          ? 'bg-gray-100 border-gray-300 cursor-wait' 
                          : seat.isBooked 
                            ? 'bg-red-100 border-red-500 text-red-700 cursor-not-allowed' 
                            : isLocked && !isLockedByMe
                              ? 'bg-yellow-100 border-yellow-500 text-yellow-700 cursor-not-allowed'
                              : isSelected
                                ? 'bg-green-500 border-green-600 text-white shadow-lg'
                                : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50'}
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
                    </motion.button>
                    
                    {/* Tooltip */}
                    <AnimatePresence>
                      {showTooltip === seat.seatNumber && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute z-10 w-max max-w-xs px-3 py-2 mt-2 -translate-x-1/2 left-1/2 bg-gray-800 text-white text-xs rounded-md shadow-lg"
                        >
                          {tooltipText}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Legend */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex flex-wrap gap-4 text-sm bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white border-2 border-blue-300 rounded"></div>
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
              <span>Reserved by Another User</span>
            </div>
          </motion.div>

          {/* Countdown Timer (if seat is selected) */}
          {selectedSeat && selectedSeat.lock_expiry && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center gap-3"
            >
              <Clock className="text-blue-500" size={20} />
              <div className="text-center">
                <p className="text-blue-700 font-medium">
                  Seat reservation expires in <SeatLockCountdown expiryTime={selectedSeat.lock_expiry} />
                </p>
              </div>
            </motion.div>
          )}

          {/* Continue Button */}
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={isAuthenticated && selectedSeat ? { scale: 1.02 } : {}}
            className={`w-full mt-6 px-6 py-4 rounded-lg text-white transition-all shadow-md
              ${!isAuthenticated || !selectedSeat
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={!isAuthenticated || !selectedSeat}
            onClick={proceedToBooking}
          >
            {!isAuthenticated 
              ? 'Please Log In to Book Seat'
              : !selectedSeat
                ? 'Select a Seat to Continue'
                : `Proceed to Book Seat ${selectedSeat.seatNumber}`}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// Enhanced countdown component with color changes
const SeatLockCountdown = ({ expiryTime }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isLow, setIsLow] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(expiryTime);
      const difference = expiry - now;
      
      if (difference <= 0) {
        setIsLow(true);
        return '0:00';
      }
      
      const minutes = Math.floor(difference / 60000);
      const seconds = Math.floor((difference % 60000) / 1000);
      
      // Set warning state if less than 45 seconds left
      setIsLow(difference < 45000);
      
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft === '0:00') {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTime]);

  return (
    <span className={`font-mono font-medium ${isLow ? 'text-red-600 animate-pulse' : ''}`}>
      {timeLeft}
    </span>
  );
};

export default SeatSelectionPage;