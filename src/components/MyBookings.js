import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';
import { Calendar, Clock, CreditCard, Map, CheckCircle, X, ArrowLeft, Search, Filter } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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
        
        // Sort bookings with newest first (based on travel date)
        const sortedBookings = response.data.bookings.sort((a, b) => 
          new Date(b.travelDate) - new Date(a.travelDate)
        );
        
        setBookings(sortedBookings);
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

  // Filter bookings based on search term and status filter
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      (booking.matatu?.registrationNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.route?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.route?.destination || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });
  
  // Get the status badge class and text
  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return {
          className: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle size={14} className="mr-1" />,
          text: 'Confirmed'
        };
      case 'pending':
        return {
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock size={14} className="mr-1" />,
          text: 'Pending'
        };
      case 'cancelled':
        return {
          className: 'bg-red-100 text-red-800 border-red-200',
          icon: <X size={14} className="mr-1" />,
          text: 'Cancelled'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: null,
          text: status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'
        };
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
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
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading your bookings...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md w-full shadow-md" role="alert">
          <div className="flex items-center mb-2">
            <X size={20} className="mr-2" />
            <p className="font-bold text-lg">Error</p>
          </div>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/moilinktravellers')}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-blue-100 p-4">
              <Calendar size={32} className="text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Bookings Found</h2>
          <p className="text-gray-600 mb-6">You don't have any bookings yet. Book a trip to get started!</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate('/moilinktravellers')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
            >
              Book a Trip
            </button>
            <button 
              onClick={() => navigate('/')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-md transition duration-300 flex items-center justify-center"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
            <p className="text-gray-500">Showing {filteredBookings.length} of {bookings.length} bookings</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => navigate('/moilinktravellers')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center justify-center text-sm"
            >
              Book a New Trip
            </button>
            <button 
              onClick={() => navigate('/moilinktravellers')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-300 flex items-center justify-center text-sm"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Home
            </button>
          </div>
        </div>
        
        {/* Search and filter bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                
              </div>
              <input
                type="text"
                placeholder="Search by vehicle number, route or destination..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 min-w-fit">
             
              <select
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        
        {filteredBookings.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">No bookings match your search criteria. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => {
            const statusBadge = getStatusBadge(booking.status);
            return (
              <div key={booking._id} className="bg-blue-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className={`py-3 px-4 ${
                  booking.status === 'confirmed' ? 'bg-green-600' : 
                  booking.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'
                } text-white flex justify-between items-center`}>
                  <h3 className="font-semibold">{booking.route?.name || 'Unknown Route'}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${statusBadge.className}`}>
                    {statusBadge.icon}
                    {statusBadge.text}
                  </span>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between mb-4">
                    <div className="text-center">
                      <div className="border-t border-gray-300 w-16 mt-3"></div>
                    </div>
                  </div>
                  
                  <div className="mb-4 flex justify-center">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <QRCode 
                        value={booking.qr_verification_link || booking._id || 'N/A'}
                        size={150}
                        level="H"
                      />
                      <p className="text-xs text-center mt-2 text-red-500">For Admin to scan </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded flex items-start">
                      <div className="mt-1 mr-2">
                        <Map size={14} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Number Plate</p>
                        <p className="font-semibold">{booking.matatu?.registrationNumber || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded flex items-start">
                      <div className="mt-1 mr-2">
                        <CheckCircle size={14} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Seat</p>
                        <p className="font-semibold">{booking.seatNumber || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded flex items-start">
                      <div className="mt-1 mr-2">
                        <Calendar size={14} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Travel Date</p>
                        <p className="font-semibold">{new Date(booking.travelDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded flex items-start">
                      <div className="mt-1 mr-2">
                        <Clock size={14} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Departure</p>
                        <p className="font-semibold">{booking.matatu?.departureTime || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded flex items-start col-span-2">
                      <div className="mt-1 mr-2">
                        <CreditCard size={14} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fare</p>
                        <p className="font-semibold">Ksh {booking.fare}</p>
                      </div>
                    </div>
                  </div>
        
                </div>
              </div>
            );
          })}
        </div>
        
        )}
        
        {/* Pagination could be added here for large numbers of bookings */}
        
        {filteredBookings.length > 0 && (
          <div className="mt-6 flex justify-center">
            <p className="text-gray-500 text-sm">
              Showing all {filteredBookings.length} bookings. 
              {bookings.length > 10 && " Use the search and filter to find specific bookings."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;