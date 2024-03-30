// HeroSection.js
import React, { useState, useEffect } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const captions = [
    'Luxury Apartments for Rent',
    'Discover Your Dream Home',
    'Book Your Perfect Getaway',
    // Add more captions as needed
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % captions.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [captions.length]); // Include captions.length in the dependency array

  return (
    <div className="hero-section">
      <div className="hero-overlay">
        <div className="caption-container">
          <div className="caption-card">
            <p className="caption">{captions[currentIndex]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
