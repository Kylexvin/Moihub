import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

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
  
  const socketRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Modify the useEffect for better socket handling
  useEffect(() => {
    try {
      const storedDetails = sessionStorage.getItem('selectedSeats');
      if (!storedDetails) throw new Error('No booking details found');
      setBookingDetails(JSON.parse(storedDetails));
    } catch (err) {
      setError('Unable to load booking details. Please try selecting your seat again.');
    } finally {
      setLoading(false);
    }

    // Socket.io connection with better error handling
    const token = localStorage.getItem('token');
    if (token) {
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'], // Fall back to polling if websocket fails
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected with ID:', socketRef.current.id);
      });
      
      socketRef.current.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        // If socket fails to connect after attempts, initiate polling automatically
        if (!pollIntervalRef.current && paymentResponse?.payment_id) {
          console.log('Starting fallback polling due to socket connection failure');
          startPaymentStatusCheck(paymentResponse.payment_id);
        }
      });

      socketRef.current.on('payment_requested', (data) => {
        console.log('Payment requested:', data);
        setPaymentStatus('stk_pushed');
        setPaymentMessage('M-PESA request sent to your phone');
      });

      socketRef.current.on('payment_status_update', (data) => {
        console.log('Payment status update:', data);
        setPaymentStatus(data.status);
        setPaymentMessage(data.message || getStatusMessage(data.status));
        
        if (data.status === 'completed') {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          sessionStorage.removeItem('selectedSeats');
          
          // Store transaction data for the booking page
          const bookingData = {
            ...data,
            registration: bookingDetails?.registration,
            route: bookingDetails?.route,
            seats: bookingDetails?.seats,
            departure_time: bookingDetails?.departure_time
          };
          
          navigate('/mybookings', { state: { bookingDetails: bookingData } });
        }
      });

      socketRef.current.on('seat_update', (data) => {
        console.log('Seat update:', data);
        if (data.status === 'booked' && bookingDetails?.seats?.includes(data.seat_number)) {
          setPaymentMessage('Your seat has been confirmed!');
        }
      });
      
      socketRef.current.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        // Start polling if socket disconnects during a payment
        if (paymentStatus && ['stk_pushed', 'processing'].includes(paymentStatus) && 
            paymentResponse?.payment_id && !pollIntervalRef.current) {
          console.log('Starting fallback polling due to socket disconnect');
          startPaymentStatusCheck(paymentResponse.payment_id);
        }
      });
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [navigate]);

  // Improve the payment initiation function
  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Get token early and validate it's available
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please log in to continue.');
      return;
    }
    
    // More comprehensive phone validation for Safaricom
    if (!phoneNumber.match(/^(?:254|\+254|0)?([71](?:[0-9]){8})$/)) {
      setError('Please enter a valid Safaricom phone number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Format phone number to ensure it starts with 254
      let formattedPhone = phoneNumber;
      if (formattedPhone.startsWith('+')) formattedPhone = formattedPhone.substring(1);
      if (formattedPhone.startsWith('0')) formattedPhone = `254${formattedPhone.substring(1)}`;
      if (!formattedPhone.startsWith('254')) formattedPhone = `254${formattedPhone}`;
      
      // Make sure we're sending the booking details in the payload
      const payload = {
        phone_number: formattedPhone,
        registration: bookingDetails?.registration,
        route_id: bookingDetails?.route?.id,
        seats: bookingDetails?.seats,
        departure_time: bookingDetails?.departure_time
      };

      const response = await axios.post(
        `${API_BASE_URL}/bookings/payments/initiate`,
        payload,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
          } 
        }
      );

      if (!response.data?.payment_id) throw new Error('Invalid payment response');

      setPaymentResponse(response.data);
      setPaymentStatus('stk_pushed');
      setPaymentMessage('M-PESA request sent to your phone. Please check your phone and enter your PIN when prompted.');
      
      // Start fallback polling with a delay to give socket a chance to work
      setTimeout(() => {
        if (['stk_pushed', 'processing'].includes(paymentStatus)) {
          console.log('Starting delayed fallback polling');
          startPaymentStatusCheck(response.data.payment_id, token); // Pass token explicitly
        }
      }, 15000);
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to initiate payment. Please try again.');
      setPaymentStatus(null);
    } finally {
      setLoading(false);
    }
  };

  // Improve the polling mechanism
  const startPaymentStatusCheck = (paymentId, authToken) => {
    // Don't start if already polling
    if (pollIntervalRef.current) {
      console.log('Polling already in progress. Skipping duplicate polling.');
      return;
    }
    
    console.log('Starting payment status polling for:', paymentId);
    const token = authToken || localStorage.getItem('token');
    if (!token) {
      console.error('Missing authentication token for payment status check');
      setError('Authentication error. Please try logging in again.');
      return;
    }
    
    let failedAttempts = 0;

    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/bookings/payments/${paymentId}/status`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        const { status } = response.data;
        console.log('Poll status:', status);
        
        // Reset failed attempts counter on successful request
        failedAttempts = 0;
        
        // Only update if the status has changed
        if (paymentStatus !== status) {
          setPaymentStatus(status);
          setPaymentMessage(getStatusMessage(status));
        }

        if (status === 'completed') {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          
          sessionStorage.removeItem('selectedSeats');
          navigate('/mybookings', { state: { bookingDetails: response.data } });
        } else if (['failed', 'expired', 'cancelled', 'refund_required'].includes(status)) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          setError(`Payment ${status}. ${getStatusMessage(status)}`);
        }
      } catch (err) {
        console.error('Payment status check error:', err);
        failedAttempts++;
        
        // Stop polling after 3 consecutive failed attempts
        if (failedAttempts >= 3) {
          console.error('Too many failed polling attempts. Stopping poll.');
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          
          // Only show error if we're not completed yet
          if (paymentStatus !== 'completed') {
            setError('Network issues while checking payment status. Please check My Bookings section to verify your booking.');
          }
        }
      }
    }, 6000); // Poll every 6 seconds

    // Stop polling after 5 minutes (M-Pesa timeout)
    setTimeout(() => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
        
        if (['initiated', 'stk_pushed', 'processing'].includes(paymentStatus)) {
          setPaymentStatus('expired');
          setError('Payment request may have expired. Please check your M-PESA messages to confirm if payment was processed, then check My Bookings section.');
        }
      }
    }, 300000); // 5 minutes
  };

  const getStatusMessage = (status) => {
    switch(status) {
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

  // Calculate total amount based on number of seats and base price
  const calculateTotalAmount = () => {
    const basePrice = bookingDetails?.route?.basePrice || 0;
    const numSeats = bookingDetails?.seats?.length || 0;
    return basePrice * numSeats;
  };

  const renderPaymentStatusUI = () => {
    if (!paymentStatus || ['failed', 'expired', 'cancelled'].includes(paymentStatus)) {
      return null;
    }

    const isProcessing = ['initiated', 'stk_pushed', 'processing'].includes(paymentStatus);
    const isSuccess = paymentStatus === 'completed';
    const needsAction = paymentStatus === 'refund_required';
    
    let bgColor = 'bg-blue-50 border-blue-200';
    let textColor = 'text-blue-800';
    
    if (isSuccess) {
      bgColor = 'bg-green-50 border-green-200';
      textColor = 'text-green-800';
    } else if (needsAction) {
      bgColor = 'bg-yellow-50 border-yellow-200';
      textColor = 'text-yellow-800';
    }

    return (
      <div className={`space-y-4 ${isProcessing ? 'animate-pulse' : ''}`}>
        <div className={`${bgColor} border p-4 rounded-lg`}>
          <h3 className={`font-semibold ${textColor}`}>
            {isProcessing ? 'Payment In Progress' : 'Payment Status'}
          </h3>
          <p className="mt-2">{paymentMessage}</p>
          {isProcessing && (
            <div className="mt-4 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              <p className="text-sm text-gray-600">Please wait...</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading && !bookingDetails && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="p-4 text-red-500 text-center">
        <p className="font-medium">{error}</p>
        <button 
          onClick={() => navigate('/matatus')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Matatus
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Booking Confirmation</h1>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Booking Details</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><span className="font-medium">Registration:</span> {bookingDetails?.registration}</p>
              <p><span className="font-medium">Route:</span> {bookingDetails?.route?.name}</p>
              <p><span className="font-medium">Departure Time:</span> {bookingDetails?.departure_time}</p>
              <p><span className="font-medium">Selected Seat(s):</span> {bookingDetails?.seats?.join(', ')}</p>
              <p><span className="font-medium">Price per Seat:</span> KES {bookingDetails?.route?.basePrice}</p>
              <p><span className="font-medium">Number of Seats:</span> {bookingDetails?.seats?.length || 0}</p>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <p className="font-semibold text-lg text-blue-700">
                  Total Amount: KES {calculateTotalAmount()}
                </p>
              </div>
            </div>
          </div>

          {renderPaymentStatusUI()}

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
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;