import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Map, Clock, Route, CheckCircle } from 'lucide-react';
import { fetchRoutes, setSelectedDestination } from "../redux/slices/routeSlice";
import "./v3.css";

const RouteSelectionPage = () => {
  const dispatch = useDispatch();
  const { 
    filteredRoutes, 
    routes, 
    selectedDestination, 
    totalRoutes, 
    lastUpdated, 
    status 
  } = useSelector((state) => state.routes);
  
  const isLoading = status === 'loading';

  useEffect(() => {
    dispatch(fetchRoutes());
  }, [dispatch]);

  const handleDestinationChange = (e) => {
    dispatch(setSelectedDestination(e.target.value));
  };

  const handleRefresh = () => {
    dispatch(fetchRoutes());
  };

  const uniqueDestinations = [...new Set(routes.map((route) => route.destination))];

  return (
    <div>
      <div className="moilink-card">
        <div className="moilinkcards-container">
          <div className="moilinkcard travelers-card">
            <h2 className="moilinkcard-title">Moilink Travelers</h2>
            <p className="moilinkcard-slogan">Your Journey, Our Priority</p>
          </div>
          <div className="moilinkcard moilinkstats-card">
            <p className="moilinkstats-number">TOTAL ROUTES: {totalRoutes}
              <br/>{lastUpdated && 
                <p className="updated-time">Updated {new Date(lastUpdated).toLocaleTimeString()}</p>
              }
            </p>
            <div className="refresh-container">
              <button className="refresh-btn" onClick={handleRefresh} disabled={isLoading}>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="destination-panel">
        <div className="panel-header"></div>
        <select
          className="search-btn"
          value={selectedDestination}
          onChange={handleDestinationChange}
        >
          <option value="" disabled>
            Choose a destination
          </option>
          {uniqueDestinations.map((destination) => (
            <option key={destination} value={destination}>
              {destination}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className='load-c'>
          <span className="loader"></span>
        </div>
      ) : (
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
                  <Route size={16} />
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
      )}

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

export default RouteSelectionPage;