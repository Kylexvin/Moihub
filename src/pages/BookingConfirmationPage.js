import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Clock, Phone, MapPin, AlertCircle } from 'lucide-react';

const BookingConfirmationPage = () => {
  const { matatuId, seatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const { seatDetails, matatuDetails, lockExpiry } = location.state || {};

  // Initialize payment
  const initiatePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch('https://moigosip.onrender.com/api/bookings/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          matatu_id: matatuId,
          seat_number: seatDetails.seatNumber,
          amount: matatuDetails.price
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initiate payment');
      }

      const data = await response.json();
      setPaymentId(data.payment_id);
      startPaymentStatusCheck(data.payment_id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check payment status
  const checkPaymentStatus = async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://moigosip.onrender.com/api/bookings/payments/status/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to check payment status');
      
      const data = await response.json();
      return data.status;
    } catch (err) {
      console.error('Error checking payment status:', err);
      return null;
    }
  };

  // Poll payment status
  const startPaymentStatusCheck = async (pId) => {
    let attempts = 0;
    const maxAttempts = 20; // 10 seconds * 20 = 200 seconds maximum waiting time
    
    const checkStatus = async () => {
      if (attempts >= maxAttempts) {
        setError('Payment timeout. Please try again.');
        return;
      }

      const status = await checkPaymentStatus(pId);
      setPaymentStatus(status);

      if (status === 'completed') {
        // Proceed with booking
        await confirmBooking(pId);
      } else if (status === 'failed') {
        setError('Payment failed. Please try again.');
      } else if (status === 'pending') {
        attempts++;
        setTimeout(checkStatus, 10000); // Check every 10 seconds
      }
    };

    checkStatus();
  };

  // Confirm booking after successful payment
  const confirmBooking = async (pId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://moigosip.onrender.com/api/bookings/${matatuId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          seat_number: seatDetails.seatNumber,
          payment_id: pId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to confirm booking');
      }

      const data = await response.json();
      navigate('/my-bookings', { 
        state: { 
          bookingConfirmed: true,
          bookingDetails: data.booking 
        }
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Validate phone number format
  const validatePhoneNumber = (number) => {
    // Basic Kenyan phone number validation
    const phoneRegex = /^(?:254|\+254|0)?([17]\d{8})$/;
    return phoneRegex.test(number);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    await initiatePayment();
  };

  // Check if lock is expired
  const isLockExpired = () => {
    return new Date(lockExpiry) < new Date();
  };

  useEffect(() => {
    if (isLockExpired()) {
      navigate(`/seat-selection/${matatuId}`);
    }
  }, [lockExpiry]);

  if (!seatDetails || !matatuDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Invalid booking session</h2>
          <button 
            onClick={() => navigate(`/seat-selection/${matatuId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return to Seat Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold mb-4">Complete Your Booking</h1>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>{matatuDetails.route.origin} - {matatuDetails.route.destination}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Departure: {matatuDetails.departure_time}</span>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6 border-b">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Seat Number</h3>
                <p>{seatDetails.seatNumber}</p>
              </div>
              <div>
                <h3 className="font-semibold">Vehicle Registration</h3>
                <p>{matatuDetails.registration}</p>
              </div>
              <div>
                <h3 className="font-semibold">Lock Expiry</h3>
                <p>{new Date(lockExpiry).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            {!paymentStatus && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    M-Pesa Phone Number
                  </label>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-gray-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your M-Pesa number"
                      className="flex-1 p-2 border rounded-md"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 rounded-md text-white 
                    ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
                    transition-colors duration-200`}
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </form>
            )}

            {paymentStatus && (
              <div className="text-center">
                <div className="animate-pulse">
                  <h3 className="text-lg font-semibold mb-2">
                    {paymentStatus === 'pending' 
                      ? 'Waiting for M-Pesa payment...' 
                      : 'Processing your booking...'}
                  </h3>
                  <p className="text-gray-600">Please do not close this window</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;