import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://moihub.onrender.com/api';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentResponse, setPaymentResponse] = useState(null);
  
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

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber.match(/^(?:254|\+254|0)?([71](?:[0-9]){8})$/)) {
      setError('Please enter a valid Safaricom phone number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const formattedPhone = phoneNumber.startsWith('254') ? phoneNumber : `254${phoneNumber.slice(1)}`;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in to continue');

      const response = await axios.post(
        `${API_BASE_URL}/bookings/payments/initiate`,
        { phone_number: formattedPhone },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      if (!response.data?.payment_id) throw new Error('Invalid payment response');

      setPaymentResponse(response.data);
      setPaymentStatus('initiated');
      startPaymentStatusCheck(response.data.payment_id);
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to initiate payment. Please try again.');
      setPaymentStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const startPaymentStatusCheck = (paymentId) => {
    const token = localStorage.getItem('token');

    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/bookings/payments/${paymentId}/status`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        const { status } = response.data;
        setPaymentStatus(status);

        if (status === 'completed') {
          clearInterval(pollIntervalRef.current);
          sessionStorage.removeItem('selectedSeats');
          navigate('/mybookings', { state: { bookingDetails: response.data } });
        } else if (['failed', 'expired', 'cancelled'].includes(status)) {
          clearInterval(pollIntervalRef.current);
          setError(`Payment ${status}. Please try again.`);
          setPaymentStatus(null);
          setPaymentResponse(null);
        }
      } catch (err) {
        console.error('Payment status check error:', err);
        if (err.response?.status === 404) {
          clearInterval(pollIntervalRef.current);
          setError('Payment not found. Please try again.');
          setPaymentStatus(null);
        }
      }
    }, 5000);

    // Stop polling after 10 minutes (matching backend timeout)
    setTimeout(() => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        if (paymentStatus === 'initiated') {
          setPaymentStatus('expired');
          setError('Payment request expired. Please try again.');
        }
      }
    }, 600000);
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
              <p><span className="font-medium">Selected Seat:</span> {bookingDetails?.seats?.join(', ')}</p>
              <p><span className="font-medium">Price:</span> KES {bookingDetails?.route?.basePrice}</p>
            </div>
          </div>

          {paymentStatus === 'initiated' ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Payment Initiated</h3>
                <p className="mt-2">Please check your phone for the M-PESA prompt and enter your PIN to complete the payment.</p>
                <div className="mt-4 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  <p className="text-sm text-gray-600">Waiting for payment confirmation...</p>
                </div>
              </div>
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
                  placeholder="e.g., 254712345678"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <p className="text-sm text-gray-500">Enter your Safaricom number in the format: 254712345678</p>
              </div>

              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md"><p className="text-sm text-red-600">{error}</p></div>}

              <button type="submit" disabled={loading} className={`w-full py-3 px-4 rounded-md text-white font-medium ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}>
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
