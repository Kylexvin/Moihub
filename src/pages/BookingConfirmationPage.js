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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedBookingDetails, setCompletedBookingDetails] = useState(null);

  const socketRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Status messages for payment tracking

const STATUS_MESSAGES = {
  stk_pushed: 'M-PESA request sent to your phone',
  processing: 'Processing your payment...',
  completed: 'Payment successful! Your seat has been booked.',
  failed: 'Payment failed. Please try again.',
  cancelled: 'Payment was cancelled. Please try again.',
  expired: 'Payment request expired. Please try again.',
  refund_required: 'There was an issue confirming your seat. A refund will be processed.'
};
// Add after your other const definitions, around line 40
const formatTransactionDate = (transactionDate) => {
  if (!transactionDate) return '';
  
  // Backend sends date in format YYYYMMDDHHmmss
  const dateStr = transactionDate.toString();
  if (dateStr.length !== 14) return dateStr;
  
  try {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    
    return `${day}/${month}/${year} ${hour}:${minute}`;
  } catch (e) {
    return dateStr;
  }
};
  // Notification handler
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

  useEffect(() => {
    // Check for pending payments from previous sessions
    const pendingPayment = localStorage.getItem('pendingPayment');
    if (pendingPayment) {
      try {
        const { paymentId, status } = JSON.parse(pendingPayment);
        if (paymentId) {
          startPaymentStatusCheck(paymentId);
        }
        localStorage.removeItem('pendingPayment');
      } catch (e) {
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
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        setSocketConnected(true);
        
        // Join user-specific room
        const userId = getUserIdFromToken();
        if (userId) {
          socketRef.current.emit('join_user_room', { userId });
        }
        
        notify('socket_connected');
      });

      socketRef.current.on('connect_error', () => {
        setSocketConnected(false);
        notify('socket_disconnected');
        
        // Start polling if payment is in progress
        if (paymentResponse?.payment_id && !pollIntervalRef.current) {
          startPaymentStatusCheck(paymentResponse.payment_id);
        }
      });

      socketRef.current.on('payment_requested', () => {
        handlePaymentStatusUpdate('stk_pushed');
      });

      socketRef.current.on('payment_status_update', (data) => {
        handlePaymentStatusUpdate(data.status, data.message, data);
      });

     
socketRef.current.on('payment_completed', (data) => {
  // Extract booking details from the data structure returned by backend
  const bookingData = {
    ...data.booking,
    receipt: data.receipt,
    transaction_date: data.transaction_date
  };
  handlePaymentStatusUpdate('completed', null, bookingData);
});
      socketRef.current.on('disconnect', () => {
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
        socketRef.current.disconnect();
      }
      
      // Check if we were in a payment flow and never got confirmation
      if (paymentStatus === 'stk_pushed' || paymentStatus === 'processing') {
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
    notify(status, customMessage);
  
    if (status === 'completed') {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      const formattedBookingData = {
        ...bookingData,
        // Ensure we have access to these properties from either structure
        booking_id: bookingData?.booking_id || bookingData?._id || paymentResponse?.payment_id,
        receipt: bookingData?.receipt || bookingData?.transaction_details?.receipt_number,
        transaction_date: bookingData?.transaction_date || bookingData?.transaction_details?.transaction_date
      };
      setCompletedBookingDetails(formattedBookingData);
      setShowSuccessModal(true);
    } else if (['failed', 'expired', 'cancelled', 'refund_required'].includes(status)) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      setError(`Payment ${status}. ${customMessage || STATUS_MESSAGES[status]}`);
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

      if (!response.data?.payment_id) {
        throw new Error('Invalid payment response. Missing payment ID.');
      }
      

      setPaymentResponse(response.data);
      handlePaymentStatusUpdate('stk_pushed');

      // Start polling after a delay as a fallback
      setTimeout(() => {
        if (['stk_pushed', 'processing', 'initiated'].includes(paymentStatus)) {
          startPaymentStatusCheck(response.data.payment_id);
        }
      }, 20000); 
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to initiate payment. Please try again.');
      notify(null, 'Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startPaymentStatusCheck = (paymentId) => {
    if (pollIntervalRef.current) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication error. Please try logging in again.');
      notify('auth_error');
      return;
    }

    let failedAttempts = 0;

    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/bookings/payments/status/${paymentId}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      
        const { status, message } = response.data;
        // Pass the complete response data for additional details
        handlePaymentStatusUpdate(status, message || null, response.data);
      } catch (err) {
        failedAttempts++;
        if (failedAttempts >= 3) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          setError('Network issues while checking payment status. Please check My Bookings section.');
          notify('network_error');
        }
      }
    }, 6000);

    // Clear polling after 5 minutes if no completion
    setTimeout(() => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
        if (['initiated', 'stk_pushed', 'processing'].includes(paymentStatus)) {
          handlePaymentStatusUpdate('expired');
        }
      }
    }, 300000); // 5 minutes
  };

  // Payment Status Indicator Component
  const PaymentStatusIndicator = ({ status }) => {
    const statusConfig = {
      stk_pushed: {
        icon: 'phone',
        color: 'blue',
        title: 'M-PESA Request Sent',
        description: 'Please check your phone and enter your PIN'
      },
      processing: {
        icon: 'refresh',
        color: 'blue',
        title: 'Processing Payment',
        description: 'We are processing your transaction'
      },
      completed: {
        icon: 'check-circle',
        color: 'green',
        title: 'Payment Successful',
        description: 'Your booking has been confirmed'
      },
      failed: {
        icon: 'x-circle',
        color: 'red',
        title: 'Payment Failed',
        description: 'Please try again or use a different number'
      },
      expired: {
        icon: 'clock',
        color: 'yellow',
        title: 'Request Expired',
        description: 'The payment request has expired'
      },
      cancelled: {
        icon: 'x',
        color: 'red',
        title: 'Payment Cancelled',
        description: 'You cancelled the M-PESA request'
      }
    };

    const config = statusConfig[status] || {
      icon: 'info',
      color: 'gray',
      title: 'Unknown Status',
      description: 'Please wait...'
    };

    const getIcon = () => {
      switch (config.icon) {
        case 'phone':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          );
          case 'refresh':
            return (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H9"
                />
              </svg>
            );
          
        case 'check-circle':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'x-circle':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'clock':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'x':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          );
        default:
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
      }
    };

    const colorClasses = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      red: 'text-red-600 bg-red-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      gray: 'text-gray-600 bg-gray-100'
    };

    return (
      <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className={`p-3 rounded-full ${colorClasses[config.color]}`}>
          {getIcon()}
        </div>
        <div className="ml-4">
          <h3 className="font-medium">{config.title}</h3>
          <p className="text-sm text-gray-500">{config.description}</p>
        </div>
      </div>
    );
  };

  // Success Modal Component
  const SuccessModal = ({ show, onClose, bookingData }) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
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
  <p><span className="font-medium">Registration:</span> {bookingDetails?.registration}</p>
  <p><span className="font-medium">Seat(s):</span> {bookingDetails?.seats?.join(', ')}</p>
  
  {/* Add these lines to display receipt details */}
  {completedBookingDetails?.receipt && (
    <p><span className="font-medium">Receipt:</span> {completedBookingDetails.receipt}</p>
  )}
  {completedBookingDetails?.transaction_date && (
    <p><span className="font-medium">Transaction Date:</span> {formatTransactionDate(completedBookingDetails.transaction_date)}</p>
  )}
</div>
            
            <div className="text-center space-y-4 mt-4">
              <p className="text-gray-600">Your ticket is now confirmed!</p>
              
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

  // Calculate total amount for display
  const getTotalAmount = () => {
    const basePrice = bookingDetails?.route?.basePrice || bookingDetails?.route?.currentPrice || 0;
    const numSeats = bookingDetails?.seats?.length || 0;
    return basePrice * numSeats;
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <ToastContainer />
      <SuccessModal 
        show={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        bookingData={completedBookingDetails} 
      />
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <h1 className="text-xl font-bold text-blue-800">Payment</h1>
          {socketConnected && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Live updates
            </span>
          )}
        </div>

        <div className="p-4">
          {/* Basic booking info */}
          <div className="mb-4 bg-gray-50 p-3 rounded-lg text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Route:</span>
              <span className="font-medium">{bookingDetails?.route?.name}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-600">Seat(s):</span>
              <span className="font-medium">{bookingDetails?.seats?.join(', ')}</span>
            </div>
            <div className="flex justify-between mt-1 border-t border-gray-200 pt-1">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold text-blue-700">KES {getTotalAmount()}</span>
            </div>
          </div>

          {/* Payment status indicator */}
          {paymentStatus && (
            <div className="mb-4">
              <PaymentStatusIndicator status={paymentStatus} />
            </div>
          )}

          {/* Payment form or status */}
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
                <p className="text-xs text-gray-500">Enter your Safaricom number (254xxxxxxxxx)</p>
              </div>

              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md"><p className="text-sm text-red-600">{error}</p></div>}

              <button 
                type="submit" 
                disabled={loading} 
                className={`w-full py-3 px-4 rounded-md text-white font-medium flex items-center justify-center ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  `Pay KES ${getTotalAmount()}`
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Payment tracking animation for in-progress states */}
              {['stk_pushed', 'processing'].includes(paymentStatus) && (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-blue-200 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full border-4 border-t-blue-600 animate-spin"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-sm text-gray-600">
                    {paymentStatus === 'stk_pushed' ? 
                      'Please enter your M-PESA PIN when prompted on your phone' : 
                      'Processing your payment...'}
                  </p>
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