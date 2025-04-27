// src/components/eshop/DashboardOverview.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ShoppingBag, Clock, DollarSign, Users } from 'lucide-react';

const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/eshop/vendor/dashboard', {
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
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return <p>No dashboard data available.</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Shop Information */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{dashboardData.shop.shopName}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            dashboardData.shop.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {dashboardData.shop.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
        <p className="text-gray-600 mb-2">{dashboardData.shop.description}</p>
        <p className="text-gray-600 mb-2">{dashboardData.shop.address}</p>
        <p className="text-gray-600 mb-4">{dashboardData.shop.phoneNumber}</p>
        
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Subscription valid until: <span className="font-medium">{formatDate(dashboardData.shop.subscriptionEndDate)}</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Status: <span className={`font-medium ${dashboardData.isSubscriptionValid ? 'text-green-600' : 'text-red-600'}`}>
              {dashboardData.isSubscriptionValid ? 'Active' : 'Expired'}
            </span>
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Products */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-2xl font-semibold text-gray-800">{dashboardData.totalProducts}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {dashboardData.availableProducts} available for sale
          </p>
        </div>

        {/* Orders */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-800">{dashboardData.totalOrders}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {dashboardData.pendingOrders} pending orders
          </p>
        </div>

        {/* Revenue */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-800">
                ${dashboardData.totalRevenue || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Shop Status */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Shop Status</p>
              <p className="text-2xl font-semibold text-gray-800">
                {dashboardData.shop.isApproved ? 'Approved' : 'Pending'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.recentOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order._id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.items.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
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
      </div>
    </div>
  );
};

export default DashboardOverview;