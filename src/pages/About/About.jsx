import React from "react";
import { Helmet } from 'react-helmet-async';
import "./About.css";

function About() {
  const faqs = [
    {
      q: "Is MoiHub the official Moi University app?",
      a: "No. MoiHub is an independent platform built to serve the Moi University community and campus communities across Kenya. It is not affiliated with or operated by Moi University.",
    },
    {
      q: "Who can use MoiHub?",
      a: "Students, vendors, landlords, and local service providers within campus communities can all use MoiHub to buy, sell, rent, and connect.",
    },
    {
      q: "Is MoiHub free to download?",
      a: "Yes, MoiHub is free to download and use. Some transactions between users may involve their own agreed pricing.",
    },
    {
      q: "Which campus communities does MoiHub support?",
      a: "MoiHub started with the Moi University community and continues to expand to serve more campus communities across Kenya.",
    },
  ];

  return (
    <>
      <Helmet>
        {/* Title */}
        <title>About Moihub - Campus Platform for Moi University</title>
        
        {/* Meta Description */}
        <meta name="description" content="Learn about Moihub - the platform connecting Moi University students with rentals, food delivery, shopping, and essential campus services. Built to simplify campus life." />
        
        {/* Open Graph */}
        <meta property="og:title" content="About Moihub - Campus Platform for Moi University" />
        <meta property="og:description" content="Learn about Moihub - connecting Moi University students with rentals, food, shopping, and campus services. Built to simplify campus life." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moihub-silk.vercel.app/about" />
        <meta property="og:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Moihub - Campus Platform for Moi University" />
        <meta name="twitter:description" content="Learn about Moihub - connecting Moi University students with rentals, food, shopping, and campus services." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://moihub-silk.vercel.app/about" />
      </Helmet>

      <div className="about-page">
        {/* Hero */}
        <section className="about-hero">
          <div className="about-container">
            <span className="about-eyebrow">About MoiHub</span>
            <h1 className="about-headline">Built to simplify campus life.</h1>
            <p className="about-description">
              MoiHub is an all-in-one campus platform that connects students,
              vendors, landlords, and local service providers through a single
              mobile experience. From shopping and food ordering to rentals and
              campus opportunities, MoiHub helps make everyday student life
              more convenient.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="about-section">
          <div className="about-container about-grid-2">
            <div>
              <span className="about-label">Our Story</span>
              <h2 className="about-heading">From an idea to a growing platform</h2>
            </div>
            <div className="about-body">
              <p>
                Every campus has countless opportunities, businesses, services,
                and communities — but they're often scattered across social
                media, messaging apps, notice boards, and word of mouth.
              </p>
              <p>
                MoiHub was created to bring these everyday needs together into
                one platform. Instead of switching between multiple apps to buy
                and sell products, order food, find accommodation, or discover
                local services, students can access everything from one place.
              </p>
              <p>
                What began as an idea has continued to evolve into a platform
                focused on improving how campus communities connect, trade, and
                grow.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="about-section about-section-alt">
          <div className="about-container about-grid-2">
            <div className="about-card">
              <span className="about-label">Our Mission</span>
              <h3 className="about-subheading">Making campus life more connected.</h3>
              <p>
                Our mission is to simplify daily life by giving students and
                businesses a single platform where they can discover
                opportunities, access services, and support one another.
              </p>
            </div>
            <div className="about-card">
              <span className="about-label">Our Vision</span>
              <h3 className="about-subheading">Building the future of campus communities.</h3>
              <p>
                We envision a future where every campus has a digital ecosystem
                that supports learning, entrepreneurship, and community through
                technology.
              </p>
            </div>
          </div>
        </section>

        {/* What You Can Do */}
        <section className="about-section">
          <div className="about-container">
            <h2 className="about-heading about-center">What You Can Do</h2>
            <div className="about-feature-grid">
              <div className="about-feature-card">
                <h4>Marketplace</h4>
                <p>Buy and sell products within your campus community.</p>
              </div>
              <div className="about-feature-card">
                <h4>Food Delivery</h4>
                <p>Order meals from nearby food vendors.</p>
              </div>
              <div className="about-feature-card">
                <h4>Rentals</h4>
                <p>Find accommodation close to campus.</p>
              </div>
              <div className="about-feature-card">
                <h4>Local Services</h4>
                <p>Connect with trusted professionals.</p>
              </div>
              <div className="about-feature-card">
                <h4>MoiHub AI</h4>
                <p>Discover information and services through intelligent search.</p>
              </div>
              <div className="about-feature-card">
                <h4>Student Opportunities</h4>
                <p>Stay informed about events, announcements, and opportunities.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="about-section about-section-alt">
          <div className="about-container">
            <h2 className="about-heading about-center">Who We Serve</h2>
            <div className="about-serve-grid">
              <div className="about-serve-card">
                <h4>Students</h4>
                <p>Access everything you need for everyday campus life.</p>
              </div>
              <div className="about-serve-card">
                <h4>Vendors</h4>
                <p>Reach more customers and grow your business.</p>
              </div>
              <div className="about-serve-card">
                <h4>Service Providers</h4>
                <p>Showcase your skills and connect with potential clients.</p>
              </div>
              <div className="about-serve-card">
                <h4>Campus Communities</h4>
                <p>Build stronger connections through one shared platform.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why MoiHub */}
        <section className="about-section">
          <div className="about-container">
            <h2 className="about-heading about-center">Why MoiHub?</h2>
            <div className="about-why-grid">
              <div className="about-why-card">
                <h4>One Platform</h4>
                <p>No need to switch between multiple apps.</p>
              </div>
              <div className="about-why-card">
                <h4>Community Focused</h4>
                <p>Designed around the needs of campus communities.</p>
              </div>
              <div className="about-why-card">
                <h4>Secure</h4>
                <p>Built with user privacy and security in mind.</p>
              </div>
              <div className="about-why-card">
                <h4>Continuously Improving</h4>
                <p>New features and improvements are regularly introduced.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Built for Campus Communities */}
        <section className="about-section about-section-alt">
          <div className="about-container about-narrow">
            <h2 className="about-heading">Built for Campus Communities</h2>
            <p>
              MoiHub was first developed with the needs of the Moi University
              community in mind. The platform continues to evolve while
              remaining focused on solving everyday challenges experienced by
              students, vendors, and local businesses around campus.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="about-section">
          <div className="about-container about-narrow">
            <h2 className="about-heading about-center">Frequently Asked Questions</h2>
            <div className="about-faq-list">
              {faqs.map((item, idx) => (
                <details className="about-faq-item" key={idx}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <div className="about-container about-center">
            <h2 className="about-heading">Ready to experience MoiHub?</h2>
            <p>Download the app today and discover a smarter way to navigate campus life.</p>
            
            <a href="https://play.google.com/store/apps/details?id=com.kylexvin.moihub"
              target="_blank"
              rel="noopener noreferrer"
              className="about-cta-button"
            >
              Download App
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

export default About;