import React, { useState, useEffect } from 'react';
import { Bell, Clock, DollarSign, MapPin, ShoppingBag, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const FoodOrderNotification = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  // For demonstration, add this state to store and display item names
  const [itemNames, setItemNames] = useState({});

  useEffect(() => {
    // Fetch orders from your backend API
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Get the token from localStorage or wherever you store it
        const token = localStorage.getItem('vendorToken') || localStorage.getItem('token');
        
        if (!token) {
          setError("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }
        
        const response = await axios.get('https://moihub.onrender.com/api/food/orders/vendor', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          console.log("Orders fetched successfully:", response.data.orders);
          setOrders(response.data.orders);
          
          // Fetch item details for each order
          // This is a temporary solution - ideally your API would populate item details
          const listingIds = new Set();
          response.data.orders.forEach(order => {
            order.items.forEach(item => {
              listingIds.add(item.listingId);
            });
          });
          
          // For now we'll just use placeholder names
          const tempItemNames = {};
          listingIds.forEach(id => {
            tempItemNames[id] = `Menu Item ${id.substring(id.length-5)}`;
          });
          setItemNames(tempItemNames);
          
        } else {
          setError('Failed to fetch orders: ' + (response.data.message || 'Unknown error'));
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || err.message || 'Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    
    // Set up polling to check for new orders every minute
    const intervalId = setInterval(fetchOrders, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const toggleExpanded = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('vendorToken') || localStorage.getItem('token');
      
      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }
      
      const response = await axios.put(
        `https://moihub.onrender.com/api/food/orders/vendor/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // Update the order in local state
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        alert(`Order #${orderId.slice(-6)} has been ${newStatus}.`);
      } else {
        alert(`Failed to update status: ${response.data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      alert(`Failed to update status: ${err.response?.data?.message || err.message}`);
    }
  };

  // Format time to be more readable
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  // Status color mapping
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 mt-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <ShoppingBag className="h-12 w-12 text-orange-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Loading your orders...</h3>
          <div className="mt-4 h-2 bg-gray-200 rounded w-3/4"></div>
          <div className="mt-2 h-2 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 mt-8">
        <div className="text-center text-red-500">
          <XCircle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium">Error Loading Orders</h3>
          <p className="mt-2 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 mt-8 text-center">
        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700">No orders yet</h3>
        <p className="text-gray-500 mt-2">New orders will appear here when customers place them.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-md mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Your Orders</h2>
        <div className="text-sm text-gray-500">
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {orders.map(order => (
        <div 
          key={order._id} 
          className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-orange-500 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-orange-500 mr-2" />
                <h3 className="text-lg font-bold text-gray-800">Order #{order._id.slice(-6)}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            
            <div className="mt-2">
              <div className="flex items-center text-gray-600 text-sm flex-wrap">
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatDate(order.createdAt)} at {formatTime(order.createdAt)}</span>                       
                <span className="mx-2">•</span>
                <DollarSign className="h-4 w-4 mr-1" />
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-3">
              <button 
                onClick={() => toggleExpanded(order._id)}
                className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center"
              >
                {expandedOrderId === order._id ? "Hide details" : "View details"}
              </button>
            </div>
            
            {expandedOrderId === order._id && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Order Items:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm py-1">
                        <span>{item.quantity}× {itemNames[item.listingId] || `Item #${item.listingId.slice(-5)}`}</span>
                        <span className="text-gray-600">${((order.totalPrice / order.items.reduce((sum, i) => sum + i.quantity, 0)) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between font-medium">
                      <span>Total:</span>
                      <span>${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {order.deliveryInstructions && (
                    <div className="flex items-start text-sm text-gray-600 bg-blue-50 p-3 rounded">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
                      <div>
                        <h4 className="font-medium text-blue-700 mb-1">Delivery Instructions:</h4>
                        <p>{order.deliveryInstructions}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {order.status === 'pending' && (
                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={() => updateOrderStatus(order._id, 'confirmed')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Order
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order._id, 'rejected')}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm flex items-center"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Order
                    </button>
                  </div>
                )}
                
                {order.status === 'confirmed' && (
                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={() => updateOrderStatus(order._id, 'delivered')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Delivered
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodOrderNotification;