import React from "react";
import "./Screenshots.css";

import homeScreenshot from "../../../assets/screenshots/phone-mockup.png";
import marketplaceScreenshot from "../../../assets/screenshots/marketplace_mockup.png";
import foodScreenshot from "../../../assets/screenshots/food_mockup.png";
import aiScreenshot from "../../../assets/screenshots/ai_mockup.png";
import rentalsScreenshot from "../../../assets/screenshots/rentals_mockup.png";
import profileScreenshot from "../../../assets/screenshots/profile_mockup.png";

const SCREENSHOTS = [
  { 
    id: 1, 
    image: homeScreenshot, 
    alt: "MoiHub home dashboard showing campus services and quick access", 
    title: "Home dashboard", 
    size: "normal",
    width: 240,
    height: 480
  },
  { 
    id: 2, 
    image: marketplaceScreenshot, 
    alt: "MoiHub marketplace for buying and selling on campus", 
    title: "Marketplace", 
    size: "large",
    width: 280,
    height: 500
  },
  { 
    id: 3, 
    image: foodScreenshot, 
    alt: "MoiHub food ordering and delivery interface", 
    title: "Food ordering", 
    size: "normal",
    width: 240,
    height: 480
  },
  { 
    id: 4, 
    image: aiScreenshot, 
    alt: "MoiHub AI assistant for smart campus search", 
    title: "MoiHub AI", 
    size: "large",
    width: 280,
    height: 500
  },
  { 
    id: 5, 
    image: rentalsScreenshot, 
    alt: "MoiHub rental listings for accommodation near campus", 
    title: "Rentals", 
    size: "normal",
    width: 240,
    height: 480
  },
  { 
    id: 6, 
    image: profileScreenshot, 
    alt: "MoiHub user profile with account settings", 
    title: "User profile", 
    size: "large",
    width: 280,
    height: 500
  },
];

function ScreenshotCard({ shot, index }) {
  return (
    <div className={`screenshot-item ${shot.size === "large" ? "screenshot-item-lg" : ""}`}>
      <div className="screenshot-wrapper">
        <span className="screenshot-pin" aria-hidden="true" />
        <img 
          src={shot.image} 
          alt={shot.alt} 
          className="screenshot-image"
          width={shot.width}
          height={shot.height}
          loading="lazy"
          decoding="async"
        />
      </div>
      <span className="screenshot-name">
        <span className="screenshot-index">{String(index + 1).padStart(2, "0")}</span>
        {shot.title}
      </span>
    </div>
  );
}

function Screenshots() {
  return (
    <section className="screenshots" id="screenshots">
      <div className="screenshots-container">

        {/* HEADER */}
        <div className="screenshots-header">
          <span className="screenshots-badge">The interface</span>
          <h2 className="screenshots-title">
            See MoiHub <span className="screenshots-highlight">in action</span>
          </h2>
          <p className="screenshots-description">
            Explore the interface built to make buying, selling, ordering, and connecting
            on campus effortless.
          </p>
        </div>

        {/* SCREENSHOTS GRID */}
        <div className="screenshots-grid">
          <div className="screenshot-row">
            <ScreenshotCard shot={SCREENSHOTS[0]} index={0} />
            <ScreenshotCard shot={SCREENSHOTS[1]} index={1} />
            <ScreenshotCard shot={SCREENSHOTS[2]} index={2} />
          </div>
          <div className="screenshot-row screenshot-row-center">
            <ScreenshotCard shot={SCREENSHOTS[3]} index={3} />
            <ScreenshotCard shot={SCREENSHOTS[4]} index={4} />
            <ScreenshotCard shot={SCREENSHOTS[5]} index={5} />
          </div>
        </div>

      </div>
    </section>
  );
}

export default Screenshots;