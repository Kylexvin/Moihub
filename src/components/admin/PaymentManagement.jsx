import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, RefreshCw, Check, X, AlertTriangle, RotateCcw } from 'lucide-react';

const PaymentManagement = () => {
  // State for payments data and pagination
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // State for filters
  const [filters, setFilters] = useState({
    status: '',
    userId: '',
    phoneNumber: '',
    paymentId: '',
    dateRange: '',
    searchTerm: ''
  });
  
  // State for status update
  const [updatingPaymentId, setUpdatingPaymentId] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Status badge colors and icons
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle size={16} className="text-yellow-500" /> },
    completed: { color: 'bg-green-100 text-green-800', icon: <Check size={16} className="text-green-500" /> },
    failed: { color: 'bg-red-100 text-red-800', icon: <X size={16} className="text-red-500" /> },
    refunded: { color: 'bg-blue-100 text-blue-800', icon: <RotateCcw size={16} className="text-blue-500" /> }
  };

  // Date range options
  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' }
  ];

  // Status options
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ];

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Fetch payments based on current filters and pagination
  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Construct query parameters
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage
      });
      
      // Add filters to query params if they exist
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.userId) queryParams.append('userId', filters.userId);
      if (filters.phoneNumber) queryParams.append('phoneNumber', filters.phoneNumber);
      if (filters.paymentId) queryParams.append('paymentId', filters.paymentId);
      if (filters.dateRange) queryParams.append('dateRange', filters.dateRange);
      
      // Get auth token
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await fetch(`https://moihub.onrender.com/api/bookings/payments?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch payments: ${response.statusText}`);
      }
      
      const data = await response.json();
      // Update to match API response structure
      setPayments(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update payment status
  const updatePaymentStatus = async (paymentId, newStatus) => {
    setUpdateLoading(true);
    
    try {
      // Get auth token
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await fetch(`https://moihub.onrender.com/api/bookings/payments/${paymentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to update payment status: ${response.statusText}`);
      }
      
      // Refresh payments list after successful update
      fetchPayments();
      
      // Reset update state
      setUpdatingPaymentId(null);
      setUpdateStatus('');
      
    } catch (err) {
      setError(err.message);
      console.error('Error updating payment status:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle search input
  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  // Apply filters
  const applyFilters = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when filtering
    fetchPayments();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      userId: '',
      phoneNumber: '',
      paymentId: '',
      dateRange: '',
      searchTerm: ''
    });
    setCurrentPage(1);
    fetchPayments(); // Fetch all payments after resetting filters
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  // Filter payments by search term (client-side filtering)
  const filteredPayments = payments.filter(payment => {
    if (!filters.searchTerm) return true;
    
    const searchTerm = filters.searchTerm.toLowerCase();
    return (
      (payment.user?.username?.toLowerCase().includes(searchTerm)) ||
      (payment.phone_number?.toLowerCase().includes(searchTerm)) ||
      (payment._id?.toLowerCase().includes(searchTerm)) ||
      (payment.transaction_details?.receipt_number?.toLowerCase().includes(searchTerm))
    );
  });

  // Load payments on initial render and when filters/pagination change
  useEffect(() => {
    fetchPayments();
  }, [currentPage, itemsPerPage]);

  // Handle auth error and redirect to login if needed
  const handleAuthError = (errorMessage) => {
    if (errorMessage && (
      errorMessage.includes('Authentication required') || 
      errorMessage.includes('Authentication failed')
    )) {
      // You can implement redirect to login here
      // Example: window.location.href = '/login';
      console.log('Redirecting to login page...');
    }
  };

  // Monitor error state for auth errors
  useEffect(() => {
    if (error) {
      handleAuthError(error);
    }
  }, [error]);

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Management</h1>
        <p className="text-gray-600">View, filter, and manage payment transactions</p>
      </div>
      
      {/* Auth Error Message */}
      {error && (error.includes('Authentication required') || error.includes('Authentication failed')) && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error} <a href="/login" className="font-medium underline">Login again</a>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <Filter size={20} className="text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        
        <form onSubmit={applyFilters} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* User ID Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input
                type="text"
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                placeholder="Enter user ID"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Phone Number Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={filters.phoneNumber}
                onChange={handleFilterChange}
                placeholder="Enter phone number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Payment ID Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment ID</label>
              <input
                type="text"
                name="paymentId"
                value={filters.paymentId}
                onChange={handleFilterChange}
                placeholder="Enter payment ID"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                name="dateRange"
                value={filters.dateRange}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* Search Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  name="searchTerm"
                  value={filters.searchTerm}
                  onChange={handleSearch}
                  placeholder="Search by name, phone, or receipt #"
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {/* <Search size={18} className="absolute left-3 top-2.5 text-gray-400" /> */}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
      
      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Payment Transactions</h2>
          <button
            onClick={() => fetchPayments()}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <RefreshCw size={16} className="mr-1" />
            Refresh
          </button>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading payments...</p>
          </div>
        ) : error && !error.includes('Authentication') ? (
          <div className="p-8 text-center text-red-600">
            <p>Error: {error}</p>
            <button
              onClick={() => fetchPayments()}
              className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p>No payments found with the current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipt #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment._id.substring(0, 10)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.user?.username || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.phone_number || 'No phone'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.transaction_details?.receipt_number || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[payment.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                        {statusConfig[payment.status]?.icon}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {updatingPaymentId === payment._id ? (
                        <div className="flex items-center justify-end space-x-2">
                          <select
                            value={updateStatus}
                            onChange={(e) => setUpdateStatus(e.target.value)}
                            className="p-1 text-sm border border-gray-300 rounded"
                            disabled={updateLoading}
                          >
                            <option value="">Select status</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                          </select>
                          <button
                            onClick={() => updatePaymentStatus(payment._id, updateStatus)}
                            disabled={!updateStatus || updateLoading}
                            className="text-green-600 hover:text-green-900 disabled:text-gray-400"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setUpdatingPaymentId(null);
                              setUpdateStatus('');
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setUpdatingPaymentId(payment._id);
                            setUpdateStatus(payment.status);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Update Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredPayments.length}</span> results
                {totalPages > 1 && (
                  <span> - Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span></span>
                )}
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft size={18} />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNumber
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight size={18} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;