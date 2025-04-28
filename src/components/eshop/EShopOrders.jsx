import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import moment from 'moment';

const EShopOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [processingUpdate, setProcessingUpdate] = useState(false);

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
    setProcessingUpdate(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://moihub.onrender.com/api/eshop/orders/vendor/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state to reflect the change
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status. Please try again.');
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
  }, []);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const badgeClass = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClass[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Calculate order items total
  const calculateItemsTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Manage Orders</h2>
        <button 
          onClick={fetchOrders}
          className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Orders'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No orders found.</p>
        </div>
      ) : (
        <div>
          {/* Desktop view - Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order._id.substring(order._id.length - 8)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.user.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.totalAmount}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => toggleOrderDetails(order._id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                        </button>
                      </td>
                    </tr>
                    {expandedOrder === order._id && (
                      <tr>
                        <td colSpan="6" className="px-4 py-4 bg-gray-50">
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium text-gray-700 mb-2">Order Details</h4>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-500">Shipping Address:</p>
                                <p className="text-sm font-medium">{order.shippingAddress}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Contact Number:</p>
                                <p className="text-sm font-medium">{order.contactNumber}</p>
                              </div>
                            </div>
                            
                            <h5 className="font-medium text-gray-700 mt-4 mb-2">Items:</h5>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {order.items.map((item) => (
                                    <tr key={item._id}>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm">{item.product.name}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm">{item.quantity}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm">${item.price}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm">${item.price * item.quantity}</td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                  <tr>
                                    <td colSpan="3" className="px-3 py-2 text-sm font-medium text-right">Total:</td>
                                    <td className="px-3 py-2 text-sm font-medium">${order.totalAmount}</td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                            
                            <div className="mt-4">
                              <h5 className="font-medium text-gray-700 mb-2">Update Status:</h5>
                              <div className="flex flex-wrap gap-2">
                                {['pending', 'processing', 'completed', 'cancelled'].map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => updateOrderStatus(order._id, status)}
                                    disabled={order.status === status || processingUpdate}
                                    className={`px-3 py-1 text-sm font-medium rounded ${
                                      order.status === status
                                        ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                  >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
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

          {/* Mobile view - Cards */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500">Order ID</p>
                      <p className="font-medium">{order._id.substring(order._id.length - 8)}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="text-sm truncate">{order.user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm">{moment(order.createdAt).format('MMM DD, YYYY')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Amount</p>
                      <p className="text-sm font-semibold">${order.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Items</p>
                      <p className="text-sm">{order.items.length} item(s)</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => toggleOrderDetails(order._id)}
                      className="text-sm text-indigo-600 font-medium"
                    >
                      {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>

                {expandedOrder === order._id && (
                  <div className="p-4 bg-gray-50">
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Shipping Details</h4>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm text-gray-500">Address:</p>
                        <p className="text-sm mb-2">{order.shippingAddress}</p>
                        <p className="text-sm text-gray-500">Contact:</p>
                        <p className="text-sm">{order.contactNumber}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item._id} className="bg-white p-3 rounded border">
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-gray-500">
                                  {item.quantity} x ${item.price}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">${item.price * item.quantity}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 bg-white p-3 rounded border">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Total</p>
                          <p className="font-semibold">${order.totalAmount}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Update Status</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['pending', 'processing', 'completed', 'cancelled'].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order._id, status)}
                            disabled={order.status === status || processingUpdate}
                            className={`px-3 py-2 text-sm font-medium rounded ${
                              order.status === status
                                ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
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