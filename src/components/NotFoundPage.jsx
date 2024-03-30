import React from 'react';
import './404.css'; // Import your CSS file for styling

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <p>Oops! Page not found.</p>
        <p>It seems like you're lost in Moi university.</p>
        <button onClick={() => window.location.href = '/'}>
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
