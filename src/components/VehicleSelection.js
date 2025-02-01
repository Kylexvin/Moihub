import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, AlertCircle } from 'lucide-react';

const SeatSelectionPage = () => {
  const { matatuId } = useParams();
  const [matatu, setMatatu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const navigate = useNavigate();

  const fetchMatatu = async (matatuId) => {
    try {
      const response = await fetch(`https://moigosip.onrender.com/api/matatus/${matatuId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch matatu');
      }
      const data = await response.json();

      if (!data) throw new Error('Invalid response data');
      if (!data._id) throw new Error('Invalid matatu data');

      return data;
    } catch (err) {
      console.error(`Error fetching matatu ${matatuId}:`, err);
      throw err;
    }
  };

  const checkSeatAvailability = async (seatId) => {
    try {
      const response = await fetch(`https://moigosip.onrender.com/api/bookings/check-seat?seatId=${seatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check seat availability');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`Error checking seat availability ${seatId}:`, err);
      throw err;
    }
  };

  const lockSeat = async (seatId) => {
    try {
      const response = await fetch(`https://moigosip.onrender.com/api/bookings/lock-seat/${matatuId}/${seatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to lock seat');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`Error locking seat ${seatId}:`, err);
      throw err;
    }
  };

  useEffect(() => {
    const fetchMatatuData = async () => {
      try {
        setLoading(true);
        const fetchedMatatu = await fetchMatatu(matatuId);
        setMatatu(fetchedMatatu);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatatuData();
  }, [matatuId]);

  const handleSeatSelect = async (seatId) => {
    try {
      const seatAvailability = await checkSeatAvailability(seatId);

      if (seatAvailability.status === 'booked') {
        alert(`Seat ${seatAvailability.seat.seatNumber} is already booked`);
        return;
      }

      if (seatAvailability.status === 'locked' && !seatAvailability.locked_by_you) {
        alert(`Seat ${seatAvailability.seat.seatNumber} is temporarily locked by another user`);
        return;
      }

      const lockedSeat = await lockSeat(seatId);
      setSelectedSeat(lockedSeat.seat);
      navigate(`/booking-confirmation/${matatuId}/${seatId}`);
    } catch (error) {
      console.error('Error selecting seat:', error);
      alert('Failed to select seat. Please try again.');
    }
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
          <h2 className="text-2xl font-bold text-red-700 mb-4">Oops! Something went wrong</h2>
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

  if (!matatu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Matatu Found</h2>
          <p className="text-gray-600 mb-4">Please try again with a valid matatu ID.</p>
          <button 
            onClick={() => navigate('/') }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Select Your Seat</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>{matatu.route.origin} - {matatu.route.destination}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Departure: {matatu.departureTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">KSH {matatu.currentPrice}</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="p-6 border-b">
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-red-500"></div>
                <span>Booked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
                <span>Held</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-green-500"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>

          {/* Seats Grid */}
          <div className="p-6">
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              {matatu.seatLayout.map((seat) => (
                <button
                  key={seat._id}
                  className={`relative p-6 rounded-lg text-white font-medium transform transition-all duration-200 ${seat.isBooked ? 'bg-red-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                  onClick={() => handleSeatSelect(seat._id)}
                  disabled={seat.isBooked}
                >
                  <span className="text-lg">{seat.seatNumber}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;