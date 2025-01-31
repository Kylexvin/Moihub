import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VehicleSelectionPage = () => {
  const { routeId } = useParams();
  const [matatus, setMatatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMatatusForRoute = async (routeId) => {
    try {
      const response = await fetch(`https://moigosip.onrender.com/api/routes/matatu/${routeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch matatus');
      }
      const data = await response.json();

      if (!data || !Array.isArray(data.matatus)) throw new Error('Invalid matatus data');

      // Process matatus and calculate seat availability
      const processedMatatus = data.matatus.map((matatu) => {
        const availableSeats = matatu.seatLayout.filter(seat => !seat.isBooked).length;
        return {
          ...matatu,
          availableSeats,
          isAvailable: matatu.status === 'active' && availableSeats > 0,
        };
      });

      console.log('Fetched Matatus:', processedMatatus); // Debug log

      return processedMatatus;
    } catch (err) {
      console.error(`Error fetching matatus for route ${routeId}:`, err);
      throw err;
    }
  };

  useEffect(() => {
    const fetchMatatus = async () => {
      try {
        setLoading(true);
        const fetchedMatatus = await fetchMatatusForRoute(routeId);
        setMatatus(fetchedMatatus);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatatus();
  }, [routeId]);

  const handleMatatuSelect = (matatuId) => {
    console.log(`Selected matatu: ${matatuId}`);
    // Navigate to seat selection page
    navigate(`/seat-selection/${matatuId}`);
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
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
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
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Select Your Matatu</h1>

        {/* Matatus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matatus.map((matatu) => (
            <div 
              key={matatu._id} 
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => handleMatatuSelect(matatu._id)}
            >
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">{matatu.registrationNumber}</h2>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">KSH {matatu.currentPrice}</span>
                    <span className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                      {matatu.totalSeats} seats
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-gray-700">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Departure Time</p>
                      <p className="text-sm">{matatu.departureTime}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Available Seats</p>
                      <p className="text-sm">{matatu.availableSeats}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Status</p>
                      <p className="text-sm">{matatu.isAvailable ? 'Available' : 'Not Available'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100">
                <button 
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center space-x-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMatatuSelect(matatu._id);
                  }}
                  disabled={!matatu.isAvailable}
                >
                  <span>Select Matatu</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {matatus.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 005.656 0m-5.656 0a4 4 0 115.656 0m-5.656 0L3 7.343M16.657 9.172a4 4 0 010 5.656m0-5.656a4 4 0 015.656 0M7.343 3l4.243 4.243m0 0a4 4 0 010 5.656" />
            </svg>
            <p className="text-lg text-gray-500">No matatus found for this route</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleSelectionPage;