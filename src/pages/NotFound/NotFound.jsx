// src/pages/NotFound/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <p>Oops! Page not found.</p>
        <p>It seems like you're lost.</p>
        <Link to="/" className="not-found-btn">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;