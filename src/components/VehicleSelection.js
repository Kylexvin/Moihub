import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VehicleSelection = ({ selectedRoute, setSelectedMatatu }) => {
  const [matatus, setMatatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMatatusForRoute = async (routeId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/routes/matatu/${routeId}`);
      const data = await response.json();
      if (!data || !Array.isArray(data.matatus)) throw new Error('Invalid matatus data');
      setMatatus(data.matatus.map((matatu) => {
        const availableSeats = matatu.seatLayout?.filter((seat) => !seat.isBooked).length || 0;
        return {
          ...matatu,
          availableSeats,
          isAvailable: matatu.status === 'active' && availableSeats > 0,
        };
      }));
      setError(null);
    } catch (err) {
      setError('Failed to fetch matatus. Please try again.');
      console.error('Error fetching matatus:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRoute) {
      fetchMatatusForRoute(selectedRoute._id);
    }
  }, [selectedRoute]);

  const handleMatatuSelect = (matatu) => {
    setSelectedMatatu(matatu);
    navigate('/seat-selection');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" aria-label="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 text-center bg-white rounded shadow">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchMatatusForRoute(selectedRoute._id)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/route-selection')}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to Routes
          </button>
          <h2 className="text-2xl font-bold">Choose your ride</h2>
        </div>
        <div className="space-y-4">
          {matatus.map((matatu) => {
            const availableSeats = matatu.seatLayout?.filter(seat => !seat.isBooked).length || 0;
            const isAvailable = matatu.status === 'active' && availableSeats > 0;

            return (
              <div
                key={matatu._id}
                onClick={() => isAvailable && handleMatatuSelect(matatu)}
                className={`bg-white rounded-lg shadow p-6 ${
                  isAvailable ? 'cursor-pointer hover:shadow-lg' : 'opacity-75 cursor-not-allowed'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span>🚐</span>
                        <span className="font-semibold">{matatu.registrationNumber}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-gray-600">
                        <Clock size={18} />
                        <span>Departure: {matatu.departureTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-lg font-semibold text-gray-900">
                    Price: Ksh {matatu.currentPrice}
                  </div>

                  <div className="text-sm text-gray-600">
                    Available Seats: {availableSeats}
                  </div>

                  <div className="text-sm">
                    Status: <span className={matatu.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                      {matatu.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VehicleSelection;