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
  List,
  RefreshCw,
  TrendingUp,
  Users,
  MapPin,
  DollarSign
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
  Cell,
  AreaChart,
  Area
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
  
  // State for view mode (table or graphs) - default to graphs now
  const [viewMode, setViewMode] = useState('graphs');
  
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
      
      // Extract bookings array from response
      const bookingsData = response.data.bookings || [];
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
        // Check if travelDate exists
        if (!booking.travelDate) return false;
        const bookingDate = new Date(booking.travelDate).toDateString();
        return bookingDate === filterDate;
      });
    }
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(booking => 
        booking.user?.username?.toLowerCase().includes(searchTerm) ||
        booking.matatu?.registrationNumber?.toLowerCase().includes(searchTerm) ||
        booking.route?.name?.toLowerCase().includes(searchTerm)
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
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800';
      case 'completed':
        return 'bg-sky-100 text-sky-800';
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
      .slice(0, 6); // Show top 6 matatus only for better visualization
  };
  
  // Prepare data for routes bookings bar chart
  const getRouteBookingsData = () => {
    if (!Array.isArray(filteredBookings) || filteredBookings.length === 0) {
      return [];
    }
    
    const routeCounts = {};
    
    filteredBookings.forEach(booking => {
      if (booking.route?.name) {
        const routeName = booking.route.name;
        routeCounts[routeName] = (routeCounts[routeName] || 0) + 1;
      }
    });
    
    return Object.keys(routeCounts)
      .map(routeName => ({
        name: routeName,
        bookings: routeCounts[routeName]
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 6); // Show top 6 routes only
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
      // Check for payment.amount first, then fallback to fare
      return sum + (booking.payment?.amount || booking.fare || 0);
    }, 0);
  };

  // Calculate total routes
  const calculateTotalRoutes = () => {
    if (!Array.isArray(filteredBookings) || filteredBookings.length === 0) {
      return 0;
    }
    
    const uniqueRoutes = new Set();
    filteredBookings.forEach(booking => {
      if (booking.route?._id) {
        uniqueRoutes.add(booking.route._id);
      }
    });
    
    return uniqueRoutes.size;
  };

  // Calculate total unique users
  const calculateTotalUsers = () => {
    if (!Array.isArray(filteredBookings) || filteredBookings.length === 0) {
      return 0;
    }
    
    const uniqueUsers = new Set();
    filteredBookings.forEach(booking => {
      if (booking.user?._id) {
        uniqueUsers.add(booking.user._id);
      }
    });
    
    return uniqueUsers.size;
  };
  
  // Calculate completion rate
  const calculateCompletionRate = () => {
    if (!Array.isArray(filteredBookings) || filteredBookings.length === 0) {
      return 0;
    }
    
    const completedCount = filteredBookings.filter(booking => 
      booking.status?.toLowerCase() === 'completed').length;
    
    return Math.round((completedCount / filteredBookings.length) * 100);
  };
  
  // Colors for charts
  const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'];
  const CHART_COLORS = {
    blue: {
      main: '#6366f1',
      light: '#818cf8', 
      lighter: '#e0e7ff'
    },
    green: {
      main: '#10b981',
      light: '#34d399',
      lighter: '#d1fae5'
    },
    yellow: {
      main: '#f59e0b',
      light: '#fbbf24',
      lighter: '#fef3c7'
    },
    purple: {
      main: '#8b5cf6',
      light: '#a78bfa',
      lighter: '#ede9fe'
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen p-4 pt-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Booking Management</h1>
        <p className="text-gray-500">Monitor and manage all booking activities</p>
      </div>
      
      {/* Filters section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-medium text-gray-700">Filters & View Options</h3>
          </div>
          
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
            <button 
              className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'graphs' ? 'bg-indigo-600 text-white' : 'bg-transparent text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setViewMode('graphs')}
            >
              <BarChartIcon className="h-4 w-4 mr-2" />
              Analytics
            </button>
            <button 
              className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-transparent text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4 mr-2" />
              Table
            </button>
          </div>
          
          {/* Refresh button */}
          <button 
            onClick={fetchBookings}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
           
          </div>
          
          {/* Status filter */}
          <select
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white appearance-none transition-all"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center" }}
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
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
            <Calendar className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            
            {/* Clear filters button */}
            {(filters.status || filters.date || filters.search) && (
              <button 
                onClick={clearFilters}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-xs font-medium flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 p-12">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading booking data...</p>
        </div>
      )}
      
      {/* No results message */}
      {!loading && (!Array.isArray(filteredBookings) || filteredBookings.length === 0) && (
        <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 p-12">
          <div className="bg-gray-100 p-3 rounded-full">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">No bookings found matching your filters</p>
          <button 
            onClick={clearFilters}
            className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
      
      {/* Dashboard Overview - Stats Cards */}
      {!loading && Array.isArray(filteredBookings) && filteredBookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Bookings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-3xl font-bold text-gray-800">{filteredBookings.length}</span>
              <span className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded bg-green-100 text-green-800">+24%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs. previous period</p>
          </div>
          
          {/* Unique Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">Unique Users</h3>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-3xl font-bold text-gray-800">{calculateTotalUsers()}</span>
              <span className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded bg-green-100 text-green-800">+18%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs. previous period</p>
          </div>
          
          {/* Total Routes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">Active Routes</h3>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-3xl font-bold text-gray-800">{calculateTotalRoutes()}</span>
              <span className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">+5%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs. previous period</p>
          </div>
          
          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-3xl font-bold text-gray-800">KES {calculateTotalRevenue().toLocaleString()}</span>
              <span className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded bg-green-100 text-green-800">+32%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs. previous period</p>
          </div>
        </div>
      )}
      
      {/* Analytics/Graph View */}
      {!loading && Array.isArray(filteredBookings) && filteredBookings.length > 0 && viewMode === 'graphs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily booking trend - Spanning full width */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-base font-medium text-gray-800 mb-6">Booking Activity Trend</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={getDailyBookingsTrendData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.blue.main} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={CHART_COLORS.blue.main} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} />
                  <YAxis tick={{ fontSize: 12 }} tickMargin={10} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    formatter={(value) => [`${value} bookings`, 'Count']} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bookings" 
                    name="Daily Bookings" 
                    stroke={CHART_COLORS.blue.main} 
                    fillOpacity={1} 
                    fill="url(#colorBookings)" 
                    strokeWidth={2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Status distribution pie chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-base font-medium text-gray-800 mb-5">Booking Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getStatusDistributionData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                  >
                    {getStatusDistributionData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} bookings`, 'Count']}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Most Popular Routes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-base font-medium text-gray-800 mb-5">Most Popular Routes</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getRouteBookingsData()}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 120, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} tickMargin={10} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 12 }} 
                    width={120} 
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} bookings`, 'Count']}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Bar 
                    dataKey="bookings" 
                    fill={CHART_COLORS.purple.main} 
                    name="Number of Bookings"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Most Popular Vehicles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-base font-medium text-gray-800 mb-5">Most Used Vehicles</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getMatatuBookingsData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }} 
                    tickMargin={10}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 12 }} tickMargin={10} />
                  <Tooltip 
                    formatter={(value) => [`${value} bookings`, 'Count']}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Bar 
                    dataKey="bookings" 
                    fill={CHART_COLORS.green.main} 
                    name="Number of Bookings" 
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      

      
{/* Table View */}
{!loading && Array.isArray(filteredBookings) && filteredBookings.length > 0 && viewMode === 'table' && (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Booking ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Passenger</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Vehicle Reg</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Route</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Travel Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Seat</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Fare</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {currentItems.map((booking) => (
            <tr key={booking._id} className="hover:bg-blue-50 transition-colors duration-150">
              <td className="px-4 py-3 text-sm font-medium text-blue-600">{booking._id.slice(-6)}</td>
              <td className="px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-gray-800">{booking.user?.username || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{booking.user?.email || 'N/A'}</div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {booking.matatu?.registrationNumber || 'N/A'}
                {booking.matatu?.departureTime && <div className="text-xs text-blue-500">Departure: {booking.matatu.departureTime}</div>}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {booking.route?.name || 'N/A'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatDate(booking.travelDate)}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-xs font-medium text-blue-800">
                  {booking.seatNumber || 'N/A'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status || 'Unknown'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm font-medium text-emerald-600">
                KES {booking.payment?.amount || booking.fare || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    {/* Pagination */}
    {filteredBookings.length > itemsPerPage && (
      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100 sm:px-6 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Showing <span className="font-medium text-gray-700">{indexOfFirstItem + 1}</span> to <span className="font-medium text-gray-700">{Math.min(indexOfLastItem, filteredBookings.length)}</span> of <span className="font-medium text-gray-700">{filteredBookings.length}</span> bookings
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-1.5 rounded-full ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          {Array.from({ length: Math.min(5, Math.ceil(filteredBookings.length / itemsPerPage)) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={i}
                onClick={() => paginate(pageNum)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium transition-colors duration-150 ${currentPage === pageNum ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 hover:bg-blue-100'}`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {Math.ceil(filteredBookings.length / itemsPerPage) > 5 && (
            <span className="text-gray-500 px-1">...</span>
          )}
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredBookings.length / itemsPerPage)}
            className={`p-1.5 rounded-full ${currentPage === Math.ceil(filteredBookings.length / itemsPerPage) ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
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
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Status distribution pie chart */}
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-medium mb-4 text-gray-800">Booking Status Distribution</h3>
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
                <Cell key={`cell-${index}`} fill={['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][index % 6]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} bookings`, 'Count']} 
              contentStyle={{ backgroundColor: 'rgba(155, 49, 49, 0.95)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none' }}
            />
            <Legend iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    
    {/* Top vehicles by bookings */}
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-medium mb-4 text-gray-800">Most Popular Vehicles</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={getMatatuBookingsData()}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
            <Tooltip 
              formatter={(value) => [`${value} bookings`, 'Count']}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none' }}
            />
            <Legend />
            <Bar dataKey="bookings" fill="#10B981" name="Number of Bookings" radius={[0, 4, 4, 0]}>
              {getMatatuBookingsData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`#10B981${90 - index * 10}`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    
    {/* Top routes by bookings */}
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-medium mb-4 text-gray-800">Most Popular Routes</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={getRouteBookingsData()}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
            <Tooltip 
              formatter={(value) => [`${value} bookings`, 'Count']}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none' }}
            />
            <Legend />
            <Bar dataKey="bookings" fill="#4F46E5" name="Number of Bookings" radius={[0, 4, 4, 0]}>
              {getRouteBookingsData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`#4F46E5${90 - index * 10}`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    
    {/* Daily booking trend */}
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-medium mb-4 text-gray-800">Daily Booking Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={getDailyBookingsTrendData()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} bookings`, 'Count']}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none' }}
            />
            <Legend />
            <Bar dataKey="bookings" name="Daily Bookings" radius={[4, 4, 0, 0]}>
              {getDailyBookingsTrendData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`#8B5CF6${90 - (index % 7) * 10}`} />
              ))}
            </Bar>
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