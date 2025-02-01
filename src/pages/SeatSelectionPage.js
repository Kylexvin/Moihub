import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';

const SeatSelectionPage = () => {
  const { matatuId } = useParams();
  const navigate = useNavigate();
  const [matatu, setMatatu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seatStatuses, setSeatStatuses] = useState({});

  // Fetch matatu details
  const fetchMatatu = async () => {
    try {
      const response = await fetch(`https://moigosip.onrender.com/api/matatus/${matatuId}`);
      if (!response.ok) throw new Error('Failed to fetch matatu');
      const data = await response.json();
      setMatatu(data);
      
      // Initialize seat status checks for all seats
      const statusPromises = data.seatLayout.map(seat => 
        checkSeatAvailability(seat.seatNumber)
      );
      
      const statuses = await Promise.all(statusPromises);
      const statusMap = {};
      statuses.forEach((status, index) => {
        statusMap[data.seatLayout[index].seatNumber] = status;
      });
      setSeatStatuses(statusMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check seat availability
  const checkSeatAvailability = async (seatNumber) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://moigosip.onrender.com/api/bookings/${matatuId}/check-seat?seat_number=${seatNumber}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to check seat availability');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error checking seat:', err);
      return null;
    }
  };

  // Lock seat
  const lockSeat = async (seatId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://moigosip.onrender.com/api/bookings/${matatuId}/lock/${seatId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to lock seat');
      return await response.json();
    } catch (err) {
      console.error('Error locking seat:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchMatatu();
    
    // Poll for seat status updates every 15 seconds
    const intervalId = setInterval(() => {
      if (matatu) {
        matatu.seatLayout.forEach(async (seat) => {
          const status = await checkSeatAvailability(seat.seatNumber);
          setSeatStatuses(prev => ({
            ...prev,
            [seat.seatNumber]: status
          }));
        });
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, [matatuId]);

  const handleSeatClick = async (seat) => {
    try {
      const seatStatus = await checkSeatAvailability(seat.seatNumber);
      
      if (!seatStatus) {
        throw new Error('Failed to check seat availability');
      }

      if (seatStatus.status === 'booked') {
        alert(`Seat ${seat.seatNumber} is already booked`);
        return;
      }

      if (seatStatus.status === 'locked' && !seatStatus.locked_by_you) {
        alert(`Seat ${seat.seatNumber} is temporarily locked by another user`);
        return;
      }

      // Show booking details and lock button
      setSelectedSeat({
        ...seat,
        ...seatStatus
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLockAndBook = async () => {
    try {
      if (!selectedSeat) return;

      const lockedSeatData = await lockSeat(selectedSeat.seat._id);
      
      // Navigate to booking page with seat and matatu details
      navigate(`/booking-confirmation/${matatuId}/${selectedSeat.seat._id}`, {
        state: {
          seatDetails: lockedSeatData.seat,
          matatuDetails: lockedSeatData.matatu_details,
          lockExpiry: lockedSeatData.lock_expiry
        }
      });
    } catch (error) {
      alert('Failed to lock seat. Please try again.');
    }
  };

  const getSeatColor = (seat) => {
    const status = seatStatuses[seat.seatNumber]?.status;
    if (selectedSeat?.seat?._id === seat._id) return 'bg-green-500';
    if (status === 'booked' || seat.isBooked) return 'bg-red-500';
    if (status === 'locked') return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !matatu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-700 mb-4">
            {error || 'No Matatu Found'}
          </h2>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
          {/* Header */}
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

          {/* Seats */}
          <div className="p-6">
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              {matatu.seatLayout.map((seat) => (
                <button
                  key={seat._id}
                  onClick={() => handleSeatClick(seat)}
                  className={`
                    relative p-6 rounded-lg text-white font-medium 
                    transition-all duration-200 
                    ${getSeatColor(seat)}
                    ${seat.isBooked ? 'cursor-not-allowed' : 'hover:opacity-90'}
                  `}
                  disabled={seat.isBooked}
                >
                  <span className="text-lg">{seat.seatNumber}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Seat Details */}
          {selectedSeat && (
            <div className="p-6 border-t">
              <div className="max-w-2xl mx-auto bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Selected Seat Details</h3>
                <p>Seat Number: {selectedSeat.seat.seatNumber}</p>
                <p>Route: {selectedSeat.matatu_details.route.origin} - {selectedSeat.matatu_details.route.destination}</p>
                <p>Departure: {selectedSeat.matatu_details.departure_time}</p>
                <button
                  onClick={handleLockAndBook}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Lock and Proceed to Book
                </button>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="p-6 border-t">
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-500" />
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-red-500" />
                <span>Booked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-yellow-500" />
                <span>On Hold</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-green-500" />
                <span>Selected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;