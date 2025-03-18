import React, { useEffect, useState } from 'react';
import { LineChart, BarChart, PieChart, Pie, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const MatatuStats = () => {
  const [stats, setStats] = useState({
    completedPayments: 0,
    totalUsers: 0,
    totalMatatus: 0,
    completedTransactions: 0,
    totalTransactions: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [paymentStatusData, setPaymentStatusData] = useState([]);
  const [paymentTrendData, setPaymentTrendData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all necessary data
        const bookingsRes = await fetch('https://moihub.onrender.com/api/bookings');
        const usersRes = await fetch('https://moihub.onrender.com/api/auth/users');
        const matatusRes = await fetch('https://moihub.onrender.com/api/matatus/');
        
        const bookingsData = await bookingsRes.json();
        const usersData = await usersRes.json();
        const matatusData = await matatusRes.json();
        
        // Get transactions from the response (handle both data structures)
        const allTransactions = bookingsData.data || bookingsData.bookings || [];
        setTransactions(allTransactions);
        
        // Calculate sum of completed payments - making sure to access the correct property
        const completedPayments = allTransactions
          .filter(transaction => transaction.status === 'completed')
          .reduce((total, transaction) => total + (transaction.amount || 0), 0);
        
        // Set all the stats
        setStats({
          completedPayments,
          totalUsers: usersData.length || 0,
          totalMatatus: matatusData.count || 0,
          completedTransactions: allTransactions.filter(t => t.status === 'completed').length,
          totalTransactions: allTransactions.length,
        });
        
        // Process payment status data for pie chart
        const statusCounts = allTransactions.reduce((acc, transaction) => {
          const status = transaction.status || 'unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        
        const statusData = Object.keys(statusCounts).map(status => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: statusCounts[status],
        }));
        
        setPaymentStatusData(statusData);
        
        // Process payment trends by date
        const trendsByDate = {};
        
        allTransactions.forEach(transaction => {
          const date = new Date(transaction.created_at).toLocaleDateString();
          
          if (!trendsByDate[date]) {
            trendsByDate[date] = { 
              date, 
              completed: 0, 
              expired: 0, 
              pending: 0, 
              totalAmount: 0 
            };
          }
          
          const status = transaction.status || 'unknown';
          trendsByDate[date][status] = (trendsByDate[date][status] || 0) + 1;
          
          if (status === 'completed') {
            trendsByDate[date].totalAmount += (transaction.amount || 0);
          }
        });
        
        const sortedTrends = Object.values(trendsByDate).sort((a, b) => 
          new Date(a.date) - new Date(b.date)
        );
        
        setPaymentTrendData(sortedTrends);
        
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const STATUS_COLORS = {
    completed: '#10B981', // green
    expired: '#EF4444',   // red
    pending: '#F59E0B',   // amber
  };

  return (
    <div className="p-4 bg-gray-50">
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard 
          title="Completed Payments" 
          value={`Ksh ${stats.completedPayments}`} 
          icon="cash"
          subtitle={`${stats.completedTransactions} transactions`}
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon="users"
        />
        <StatCard 
          title="Total Matatus" 
          value={stats.totalMatatus} 
          icon="truck"
        />
      </div>

      {/* Debug info - remove this in production */}
      {/* {transactions.length === 0 && (
        <div className="bg-yellow-100 p-4 mb-4 rounded border border-yellow-400">
          No transaction data loaded. Please check API endpoints.
        </div>
      )} */}

      {/* Transaction Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Payment Status Overview</h2>
          {paymentStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STATUS_COLORS[entry.name.toLowerCase()] || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No status data available
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Transaction Trends</h2>
          {paymentTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={paymentTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#10B981" activeDot={{ r: 8 }} name="Completed" />
                <Line type="monotone" dataKey="expired" stroke="#EF4444" name="Expired" />
                <Line type="monotone" dataKey="pending" stroke="#F59E0B" name="Pending" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No trend data available
            </div>
          )}
        </div>
      </div>

      {/* Transaction Details */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.slice(0, 5).map((transaction) => (
                <tr key={transaction._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.transaction_details?.receipt_number || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.user?.username || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Ksh {transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        transaction.status === 'expired' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Amount Distribution */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Completed Payments</h2>
        {transactions.filter(t => t.status === 'completed').length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactions.filter(t => t.status === 'completed').slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={(transaction) => 
                transaction.transaction_details?.receipt_number || 
                transaction._id.substring(0, 8)
              } />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#3B82F6" name="Amount (Ksh)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No completed payments found
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, subtitle }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'cash':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'users':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'truck':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <div className="mr-4">{getIcon(icon)}</div>
      <div>
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <p className="text-2xl font-bold text-green-600">{value}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
};

export default MatatuStats;