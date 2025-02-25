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

  const socketRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Initialize Toastify notifications
  const notify = (message, type = 'info') => {
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
    // Load booking details from session storage
    try {
      const storedDetails = sessionStorage.getItem('selectedSeats');
      if (!storedDetails) throw new Error('No booking details found');
      setBookingDetails(JSON.parse(storedDetails));
    } catch (err) {
      setError('Unable to load booking details. Please try selecting your seat again.');
      notify('Unable to load booking details. Please try again.', 'error');
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
        
        notify('Connected to real-time updates.', 'success');
      });

      socketRef.current.on('room_joined', (data) => {
        console.log('Successfully joined room:', data);
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        setSocketConnected(false);
        notify('Real-time updates unavailable. Falling back to polling.', 'warning');
        
        // Start polling if payment is in progress
        if (paymentResponse?.payment_id && !pollIntervalRef.current) {
          startPaymentStatusCheck(paymentResponse.payment_id);
        }
      });

      socketRef.current.on('payment_requested', (data) => {
        console.log('Payment requested event received:', data);
        setPaymentStatus('stk_pushed');
        setPaymentMessage('M-PESA request sent to your phone');
        notify('M-PESA request sent. Please check your phone.', 'info');
      });

      socketRef.current.on('payment_status_update', (data) => {
        console.log('Payment status update event received:', data);
        setPaymentStatus(data.status);
        setPaymentMessage(data.message || getStatusMessage(data.status));

        if (data.status === 'completed') {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          
          sessionStorage.removeItem('selectedSeats');
          notify('Payment successful! Your seat has been booked.', 'success');
          
          // Ensure we have booking details to pass to the next page
          const navigationData = {
            state: { 
              bookingDetails: data.booking || data
            }
          };
          
          console.log('Navigating to /mybookings with data:', navigationData);
          navigate('/mybookings', navigationData);
        } else if (data.status === 'failed') {
          notify('Payment failed. Please try again.', 'error');
        }
      });

      socketRef.current.on('payment_completed', (data) => {
        console.log('Payment completed event received:', data);
        setPaymentStatus('completed');
        setPaymentMessage('Payment successful! Your seat has been booked.');
        
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        
        sessionStorage.removeItem('selectedSeats');
        notify('Payment successful! Your seat has been booked.', 'success');
        
        // Navigate to bookings page
        navigate('/mybookings', { 
          state: { bookingDetails: data.booking || data } 
        });
      });

      socketRef.current.on('seat_update', (data) => {
        console.log('Seat update event received:', data);
        if (data.status === 'booked' && bookingDetails?.seats?.includes(data.seat_number)) {
          notify('Your seat has been confirmed!', 'success');
        }
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setSocketConnected(false);
        
        // Start polling if we were in the middle of a payment
        if (paymentStatus && ['stk_pushed', 'processing'].includes(paymentStatus) &&
            paymentResponse?.payment_id && !pollIntervalRef.current) {
          notify('Lost connection. Falling back to polling for updates.', 'warning');
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
    };
  }, [navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please log in to continue.');
      notify('Please log in to continue.', 'error');
      return;
    }

    if (!phoneNumber.match(/^(?:254|\+254|0)?([71](?:[0-9]){8})$/)) {
      setError('Please enter a valid Safaricom phone number');
      notify('Invalid phone number. Please enter a valid Safaricom number.', 'error');
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
      setPaymentStatus('stk_pushed');
      setPaymentMessage('M-PESA request sent to your phone. Please check your phone and enter your PIN when prompted.');
      notify('M-PESA request sent. Please check your phone.', 'info');

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
      notify('Failed to initiate payment. Please try again.', 'error');
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
      notify('Authentication error. Please log in again.', 'error');
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
        setPaymentStatus(status);
        setPaymentMessage(getStatusMessage(status));

        if (status === 'completed') {
          console.log('Payment completed via polling');
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          sessionStorage.removeItem('selectedSeats');
          notify('Payment successful! Your seat has been booked.', 'success');
          navigate('/mybookings', { state: { bookingDetails: response.data } });
        } else if (['failed', 'expired', 'cancelled', 'refund_required'].includes(status)) {
          console.log(`Payment ${status} via polling`);
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          setError(`Payment ${status}. ${getStatusMessage(status)}`);
          notify(`Payment ${status}. ${getStatusMessage(status)}`, 'error');
        }
      } catch (err) {
        console.error('Error polling payment status:', err);
        failedAttempts++;
        if (failedAttempts >= 3) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          setError('Network issues while checking payment status. Please check My Bookings section.');
          notify('Network issues. Please check My Bookings section.', 'error');
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
          setPaymentStatus('expired');
          setError('Payment request may have expired. Please check your M-PESA messages.');
          notify('Payment request expired. Please check your M-PESA messages.', 'warning');
        }
      }
    }, 300000); // 5 minutes
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'stk_pushed': return 'M-PESA request sent to your phone';
      case 'processing': return 'Processing your payment...';
      case 'completed': return 'Payment successful! Confirming your seat...';
      case 'failed': return 'Payment failed. Please try again.';
      case 'cancelled': return 'Payment was cancelled. Please try again.';
      case 'expired': return 'Payment request expired. Please try again.';
      case 'refund_required': return 'There was an issue confirming your seat. A refund will be processed.';
      default: return 'Waiting for payment status...';
    }
  };

  const calculateTotalAmount = () => {
    const basePrice = bookingDetails?.route?.basePrice || 0;
    const numSeats = bookingDetails?.seats?.length || 0;
    return basePrice * numSeats;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Booking Confirmation</h1>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;