import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Edit2, Trash2, MapPin } from 'lucide-react';

const RoutesManagement = ({ setError, setSuccess }) => {
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

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  // API config
  const token = localStorage.getItem('token');
  const apiConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  // Fetch routes on component mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  // Fetch routes function
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

  // Route form handlers
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

  return (
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
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-500">Loading routes...</p>
              </div>
            ) : routes.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-400" />
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
  );
};

export default RoutesManagement;