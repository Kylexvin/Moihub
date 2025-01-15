import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// If you want to use icons, you can import from react-icons (free) or create simple SVG components
const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
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
    console.log(`Selected route: ${routeId}`);
    // Navigate to vehicle selection page
    navigate(`/vehicle-selection/${routeId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600 text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Routes</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Select Your Route</h1>
        
        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <IconSearch />
              </span>
              <input
                type="text"
                placeholder="Search routes, stops..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Destination Filter */}
            <select
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="flex justify-between">
                <span>Price Range: </span>
                <span>KSH {priceRange[0]} - KSH {priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="100"
                className="w-full"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found {filteredRoutes.length} routes
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => (
            <div key={route._id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2 text-lg font-semibold">
                  <IconMapPin />
                  <span>{route.origin} → {route.destination}</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">KSH {route.basePrice}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pickup point:</p>
                      <p className="text-sm">{route.pickupPoint}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Drop-off point:</p>
                      <p className="text-sm">{route.droppingPoint}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Distance:</p>
                      <p className="text-sm">{route.distance} km</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Estimated duration:</p>
                      <p className="text-sm">{route.estimatedDuration}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t">
                <button 
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  onClick={() => handleRouteSelect(route._id)}
                >
                  Select Route
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredRoutes.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No routes found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteSelectionPage;