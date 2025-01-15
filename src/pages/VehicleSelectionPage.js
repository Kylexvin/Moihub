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
      const response = await fetch(`http://localhost:5000/api/matatus/routes/${routeId}`);
      const data = await response.json();

      if (!data || !Array.isArray(data.matatus)) throw new Error('Invalid matatus data');

      // Process matatus and calculate seat availability
      const processedMatatus = data.matatus.map((matatu) => {
        const availableSeats = matatu.seatLayout?.filter((seat) => !seat.isBooked).length || 0;
        return {
          ...matatu,
          availableSeats,
          isAvailable: matatu.status === 'active' && availableSeats > 0,
        };
      });

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600 text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Matatus</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Select Your Matatu</h1>

        {/* Matatus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matatus.map((matatu) => (
            <div key={matatu._id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">{matatu.registrationNumber}</h2>
                <p className="text-sm text-gray-600">Total Seats: {matatu.totalSeats}</p>
                <p className="text-sm text-gray-600">Departure Time: {matatu.departureTime}</p>
                <p className="text-sm text-gray-600">Current Price: KSH {matatu.currentPrice}</p>
                <p className="text-sm text-gray-600">Available Seats: {matatu.availableSeats}</p>
                <p className="text-sm text-gray-600">Status: {matatu.isAvailable ? 'Available' : 'Not Available'}</p>
              </div>
              
              <div className="p-4 border-t">
                <button 
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  onClick={() => handleMatatuSelect(matatu._id)}
                  disabled={!matatu.isAvailable}
                >
                  Select Matatu
                </button>
              </div>
            </div>
          ))}
        </div>

        {matatus.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No matatus found for this route</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleSelectionPage;