import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Route } from "lucide-react";
import { fetchMatatus, setSelectedMatatu } from "../redux/slices/vehicleSlice";

const VehicleSelectionPage = () => {
  const dispatch = useDispatch();
  const { matatus, lastUpdated, status, error } = useSelector((state) => state.vehicles);
  const isLoading = status === 'loading';
  const { routeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (routeId) {
      dispatch(fetchMatatus(routeId));
    }
  }, [dispatch, routeId]);

  const handleSelectMatatu = (matatu) => {
    dispatch(setSelectedMatatu(matatu));
    navigate(`/seat-selection/${matatu._id}`);
  };

  return (
    <div className="vehicle-selection-page">
      <div className="moilink-card">
        <h2>Moilink Travelers</h2>
        
      </div>

      <div className="destination-panel">
        {isLoading ? (
          <div className='load-c'>
            <span className="loader"></span>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : matatus.length === 0 ? (
          <p>No matatus available for this route.</p>
        ) : (
          matatus.map((matatu) => (
            <div key={matatu._id} className="matatu-card">
              <div className="matatu-header">
                <span className="matatu-name">{matatu.registrationNumber}</span>
                <span className="matatu-price">KSH {matatu.currentPrice}</span>
              </div>
              <div className="matatu-info">
                <div className="matatu-detail">
                  <Clock size={16} />
                  <div className="detail-text">
                    <div className="detail-label">Departure Time</div>
                    <div className="detail-value">{matatu.departureTime}</div>
                  </div>
                </div>
                <div className="matatu-detail">
                  <Route size={16} />
                  <div className="detail-text">
                    <div className="detail-label">Total Seats</div>
                    <div className="detail-value">{matatu.totalSeats}</div>
                  </div>
                </div>
              </div>
              <button
                className="select-matatu-btn"
                onClick={() => handleSelectMatatu(matatu)}
              >
                <CheckCircle size={16} /> Select Matatu
              </button>
            </div>
          ))
        )}
      </div>

      <div className="refresh-container">        
        {lastUpdated && <p className="updated-time">Updated {new Date(lastUpdated).toLocaleTimeString()}</p>}
      </div>

      <div className="bottom-navv">
        <a href="/moilinktravellers" className="nav-itemm">
          <i className="fas fa-route"></i> Routes
        </a>
        <a href="/mybookings" className="nav-itemm">
          <i className="fas fa-book"></i> Bookings
        </a>
      </div>
    </div>
  );
};

export default VehicleSelectionPage;