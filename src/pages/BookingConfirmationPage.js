import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookingConfirmationPage = () => {
  const { matatuId, seatId } = useParams();
  const [matatu, setMatatu] = useState(null);
  const [seat, setSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const navigate = useNavigate();

  const fetchMatatu = async (matatuId) => {
    try {
      const response = await fetch(`https://moigosip.onrender.com/api/matatus/${matatuId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch matatu');
      }
      const data = await response.json();

      if (!data) throw new Error('Invalid response data');
      if (!data._id) throw new Error('Invalid matatu data');

      return data;
    } catch (err) {
      console.error(`Error fetching matatu ${matatuId}:`, err);
      throw err;
    }
  };

  const fetchSeat = async (seatId) => {
    try {
      const response = await fetch(`https://moigosip.onrender.com/api/bookings/check-seat?seatId=${seatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check seat availability');
      }

      const data = await response.json();
      return data.seat;
    } catch (err) {
      console.error(`Error fetching seat ${seatId}:`, err);
      throw err;
    }
  };

  const handleBooking = async (phoneNumber) => {
    try {
      const response = await fetch(`https://moigosip.onrender.com/api/bookings/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ phone_number: phoneNumber, matatuId, seatId })
      });

      if (!response.ok) {
        throw new Error('Failed to book seat');
      }

      const data = await response.json();
      setPaymentId(data.payment_id);
      navigate('/payment/initiate', { state: { paymentId: data.payment_id } });
    } catch (err) {
      setError('Failed to book seat');
    }
  };

  useEffect(() => {
    const fetchMatatuData = async () => {
      try {
        setLoading(true);
        const fetchedMatatu = await fetchMatatu(matatuId);
        setMatatu(fetchedMatatu);
        const fetchedSeat = await fetchSeat(seatId);
        setSeat(fetchedSeat);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatatuData();
  }, [matatuId, seatId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Confirm Your Booking</h1>

        {/* Matatu and Seat Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Matatu: {matatu.registrationNumber}</h2>
          <p className="text-sm text-gray-600">Total Seats: {matatu.totalSeats}</p>
          <p className="text-sm text-gray-600">Departure Time: {matatu.departureTime}</p>
          <p className="text-sm text-gray-600">Current Price: KSH {matatu.currentPrice}</p>
          <p className="text-sm text-gray-600">Selected Seat: {seat.seatNumber}</p>
        </div>

        {/* Booking Form */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const phoneNumber = e.target.phone_number.value;
            await handleBooking(phoneNumber);
          }}
        >
          <div className="mb-4">
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;