import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom SVG Icons
const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    ))}
  </div>
);

const RouteSelectionPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedDestination, setSelectedDestination] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://moigosip.onrender.com/api/routes');
        if (!response.ok) {
          throw new Error('Failed to fetch routes');
        }
        const data = await response.json();
        setRoutes(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const destinations = useMemo(() => {
    const uniqueDestinations = [...new Set(routes.map(route => route.destination))];
    return ["all", ...uniqueDestinations];
  }, [routes]);

  const filteredRoutes = useMemo(() => {
    return routes.filter(route => {
      const matchesSearch =
        route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.pickupPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.droppingPoint.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPrice =
        route.basePrice >= priceRange[0] && route.basePrice <= priceRange[1];

      const matchesDestination =
        selectedDestination === "all" || route.destination === selectedDestination;

      return matchesSearch && matchesPrice && matchesDestination;
    });
  }, [routes, searchTerm, priceRange, selectedDestination]);

  const handleRouteSelect = (routeId) => {
    navigate(`/vehicle-selection/${routeId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Select Your Route</h1>
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Select Your Route</h1>
        
        {/* Filters Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Route Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconSearch />
              </div>
              <input
                type="text"
                placeholder="Search routes, stops..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Destination Filter */}
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
            >
              {destinations.map(dest => (
                <option key={dest} value={dest}>
                  {dest === "all" ? "All Destinations" : dest}
                </option>
              ))}
            </select>

            {/* Price Range */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Price Range:</span>
                <span>KSH {priceRange[0]} - KSH {priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="100"
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Found {filteredRoutes.length} routes
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Prices and schedules subject to change</span>
          </div>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => (
            <div 
              key={route._id} 
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => handleRouteSelect(route._id)}
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                  <IconMapPin />
                  <span>{route.origin} → {route.destination}</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">KSH {route.basePrice}</span>
                    <span className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                      {route.distance} km
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-gray-700">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Pickup Point</p>
                      <p className="text-sm">{route.pickupPoint}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Drop-off Point</p>
                      <p className="text-sm">{route.droppingPoint}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Estimated Duration</p>
                      <p className="text-sm">{route.estimatedDuration}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100">
                <button 
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center space-x-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRouteSelect(route._id);
                  }}
                >
                  <span>Select Route</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredRoutes.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 005.656 0m-5.656 0a4 4 0 115.656 0m-5.656 0L3 7.343M16.657 9.172a4 4 0 010 5.656m0-5.656a4 4 0 015.656 0M7.343 3l4.243 4.243m0 0a4 4 0 010 5.656" />
            </svg>
            <p className="text-lg text-gray-500">No routes found matching your criteria</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedDestination("all");
                setPriceRange([0, 2000]);
              }}
              className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteSelectionPage;