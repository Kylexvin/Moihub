import { useEffect, useState } from "react";
import { MapPin, Map, Clock,  Route, CheckCircle, Book, Ticket } from 'lucide-react';
import "./v3.css";

const RouteSelectionPage = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [totalRoutes, setTotalRoutes] = useState(0);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch("https://moihub.onrender.com/api/routes");
        const data = await response.json();
        setRoutes(data);
        setTotalRoutes(data.length);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchRoutes();
  }, []);

  const uniqueDestinations = [...new Set(routes.map((route) => route.destination))];

  const filteredRoutes = selectedDestination
    ? routes.filter((route) => route.destination === selectedDestination)
    : routes;

  return (
    <div>
      <div className="moilink-card">
        <div className="moilinkcards-container">
          <div className="moilinkcard travelers-card">
            <h2 className="moilinkcard-title">Moilink Travelers</h2>
            <p className="moilinkcard-slogan">Your Journey, Our Priority</p>
          </div>
          <div className="moilinkcard moilinkstats-card">
            <p className="moilinkstats-number">TOTAL ROUTES: {totalRoutes}</p>
          </div>
        </div>
      </div>

      <div className="destination-panel">
        <div className="panel-header"></div>
        <select
          className="search-btn"
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
        >
          <option value="" disabled selected>
            Choose a destination
          </option>
          {uniqueDestinations.map((destination) => (
            <option key={destination} value={destination}>
              {destination}
            </option>
          ))}
        </select>
      </div>

      <div id="route-container">
        {filteredRoutes.map((route) => (
          <div key={route._id} className="route-card">
            <div className="route-header">
              <span className="route-name">{route.name}</span>
              <span className="route-price">KSH {route.basePrice}</span>
            </div>
            <div className="route-info">
              <div className="route-detail">
                <MapPin size={16} />
                <div className="detail-text">
                  <div className="detail-label">Pickup point</div>
                  <div className="detail-value">{route.pickupPoint}</div>
                </div>
              </div>
              <div className="route-detail">
                <Map size={16} />
                <div className="detail-text">
                  <div className="detail-label">Drop off</div>
                  <div className="detail-value">{route.droppingPoint}</div>
                </div>
              </div>
              <div className="route-detail">
                <Clock size={16} />
                <div className="detail-text">
                  <div className="detail-label">Duration</div>
                  <div className="detail-value">{route.estimatedDuration}</div>
                </div>
              </div>
              <div className="route-detail">
                < Route size={16} />
                <div className="detail-text">
                  <div className="detail-label">Distance</div>
                  <div className="detail-value">{route.distance} km</div>
                </div>
              </div>
            </div>
            <button
  className="select-route-btn"
  onClick={() => (window.location.href = `/VehicleSelectionPage/${route._id}`)}
>
  <CheckCircle size={16} /> Select Route
</button>

          </div>
        ))}
      </div>

      <nav className="bottom-nav">
        <a href="/" className="nav-item">
          <i className="fas fa-book"></i> Booking
        </a>
        <a href="/tickets" className="nav-item">
          <i className="fas fa-ticket"></i> Tickets
        </a>
      </nav>
    </div>
  );
};

export default RouteSelectionPage;
