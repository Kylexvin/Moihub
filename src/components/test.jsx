import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Extracted components
import { usePaymentStatus } from './hooks/usePaymentStatus';
import { useSocketConnection } from './hooks/useSocketConnection';
import { PaymentStatusIndicator } from './PaymentStatusIndicator';
import { SuccessModal } from './SuccessModal';


// Constants
const API_BASE_URL = 'https://moihub.onrender.com/api';





const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedBookingDetails, setCompletedBookingDetails] = useState(null);

  // Custom hooks for payment status and socket connection
  const { 
    paymentStatus, 
    paymentResponse, 
    handlePaymentStatusUpdate, 
    startPaymentStatusCheck 
  } = usePaymentStatus((status, data) => {
    if (status === 'completed') {
      setCompletedBookingDetails(data);
      setShowSuccessModal(true);
    }
  });

  const { socketConnected } = useSocketConnection({
    onStatusUpdate: handlePaymentStatusUpdate,
    paymentResponse,
    paymentStatus
  });

  // Load booking details on mount
  useEffect(() => {
    // Check for pending payments from previous sessions
    const pendingPayment = localStorage.getItem('pendingPayment');
    if (pendingPayment) {
      try {
        const { paymentId } = JSON.parse(pendingPayment);
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
      toast.error('Unable to load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to validate phone number
  const validatePhoneNumber = (phone) => {
    return phone.match(/^(?:254|\+254|0)?([71](?:[0-9]){8})$/);
  };

  // Function to format phone number
  const formatPhoneNumber = (phone) => {
    let formattedPhone = phone;
    if (formattedPhone.startsWith('+')) formattedPhone = formattedPhone.substring(1);
    if (formattedPhone.startsWith('0')) formattedPhone = `254${formattedPhone.substring(1)}`;
    if (!formattedPhone.startsWith('254')) formattedPhone = `254${formattedPhone}`;
    return formattedPhone;
  };

  // Handler for payment submission
  const handlePayment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Authentication required. Please log in to continue.');
      toast.error('Authentication error. Please log in again.');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Safaricom phone number');
      toast.error('Invalid phone number. Please enter a valid Safaricom number.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formattedPhone = formatPhoneNumber(phoneNumber);
      
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

      if (!response.data?.payment_id) throw new Error('Invalid payment response');

      handlePaymentStatusUpdate('stk_pushed', null, response.data);

      // Start polling after a delay as a fallback
      setTimeout(() => {
        if (['stk_pushed', 'processing', 'initiated'].includes(paymentStatus)) {
          startPaymentStatusCheck(response.data.payment_id);
        }
      }, 15000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to initiate payment. Please try again.');
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total amount for display
  const getTotalAmount = () => {
    const basePrice = bookingDetails?.route?.basePrice || bookingDetails?.route?.currentPrice || 0;
    const numSeats = bookingDetails?.seats?.length || 0;
    return basePrice * numSeats;
  };

  // Loading state
  if (loading && !bookingDetails) {
    return (
      <div className="max-w-md mx-auto p-4 flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
      />
      
      <SuccessModal 
        show={showSuccessModal} 
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/mybookings');
        }}
        bookingData={completedBookingDetails}
        bookingDetails={bookingDetails}
      />
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-800">Complete Booking</h1>
          {socketConnected && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Live
            </span>
          )}
        </div>

        <div className="p-4">
          {/* Booking summary */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Booking Summary</h2>
            <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Route:</span>
                <span className="font-medium">{bookingDetails?.route?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-medium">{bookingDetails?.registration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seat(s):</span>
                <span className="font-medium">{bookingDetails?.seats?.join(', ')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                <span className="text-gray-600 font-medium">Total Amount:</span>
                <span className="font-bold text-blue-700">KES {getTotalAmount()}</span>
              </div>
            </div>
          </div>

          {/* Payment status indicator */}
          {paymentStatus && (
            <div className="mb-6">
              <PaymentStatusIndicator status={paymentStatus} />
            </div>
          )}

          {/* Payment form or processing UI */}
          {!paymentStatus || ['failed', 'expired', 'cancelled'].includes(paymentStatus) ? (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-3">Payment Details</h2>
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                  <p className="text-xs text-gray-500">Enter your Safaricom number (format: 07xx, 254xxx, or +254xxx)</p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading} 
                  className={`w-full py-3 px-4 rounded-md text-white font-medium flex items-center justify-center transition ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
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
            </div>
          ) : (
            <div className="space-y-4">
              {/* Payment tracking animation for in-progress states */}
              {['stk_pushed', 'processing'].includes(paymentStatus) && (
                <div className="flex flex-col items-center justify-center py-8 bg-white border border-gray-200 rounded-lg">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full border-4 border-blue-200 flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full border-4 border-t-blue-600 animate-spin"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-6 text-center text-gray-700 font-medium">
                    {paymentStatus === 'stk_pushed' ? 
                      'Please enter your M-PESA PIN' : 
                      'Processing your payment...'}
                  </p>
                  <p className="mt-2 text-center text-sm text-gray-500 max-w-xs">
                    {paymentStatus === 'stk_pushed' ? 
                      'Check your phone for the M-PESA prompt and enter your PIN to complete payment' : 
                      'Please wait while we confirm your payment. This may take a moment.'}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="mt-6 flex justify-between">
            <button 
              onClick={() => navigate(-1)} 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;