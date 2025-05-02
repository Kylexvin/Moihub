import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';

const EShopOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [processingUpdate, setProcessingUpdate] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all vendor orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://moihub.onrender.com/api/eshop/orders/vendor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    // Show confirmation dialog first
    const result = await Swal.fire({
      title: 'Update Order Status',
      text: `Are you sure you want to change the status to ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    });
    
    if (!result.isConfirmed) return;
    
    setProcessingUpdate(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `https://moihub.onrender.com/api/eshop/orders/vendor/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        // Update local state to reflect the change
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        
        Swal.fire({
          title: 'Success!',
          text: `Order status updated to ${newStatus}`,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update order status. Please try again.',
        icon: 'error'
      });
    } finally {
      setProcessingUpdate(false);
    }
  };

  // Toggle order details view
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Format date
  const formatDate = (dateString) => {
    return moment(dateString).format('MMM DD, YYYY [at] h:mm A');
  };

  // Load orders when component mounts
  useEffect(() => {
    fetchOrders();
    // Add event listener for network status
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  // Handle coming back online
  const handleOnline = () => {
    if (navigator.onLine) {
      toast.info('You are back online. Refreshing orders...');
      fetchOrders();
    }
  };

  // Status badge component with improved styling
  const StatusBadge = ({ status }) => {
    const badgeClass = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border border-blue-200',
      completed: 'bg-green-100 text-green-800 border border-green-200',
      cancelled: 'bg-red-100 text-red-800 border border-red-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClass[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Get card background color based on status
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'processing':
        return 'bg-blue-50 border-blue-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'cancelled':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  // Filter and search orders
  const filteredOrders = orders
    .filter(order => statusFilter === 'all' || order.status === statusFilter)
    .filter(order => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        order._id.toLowerCase().includes(search) ||
        order.user.email.toLowerCase().includes(search) ||
        order.shippingAddress?.toLowerCase().includes(search) ||
        order.contactNumber?.toLowerCase().includes(search) ||
        order.items.some(item => item.product.name.toLowerCase().includes(search))
      );
    });

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Manage Orders</h2>
        <button 
          onClick={fetchOrders}
          className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </>
          ) : (
            'Refresh Orders'
          )}
        </button>
      </div>

      {/* Order counts summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'All Orders', value: orders.length, color: 'bg-gray-100 border-gray-200', onClick: () => setStatusFilter('all') },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'bg-yellow-50 border-yellow-200', onClick: () => setStatusFilter('pending') },
          { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: 'bg-blue-50 border-blue-200', onClick: () => setStatusFilter('processing') },
          { label: 'Completed', value: orders.filter(o => o.status === 'completed').length, color: 'bg-green-50 border-green-200', onClick: () => setStatusFilter('completed') },
        ].map((item) => (
          <div 
            key={item.label} 
            className={`${item.color} p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md`}
            onClick={item.onClick}
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm md:w-48"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-gray-500">Loading orders...</p>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Orders Yet</h3>
          <p className="mt-1 text-gray-500">You haven't received any orders yet.</p>
          <div className="mt-6">
            <button
              onClick={fetchOrders}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Refresh
            </button>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2 text-gray-500 text-lg">No {statusFilter !== 'all' ? statusFilter : ''} orders found.</p>
          {statusFilter !== 'all' && (
            <button 
              onClick={() => setStatusFilter('all')}
              className="mt-3 text-blue-600 hover:text-blue-800"
            >
              View all orders
            </button>
          )}
        </div>
      ) : (
        <div>
          {/* Desktop view - Table with improved styling */}
          <div className="hidden md:block overflow-x-auto border rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="hover:bg-gray-50 transition duration-150">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.user.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        KSh {order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => toggleOrderDetails(order._id)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium flex items-center"
                        >
                          {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                          <svg 
                            className={`ml-1 h-4 w-4 transition-transform transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {expandedOrder === order._id && (
                      <tr>
                        <td colSpan="6" className="px-4 py-4 bg-gray-50">
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                              <svg className="mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              Order Details
                            </h4>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="p-3 bg-white rounded border">
                                <p className="text-sm text-gray-500 mb-1">Shipping Address:</p>
                                <p className="text-sm font-medium">{order.shippingAddress}</p>
                              </div>
                              <div className="p-3 bg-white rounded border">
                                <p className="text-sm text-gray-500 mb-1">Contact Number:</p>
                                <p className="text-sm font-medium">{order.contactNumber}</p>
                              </div>
                            </div>
                            
                            <h5 className="font-medium text-gray-700 mt-4 mb-2 flex items-center">
                              <svg className="mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                              Items:
                            </h5>
                            <div className="overflow-x-auto border rounded">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Quantity</th>
                                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
                                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {order.items.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50">
                                      <td className="px-3 py-3 text-sm">{item.product.name}</td>
                                      <td className="px-3 py-3 text-sm">{item.quantity}</td>
                                      <td className="px-3 py-3 text-sm text-right">KSh {item.price.toFixed(2)}</td>
                                      <td className="px-3 py-3 text-sm font-medium text-right">KSh {(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                  <tr>
                                    <td colSpan="3" className="px-3 py-3 text-sm font-medium text-right">Total:</td>
                                    <td className="px-3 py-3 text-sm font-medium text-right">KSh {order.totalAmount.toFixed(2)}</td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                            
                            <div className="mt-5">
                              <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                                <svg className="mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                </svg>
                                Update Status:
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {['pending', 'processing', 'completed', 'cancelled'].map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => updateOrderStatus(order._id, status)}
                                    disabled={order.status === status || processingUpdate}
                                    className={`
                                      px-3 py-2 text-sm font-medium rounded transition-colors
                                      ${
                                        order.status === status
                                          ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                                          : processingUpdate
                                            ? 'bg-gray-300 text-gray-700 cursor-wait'
                                            : status === 'completed'
                                              ? 'bg-green-600 text-white hover:bg-green-700'
                                              : status === 'cancelled'
                                                ? 'bg-red-600 text-white hover:bg-red-700'
                                                : status === 'processing'
                                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
                                      }
                                    `}
                                  >
                                    {processingUpdate ? (
                                      <>
                                        <span className="inline-block mr-1">
                                          <svg className="animate-spin h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                        </span>
                                      </>
                                    ) : (
                                      status.charAt(0).toUpperCase() + status.slice(1)
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile view - Improved Cards */}
          <div className="md:hidden space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className={`${getStatusColorClass(order.status)} border rounded-lg shadow-sm overflow-hidden`}>
                <div className="p-4 border-b relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500">Order ID</p>
                      <p className="font-medium">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="text-sm truncate max-w-[140px]">{order.user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm">{moment(order.createdAt).format('MMM DD, YYYY')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Amount</p>
                      <p className="text-sm font-semibold">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Items</p>
                      <p className="text-sm">{order.items.length} item(s)</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      onClick={() => toggleOrderDetails(order._id)}
                      className="text-sm text-indigo-600 font-medium flex items-center"
                    >
                      {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                      <svg 
                        className={`ml-1 h-4 w-4 transition-transform transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {expandedOrder === order._id && (
                  <div className="p-4 bg-gray-50">
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                        <svg className="mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Shipping Details
                      </h4>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm text-gray-500">Address:</p>
                        <p className="text-sm mb-2">{order.shippingAddress}</p>
                        <p className="text-sm text-gray-500">Contact:</p>
                        <p className="text-sm">{order.contactNumber}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                        <svg className="mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Order Items
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item._id} className="bg-white p-3 rounded border">
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-gray-500">
                                  {item.quantity} x ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 bg-white p-3 rounded border">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Total</p>
                          <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                        <svg className="mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        Update Status
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['pending', 'processing', 'completed', 'cancelled'].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order._id, status)}
                            disabled={order.status === status || processingUpdate}
                            className={`
                              relative px-3 py-2 text-sm font-medium rounded transition-colors
                              ${
                                order.status === status
                                  ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                                  : processingUpdate
                                    ? 'bg-gray-300 text-gray-700 cursor-wait'
                                    : status === 'completed'
                                      ? 'bg-green-600 text-white hover:bg-green-700'
                                      : status === 'cancelled'
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : status === 'processing'
                                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                                          : 'bg-yellow-500 text-white hover:bg-yellow-600'
                              }
                            `}
                          >
                            {processingUpdate ? (
                              <>
                                <span className="inline-block">
                                  <svg className="animate-spin h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                </span>
                              </>
                            ) : (
                              status.charAt(0).toUpperCase() + status.slice(1)
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EShopOrders;