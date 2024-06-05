// Navbar.js
import React from 'react';
import './styles.css'; 

const navLinkStyle = {
  color: '#fff', // Text color
  textDecoration: 'none', // Remove underline
  margin: '0 10px', // Adjust spacing
  fontSize: '18px', // Adjust font size
};

const Navbar = () => {
  return (
    <>
  <nav className="navbar navbar-expand-lg navbar-light bg-success">
    <a className="navbar-brand" href="/">
      <img src="logo2.png" width="auto" height="50" className="d-inline-block " alt="MoiHub" />
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
            <a className="nav-link dropdown-toggle" href="#" id="servicesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Services
            </a>
            <div className="dropdown-menu" aria-labelledby="servicesDropdown">
              <a className="dropdown-item" href="/book">Booking</a>
              <a className="dropdown-item" href="/pharmacy">E-Chem</a>
              <a className="dropdown-item" href="/discover">Local Services</a>
              <a className="dropdown-item" href="/food-delivery">Food Delivery</a>
            </div>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="shoppingDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Shopping
            </a>
            <div className="dropdown-menu" aria-labelledby="shoppingDropdown">
              <a className="dropdown-item" href="/eshop">E-Shop</a>
              <a className="dropdown-item" href="/pharmacy">E-Chem</a>
              <a className="dropdown-item" href="/marketplace">Marketplace</a>
            </div>
          </li>
          
        </ul>
      </div>
    </div>
  </nav>
</>

  
  );
};

export default Navbar;
