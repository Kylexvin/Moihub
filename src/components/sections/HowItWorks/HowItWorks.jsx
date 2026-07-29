import React from "react";
import "./HowItWorks.css";

const STEPS = [
  {
    number: "01",
    tag: "Quick start",
    title: "Download the app",
    text: "Install MoiHub on your device and create your free account in under a minute.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    number: "02",
    tag: "Personalize",
    title: "Set up your profile",
    text: "Complete your profile to personalize your experience and unlock all features.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    number: "03",
    tag: "Discover",
    title: "Explore campus",
    text: "Browse the marketplace, order food, discover events, and connect with services.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    number: "04",
    tag: "Engage",
    title: "Connect & grow",
    text: "Shop, sell, find roommates, and build meaningful campus connections.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
];

const FEATURE_TAGS = [
  {
    label: "Marketplace",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    label: "Roommate finder",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "LinkMe dating",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    label: "Campus events",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    label: "Food delivery",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="hiw-container">

        {/* HEADER */}
        <div className="hiw-header">
          <span className="hiw-badge">Getting started</span>
          <h2 className="hiw-title">
            Your campus journey starts
            <br />
            <span className="hiw-highlight">in 4 simple steps</span>
          </h2>
        </div>

        {/* STEPS */}
        <div className="hiw-steps-grid">
          {STEPS.map((step) => (
            <div className="hiw-step-card" key={step.number}>
              <div className="hiw-step-top">
                <div className="hiw-icon-frame">{step.icon}</div>
                <span className="hiw-step-number">{step.number}</span>
              </div>
              <h3 className="hiw-step-title">{step.title}</h3>
              <p className="hiw-step-text">{step.text}</p>
              <span className="hiw-step-tag">{step.tag}</span>
            </div>
          ))}
        </div>

        {/* FEATURES PREVIEW */}
        <div className="hiw-features-preview">
          {FEATURE_TAGS.map((f) => (
            <span className="hiw-feature-tag" key={f.label}>
              {f.icon}
              {f.label}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="hiw-cta-section">
          <p className="hiw-cta-text">
            Ready to elevate your <span className="hiw-cta-highlight">campus experience?</span>
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=com.kylexvin.moihub"
            className="hiw-btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="playstore-icon" viewBox="0 0 512 512" fill="currentColor">
              <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
            </svg>
            Download app
          </a>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;