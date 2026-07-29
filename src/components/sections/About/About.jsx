import React from "react";
//import { Link } from "react-router-dom";
import "./About.css";

const VALUE_CARDS = [
  {
    title: "Everything in one place",
    text: "Access shopping, food, rentals, local services, and more.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    title: "Empowering student businesses",
    text: "Helping vendors reach more customers on campus.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Built for growth",
    text: "New features and smarter tools to improve the campus experience.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
];

function About() {
  return (
    <section className="about" id="about">
      <div className="about-container">

        {/* HEADER */}
        <div className="about-header">
          <span className="about-tag">About MoiHub</span>
          <h2 className="about-title">
            Built to make <span className="about-highlight">campus life</span> easier.
          </h2>
          <p className="about-description">
            MoiHub was created to bring everyday campus needs into one place. Instead of
            switching between different apps to shop, order food, find housing, or connect
            with local services, students can do it all through a single platform designed
            for campus communities.
          </p>
        </div>

        {/* VALUE CARDS */}
        <div className="about-cards">
          {VALUE_CARDS.map((card, i) => (
            <div className="about-card" key={card.title} style={{ "--i": i }}>
              <div className="about-card-icon">{card.icon}</div>
              <div className="about-card-content">
                <h3 className="about-card-title">{card.title}</h3>
                <p className="about-card-text">{card.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {/* <div className="about-cta">
          <Link to="/about" className="about-cta-link">
            Learn more about MoiHub
            <span className="about-cta-arrow" aria-hidden="true">→</span>
          </Link>
        </div> */}

      </div>
    </section>
  );
}

export default About;