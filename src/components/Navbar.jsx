import React, { useState, useEffect } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import './styles.css';

const navLinkStyle = {
  color: '#fff', // Text color
  textDecoration: 'none', // Remove underline
  margin: '0 10px', // Adjust spacing
  fontSize: '18px', // Adjust font size
};

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in using localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);
  
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    
    // Update state
    setIsLoggedIn(false);
    
    // Redirect to home page
    window.location.href = '/';
  };

  return (
    <>
      <SpeedInsights />
      <nav className="navbar navbar-expand-lg navbar-light bg-success">
        <a className="navbar-brand" href="/">
          <img src="/logo2.png" width="auto" height="50" className="d-inline-block" alt="MoiHub" />
        </a>
        <a className="navbar-brand">MoiHub</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ml-auto justify-content-end">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/" style={navLinkStyle}>
                  Home
                </a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="servicesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={navLinkStyle}>
                  Services
                </a>
                <div className="dropdown-menu" aria-labelledby="servicesDropdown">
                  <a className="dropdown-item" href="/book">
                    <i className="fas fa-calendar-alt icon-green"></i> Rental Booking
                  </a>
                  <a className="dropdown-item" href="/pharmacy">
                    <i className="fas fa-pills icon-green"></i> E-Chem
                  </a>
                  <a className="dropdown-item" href="/discover">
                    <i className="fas fa-map-marker-alt icon-green"></i> Local Services
                  </a>
                  <a className="dropdown-item" href="/food-delivery">
                    <i className="fas fa-utensils icon-green"></i> Food Delivery
                  </a>
                  <a className="dropdown-item" href="/find-roommate">
                    <i className="fas fa-user-friends icon-blue"></i> Find Roommate
                  </a>
                  <a className="dropdown-item" href="https://mvobingwa.godaddysites.com">
                    <i className="fas fa-sim-card icon-blue"></i> Data Bundles
                  </a>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="shoppingDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={navLinkStyle}>
                  Shopping
                </a>
                <div className="dropdown-menu" aria-labelledby="shoppingDropdown">
                  <a className="dropdown-item" href="/eshop">
                    <i className="fas fa-shopping-cart"></i> E-Shop
                  </a>
                  <a className="dropdown-item" href="/greenhub">
                    <i className="fas fa-apple-alt"></i> Grocery
                  </a>
                  <a className="dropdown-item" href="/pharmacy">
                    <i className="fas fa-pills"></i> E-Chem
                  </a>
                  <a className="dropdown-item" href="https://markethub-mocha.vercel.app/">
                    <i className="fas fa-store"></i> Marketplace
                  </a>
                </div>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/ourteam" style={navLinkStyle}>
                  Our Team
                </a>
              </li>
            </ul>
          </div>
          {/* Login/Logout button */}
          <div className="navbar-footer">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className="btn btn-outline-light" 
                style={{ marginTop: '10px', fontSize: '16px' }}
              >
                Logout
              </button>
            ) : (
              <a 
                href="/login" 
                className="btn btn-outline-light" 
                style={{ marginTop: '10px', fontSize: '16px' }}
              >
                Login
              </a>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;