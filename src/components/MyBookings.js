import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to view your bookings');
        window.location.href = '/login';
        return;
      }

      const response = await fetch('http://localhost:5000/api/bookings/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data.bookings);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" aria-label="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 text-center bg-white rounded shadow">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">My Bookings</h2>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">You have no bookings yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">{booking.matatu.registrationNumber}</h3>
                  <p className="text-gray-600">Departure: {booking.matatu.departureTime}</p>
                  <p className="text-gray-600">Price: Ksh {booking.price}</p>
                  <p className="text-gray-600">Seat: {booking.seatNumber}</p>
                  <p className="text-gray-600">Status: {booking.status}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => navigate('/ticket', { state: { bookingDetails: booking } })}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    View Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;