import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
  X,
  BarChart as BarChartIcon,
  List
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const BookingManagement = ({ setError, setSuccess }) => {
  // State for bookings data
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // State for filters
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    search: ''
  });
  
  // State for view mode (table or graphs)
  const [viewMode, setViewMode] = useState('table');
  
  // API config
  const getApiConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
  };
  
  // Fetch bookings on component mount
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://moihub.onrender.com/api/bookings', getApiConfig());
      
      // Ensure we're getting an array of bookings
      const bookingsData = Array.isArray(response.data) ? response.data : [];
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to load bookings. Please try again.");
      setLoading(false);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    fetchBookings();
  }, []);
  
  // Apply filters when filters state changes
  useEffect(() => {
    if (!Array.isArray(bookings) || bookings.length === 0) {
      setFilteredBookings([]);
      return;
    }
    
    let result = [...bookings];
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(booking => booking.status?.toLowerCase() === filters.status.toLowerCase());
    }
    
    // Apply date filter
    if (filters.date) {
      const filterDate = new Date(filters.date).toDateString();
      result = result.filter(booking => {
        const bookingDate = new Date(booking.travelDate).toDateString();
        return bookingDate === filterDate;
      });
    }
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(booking => 
        booking.user?.username?.toLowerCase().includes(searchTerm) ||
        booking.matatu?.registrationNumber?.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredBookings(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, bookings]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: '',
      date: '',
      search: ''
    });
  };
  
  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Status badge color mapping
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Prepare data for status distribution pie chart
  const getStatusDistributionData = () => {
    if (!Array.isArray(filteredBookings) || filteredBookings.length === 0) {
      return [];
    }
    
    const statusCounts = {};
    
    filteredBookings.forEach(booking => {
      const status = booking.status || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    return Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status]
    }));
  };
  
  // Prepare data for matatu bookings bar chart
  const getMatatuBookingsData = () => {
    if (!Array.isArray(filteredBookings) || filteredBookings.length === 0) {
      return [];
    }
    
    const matatuCounts = {};
    
    filteredBookings.forEach(booking => {
      if (booking.matatu?.registrationNumber) {
        const regNumber = booking.matatu.registrationNumber;
        matatuCounts[regNumber] = (matatuCounts[regNumber] || 0) + 1;
      }
    });
    
    return Object.keys(matatuCounts)
      .map(regNumber => ({
        name: regNumber,
        bookings: matatuCounts[regNumber]
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 10); // Show top 10 matatus only
  };
  
  // Prepare data for daily bookings trend
  const getDailyBookingsTrendData = () => {
    if (!Array.isArray(filteredBookings) || filteredBookings.length === 0) {
      return [];
    }
    
    const dateCounts = {};
    
    filteredBookings.forEach(booking => {
      if (booking.travelDate) {
        const date = new Date(booking.travelDate).toLocaleDateString();
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      }
    });
    
    return Object.keys(dateCounts)
      .map(date => ({
        date,
        bookings: dateCounts[date]
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-14); // Show last 14 days only
  };
  
  // Calculate total revenue
  const calculateTotalRevenue = () => {
    if (!Array.isArray(filteredBookings) || filteredBookings.length === 0) {
      return 0;
    }
    
    return filteredBookings.reduce((sum, booking) => {
      return sum + (booking.payment?.amount || booking.fare || 0);
    }, 0);
  };
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <div className="space-y-4">
      {/* Filters section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium">Filters</h3>
          </div>
          
          {/* View toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button 
              className={`flex items-center px-3 py-1.5 text-xs ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-500'}`}
              onClick={() => setViewMode('table')}
            >
              <List className="h-3.5 w-3.5 mr-1.5" />
              Table
            </button>
            <button 
              className={`flex items-center px-3 py-1.5 text-xs ${viewMode === 'graphs' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-500'}`}
              onClick={() => setViewMode('graphs')}
            >
              <BarChartIcon className="h-3.5 w-3.5 mr-1.5" />
              Analytics
            </button>
          </div>
          
          {/* Clear filters button */}
          {(filters.status || filters.date || filters.search) && (
            <button 
              onClick={clearFilters}
              className="text-xs flex items-center text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by username or vehicle reg..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          {/* Status filter */}
          <select
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          
          {/* Date filter */}
          <div className="relative">
            <input
              type="date"
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
            <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Loading indicator */}
      {loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Loading bookings data...</p>
        </div>
      )}
      
      {/* No results message */}
      {!loading && (!Array.isArray(filteredBookings) || filteredBookings.length === 0) && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No bookings found matching your filters.</p>
        </div>
      )}
      
      {/* Booking statistics summary cards */}
      {!loading && Array.isArray(filteredBookings) && filteredBookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-500">Total Bookings</div>
            <div className="text-2xl font-bold mt-1">{filteredBookings.length}</div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-500">Confirmed Bookings</div>
            <div className="text-2xl font-bold mt-1 text-green-600">
              {filteredBookings.filter(b => b.status?.toLowerCase() === 'confirmed').length}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-500">Total Revenue</div>
            <div className="text-2xl font-bold mt-1 text-blue-600">
              KES {calculateTotalRevenue().toLocaleString()}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-500">Avg. Fare</div>
            <div className="text-2xl font-bold mt-1 text-purple-600">
              KES {filteredBookings.length > 0 ? Math.round(calculateTotalRevenue() / filteredBookings.length).toLocaleString() : 0}
            </div>
          </div>
        </div>
      )}
      
      {/* Table View */}
      {!loading && Array.isArray(filteredBookings) && filteredBookings.length > 0 && viewMode === 'table' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passenger</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Reg</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seat</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{booking._id.slice(-6)}</td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.user?.username || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{booking.user?.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {booking.matatu?.registrationNumber || 'N/A'}
                      {booking.matatu?.departureTime && <div className="text-xs">Departure: {booking.matatu.departureTime}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(booking.travelDate)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {booking.seatNumber || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      KES {booking.payment?.amount || booking.fare || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredBookings.length > itemsPerPage && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBookings.length)} of {filteredBookings.length} bookings
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-1 rounded ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {Array.from({ length: Math.min(5, Math.ceil(filteredBookings.length / itemsPerPage)) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={i}
                      onClick={() => paginate(pageNum)}
                      className={`px-2 py-1 text-xs rounded ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {Math.ceil(filteredBookings.length / itemsPerPage) > 5 && (
                  <span className="text-gray-500">...</span>
                )}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredBookings.length / itemsPerPage)}
                  className={`p-1 rounded ${currentPage === Math.ceil(filteredBookings.length / itemsPerPage) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Analytics/Graph View */}
      {!loading && Array.isArray(filteredBookings) && filteredBookings.length > 0 && viewMode === 'graphs' && (
        <div className="space-y-4">
          {/* Status distribution pie chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-medium mb-4">Booking Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getStatusDistributionData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {getStatusDistributionData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} bookings`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Top vehicles by bookings */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-medium mb-4">Most Popular Vehicles</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getMatatuBookingsData()}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip formatter={(value) => [`${value} bookings`, 'Count']} />
                  <Legend />
                  <Bar dataKey="bookings" fill="#82ca9d" name="Number of Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Daily booking trend */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-medium mb-4">Daily Booking Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getDailyBookingsTrendData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} bookings`, 'Count']} />
                  <Legend />
                  <Bar dataKey="bookings" fill="#0088FE" name="Daily Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;