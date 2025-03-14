import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Route } from "lucide-react"; // Use Lucide icons

const VehicleSelectionPage = () => {
  const [matatus, setMatatus] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { routeId } = useParams(); // Get routeId from URL params
  const navigate = useNavigate(); // React Router navigation

  useEffect(() => {
    fetchMatatus();
  }, [routeId]);

  const fetchMatatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://moihub.onrender.com/api/routes/matatu/${routeId}`);
      if (!response.ok) throw new Error("Failed to fetch data.");
      const data = await response.json();
      setMatatus(data.matatus || []);
      setLastUpdated(new Date());
    } catch (error) {
      setError("Error fetching matatus. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vehicle-selection-page">
      <div className="moilink-card">
        <h2>Moilink Travelers</h2>
        <p className="moilinkcard-slogan">Your Journey, Our Priority</p>
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
                onClick={() => navigate(`/seat-selection/${matatu._id}`)}
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
    <a href="/moilinktravellers" className="nav-item">
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