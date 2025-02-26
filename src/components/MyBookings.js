import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'https://moihub.onrender.com/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [recentBooking, setRecentBooking] = useState(null);
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    canceled: 0
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we have just confirmed booking data passed from state
  useEffect(() => {
    if (location.state?.bookingDetails) {
      console.log('Received booking details:', location.state.bookingDetails);
      setRecentBooking(location.state.bookingDetails);
      // Show confirmation toast
      toast.success('Booking confirmed successfully!', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  }, [location]);
  
  useEffect(() => {
    const fetchUserBookings = async () => {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to view your bookings');
        setLoading(false);
        return;
      }
      
      try {
        // Decode the JWT to get user information
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId; // Ensure 'userId' exists in your token payload
        
        // Set basic user details from token
        setUserDetails({
          _id: userId,
          name: decodedToken.name || 'User',
          email: decodedToken.email || '',
          phone: decodedToken.phone || ''
        });
        
        // Get user bookings
        const bookingsResponse = await axios.get(`${API_BASE_URL}/bookings/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userBookings = bookingsResponse.data.bookings;
        setBookings(userBookings);
        
        // Calculate booking statistics
        calculateBookingStats(userBookings);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err.response?.data?.message || 'Failed to fetch your bookings');
        setLoading(false);
      }
    };
    
    fetchUserBookings();
  }, []);
  
  const calculateBookingStats = (bookingsData) => {
    const stats = {
      total: bookingsData.length,
      confirmed: bookingsData.filter(b => b.status === 'CONFIRMED').length,
      pending: bookingsData.filter(b => b.status === 'PENDING').length,
      canceled: bookingsData.filter(b => b.status === 'CANCELED').length
    };
    
    setBookingStats(stats);
  };
  
  const handleViewDetails = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };
  
  const handleBookNewRide = () => {
    navigate('/routes');
  };
  
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4" role="alert">
      <p>{error}</p>
      <button 
        className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => navigate('/login')}
      >
        Go to Login
      </button>
    </div>
  );
  
  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      
      {/* Header with user info and tab navigation */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Dashboard</h1>
            {userDetails && (
              <div>
                <p className="text-gray-600">Welcome, {userDetails.name}</p>
                {userDetails.email && <p className="text-gray-600">{userDetails.email}</p>}
              </div>
            )}
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleBookNewRide}
            >
              Book New Ride
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard' 
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings' 
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('bookings')}
            >
              My Bookings
            </button>
          </nav>
        </div>
      </div>
      
      {/* New Booking Confirmation */}
      {recentBooking && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="ml-3 text-xl font-semibold text-green-800">Booking Confirmed Successfully!</h2>
            <button 
              onClick={() => setRecentBooking(null)} 
              className="ml-auto text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-green-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700">Booking Details</h3>
                <p className="mt-1">
                  <span className="font-medium">Route:</span> {recentBooking.route?.name || (recentBooking.route?.from + ' to ' + recentBooking.route?.to)}
                </p>
                <p>
                  <span className="font-medium">Matatu:</span> {recentBooking.registration || recentBooking.matatu?.registration_number}
                </p>
                <p>
                  <span className="font-medium">Seats:</span> {Array.isArray(recentBooking.seats) ? recentBooking.seats.join(', ') : recentBooking.seat_number}
                </p>
                <p>
                  <span className="font-medium">Departure:</span> {recentBooking.departure_time || moment(recentBooking.booking_date).format('MMM D, YYYY [at] h:mm A')}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Payment Information</h3>
                <p className="mt-1">
                  <span className="font-medium">Amount:</span> KES {recentBooking.amount || recentBooking.totalAmount || '-'}
                </p>
                <p>
                  <span className="font-medium">Payment Status:</span> 
                  <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                    Completed
                  </span>
                </p>
                <p>
                  <span className="font-medium">Reference:</span> {recentBooking.reference || recentBooking._id || '-'}
                </p>
                <p>
                  <span className="font-medium">Booking Status:</span> 
                  <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                    CONFIRMED
                  </span>
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">Thank you for your booking. Your seat has been reserved. Please arrive at least 15 minutes before departure.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Dashboard Tab Content */}
      {activeTab === 'dashboard' && (
        <div>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Total Bookings</h3>
                  <p className="text-2xl font-bold">{bookingStats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Confirmed</h3>
                  <p className="text-2xl font-bold">{bookingStats.confirmed}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Pending</h3>
                  <p className="text-2xl font-bold">{bookingStats.pending}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Canceled</h3>
                  <p className="text-2xl font-bold">{bookingStats.canceled}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Bookings */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Recent Bookings</h2>
            </div>
            
            <div className="overflow-x-auto">
              {bookings.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <p>You don't have any bookings yet.</p>
                  <button 
                    className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleBookNewRide}
                  >
                    Book Your First Ride
                  </button>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seats
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.route.from} to {booking.route.to}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.matatu.registration_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {moment(booking.booking_date).format('MMM D, YYYY')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {moment(booking.booking_date).format('h:mm A')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.seats.join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          KES {booking.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleViewDetails(booking._id)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            {bookings.length > 5 && (
              <div className="p-4 border-t border-gray-200 text-right">
                <button 
                  className="text-blue-600 hover:text-blue-900"
                  onClick={() => setActiveTab('bookings')}
                >
                  View All Bookings
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Bookings Tab Content */}
      {activeTab === 'bookings' && (
        <div>
          {bookings.length === 0 ? (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
              <p>You don't have any bookings yet.</p>
              <button 
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleBookNewRide}
              >
                Book a Ride
              </button>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">All Bookings</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seats
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.route.from} to {booking.route.to}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.matatu.registration_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {moment(booking.booking_date).format('MMM D, YYYY')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {moment(booking.booking_date).format('h:mm A')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.seats.join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          KES {booking.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleViewDetails(booking._id)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookings;