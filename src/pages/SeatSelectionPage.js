import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Timer } from "lucide-react";
import "./SeatSelection.css";

const SeatSelectionPage = () => {
  const { matatuId } = useParams();
  const navigate = useNavigate();
  const [matatu, setMatatu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seatStatuses, setSeatStatuses] = useState({});
  const [lockTimer, setLockTimer] = useState(0);
  const [sessionTimer, setSessionTimer] = useState(3600); // 1 hour session
  const [isRefreshing, setIsRefreshing] = useState({});

  const checkTokenExpiration = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Session expired. Please login again.');
      navigate('/login');
      return false;
    }
    return true;
  }, [navigate]);

  const fetchMatatu = async () => {
    if (!checkTokenExpiration()) return;
    try {
      const response = await fetch(`https://moigosip.onrender.com/api/matatus/${matatuId}`);
      if (!response.ok) throw new Error('Failed to fetch matatu');
      const data = await response.json();
      setMatatu(data);
      await refreshAllSeatStatuses(data.seatLayout);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshAllSeatStatuses = async (seatLayout) => {
    const statusPromises = seatLayout.map(seat => checkSeatAvailability(seat.seatNumber));
    const statuses = await Promise.all(statusPromises);
    const statusMap = {};
    statuses.forEach((status, index) => {
      statusMap[seatLayout[index].seatNumber] = status;
    });
    setSeatStatuses(statusMap);
  };

  const checkSeatAvailability = async (seatNumber) => {
    setIsRefreshing(prev => ({ ...prev, [seatNumber]: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://moigosip.onrender.com/api/bookings/${matatuId}/check-seat?seat_number=${seatNumber}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Failed to check seat');
      return await response.json();
    } catch (err) {
      return null;
    } finally {
      setIsRefreshing(prev => ({ ...prev, [seatNumber]: false }));
    }
  };

  const lockSeat = async (seatId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://moigosip.onrender.com/api/bookings/${matatuId}/lock/${seatId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!response.ok) throw new Error('Failed to lock seat');
      return await response.json(); // Expected response: { success: true, seatId }
    } catch (err) {
      alert(err.message);
      return null;
    }
  };
  
  const handleSeatClick = async (seat) => {
    if (selectedSeat?.seatNumber === seat.seatNumber) {
      setSelectedSeat(null);
      setLockTimer(0);
      return;
    }
  
    try {
      const status = await checkSeatAvailability(seat.seatNumber);
      if (!status) throw new Error('Failed to check seat');
  
      if (status.status === 'booked') {
        alert(`Seat ${seat.seatNumber} is already booked`);
        return;
      }
      if (status.status === 'locked' && !status.locked_by_you) {
        alert(`Seat ${seat.seatNumber} is temporarily locked`);
        return;
      }
  
      // Lock seat before selecting
      const lockResponse = await lockSeat(seat._id);
      if (!lockResponse || !lockResponse.success) {
        alert('Failed to lock seat. Try again.');
        return;
      }
  
      setSelectedSeat({ ...seat, ...status });
      setLockTimer(300); // 5 minutes lock timer
    } catch (error) {
      alert(error.message);
    }
  };
  
  useEffect(() => {
    fetchMatatu();
    
    // Polling every 5 seconds
    const pollingId = setInterval(() => {
      if (matatu) {
        refreshAllSeatStatuses(matatu.seatLayout);
      }
    }, 5000);

    // Lock timer countdown
    const lockId = setInterval(() => {
      setLockTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Session timer
    const sessionId = setInterval(() => {
      setSessionTimer(prev => {
        if (prev <= 0) {
          alert('Session timeout. Please refresh.');
          return 0;
        }
        if (prev <= 300) { // 5 minutes warning
          alert(`Session will expire in ${Math.floor(prev / 60)} minutes`);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(pollingId);
      clearInterval(lockId);
      clearInterval(sessionId);
    };
  }, [matatuId, matatu]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!matatu) return <div className="error">Matatu not found</div>;

  const availableSeats = matatu.seatLayout.filter(
    seat => seatStatuses[seat.seatNumber]?.status !== 'booked'
  ).length;

  const firstRow = matatu.seatLayout.slice(0, 2);
  const remainingSeats = matatu.seatLayout.slice(2);
  const remainingRows = [];
  for (let i = 0; i < remainingSeats.length; i += 3) {
    remainingRows.push(remainingSeats.slice(i, i + 3));
  }

  return (
    <div className="seat-selection-page">
      <div className="header">
        <h2>Select Your Seat - {matatu.registrationNumber}</h2>
        <div className="status-info">
          <span>Available Seats: {availableSeats}</span>
          <span>Session: {Math.floor(sessionTimer / 60)}:{(sessionTimer % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      <div className="seat-layout">
        <div className="first-row">
          {firstRow.map((seat) => (
            <button
              key={seat._id}
              className={`seat ${seatStatuses[seat.seatNumber]?.status || ''} 
                         ${selectedSeat?.seatNumber === seat.seatNumber ? 'selected' : ''}
                         ${isRefreshing[seat.seatNumber] ? 'refreshing' : ''}`}
              onClick={() => handleSeatClick(seat)}
              disabled={seatStatuses[seat.seatNumber]?.status === 'booked'}
            >
              {seat.seatNumber}
            </button>
          ))}
        </div>

        {remainingRows.map((row, index) => (
          <div key={index} className="seat-row">
            {row.map((seat) => (
              <button
                key={seat._id}
                className={`seat ${seatStatuses[seat.seatNumber]?.status || ''}
                           ${selectedSeat?.seatNumber === seat.seatNumber ? 'selected' : ''}
                           ${isRefreshing[seat.seatNumber] ? 'refreshing' : ''}`}
                onClick={() => handleSeatClick(seat)}
                disabled={seatStatuses[seat.seatNumber]?.status === 'booked'}
              >
                {seat.seatNumber}
              </button>
            ))}
          </div>
        ))}
      </div>

      {selectedSeat && (
        <div className="booking-action">
          <div className="lock-timer">
            <Timer size={16} />
            Lock expires in: {Math.floor(lockTimer / 60)}:{(lockTimer % 60).toString().padStart(2, '0')}
          </div>
          <button className="book-button" onClick={() => {
  if (window.confirm('Proceed with booking?')) {
    navigate(`/booking-confirmation/${matatuId}/${selectedSeat._id}`);
  }
}}>
  <CheckCircle size={16} /> Book Seat {selectedSeat.seatNumber}
</button>

        </div>
      )}
    </div>
  );
};

export default SeatSelectionPage;