import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import Logo from "../../assets/logos/logo.png";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/vendors", label: "Vendors" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=com.kylexvin.moihub";

function PlaystoreIcon() {
  return (
    <svg className="playstore-icon" viewBox="0 0 512 512" fill="currentColor">
      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
    </svg>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    closeMenu();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* LOGO - far left */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src={Logo} alt="Moihub" />
          <span className="nav-logo-text">Moihub</span>
        </Link>

        {/* NAV LINKS - center (hidden on mobile) */}
        <ul className="nav-links">
          {NAV_LINKS.map((link, i) => (
            <li key={link.to}>
              <Link to={link.to} className={isActive(link.to) ? "active" : ""} onClick={closeMenu}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT SIDE - desktop auth + download (hidden on mobile) */}
        <div className="nav-right">
          {isAuthenticated ? (
            <div className="nav-auth">
              <span className="nav-username-tag">{user?.username || "User"}</span>
              <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-login-btn">Login</Link>
              <Link to="/register" className="nav-register-btn">Register</Link>
            </div>
          )}

          <a href={PLAYSTORE_URL} className="nav-download-btn" target="_blank" rel="noopener noreferrer">
            <PlaystoreIcon />
            Download app
          </a>
        </div>

        {/* HAMBURGER - far right (visible on mobile) */}
        <button
          type="button"
          className={`nav-hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* MOBILE MENU - separate from nav-links */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-inner">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={isActive(link.to) ? "active" : ""} onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <>
              <div className="mobile-username">
                <span className="nav-username-tag">{user?.username || "User"}</span>
              </div>
              <button className="mobile-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <div className="mobile-auth">
              <Link to="/login" onClick={closeMenu}>Login</Link>
              <span className="nav-divider">/</span>
              <Link to="/register" onClick={closeMenu}>Register</Link>
            </div>
          )}

          <a href={PLAYSTORE_URL} className="mobile-download-btn" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
            <PlaystoreIcon />
            Download app
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;