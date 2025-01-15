import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { MapPin, Bus, CreditCard, Users, Search } from 'lucide-react';

const RouteSelectionPage = () => {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedDestination, setSelectedDestination] = useState("all");

  // Fetch routes from the backend
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/routes');
        const data = await response.json();
        setRoutes(data);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  // Get unique destinations for the filter dropdown
  const destinations = useMemo(() => {
    const uniqueDestinations = [...new Set(routes.map(route => route.destination))];
    return ["all", ...uniqueDestinations];
  }, [routes]);

  // Filter routes based on all criteria
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
    // Handle navigation to matatu selection page
    // For example, you can navigate to a new page or open a modal
  };

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
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search routes, stops..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Destination Filter */}
            <select
              className="w-full p-2 border rounded-md"
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
            >
              {destinations.map(dest => (
                <option key={dest} value={dest}>
                  {dest === "all" ? "All Destinations" : dest}
                </option>
              ))}
            </select>

            {/* Price Range Display */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Price Range: </span>
                <span>KSH {priceRange[0]} - KSH {priceRange[1]}</span>
              </div>
              <Slider
                defaultValue={[0, 2000]}
                max={2000}
                step={100}
                value={priceRange}
                onValueChange={setPriceRange}
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
            <Card key={route._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2 text-lg font-semibold">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span>{route.origin} → {route.destination}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-lg font-bold">KSH {route.basePrice}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bus className="w-4 h-4 text-gray-500" />
                      <span>Available matatus</span>
                    </div>
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
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleRouteSelect(route._id)}
                >
                  Select Route
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
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