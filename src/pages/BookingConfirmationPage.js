import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'https://moihub.onrender.com/api';
const SOCKET_URL = 'https://moihub.onrender.com';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedBookingDetails, setCompletedBookingDetails] = useState(null);

  const socketRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Extract user ID from JWT token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return payload.userId || payload.id;
    } catch (e) {
      console.error('Error extracting user ID from token:', e);
      return null;
    }
  };

  // Status message mapping - centralized for consistency
  const STATUS_MESSAGES = {
    stk_pushed: 'M-PESA request sent to your phone',
    processing: 'Processing your payment...',
    completed: 'Payment successful! Your seat has been booked.',
    failed: 'Payment failed. Please try again.',
    cancelled: 'Payment was cancelled. Please try again.',
    expired: 'Payment request expired. Please try again.',
    refund_required: 'There was an issue confirming your seat. A refund will be processed.'
  };

  // Notification function - centralized for consistent notifications
  const notify = (status, customMessage = null) => {
    const messageMap = {
      stk_pushed: 'M-PESA request sent. Please check your phone.',
      processing: 'Processing your payment...',
      completed: 'Payment successful! Your seat has been booked.',
      failed: 'Payment failed. Please try again.',
      cancelled: 'Payment was cancelled. Please try again.',
      expired: 'Payment request expired. Please try again.',
      refund_required: 'There was an issue confirming your seat. A refund will be processed.',
      socket_connected: 'Connected to real-time updates.',
      socket_disconnected: 'Lost connection. Falling back to polling for updates.',
      network_error: 'Network issues. Please check My Bookings section.',
      auth_error: 'Authentication error. Please log in again.',
      invalid_phone: 'Invalid phone number. Please enter a valid Safaricom number.',
      loading_error: 'Unable to load booking details. Please try again.'
    };
    
    const message = customMessage || messageMap[status] || status;
    const type = ['completed', 'socket_connected'].includes(status) ? 'success' 
               : ['failed', 'cancelled', 'expired', 'refund_required', 'network_error', 'auth_error', 'invalid_phone', 'loading_error'].includes(status) ? 'error'
               : ['socket_disconnected'].includes(status) ? 'warning' 
               : 'info';
    
    toast[type](message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  useEffect(() => {
    // Check for pending payments from previous sessions
    const pendingPayment = localStorage.getItem('pendingPayment');
    if (pendingPayment) {
      try {
        const { paymentId, status } = JSON.parse(pendingPayment);
        console.log('Found pending payment:', paymentId, status);
        if (paymentId) {
          startPaymentStatusCheck(paymentId);
        }
        localStorage.removeItem('pendingPayment');
      } catch (e) {
        console.error('Error parsing pending payment:', e);
        localStorage.removeItem('pendingPayment');
      }
    }

    // Load booking details from session storage
    try {
      const storedDetails = sessionStorage.getItem('selectedSeats');
      if (!storedDetails) throw new Error('No booking details found');
      setBookingDetails(JSON.parse(storedDetails));
    } catch (err) {
      setError('Unable to load booking details. Please try selecting your seat again.');
      notify('loading_error');
    } finally {
      setLoading(false);
    }

    // Socket.io connection
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Initializing socket connection...');
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected with ID:', socketRef.current.id);
        setSocketConnected(true);
        
        // Explicitly join user-specific room
        const userId = getUserIdFromToken();
        if (userId) {
          console.log('Joining user room:', `user-${userId}`);
          socketRef.current.emit('join_user_room', { userId });
        }
        
        notify('socket_connected');
      });

      socketRef.current.on('room_joined', (data) => {
        console.log('Successfully joined room:', data);
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        setSocketConnected(false);
        notify('socket_disconnected');
        
        // Start polling if payment is in progress
        if (paymentResponse?.payment_id && !pollIntervalRef.current) {
          startPaymentStatusCheck(paymentResponse.payment_id);
        }
      });

      socketRef.current.on('payment_requested', (data) => {
        console.log('Payment requested event received:', data);
        handlePaymentStatusUpdate('stk_pushed');
      });

      socketRef.current.on('payment_status_update', (data) => {
        console.log('Payment status update event received:', data);
        handlePaymentStatusUpdate(data.status, data.message, data);
      });

      socketRef.current.on('payment_completed', (data) => {
        console.log('Payment completed event received:', data);
        console.log('Payment completed payload:', JSON.stringify(data));
        
        handlePaymentStatusUpdate('completed', null, data.booking || data);
      });

      socketRef.current.on('seat_update', (data) => {
        console.log('Seat update event received:', data);
        if (data.status === 'booked' && bookingDetails?.seats?.includes(data.seat_number)) {
          notify(null, 'Your seat has been confirmed!');
        }
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setSocketConnected(false);
        
        // Start polling if we were in the middle of a payment
        if (paymentStatus && ['stk_pushed', 'processing'].includes(paymentStatus) &&
            paymentResponse?.payment_id && !pollIntervalRef.current) {
          notify('socket_disconnected');
          startPaymentStatusCheck(paymentResponse.payment_id);
        }
      });
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      
      if (socketRef.current) {
        console.log('Disconnecting socket');
        socketRef.current.disconnect();
      }
      
      // Check if we were in a payment flow and never got confirmation
      if (paymentStatus === 'stk_pushed' || paymentStatus === 'processing') {
        console.log('Payment was in progress but component unmounted');
        // Store this state in localStorage to handle page refreshes
        localStorage.setItem('pendingPayment', JSON.stringify({
          paymentId: paymentResponse?.payment_id,
          status: paymentStatus
        }));
      }
    };
  }, [navigate, paymentStatus, paymentResponse]);

  // Centralized payment status update handler
  const handlePaymentStatusUpdate = (status, customMessage = null, bookingData = null) => {
    setPaymentStatus(status);
    setPaymentMessage(customMessage || STATUS_MESSAGES[status] || '');
    notify(status, customMessage);

    if (status === 'completed') {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      
      // Save completed booking details for modal
      setCompletedBookingDetails(bookingData || paymentResponse);
      
      // Show success modal
      setShowSuccessModal(true);
    } else if (['failed', 'expired', 'cancelled', 'refund_required'].includes(status)) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      setError(`Payment ${status}. ${STATUS_MESSAGES[status]}`);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please log in to continue.');
      notify('auth_error');
      return;
    }

    if (!phoneNumber.match(/^(?:254|\+254|0)?([71](?:[0-9]){8})$/)) {
      setError('Please enter a valid Safaricom phone number');
      notify('invalid_phone');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let formattedPhone = phoneNumber;
      if (formattedPhone.startsWith('+')) formattedPhone = formattedPhone.substring(1);
      if (formattedPhone.startsWith('0')) formattedPhone = `254${formattedPhone.substring(1)}`;
      if (!formattedPhone.startsWith('254')) formattedPhone = `254${formattedPhone}`;

      const payload = {
        phone_number: formattedPhone,
        registration: bookingDetails?.registration,
        route_id: bookingDetails?.route?.id,
        seats: bookingDetails?.seats,
        departure_time: bookingDetails?.departure_time,
      };

      console.log('Initiating payment with payload:', payload);

      const response = await axios.post(
        `${API_BASE_URL}/bookings/payments/initiate`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Payment initiation response:', response.data);

      if (!response.data?.payment_id) throw new Error('Invalid payment response');

      setPaymentResponse(response.data);
      handlePaymentStatusUpdate('stk_pushed');

      // Always start polling after a delay as a fallback
      setTimeout(() => {
        if (['stk_pushed', 'processing', 'initiated'].includes(paymentStatus)) {
          console.log('Starting payment status polling as fallback');
          startPaymentStatusCheck(response.data.payment_id);
        }
      }, 15000);
    } catch (err) {
      console.error('Payment initiation error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to initiate payment. Please try again.');
      notify(null, 'Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startPaymentStatusCheck = (paymentId) => {
    if (pollIntervalRef.current) {
      console.log('Polling already in progress');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication error. Please try logging in again.');
      notify('auth_error');
      return;
    }

    console.log('Starting payment status polling for ID:', paymentId);
    let failedAttempts = 0;

    pollIntervalRef.current = setInterval(async () => {
      try {
        console.log('Polling payment status...');
        const response = await axios.get(
         `${API_BASE_URL}/bookings/payments/status/${paymentId}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        console.log('Poll response:', response.data);
        const { status } = response.data;
        handlePaymentStatusUpdate(status, null, response.data);
      } catch (err) {
        console.error('Error polling payment status:', err);
        failedAttempts++;
        if (failedAttempts >= 3) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          setError('Network issues while checking payment status. Please check My Bookings section.');
          notify('network_error');
        }
      }
    }, 6000);

    // Set a timeout to clear polling after 5 minutes if no completion
    setTimeout(() => {
      if (pollIntervalRef.current) {
        console.log('Clearing polling due to timeout');
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
        if (['initiated', 'stk_pushed', 'processing'].includes(paymentStatus)) {
          handlePaymentStatusUpdate('expired');
        }
      }
    }, 300000); // 5 minutes
  };

  const calculateTotalAmount = () => {
    const basePrice = bookingDetails?.route?.basePrice || 0;
    const numSeats = bookingDetails?.seats?.length || 0;
    return basePrice * numSeats;
  };

  // Success Modal Component
  const SuccessModal = ({ show, onClose, bookingData }) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-90vh overflow-y-auto">
          <div className="flex justify-between items-center border-b border-gray-200 p-4">
            <h2 className="text-xl font-bold text-green-700">Booking Successful!</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><span className="font-medium">Booking ID:</span> {bookingData?.booking_id || bookingData?.id}</p>
              <p><span className="font-medium">Registration:</span> {bookingDetails?.registration}</p>
              <p><span className="font-medium">Route:</span> {bookingDetails?.route?.name}</p>
              <p><span className="font-medium">Departure:</span> {bookingDetails?.departure_time}</p>
              <p><span className="font-medium">Seat(s):</span> {bookingDetails?.seats?.join(', ')}</p>
              <p><span className="font-medium">Amount Paid:</span> KES {calculateTotalAmount()}</p>
            </div>
            
            <div className="text-center space-y-4 mt-4">
              <p className="text-gray-600">Your ticket is now confirmed and ready!</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button 
                  onClick={() => navigate('/mybookings')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors duration-300"
                >
                  View My Bookings
                </button>
                <button 
                  onClick={() => navigate('/')} 
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md transition-colors duration-300"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <ToastContainer />
      <SuccessModal 
        show={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        bookingData={completedBookingDetails} 
      />
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Confirmation of Booking</h1>
          {socketConnected ? (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Live updates active</span>
          ) : (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Using fallback updates</span>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Booking Details</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><span className="font-medium">Registration:</span> {bookingDetails?.registration}</p>
              <p><span className="font-medium">Route:</span> {bookingDetails?.route?.name}</p>
              <p><span className="font-medium">Departure Time:</span> {bookingDetails?.departure_time}</p>
              <p><span className="font-medium">Selected Seat(s):</span> {bookingDetails?.seats?.join(', ')}</p>
              <p><span className="font-medium">Price per Seat:</span> KES {bookingDetails?.route?.currentPrice}</p>
              <p><span className="font-medium">Number of Seats:</span> {bookingDetails?.seats?.length || 0}</p>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <p className="font-semibold text-lg text-blue-700">
                  Total Amount: KES {calculateTotalAmount()}
                </p>
              </div>
            </div>
          </div>

          {!paymentStatus || ['failed', 'expired', 'cancelled'].includes(paymentStatus) ? (
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  M-PESA Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g., 254712345678"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <p className="text-sm text-gray-500">Enter your Safaricom number in the format: 254712345678</p>
              </div>

              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md"><p className="text-sm text-red-600">{error}</p></div>}

              <button type="submit" disabled={loading} className={`w-full py-3 px-4 rounded-md text-white font-medium ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}>
                {loading ? 'Processing...' : `Pay Now - KES ${calculateTotalAmount()}`}
              </button>
            </form>
          ) : (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800">Payment Status</h3>
              <p className="mt-2">{paymentMessage}</p>
              
              {paymentStatus === 'stk_pushed' && (
                <div className="mt-4 flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <span className="text-sm text-blue-600">Waiting for M-PESA confirmation...</span>
                </div>
              )}
              
              {paymentStatus === 'processing' && (
                <div className="mt-4 flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <span className="text-sm text-blue-600">Processing your payment...</span>
                </div>
              )}
              
              {paymentStatus === 'completed' && !showSuccessModal && (
                <div className="mt-4">
                  <div className="flex items-center text-green-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Payment completed successfully!</span>
                  </div>
                  
                  <button 
                    onClick={() => setShowSuccessModal(true)}
                    className="mt-2 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-300"
                  >
                    View Booking Details
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;