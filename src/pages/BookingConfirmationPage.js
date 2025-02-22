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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const pollIntervalRef = useRef(null);

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

    const token = localStorage.getItem('token');
    if (token) {
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected with ID:', socketRef.current.id);
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        if (!pollIntervalRef.current && paymentStatus === 'stk_pushed') {
          console.log('Starting fallback polling due to socket connection failure');
          startPaymentStatusCheck(paymentStatus);
        }
      });

      socketRef.current.on('payment_requested', (data) => {
        console.log('Payment requested:', data);
        setPaymentStatus('stk_pushed');
        toast.info('M-PESA request sent to your phone. Please check your phone and enter your PIN when prompted.');
      });

      socketRef.current.on('payment_status_update', (data) => {
        console.log('Payment status update:', data);
        setPaymentStatus(data.status);
        toast.update(data.status, { render: getStatusMessage(data.status), type: getToastType(data.status) });

        if (data.status === 'completed') {
          clearInterval(pollIntervalRef.current);
          sessionStorage.removeItem('selectedSeats');
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

      socketRef.current.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        if (['stk_pushed', 'processing'].includes(paymentStatus) && !pollIntervalRef.current) {
          console.log('Starting fallback polling due to socket disconnect');
          startPaymentStatusCheck(paymentStatus);
        }
      });
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please log in to continue.');
      return;
    }

    if (!phoneNumber.match(/^(?:254|0)([71][0-9]{8})$/)) {
      setError('Please enter a valid Safaricom phone number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      let formattedPhone = phoneNumber;
      if (formattedPhone.startsWith('0')) formattedPhone = `254${formattedPhone.substring(1)}`;

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
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }
      );

      if (!response.data?.payment_id) throw new Error('Invalid payment response');

      setPaymentStatus('stk_pushed');
      toast.promise(
        new Promise((resolve) => {
          toast.loading('M-PESA request sent to your phone. Please check your phone and enter your PIN when prompted.', {
            toastId: 'stk_pushed'
          });
          resolve();
        }),
        {
          pending: 'M-PESA request sent to your phone. Please check your phone and enter your PIN when prompted.',
          success: 'M-PESA request sent to your phone. Please check your phone and enter your PIN when prompted.',
          error: 'Failed to initiate payment. Please try again.'
        }
      );

      setTimeout(() => {
        if (paymentStatus === 'stk_pushed') {
          console.log('Starting delayed fallback polling');
          startPaymentStatusCheck(response.data.payment_id);
        }
      }, 15000);

    } catch (err) {
      setError(err.message || 'Failed to initiate payment. Please try again.');
      setPaymentStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const startPaymentStatusCheck = (paymentId) => {
    if (pollIntervalRef.current) {
      console.log('Polling already in progress. Skipping duplicate polling.');
      return;
    }

    console.log('Starting payment status polling for:', paymentId);
    const token = localStorage.getItem('token');
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

        failedAttempts = 0;
        if (paymentStatus !== status) {
          setPaymentStatus(status);
          toast.update(status, { render: getStatusMessage(status), type: getToastType(status) });
        }

        if (status === 'completed') {
          clearInterval(pollIntervalRef.current);
          sessionStorage.removeItem('selectedSeats');
          navigate('/mybookings', { state: { bookingDetails: response.data } });
        } else if (['failed', 'expired', 'cancelled', 'refund_required'].includes(status)) {
          clearInterval(pollIntervalRef.current);
          setError(`Payment ${status}. ${getStatusMessage(status)}`);
        }
      } catch (err) {
        console.error('Payment status check error:', err);
        failedAttempts++;

        if (failedAttempts >= 3) {
          console.error('Too many failed polling attempts. Stopping polling.');
          clearInterval(pollIntervalRef.current);

          if (paymentStatus !== 'completed') {
            setError('Network issues while checking payment status. Please check My Bookings section to verify your booking.');
          }
        }
      }
    }, 6000);

    setTimeout(() => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        if (['initiated', 'stk_pushed', 'processing'].includes(paymentStatus)) {
          setPaymentStatus('expired');
          setError('Payment request may have expired. Please check your M-PESA messages to confirm if payment was processed, then check My Bookings section.');
        }
      }
    }, 300000);
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

  const getToastType = (status) => {
    switch (status) {
      case 'stk_pushed': return toast.TYPE.INFO;
      case 'processing': return toast.TYPE.INFO;
      case 'completed': return toast.TYPE.SUCCESS;
      case 'failed': return toast.TYPE.ERROR;
      case 'cancelled': return toast.TYPE.ERROR;
      case 'expired': return toast.TYPE.ERROR;
      case 'refund_required': return toast.TYPE.WARNING;
      default: return toast.TYPE.DEFAULT;
    }
  };

  const calculateTotalAmount = () => {
    const basePrice = bookingDetails?.route?.basePrice || 0;
    const numSeats = bookingDetails?.seats?.length || 0;
    return basePrice * numSeats;
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
    <div className="max-w-xl mx-auto p-4">
      <ToastContainer />
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
                <p className="text-sm text-gray-500">Enter your Safaricom number in the format 254712345678</p>
              </div>

              {error && <div className="p-4 bg-red-50 border border-red-200 rounded-md"><p className="text-sm text-red-600">{error}</p></div>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 text-white font-medium ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                {loading ? 'Processing...' : `Pay Now - KES ${calculateTotalAmount()}`}
              </button>
            </form>
          ) : null}

          {paymentStatus && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold">Payment Status</h3>
              <p>{getStatusMessage(paymentStatus)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;