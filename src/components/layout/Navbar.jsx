import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import Logo from "../../assets/logos/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* LOGO */}
        <Link to="/" className="nav-logo">
          <img src={Logo} alt="Moihub" />
          <span className="nav-logo-text">Moihub</span>
        </Link>

        {/* HAMBURGER */}
        <div 
          className={`nav-hamburger ${menuOpen ? "active" : ""}`} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* NAV LINKS */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <Link 
              to="/" 
              className={isActive("/") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/features" 
              className={isActive("/features") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Features
            </Link>
          </li>
          <li>
            <Link 
              to="/vendors" 
              className={isActive("/vendors") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Vendors
            </Link>
          </li>
          <li>
            <Link 
              to="/blog" 
              className={isActive("/blog") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={isActive("/about") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={isActive("/contact") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </li>
          
          {/* Mobile Auth - shows either Login/Register OR Username/Logout */}
          {isAuthenticated ? (
            <>
              <li className="nav-username-mobile">{user?.username || "User"}</li>
              <li>
                <button className="nav-logout-mobile" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="nav-auth-mobile">
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <span className="nav-divider">|</span>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </li>
          )}
          
          <li className="nav-download-mobile">
            <a 
              href="https://play.google.com/store/apps/details?id=com.kylexvin.moihub" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              <svg className="playstore-icon" viewBox="0 0 512 512" fill="currentColor">
                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
              </svg>
              Download App
            </a>
          </li>
        </ul>

        {/* RIGHT SIDE - DESKTOP AUTH + DOWNLOAD */}
        <div className="nav-right">
          {isAuthenticated ? (
            <div className="nav-auth">
              <span className="nav-username">{user?.username || "User"}</span>
              <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-login-btn">Login</Link>
              <Link to="/register" className="nav-register-btn">Register</Link>
            </div>
          )}

          <a 
            href="https://play.google.com/store/apps/details?id=com.kylexvin.moihub" 
            className="nav-download-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="playstore-icon" viewBox="0 0 512 512" fill="currentColor">
              <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
            </svg>
            Download App
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;