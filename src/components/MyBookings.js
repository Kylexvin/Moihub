import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = 'https://moihub.onrender.com/api';

const MyBookings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showDetails, setShowDetails] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [highlightedBooking, setHighlightedBooking] = useState(null);
  
  // Ref for scrolling to highlighted booking
  const highlightedBookingRef = useRef(null);

  useEffect(() => {
    // Check if we have booking details from navigation state
    const bookingFromState = location.state?.bookingDetails;
    if (bookingFromState) {
      console.log('Received booking details from navigation:', bookingFromState);
      setHighlightedBooking(bookingFromState.id || bookingFromState.booking_id);
      // Auto-expand this booking
      setShowDetails(prev => ({
        ...prev,
        [bookingFromState.id || bookingFromState.booking_id]: true
      }));
    }

    fetchBookings();
    fetchUserProfile();
  }, [location.state]);

  // Scroll to highlighted booking when it's rendered
  useEffect(() => {
    if (highlightedBookingRef.current) {
      highlightedBookingRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [highlightedBooking, loading]);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please log in to view your bookings.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserProfile(response.data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      // Don't set error here to avoid blocking booking display
    }
  };

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please log in to view your bookings.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/bookings/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Bookings data:', response.data);
      setBookings(response.data);
      
      // If we have a highlighted booking from navigation state, switch to the appropriate tab
      if (highlightedBooking && response.data.length > 0) {
        const booking = response.data.find(b => b.id === highlightedBooking || b.booking_id === highlightedBooking);
        if (booking) {
          const bookingDate = new Date(booking.travel_date);
          const today = new Date();
          
          if (['cancelled', 'refunded'].includes(booking.status.toLowerCase())) {
            setActiveTab('cancelled');
          } else if (bookingDate >= today && ['confirmed', 'pending'].includes(booking.status.toLowerCase())) {
            setActiveTab('upcoming');
          } else {
            setActiveTab('past');
          }
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Failed to load your bookings. Please try again.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPp'); // Format as "Apr 29, 2023, 9:30 AM"
    } catch (err) {
      return dateString;
    }
  };

  const toggleDetails = (bookingId) => {
    setShowDetails(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  const filterBookings = (status) => {
    if (status === 'upcoming') {
      return bookings.filter(booking => 
        ['confirmed', 'pending'].includes(booking.status.toLowerCase()) && 
        new Date(booking.travel_date) >= new Date()
      );
    } else if (status === 'past') {
      return bookings.filter(booking => 
        new Date(booking.travel_date) < new Date() || 
        ['completed', 'expired'].includes(booking.status.toLowerCase())
      );
    } else if (status === 'cancelled') {
      return bookings.filter(booking => 
        ['cancelled', 'refunded'].includes(booking.status.toLowerCase())
      );
    }
    return [];
  };

  const getStatusColor = (status) => {
    status = status.toLowerCase();
    if (['confirmed', 'completed'].includes(status)) return 'bg-green-100 text-green-800';
    if (['pending', 'processing'].includes(status)) return 'bg-yellow-100 text-yellow-800';
    if (['cancelled', 'expired', 'refunded'].includes(status)) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleDownloadTicket = (bookingId) => {
    // Future implementation for ticket download
    console.log('Download ticket for booking:', bookingId);
  };

  const handleRebookTrip = (booking) => {
    // Navigate to booking page with pre-filled information
    navigate('/booking', { state: { rebooking: booking } });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-4 bg-gray-200 rounded col-span-2"></div>
                  <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <p>{error}</p>
            <button onClick={() => navigate('/login')} className="mt-2 text-blue-600 hover:underline">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header with conditional notification for new booking */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">My Bookings</h1>
          {userProfile && (
            <div className="mt-2 text-sm text-gray-600">
              <p>Welcome, {userProfile.full_name || userProfile.username}</p>
            </div>
          )}
        </div>

        {/* New Booking Confirmation Banner */}
        {highlightedBooking && location.state?.bookingDetails && (
          <div className="bg-green-50 p-4 border-b border-green-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Booking Confirmed!</h3>
                <div className="mt-1 text-sm text-green-700">
                  <p>Your booking has been successfully confirmed. See details below.</p>
                </div>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button 
                    onClick={() => setHighlightedBooking(null)} 
                    className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Profile Summary */}
        {userProfile && (
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-blue-800">Your Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <p className="text-sm"><span className="font-medium">Email:</span> {userProfile.email}</p>
                  <p className="text-sm"><span className="font-medium">Phone:</span> {userProfile.phone_number || 'Not provided'}</p>
                  <p className="text-sm"><span className="font-medium">Member since:</span> {formatDate(userProfile.created_at)}</p>
                  <p className="text-sm"><span className="font-medium">Total trips:</span> {bookings.length}</p>
                </div>
              </div>
              <div>
                <button 
                  onClick={() => navigate('/profile')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Manage Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-gray-50 px-6 border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button 
              onClick={() => setActiveTab('upcoming')} 
              className={`py-4 px-6 font-medium text-sm ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Upcoming Trips
              {filterBookings('upcoming').length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                  {filterBookings('upcoming').length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('past')} 
              className={`py-4 px-6 font-medium text-sm ${activeTab === 'past' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Past Trips
              {filterBookings('past').length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-800">
                  {filterBookings('past').length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('cancelled')} 
              className={`py-4 px-6 font-medium text-sm ${activeTab === 'cancelled' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Cancelled
              {filterBookings('cancelled').length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                  {filterBookings('cancelled').length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Statistics Summary */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <p className="text-sm text-green-600 font-medium">Upcoming Trips</p>
              <p className="text-2xl font-bold text-green-700">{filterBookings('upcoming').length}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-600 font-medium">Past Trips</p>
              <p className="text-2xl font-bold text-blue-700">{filterBookings('past').length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <p className="text-sm text-purple-600 font-medium">Total Amount Spent</p>
              <p className="text-2xl font-bold text-purple-700">
                KES {bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => navigate('/booking')} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Book New Trip
              </button>
              <button 
                onClick={() => navigate('/schedule')} 
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
              >
                View Schedules
              </button>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filterBookings(activeTab).length > 0 ? (
              filterBookings(activeTab).map(booking => (
                <div 
                  key={booking.id} 
                  ref={booking.id === highlightedBooking ? highlightedBookingRef : null}
                  className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                    booking.id === highlightedBooking 
                      ? 'border-green-500 shadow-md' 
                      : 'border-gray-200'
                  }`}
                >
                  <div 
                    className={`flex flex-wrap justify-between items-center p-4 cursor-pointer ${
                      booking.id === highlightedBooking ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                    onClick={() => toggleDetails(booking.id)}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{booking.route?.name || 'Trip Details'}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(booking.travel_date)} • Seat(s): {booking.seats?.join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 transition-transform ${showDetails[booking.id] ? 'rotate-180' : ''}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  {showDetails[booking.id] && (
                    <div className="p-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Trip Details</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Registration:</span> {booking.registration}</p>
                            <p><span className="font-medium">Route:</span> {booking.route?.name}</p>
                            <p><span className="font-medium">Departure:</span> {formatDate(booking.departure_time)}</p>
                            <p><span className="font-medium">Arrival:</span> {booking.arrival_time ? formatDate(booking.arrival_time) : 'Not specified'}</p>
                            <p><span className="font-medium">Seats:</span> {booking.seats?.join(', ')}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Payment Details</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Amount:</span> KES {booking.amount?.toLocaleString()}</p>
                            <p><span className="font-medium">Payment Method:</span> {booking.payment_method || 'M-PESA'}</p>
                            <p><span className="font-medium">Transaction ID:</span> {booking.transaction_id || 'Not available'}</p>
                            <p><span className="font-medium">Payment Date:</span> {booking.payment_date ? formatDate(booking.payment_date) : 'Not available'}</p>
                            <p><span className="font-medium">Payment Status:</span> {booking.payment_status || booking.status}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Booking Receipt Section */}
                      {booking.id === highlightedBooking && location.state?.bookingDetails && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">Booking Confirmation</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <p><span className="font-medium">Booking ID:</span> {booking.id || booking.booking_id}</p>
                            <p><span className="font-medium">Confirmation Date:</span> {formatDate(new Date())}</p>
                          </div>
                          <div className="mt-2 text-xs text-green-700">
                            <p>Thank you for booking with us! Your booking has been confirmed and your seat(s) are reserved.</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {activeTab === 'upcoming' && (
                          <>
                            <button
                              onClick={() => handleDownloadTicket(booking.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                            >
                              Download Ticket
                            </button>
                            <button
                              onClick={() => navigate(`/bookings/${booking.id}`)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                            >
                              View Ticket
                            </button>
                          </>
                        )}
                        
                        {activeTab === 'past' && (
                          <button
                            onClick={() => handleRebookTrip(booking)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm"
                          >
                            Book Similar Trip
                          </button>
                        )}
                        
                        {activeTab === 'upcoming' && new Date(booking.travel_date) > new Date(Date.now() + 24 * 60 * 60 * 1000) && (
                          <button
                            onClick={() => navigate(`/bookings/${booking.id}/cancel`)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="mt-4 text-gray-600">No {activeTab} bookings found</p>
                {activeTab !== 'upcoming' && (
                  <button
                    onClick={() => navigate('/booking')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Book a Trip
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;