import React from 'react';
import './DownloadApp.css'; // Import the CSS file

function DownloadApp() {
  return (
    <div className="download-container">
      <h2 className="download-title">Download Our App</h2>
      <p className="download-description">
        Get our mobile app and enjoy the full experience on your device.
      </p>
      <a href="/moihub.apk" download className="download-link">
        <button className="download-button">
          <span className="download-text">Download APK</span>
        </button>
      </a>
    </div>
  );
}

export default DownloadApp;
