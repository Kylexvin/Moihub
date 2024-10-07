import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

const adData = [
  {
    "image": "/images/eshop.jpg",
    "caption": "E-Shop",
    "info": "Get all your essentials from MoiHub's e-shop!",
    "cta": "Shop Now",
    "longDescription": "Browse our e-shop for a wide range of products, including clothing, electronics, stationery, and more. Convenient shopping, delivered straight to your door!",
    "link": "/eshop"
  },
  {
    "image": "/images/food_delivery.jpg",
    "caption": "Food Delivery",
    "info": "Order meals from your favorite restaurants on campus!",
    "cta": "Order Now",
    "longDescription": "Hungry? MoiHub offers a variety of food delivery options from local eateries, making it easy to enjoy delicious meals from the comfort of your dorm or classroom.",
    "link": "/food-delivery"
  },
  {
    "image": "/images/rentals.jpg",
    "caption": "Rental Listings",
    "info": "Find affordable housing near Moi University!",
    "cta": "Find a Place",
    "longDescription": "Looking for a rental? MoiHub provides up-to-date listings of available houses, hostels, and apartments near Moi University, tailored to student needs and budgets.",
    "link": "/book"
  },
  {
    "image": "/images/pharmacy.jpg",
    "caption": "Online Pharmacy",
    "info": "Order medical supplies and prescriptions online!",
    "cta": "Shop Now",
    "longDescription": "Access essential medications and health supplies with ease through MoiHub's online pharmacy, offering quick delivery and affordable prices.",
    "link": "/pharmacy"
  }
];

const AdContainer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate(); // Create a navigate function

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % adData.length);
    setShowInfo(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + adData.length) % adData.length);
    setShowInfo(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentAd = adData[currentIndex];

  return (
    <div style={styles.container}>
      <div style={styles.imageContainer}>
        <img
          src={currentAd.image}
          alt={currentAd.caption}
          style={styles.image}
        />
        {!isMobile && (
          <>
            <button onClick={prevSlide} style={{...styles.navButton, left: '10px'}}>
              <ChevronLeft size={24} color="#2e7d32" />
            </button>
            <button onClick={nextSlide} style={{...styles.navButton, right: '10px'}}>
              <ChevronRight size={24} color="#2e7d32" />
            </button>
          </>
        )}
        <div style={styles.progressBar}>
          {adData.map((_, index) => (
            <div 
              key={index} 
              style={{
                ...styles.progressDot,
                backgroundColor: index === currentIndex ? '#2e7d32' : '#a5d6a7'
              }}
            />
          ))}
        </div>
      </div>

      <div style={styles.contentContainer}>
        <div style={styles.captionContainer}>
          <h2 style={styles.caption}>{currentAd.caption}</h2>
          <button 
            onClick={() => setShowInfo(!showInfo)} 
            style={styles.infoButton}
            aria-label="Toggle more information"
          >
            <Info size={20} color="#2e7d32" />
          </button>
        </div>

        <div style={styles.infoContainer}>
          {showInfo ? (
            <p style={styles.longInfo}>{currentAd.longDescription}</p>
          ) : (
            <p style={styles.info}>{currentAd.info}</p>
          )}
          <button 
            style={styles.ctaButton}
            onClick={() => navigate(currentAd.link)} // Navigate to the page on button click
          >
            {currentAd.cta}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    height: '400px',
    backgroundColor: '#e8f5e9',
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '50%',
    height: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    transition: 'transform 0.5s ease',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    border: 'none',
    borderRadius: '50%',
    padding: '10px',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'background-color 0.3s ease',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    height: '100%',
  },
  captionContainer: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#c8e6c9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    color: '#1b5e20',
    textAlign: 'center',
  },
  infoButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    transition: 'background-color 0.3s ease',
  },
  infoContainer: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#a5d6a7',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#33691e',
    lineHeight: '1.4',
    textAlign: 'center',
  },
  longInfo: {
    fontSize: '14px',
    marginBottom: '20px',
    color: '#33691e',
    lineHeight: '1.4',
    maxHeight: '100px',
    overflowY: 'auto',
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#2e7d32',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '25px',
    transition: 'background-color 0.3s ease',
  },
  progressBar: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    margin: '0 4px',
    transition: 'background-color 0.3s ease',
  },
};

export default AdContainer;