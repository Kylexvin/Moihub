import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://moihub.onrender.com/api';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [paymentStartTime, setPaymentStartTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  
  const pollIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const STK_TIMEOUT_SECONDS = 120; // Giving more time for MPesa to process

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

    // Cleanup polling on unmount
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const formatPhoneNumber = (phone) => {
    // Remove any non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // If it starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.slice(1);
    }
    
    // If it doesn't start with 254, add it
    if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber.match(/^(?:254|\+254|0)?([71](?:[0-9]){8})$/)) {
      setError('Please enter a valid Safaricom phone number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setStatusMessage('Initiating payment...');
      
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please log in to continue');
      }

      const response = await axios.post(
        `${API_BASE_URL}/bookings/payments/initiate`,
        { phone_number: formattedPhone },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data?.payment_id) {
        throw new Error('Invalid payment response');
      }

      setPaymentResponse(response.data);
      setPaymentStatus('initiated');
      setPaymentStartTime(Date.now());
      setStatusMessage('STK Push sent. Check your phone for the MPesa prompt.');
      
      // Start countdown timer
      startCountdownTimer();
      
      // Begin polling for payment status
      startPaymentStatusCheck(response.data.payment_id);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to initiate payment';
      console.error('Payment initiation error:', err);
      setError(errorMessage);
      setPaymentStatus(null);
      setStatusMessage('');
    } finally {
      setLoading(false);
    }
  };

  const startCountdownTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    setTimeRemaining(STK_TIMEOUT_SECONDS);
    
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startPaymentStatusCheck = (paymentId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    // Initial check immediately
    checkPaymentStatus(paymentId, token);

    // Then start polling
    pollIntervalRef.current = setInterval(() => {
      checkPaymentStatus(paymentId, token);
    }, 3000); // Check every 3 seconds for faster feedback

    // Auto-cancel polling after timeout
    setTimeout(() => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        if (paymentStatus === 'initiated' || paymentStatus === 'pending') {
          setPaymentStatus('expired');
          setError('Payment request expired. Please try again.');
          setStatusMessage('');
        }
      }
    }, STK_TIMEOUT_SECONDS * 1000);
  };

  const checkPaymentStatus = async (paymentId, token) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/bookings/payments/status/${paymentId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const { status } = response.data;
      
      // Only update if status changed or we got an actual status
      if (status && status !== paymentStatus) {
        setPaymentStatus(status);
        
        // Handle different payment states
        switch (status) {
          case 'completed':
            clearInterval(pollIntervalRef.current);
            clearInterval(timerIntervalRef.current);
            setStatusMessage('Payment successful! Processing your booking...');
            
            try {
              // Try to recover the payment if needed
              await axios.post(
                `${API_BASE_URL}/bookings/payments/${paymentId}/recover`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
              );
              
              setStatusMessage('Booking confirmed! Redirecting to your bookings...');
              
              setTimeout(() => {
                sessionStorage.removeItem('selectedSeats');
                navigate('/my-bookings');
              }, 2000);
              
            } catch (bookErr) {
              setError('Payment successful but booking failed. Please contact support.');
              setStatusMessage('');
            }
            break;
            
          case 'failed':
            clearInterval(pollIntervalRef.current);
            clearInterval(timerIntervalRef.current);
            setError(`Payment failed: ${response.data.provider_response || 'Transaction declined'}`);
            setStatusMessage('');
            break;
            
          case 'cancelled':
            clearInterval(pollIntervalRef.current);
            clearInterval(timerIntervalRef.current);
            setError('Payment cancelled. Please try again.');
            setStatusMessage('');
            break;
            
          case 'expired':
            clearInterval(pollIntervalRef.current);
            clearInterval(timerIntervalRef.current);
            setError('MPesa prompt expired. Please try again.');
            setStatusMessage('');
            break;
            
          case 'pending':
            setStatusMessage('MPesa transaction in progress. Please complete the payment on your phone.');
            break;
            
          case 'initiated':
            const elapsedSeconds = Math.floor((Date.now() - paymentStartTime) / 1000);
            if (elapsedSeconds < 10) {
              setStatusMessage('MPesa prompt sent. Please check your phone.');
            } else {
              setStatusMessage('Waiting for you to complete the payment...');
            }
            break;
            
          default:
            setStatusMessage('Checking payment status...');
        }
      }
    } catch (err) {
      console.error('Payment status check error:', err);
      
      // Don't show error for standard polling errors
      if (err.response?.status !== 404) {
        setStatusMessage('Waiting for payment confirmation...');
      }
    }
  };

  if (loading && !bookingDetails && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error && !bookingDetails && !loading) {
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

  const getStatusColor = () => {
    if (paymentStatus === 'completed') return 'bg-green-50 border-green-200';
    if (paymentStatus === 'failed' || paymentStatus === 'expired' || paymentStatus === 'cancelled') 
      return 'bg-red-50 border-red-200';
    return 'bg-blue-50 border-blue-200';
  };

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
              <p><span className="font-medium">Departure:</span> {bookingDetails?.departure_time}</p>
              <p><span className="font-medium">Seat:</span> {bookingDetails?.seats?.join(', ')}</p>
              <p><span className="font-medium">Price:</span> KES {bookingDetails?.route?.basePrice}</p>
            </div>
          </div>

          {(paymentStatus === 'initiated' || paymentStatus === 'pending' || paymentStatus === 'completed') ? (
            <div className="space-y-4">
              <div className={`${getStatusColor()} border p-4 rounded-lg`}>
                <div className="flex justify-between items-center">
                  <h3 className={`font-semibold ${
                    paymentStatus === 'completed' ? 'text-green-800' : 
                    paymentStatus === 'failed' ? 'text-red-800' : 'text-blue-800'
                  }`}>
                    {paymentStatus === 'completed' ? 'Payment Successful' : 'Payment Processing'}
                  </h3>
                  
                  {timeRemaining > 0 && (paymentStatus === 'initiated' || paymentStatus === 'pending') && (
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                      {timeRemaining}s
                    </span>
                  )}
                </div>
                
                <p className="mt-2">{statusMessage}</p>
                
                {(paymentStatus === 'initiated' || paymentStatus === 'pending') && (
                  <div className="mt-4">
                    <div className="flex items-center mb-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                      <p className="text-sm text-gray-600">Waiting for payment confirmation...</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-100 p-3 rounded text-sm text-yellow-800">
                      <p className="font-medium">Important:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Look for MPesa prompt on your phone</li>
                        <li>Enter your MPesa PIN to complete payment</li>
                        <li>Don't leave this page until payment completes</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              {(paymentStatus === 'failed' || paymentStatus === 'expired' || paymentStatus === 'cancelled') && (
                <button 
                  onClick={() => {
                    setPaymentStatus(null);
                    setPaymentResponse(null);
                    setError(null);
                    setStatusMessage('');
                  }}
                  className="w-full py-3 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium"
                >
                  Try Again
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  M-PESA Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g., 0712345678"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <p className="text-sm text-gray-500">Enter your Safaricom number (e.g., 0712345678 or 254712345678)</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading} 
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;