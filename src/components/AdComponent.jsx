import React, { useEffect } from 'react';

const AdComponent = () => {
  useEffect(() => {
    // This ensures the ad units are loaded after the component is mounted
    if (window.adsbygoogle) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  return (
    <div className="ad-container" style={{ textAlign: 'center', margin: '20px 0' }}>
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-4438215525193485"
           data-ad-slot="your-ad-slot-id"
           data-ad-format="auto">
      </ins>
    </div>
  );
};

export default AdComponent;
