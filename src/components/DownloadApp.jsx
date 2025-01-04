import React from 'react';
import './DownloadApp.css'; // Import the CSS file

function DownloadApp() {
  return (
    <div className="download-container">
      <h2 className="download-title">Download MoiHub App</h2>
      <p className="download-description">
        Get all the services provided in and within Moi university.
      </p>
      <a href="/moihub.apk" download className="download-link">
        <button className="download-button">
          <span className="download-text">Download APK <i className="fas fa-arrow-down"></i></span>
        </button>
      </a>
    </div>
  );
}

export default DownloadApp;
