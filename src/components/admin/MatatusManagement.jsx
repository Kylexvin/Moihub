import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Edit2, Trash2, Bus, AlertCircle, ChevronRight, UserX, UserCheck } from 'lucide-react';

const MatatusManagement = ({ setError, setSuccess }) => {
  // States for routes and matatus
  const [routes, setRoutes] = useState([]);
  const [matatus, setMatatus] = useState([]);
  const [matatuForm, setMatatuForm] = useState({
    route: '',
    registrationNumber: '',
    totalSeats: '',
    departureTime: '',
    currentPrice: '',
    status: 'active'
  });
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [showSeats, setShowSeats] = useState(null);
  const [seatActionLoading, setSeatActionLoading] = useState(false);

  // API config
  const token = localStorage.getItem('token');
  const apiConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  // Base API URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch data on component mount
  useEffect(() => {
    fetchRoutes();
    fetchMatatus();
  }, []);

  // Fetch functions
  const fetchRoutes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/routes`, apiConfig);
      setRoutes(response.data);
    } catch (err) {
      setError(`Failed to fetch routes: ${err.response?.data?.message || err.message}`);
    }
  };

  const fetchMatatus = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/matatus`, apiConfig);
      setMatatus(response.data.matatus || []);
    } catch (err) {
      setError(`Failed to fetch matatus: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Form handlers
  const handleMatatuSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isEditing && currentEditId) {
        await axios.put(`${API_BASE_URL}/matatus/${currentEditId}`, matatuForm, apiConfig);
        setSuccess('Matatu updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/matatus`, matatuForm, apiConfig);
        setSuccess('Matatu created successfully');
      }
      
      resetMatatuForm();
      fetchMatatus();
    } catch (err) {
      setError(`Operation failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
      setCurrentEditId(null);
    }
  };

  const handleMatatuEdit = (matatu) => {
    setMatatuForm({
      route: matatu.route._id, // Use route._id from nested object
      registrationNumber: matatu.registrationNumber,
      totalSeats: matatu.totalSeats,
      departureTime: matatu.departureTime,
      currentPrice: matatu.currentPrice,
      status: matatu.status
    });
    setIsEditing(true);
    setCurrentEditId(matatu._id);
  };

  const handleMatatuDelete = async (matatuId) => {
    if (!window.confirm('Are you sure you want to delete this matatu?')) return;
    
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/matatus/${matatuId}`, apiConfig);
      setSuccess('Matatu deleted successfully');
      fetchMatatus();
    } catch (err) {
      setError(`Failed to delete matatu: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSeatView = (matatuId) => {
    if (showSeats === matatuId) {
      setShowSeats(null);
    } else {
      setShowSeats(matatuId);
    }
  };

  const resetMatatuForm = () => {
    setMatatuForm({
      route: '',
      registrationNumber: '',
      totalSeats: '',
      departureTime: '',
      currentPrice: '',
      status: 'active'
    });
  };

  // Admin toggle seat booking status
  const toggleSeatBooking = async (matatuId, seatNumber, currentBookingStatus) => {
    setSeatActionLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/bookings/admin/toggle-seat/${matatuId}/${seatNumber}`, 
        { isBooked: !currentBookingStatus },
        apiConfig
      );
      
      setSuccess(`Seat ${seatNumber} ${currentBookingStatus ? 'unbooked' : 'booked'} successfully`);
      // Refresh the matatus data to update the UI
      fetchMatatus();
    } catch (err) {
      setError(`Failed to toggle seat booking: ${err.response?.data?.message || err.message}`);
    } finally {
      setSeatActionLoading(false);
    }
  };

  // Get route name helper function (for display purposes)
  const getRouteName = (routeId) => {
    const route = routes.find(r => r._id === routeId);
    return route ? `${route.name} (${route.origin} - ${route.destination})` : 'Unknown Route';
  };

  // Format time from 24hr to 12hr format
  const formatTime = (time) => {
    if (!time) return '';
    
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (e) {
      return time;
    }
  };

  return (
    <div className="space-y-6">
      {/* Matatu Form */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 bg-blue-50 px-4 py-4">
          <h2 className="text-lg font-medium text-blue-800">
            {isEditing ? 'Edit Matatu' : 'Create New Matatu'}
          </h2>
        </div>
        <div className="p-4">
          <form onSubmit={handleMatatuSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={matatuForm.route} 
                  onChange={(e) => setMatatuForm({ ...matatuForm, route: e.target.value })}
                  required
                >
                  <option value="">Select a route</option>
                  {routes.map((route) => (
                    <option key={route._id} value={route._id}>
                      {route.name} ({route.origin} - {route.destination})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. KDB 123Q"
                  value={matatuForm.registrationNumber}
                  onChange={(e) => setMatatuForm({ ...matatuForm, registrationNumber: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="number"
                  placeholder="Number of seats"
                  value={matatuForm.totalSeats}
                  onChange={(e) => setMatatuForm({ ...matatuForm, totalSeats: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="time"
                  value={matatuForm.departureTime}
                  onChange={(e) => setMatatuForm({ ...matatuForm, departureTime: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Price</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  type="number"
                  placeholder="Fare amount"
                  value={matatuForm.currentPrice}
                  onChange={(e) => setMatatuForm({ ...matatuForm, currentPrice: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={matatuForm.status} 
                  onChange={(e) => setMatatuForm({ ...matatuForm, status: e.target.value })}
                  required
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Under Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              {isEditing && (
                <button 
                  type="button"
                  onClick={() => {
                    resetMatatuForm();
                    setIsEditing(false);
                    setCurrentEditId(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : isEditing ? 'Update Matatu' : 'Add Matatu'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Matatus List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 bg-blue-50 px-4 py-4 flex justify-between items-center">
          <h2 className="text-lg font-medium text-blue-800">
            Registered Matatus
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {matatus.length} Matatus
          </span>
        </div>
        
        {isLoading && (
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {!isLoading && matatus.length === 0 && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">No matatus found</h3>
            <p className="text-gray-500 mt-1">Get started by adding your first matatu.</p>
          </div>
        )}
        
        {!isLoading && matatus.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reg Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departure
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seats
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matatus.map((matatu) => (
                  <React.Fragment key={matatu._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Bus className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">{matatu.registrationNumber}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {matatu.route && `${matatu.route.name} (${matatu.route.origin} - ${matatu.route.destination})`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatTime(matatu.departureTime)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{matatu.totalSeats} seats</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">KES {matatu.currentPrice}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          matatu.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : matatu.status === 'maintenance' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {matatu.status === 'active' 
                            ? 'Active' 
                            : matatu.status === 'maintenance' 
                              ? 'Maintenance' 
                              : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => toggleSeatView(matatu._id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Seats"
                          >
                            <ChevronRight className={`h-5 w-5 transition-transform ${showSeats === matatu._id ? 'rotate-90' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleMatatuEdit(matatu)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleMatatuDelete(matatu._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {showSeats === matatu._id && matatu.seatLayout && (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 bg-gray-50">
                          <div className="text-sm font-medium text-gray-700 mb-2">Seat Layout</div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {matatu.seatLayout.map((seat) => (
                              <div 
                                key={seat._id} 
                                className={`p-3 rounded border ${
                                  seat.isBooked 
                                    ? 'bg-red-50 border-red-200' 
                                    : 'bg-green-50 border-green-200'
                                }`}
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className={`font-medium ${seat.isBooked ? 'text-red-700' : 'text-green-700'}`}>
                                    Seat {seat.seatNumber}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    seat.isBooked 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {seat.isBooked ? 'Booked' : 'Available'}
                                  </span>
                                </div>
                                
                                {seat.isBooked && seat.booked_by && (
                                  <div className="text-xs text-gray-600 mb-2">
                                    <div className="truncate"><span className="font-medium">By:</span> {seat.booked_by.username}</div>
                                    <div className="truncate"><span className="font-medium">Email:</span> {seat.booked_by.email}</div>
                                  </div>
                                )}
                                
                                <button
                                  onClick={() => toggleSeatBooking(matatu._id, seat.seatNumber, seat.isBooked)}
                                  disabled={seatActionLoading}
                                  className={`w-full mt-1 flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md ${
                                    seat.isBooked
                                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                                  }`}
                                >
                                  {seatActionLoading ? (
                                    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                                  ) : seat.isBooked ? (
                                    <>
                                      <UserX className="h-3 w-3 mr-1" />
                                      Unbook
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="h-3 w-3 mr-1" />
                                      Book
                                    </>
                                  )}
                                </button>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatatusManagement;