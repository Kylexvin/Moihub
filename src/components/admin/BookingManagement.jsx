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
  PieChart as PieChartIcon,
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
    route: '',
    search: ''
  });
  
  // State for routes (for filter dropdown)
  const [routes, setRoutes] = useState([]);
  
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
      const response = await axios.get('https://moihub.onrender.com/api//api/bookings', getApiConfig());
      setBookings(response.data);
      setFilteredBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to load bookings. Please try again.");
      setLoading(false);
    }
  };
  
  // Fetch routes for filter dropdown
  const fetchRoutes = async () => {
    try {
      const response = await axios.get('https://moihub.onrender.com/api/routes', getApiConfig());
      setRoutes(response.data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    fetchBookings();
    fetchRoutes();
  }, []);
  
  // Apply filters when filters state changes
  useEffect(() => {
    applyFilters();
  }, [filters, bookings]);
  
  // Filter bookings based on selected filters
  const applyFilters = () => {
    let result = [...bookings];
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(booking => booking.status?.toLowerCase() === filters.status.toLowerCase());
    }
    
    // Apply date filter
    if (filters.date) {
      const filterDate = new Date(filters.date).toDateString();
      result = result.filter(booking => {
        const bookingDate = new Date(booking.bookingDate).toDateString();
        return bookingDate === filterDate;
      });
    }
    
    // Apply route filter
    if (filters.route) {
      result = result.filter(booking => booking.routeId === filters.route);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(booking => 
        booking.passengerName?.toLowerCase().includes(searchTerm) ||
        booking.referenceNumber?.toLowerCase().includes(searchTerm) ||
        booking.phoneNumber?.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredBookings(result);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
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
      route: '',
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
  
  // Get route name by ID
  const getRouteName = (routeId) => {
    const route = routes.find(r => r._id === routeId);
    return route ? `${route.startLocation} - ${route.endLocation}` : 'Unknown Route';
  };
  
  // Prepare data for status distribution pie chart
  const getStatusDistributionData = () => {
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
  
  // Prepare data for route bookings bar chart
  const getRouteBookingsData = () => {
    const routeCounts = {};
    
    filteredBookings.forEach(booking => {
      const routeId = booking.routeId;
      if (routeId) {
        const routeName = getRouteName(routeId);
        routeCounts[routeName] = (routeCounts[routeName] || 0) + 1;
      }
    });
    
    return Object.keys(routeCounts)
      .map(route => ({
        name: route,
        bookings: routeCounts[route]
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 10); // Show top 10 routes only
  };
  
  // Prepare data for daily bookings trend
  const getDailyBookingsTrendData = () => {
    const dateCounts = {};
    
    filteredBookings.forEach(booking => {
      if (booking.bookingDate) {
        const date = new Date(booking.bookingDate).toLocaleDateString();
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
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];
  
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
          {(filters.status || filters.date || filters.route || filters.search) && (
            <button 
              onClick={clearFilters}
              className="text-xs flex items-center text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search bookings..."
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
          
          {/* Route filter */}
          <select
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            name="route"
            value={filters.route}
            onChange={handleFilterChange}
          >
            <option value="">All Routes</option>
            {routes.map(route => (
              <option key={route._id} value={route._id}>
                {route.startLocation} - {route.endLocation}
              </option>
            ))}
          </select>
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
      {!loading && filteredBookings.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No bookings found matching your filters.</p>
        </div>
      )}
      
      {/* Table View */}
      {!loading && filteredBookings.length > 0 && viewMode === 'table' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Ref</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passenger</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{booking.referenceNumber || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.passengerName || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{booking.phoneNumber || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {getRouteName(booking.routeId)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(booking.bookingDate)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {booking.amount ? booking.amount.toLocaleString('en-US', { style: 'currency', currency: 'KES' }) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
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
              
              {Array.from({ length: Math.ceil(filteredBookings.length / itemsPerPage) }, (_, i) => {
                // Show only a limited range of pages for better UX
                if (
                  i === 0 || 
                  i === Math.ceil(filteredBookings.length / itemsPerPage) - 1 ||
                  (i >= currentPage - 2 && i <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`px-2 py-1 text-xs rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {i + 1}
                    </button>
                  );
                } else if (
                  i === currentPage - 3 || 
                  i === currentPage + 3
                ) {
                  return <span key={i} className="text-gray-500">...</span>;
                } else {
                  return null;
                }
              })}
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredBookings.length / itemsPerPage)}
                className={`p-1 rounded ${currentPage === Math.ceil(filteredBookings.length / itemsPerPage) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Analytics/Graph View */}
      {!loading && filteredBookings.length > 0 && viewMode === 'graphs' && (
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
          
          {/* Top routes by bookings */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-medium mb-4">Most Popular Routes</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getRouteBookingsData()}
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
          
          {/* Booking statistics summary cards */}
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
              <div className="text-sm font-medium text-gray-500">Pending Bookings</div>
              <div className="text-2xl font-bold mt-1 text-yellow-600">
                {filteredBookings.filter(b => b.status?.toLowerCase() === 'pending').length}
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm font-medium text-gray-500">Cancelled Bookings</div>
              <div className="text-2xl font-bold mt-1 text-red-600">
                {filteredBookings.filter(b => b.status?.toLowerCase() === 'cancelled').length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;