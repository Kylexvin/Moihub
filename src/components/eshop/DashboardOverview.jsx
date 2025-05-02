// src/components/eshop/DashboardOverview.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ShoppingBag, Clock, DollarSign, Users, TrendingUp, ChevronRight, AlertCircle } from 'lucide-react';

const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://moihub.onrender.com/api/eshop/vendor/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setDashboardData(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return <p className="text-center py-8 text-gray-500">No dashboard data available.</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Mobile navigation tabs
  const renderTabs = () => (
    <div className="flex overflow-x-auto mb-4 md:hidden bg-gray-50 rounded-lg p-1">
      <button 
        onClick={() => setActiveTab('overview')}
        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${
          activeTab === 'overview' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
        }`}
      >
        Overview
      </button>
      <button 
        onClick={() => setActiveTab('stats')}
        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${
          activeTab === 'stats' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
        }`}
      >
        Stats
      </button>
      <button 
        onClick={() => setActiveTab('orders')}
        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${
          activeTab === 'orders' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
        }`}
      >
        Orders
      </button>
    </div>
  );

 
  // Stats grid
  const renderStatsGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {/* Products */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-md rounded-lg p-4">
        <div className="flex items-center">
          <div className="bg-blue-500 p-2 md:p-3 rounded-full">
            <Package className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div className="ml-3">
            <p className="text-xs md:text-sm text-gray-500">Products</p>
            <p className="text-lg md:text-xl font-semibold text-gray-800">{dashboardData.totalProducts}</p>
          </div>
        </div>
        <p className="mt-2 text-xs md:text-sm text-gray-600">
          {dashboardData.availableProducts} available
        </p>
      </div>

      {/* Orders */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 shadow-md rounded-lg p-4">
        <div className="flex items-center">
          <div className="bg-green-500 p-2 md:p-3 rounded-full">
            <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div className="ml-3">
            <p className="text-xs md:text-sm text-gray-500">Orders</p>
            <p className="text-lg md:text-xl font-semibold text-gray-800">{dashboardData.totalOrders}</p>
          </div>
        </div>
        <p className="mt-2 text-xs md:text-sm text-gray-600">
          {dashboardData.pendingOrders} pending
        </p>
      </div>

      {/* Revenue */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 shadow-md rounded-lg p-4">
        <div className="flex items-center">
          <div className="bg-purple-500 p-2 md:p-3 rounded-full">
            <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div className="ml-3">
            <p className="text-xs md:text-sm text-gray-500">Revenue</p>
            <p className="text-lg md:text-xl font-semibold text-gray-800">
              ${dashboardData.totalRevenue || 0}
            </p>
          </div>
        </div>
        <div className="mt-2 flex items-center text-xs text-green-600">
          <TrendingUp className="h-3 w-3 mr-1" />
          <span>This month</span>
        </div>
      </div>

      {/* Shop Status */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-md rounded-lg p-4">
        <div className="flex items-center">
          <div className="bg-yellow-500 p-2 md:p-3 rounded-full">
            <Clock className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div className="ml-3">
            <p className="text-xs md:text-sm text-gray-500">Status</p>
            <p className="text-lg md:text-xl font-semibold text-gray-800">
              {dashboardData.shop.isApproved ? 'Approved' : 'Pending'}
            </p>
          </div>
        </div>
        <div className="mt-2 text-xs md:text-sm text-gray-600">
          {dashboardData.shop.isApproved ? 'Your shop is live' : 'Under review'}
        </div>
      </div>
    </div>
  );

  // Recent orders table/cards
  const renderRecentOrders = () => (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
        <button className="text-blue-600 text-sm flex items-center hover:underline">
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      
      {/* Desktop table - hidden on mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dashboardData.recentOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                  #{order._id.substring(0, 8)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {order.items.length}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${order.totalAmount}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}
                  `}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards - shown only on mobile */}
      <div className="md:hidden space-y-3">
        {dashboardData.recentOrders.map((order) => (
          <div key={order._id} className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm">#{order._id.substring(0, 8)}</span>
              <span className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full 
                ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                  order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'}
              `}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
              <div>Date:</div>
              <div className="text-right">{formatDate(order.createdAt)}</div>
              <div>Items:</div>
              <div className="text-right">{order.items.length}</div>
              <div>Total:</div>
              <div className="text-right font-medium text-gray-900">${order.totalAmount}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="px-2 py-4 md:px-4 space-y-4 bg-gray-100 min-h-screen">
      {/* Mobile tabs */}
      {renderTabs()}

      {/* Stats Grid - Always visible on desktop, conditional on mobile */}
      <div className={activeTab === 'stats' || activeTab === 'overview' ? 'block' : 'hidden md:block'}>
        {renderStatsGrid()}
      </div>

      {/* Recent Orders - Always visible on desktop, conditional on mobile */}
      <div className={activeTab === 'orders' || activeTab === 'overview' ? 'block' : 'hidden md:block'}>
        {renderRecentOrders()}
      </div>
    </div>
  );
};

export default DashboardOverview;