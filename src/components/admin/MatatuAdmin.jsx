import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Added missing import
import { jwtDecode } from 'jwt-decode'; // Added missing import
import { PlusCircle, Edit2, Trash2, AlertCircle, ChevronRight, Bus, MapPin } from 'lucide-react';

const MatatuAdmin = () => {
  // Navigation hook
  const navigate = useNavigate();
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // States for routes
  const [routes, setRoutes] = useState([]);
  const [routeForm, setRouteForm] = useState({
    name: '',
    origin: '',
    destination: '',
    pickupPoint: '',
    droppingPoint: '',
    distance: '',
    estimatedDuration: '',
    basePrice: ''
  });

  // States for matatus
  const [matatus, setMatatus] = useState([]);
  const [matatuForm, setMatatuForm] = useState({
    routeId: '',
    regNumber: '',
    capacity: '',
    departureTime: '',
    fare: '',
    status: 'active'
  });

  // UI states
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [activeTab, setActiveTab] = useState('routes');

  // Check authentication first
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect if no token
      return;
    }

    try {
      const decoded = jwtDecode(token); // Decode token
      setIsAuthenticated(true);
      setUserRole(decoded.role); // Get role from token

      if (decoded.role !== "admin") {
        navigate("/"); // Redirect non-admin users
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token"); // Clear invalid token
      navigate("/");
    }
  }, [navigate]);
  useEffect(() => {
    if (isAuthenticated && userRole === "admin") {
      fetchRoutes();
      fetchMatatus();
    }
  }, [isAuthenticated, userRole]);
  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Set axios default headers
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // Early return if not authenticated or not admin
  if (!isAuthenticated || userRole !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <button 
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // API config - only set after authentication is verified
  const token = localStorage.getItem('token');
  const apiConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };



  // Fetch functions
  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://moihub.onrender.com/api/routes', apiConfig);
      setRoutes(response.data);
    } catch (err) {
      setError(`Failed to fetch routes: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMatatus = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://moihub.onrender.com/api/matatus', apiConfig);
      setMatatus(response.data);
    } catch (err) {
      setError(`Failed to fetch matatus: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Route handlers
  const handleRouteSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isEditing && currentEditId) {
        await axios.put(`https://moihub.onrender.com/api/routes/${currentEditId}`, routeForm, apiConfig);
        setSuccess('Route updated successfully');
      } else {
        await axios.post('https://moihub.onrender.com/api/routes/create', routeForm, apiConfig);
        setSuccess('Route created successfully');
      }
      
      resetRouteForm();
      fetchRoutes();
    } catch (err) {
      setError(`Operation failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
      setCurrentEditId(null);
    }
  };

  const handleRouteEdit = (route) => {
    setRouteForm({
      name: route.name,
      origin: route.origin,
      destination: route.destination,
      pickupPoint: route.pickupPoint,
      droppingPoint: route.droppingPoint,
      distance: route.distance,
      estimatedDuration: route.estimatedDuration,
      basePrice: route.basePrice
    });
    setIsEditing(true);
    setCurrentEditId(route._id);
  };

  const handleRouteDelete = async (routeId) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;
    
    setIsLoading(true);
    try {
      await axios.delete(`https://moihub.onrender.com/api/routes/${routeId}`, apiConfig);
      setSuccess('Route deleted successfully');
      fetchRoutes();
    } catch (err) {
      setError(`Failed to delete route: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Matatu handlers
  const handleMatatuSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isEditing && currentEditId) {
        await axios.put(`https://moihub.onrender.com/api/matatus/${currentEditId}`, matatuForm, apiConfig);
        setSuccess('Matatu updated successfully');
      } else {
        await axios.post('https://moihub.onrender.com/api/matatus', matatuForm, apiConfig);
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
      routeId: matatu.routeId,
      regNumber: matatu.regNumber,
      capacity: matatu.capacity,
      departureTime: matatu.departureTime,
      fare: matatu.fare,
      status: matatu.status
    });
    setIsEditing(true);
    setCurrentEditId(matatu._id);
  };

  const handleMatatuDelete = async (matatuId) => {
    if (!window.confirm('Are you sure you want to delete this matatu?')) return;
    
    setIsLoading(true);
    try {
      await axios.delete(`https://moihub.onrender.com/api/matatus/${matatuId}`, apiConfig);
      setSuccess('Matatu deleted successfully');
      fetchMatatus();
    } catch (err) {
      setError(`Failed to delete matatu: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSeats = (matatuId) => {
    // In a real app, you would navigate to the seats page
    // For example: history.push(`/matatu/${matatuId}/seats`)
    alert(`Navigating to seat management for Matatu ID: ${matatuId}`);
  };

  const resetRouteForm = () => {
    setRouteForm({
      name: '',
      origin: '',
      destination: '',
      pickupPoint: '',
      droppingPoint: '',
      distance: '',
      estimatedDuration: '',
      basePrice: ''
    });
  };

  const resetMatatuForm = () => {
    setMatatuForm({
      routeId: '',
      regNumber: '',
      capacity: '',
      departureTime: '',
      fare: '',
      status: 'active'
    });
  };

  return (
    <div className="container mx-auto p-4">
      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex mb-6">
        <button 
          className={`px-4 py-2 font-medium rounded-tl-lg rounded-bl-lg ${activeTab === 'routes' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('routes')}
        >
          <MapPin className="inline-block mr-1 h-4 w-4" />
          Routes
        </button>
        <button 
          className={`px-4 py-2 font-medium rounded-tr-lg rounded-br-lg ${activeTab === 'matatus' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('matatus')}
        >
          <Bus className="inline-block mr-1 h-4 w-4" />
          Matatus
        </button>
      </div>
        
      {/* Routes Tab Content */}
      {activeTab === 'routes' && (
        <div className="space-y-6">
          {/* Route Form */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200 bg-blue-50 px-4 py-4">
              <h2 className="text-lg font-medium text-blue-800">
                {isEditing ? 'Edit Route' : 'Create New Route'}
              </h2>
            </div>
            <div className="p-4">
              <form onSubmit={handleRouteSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Route Name</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Route Name"
                      value={routeForm.name}
                      onChange={(e) => setRouteForm({ ...routeForm, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Origin"
                      value={routeForm.origin}
                      onChange={(e) => setRouteForm({ ...routeForm, origin: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Destination"
                      value={routeForm.destination}
                      onChange={(e) => setRouteForm({ ...routeForm, destination: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Point</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Pickup Point"
                      value={routeForm.pickupPoint}
                      onChange={(e) => setRouteForm({ ...routeForm, pickupPoint: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dropping Point</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Dropping Point"
                      value={routeForm.droppingPoint}
                      onChange={(e) => setRouteForm({ ...routeForm, droppingPoint: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Distance (meters)</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      type="number"
                      placeholder="Distance"
                      value={routeForm.distance}
                      onChange={(e) => setRouteForm({ ...routeForm, distance: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g. 2 hours 30 minutes"
                      value={routeForm.estimatedDuration}
                      onChange={(e) => setRouteForm({ ...routeForm, estimatedDuration: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      type="number"
                      placeholder="Base Price"
                      value={routeForm.basePrice}
                      onChange={(e) => setRouteForm({ ...routeForm, basePrice: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex-1"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {isEditing ? 'Update Route' : 'Create Route'}
                  </button>
                  
                  {isEditing && (
                    <button 
                      type="button"
                      onClick={() => {
                        resetRouteForm();
                        setIsEditing(false);
                        setCurrentEditId(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Routes List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200 bg-blue-50 px-4 py-4">
              <h2 className="text-lg font-medium text-blue-800">Routes List</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {routes.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No routes found. Create one above.</p>
                  </div>
                ) : (
                  routes.map((route) => (
                    <div key={route._id} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-blue-800">{route.name}</h3>
                          <p className="text-sm text-gray-600">{route.origin} to {route.destination}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                            <p><span className="font-semibold">Pickup:</span> {route.pickupPoint}</p>
                            <p><span className="font-semibold">Dropping:</span> {route.droppingPoint}</p>
                            <p><span className="font-semibold">Distance:</span> {route.distance}m</p>
                            <p><span className="font-semibold">Duration:</span> {route.estimatedDuration}</p>
                            <p><span className="font-semibold">Base Price:</span> Ksh {route.basePrice}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            onClick={() => handleRouteEdit(route)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            onClick={() => handleRouteDelete(route._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Matatus Tab Content */}
      {activeTab === 'matatus' && (
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
                      value={matatuForm.routeId} 
                      onChange={(e) => setMatatuForm({ ...matatuForm, routeId: e.target.value })}
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
                      placeholder="e.g. KCX 123Y"
                      value={matatuForm.regNumber}
                      onChange={(e) => setMatatuForm({ ...matatuForm, regNumber: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (Seats)</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      type="number"
                      placeholder="Number of seats"
                      value={matatuForm.capacity}
                      onChange={(e) => setMatatuForm({ ...matatuForm, capacity: e.target.value })}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fare Amount</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      type="number"
                      placeholder="Fare amount"
                      value={matatuForm.fare}
                      onChange={(e) => setMatatuForm({ ...matatuForm, fare: e.target.value })}
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
                      <option value="maintenance">Maintenance</option>
                      <option value="full">Full</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex-1"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {isEditing ? 'Update Matatu' : 'Create Matatu'}
                  </button>
                  
                  {isEditing && (
                    <button 
                      type="button"
                      onClick={() => {
                        resetMatatuForm();
                        setIsEditing(false);
                        setCurrentEditId(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Matatus List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200 bg-blue-50 px-4 py-4">
              <h2 className="text-lg font-medium text-blue-800">Matatus List</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {matatus.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No matatus found. Create one above.</p>
                  </div>
                ) : (
                  matatus.map((matatu) => (
                    <div key={matatu._id} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-blue-800">{matatu.regNumber}</h3>
                          <p className="text-sm text-gray-600">
                            Route: {routes.find(r => r._id === matatu.routeId)?.name || 'Unknown'}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                            <p><span className="font-semibold">Departure:</span> {matatu.departureTime}</p>
                            <p><span className="font-semibold">Capacity:</span> {matatu.capacity} seats</p>
                            <p><span className="font-semibold">Fare:</span> Ksh {matatu.fare}</p>
                            <p>
                              <span className="font-semibold">Status:</span> 
                              <span className={`ml-1 px-2 py-0.5 rounded text-xs ${
                                matatu.status === 'active' ? 'bg-green-100 text-green-800' :
                                matatu.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                matatu.status === 'full' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {matatu.status.charAt(0).toUpperCase() + matatu.status.slice(1)}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            onClick={() => handleMatatuEdit(matatu)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            onClick={() => handleMatatuDelete(matatu._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 border-t pt-3">
                        <button
                          onClick={() => navigateToSeats(matatu._id)}
                          className="w-full py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors flex items-center justify-center"
                        >
                          Manage Seats <ChevronRight className="ml-1 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatatuAdmin;