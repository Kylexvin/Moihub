import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('token') ? true : false;
  
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://moihub.onrender.com/api/bookings/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setBookings(response.data.bookings);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to fetch your bookings. Please try again later.');
        setLoading(false);
        
        if (err.response && err.response.status === 401) {
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    
    fetchBookings();
  }, [navigate, isAuthenticated]);
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please log in to view your bookings.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md w-full" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Bookings Found</h2>
          <p className="text-gray-600 mb-6">You don't have any bookings yet.</p>
          <button 
            onClick={() => navigate('/moilinktravellers')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
          >
            Book a Trip
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8">My Bookings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 py-3 px-4">
              <h2 className="text-white font-semibold text-lg">
                {booking.route?.from} to {booking.route?.to}
              </h2>
            </div>
            
            <div className="p-4">
              <div className="mb-4 flex justify-center">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <QRCode 
                    value={booking.qr_verification_link || ''}
                    size={180}
                    level="H"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Number Plate</p>
                  <p className="font-semibold">{booking.matatu?.registrationNumber || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Seat Number</p>
                  <p className="font-semibold">{booking.seatNumber || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Travel Date</p>
                  <p className="font-semibold">{new Date(booking.travelDate).toLocaleDateString()}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Departure</p>
                  <p className="font-semibold">{booking.matatu?.departureTime || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Fare</p>
                  <p className="font-semibold">Ksh {booking.fare}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className={`font-semibold ${
                    booking.status === 'confirmed' ? 'text-green-600' : 
                    booking.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'N/A'}
                  </p>
                </div>
              </div>
              
              {/* <div className="mt-4 text-center">
                <a 
                  href={booking.qr_verification_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Verification Link
                </a>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;