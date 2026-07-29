import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";
import PhoneMockup from "../../../assets/images/phone-mockup.png";

const PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=com.kylexvin.moihub";

function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="hero">
      <div 
        className="hero-background" 
        aria-label="Campus life background" 
        role="img"
      ></div>
      <div className="hero-container">
        <div className={`hero-content ${isVisible ? "animate" : ""}`}>
          <span className="hero-badge">One app. Whole campus.</span>
          <div className="hero-glass-card">
            <h1 className="hero-title">
              Everything you need for{" "}
              <span className="hero-highlight">campus life</span>, in one app.
            </h1>
            <p className="hero-description">
              Buy and sell, order food, find rentals, connect with local services,
              discover opportunities, and more — all from a single platform.
            </p>
          </div>
          <div className="hero-buttons">
            <a href={PLAYSTORE_URL} className="hero-btn-primary" target="_blank" rel="noopener noreferrer">
              Download app
            </a>
            <Link to="/vendors" className="hero-btn-secondary">
              Become a vendor
            </Link>
          </div>
        </div>
        <div className={`hero-image ${isVisible ? "animate" : ""}`}>
          <span className="hero-image-pin" aria-hidden="true" />
          <img 
            src={PhoneMockup} 
            alt="Moihub mobile app showing campus services - food delivery, rentals, and shopping"
            width="300"
            height="600"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;