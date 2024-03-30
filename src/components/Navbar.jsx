// Navbar.js
import React from 'react';
import './styles.css'; // Import your custom styles

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
        <a className="navbar-brand" href="#">
          <img src="logo2.png" width="auto" height="50" className="d-inline-block align-top" alt="MoiHub" />
        </a>
        <a className="navbar-brand">The MoiHub</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
  <ul className="navbar-nav ml-auto">
    <li className="nav-item">
      <a className="nav-link" href="/" style={navLinkStyle}>
        Home
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="/book" style={navLinkStyle}>
        Booking
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="/marketplace" style={navLinkStyle}>
        Marketplace
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="/eshop" style={navLinkStyle}>
        E-Shop
      </a>
    </li>
  </ul>
</div>

      </nav>
    </>
  );
};

export default Navbar;
