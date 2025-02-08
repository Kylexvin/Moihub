import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://moihub.onrender.com/api';

const BookingConfirmationPage = () => {
  const { matatuId } = useParams();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Retrieve booking details from session storage
    const storedDetails = sessionStorage.getItem('selectedSeats');
    if (!storedDetails) {
      setError('No booking details found');
      return;
    }

    setBookingDetails(JSON.parse(storedDetails));
    setLoading(false);
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber.match(/^(?:254|\+254|0)?([71](?:(?:0[0-8])|(?:[12][0-9])|(?:9[0-9])|(?:4[0-3])|(?:4[68]))[0-9]{6})$/)) {
      alert('Please enter a valid Safaricom phone number');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/payments/initiate`, {
        matatuId: bookingDetails.matatuId,
        seats: bookingDetails.seats,
        phoneNumber: phoneNumber.startsWith('254') ? phoneNumber : `254${phoneNumber.slice(1)}`,
        amount: bookingDetails.price * bookingDetails.seats.length
      });

      if (response.data.success) {
        alert('Payment request sent! Please check your phone for the STK push.');
        // You might want to redirect to a payment status page or implement websocket
        // to listen for payment confirmation
      }
    } catch (err) {
      console.error('Payment initiation failed:', err);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 text-red-500 text-center">
      {error}
      <button 
        onClick={() => navigate('/matatus')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Matatus
      </button>
    </div>
  );

  if (!bookingDetails) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Booking Confirmation</h1>
        </div>

        <div className="p-6 space-y-6">
          {/* Booking Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Booking Details</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><span className="font-medium">Vehicle Reg:</span> {bookingDetails.registration}</p>
              <p><span className="font-medium">Selected Seats:</span> {bookingDetails.seats.join(', ')}</p>
              <p><span className="font-medium">Price per Seat:</span> KSH {bookingDetails.price}</p>
              <p><span className="font-medium">Total Amount:</span> KSH {bookingDetails.price * bookingDetails.seats.length}</p>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePayment} className="space-y-4">
            <h2 className="text-xl font-semibold">Payment Details</h2>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="mpesa">M-PESA</option>
              </select>
            </div>

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
              <p className="text-sm text-gray-500">
                Enter your Safaricom number in the format: 254712345678
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;