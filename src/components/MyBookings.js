import { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        let userId;
        try {
          userId = localStorage.getItem('userId');
          if (!userId && token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            userId = payload.userId || payload.sub;
          }
        } catch (e) {
          console.error('Error extracting user ID:', e);
          setError('Could not determine user ID. Please log in again.');
          setLoading(false);
          return;
        }

        if (!userId) {
          setError('User ID not found. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`https://moigosip.onrender.com/api/bookings/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setBookings(response.data?.bookings || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.response?.data?.message || 'Failed to fetch your bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>

      {loading && <p className="text-gray-600">Loading bookings...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p className="text-gray-600">You have no bookings yet.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="border p-4 rounded-lg shadow-md">
            <p className="font-medium text-lg">Status: <span className="capitalize">{booking.status}</span></p>
            {booking.route && <p>Route: {booking.route.name}</p>}
            <p>Matatu ID: {booking.matatu._id}</p>

            <div className="mt-4">
              <QRCode value={booking.qr_verification_link} size={100} />
            </div>

            <p className="mt-2 text-sm text-gray-500">Scan the QR code to verify your booking.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
