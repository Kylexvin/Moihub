import React from 'react';
import './Emergency.css'; // CSS file for styling

const Emergency = () => {
  return (
    <>
   <h1 class="emergency-title">Emergency Contacts</h1>
<div class="emergency-container">
    <div class="emergency-card">
        <i class="fas fa-ambulance fa-3x phone-icon"></i>
        <div class="heart-effect"></div>
        <p>Ambulance: [Insert ambulance emergency phone number here]</p>
    </div>
    <div class="emergency-card">
        <i class="fas fa-police fa-3x phone-icon"></i>
        <div class="heart-effect"></div>
        <p>Police: [Insert police emergency phone number here]</p>
    </div>
</div>
    </>
  );
};

export default Emergency;
