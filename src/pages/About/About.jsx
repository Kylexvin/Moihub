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

  const stats = [
    { value: "1", label: "University & Growing" },
    { value: "5+", label: "Core Services" },
    { value: "24/7", label: "Always On" },
  ];

  const features = [
    { tag: "01", title: "Marketplace", desc: "Buy and sell products within your campus community." },
    { tag: "02", title: "Food Delivery", desc: "Order meals from nearby food vendors." },
    { tag: "03", title: "Rentals", desc: "Find accommodation close to campus." },
    { tag: "04", title: "Local Services", desc: "Connect with trusted professionals." },
    { tag: "05", title: "MoiHub AI", desc: "Discover information and services through intelligent search." },
    { tag: "06", title: "Student Opportunities", desc: "Stay informed about events, announcements, and opportunities." },
  ];

  const serveGroups = [
    { title: "Students", desc: "Access everything you need for everyday campus life." },
    { title: "Vendors", desc: "Reach more customers and grow your business." },
    { title: "Service Providers", desc: "Showcase your skills and connect with potential clients." },
    { title: "Campus Communities", desc: "Build stronger connections through one shared platform." },
  ];

  const whyUs = [
    { title: "One Platform", desc: "No need to switch between multiple apps." },
    { title: "Community Focused", desc: "Designed around the needs of campus communities." },
    { title: "Secure", desc: "Built with user privacy and security in mind." },
    { title: "Continuously Improving", desc: "New features and improvements are regularly introduced." },
  ];

  // Team Members — matches /api/admin/team response shape
  const teamMembers = [
    {
      id: 1,
      name: "Kylex",
      role: "Founder & CEO",
      bio: "Passionate about connecting students and building campus communities.",
      image: "https://res.cloudinary.com/dlyfxympd/image/upload/v1784579030/team/xxtyo7j5f0mfaus0ijwx.jpg",
      initials: "K",
      social: {
        github: "https://github.com/kylexvin",
        whatsapp: "https://wa.me/254745276898",
        instagram: "https://instagram.com/kylex_vin",
        linkedin: null,
      },
    },
    {
      id: 2,
      name: "Sejjo",
      role: "Co-Founder",
      bio: "Building the technical foundation of MoiHub.",
      image: "https://res.cloudinary.com/dlyfxympd/image/upload/v1784581060/team/yju8gomwwf0iaylgk6uz.jpg",
      initials: "S",
      social: {
        github: "https://github.com/jo-oseeph",
        whatsapp: "https://wa.me/254792378380",
        instagram: "https://www.instagram.com/sejjo_codes",
        linkedin: null,
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Moihub - Campus Platform for Moi University</title>
        <meta name="description" content="Learn about Moihub - the platform connecting Moi University students with rentals, food delivery, shopping, and essential campus services. Built to simplify campus life." />
        <meta property="og:title" content="About Moihub - Campus Platform for Moi University" />
        <meta property="og:description" content="Learn about Moihub - connecting Moi University students with rentals, food, shopping, and campus services. Built to simplify campus life." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moihub-silk.vercel.app/about" />
        <meta property="og:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Moihub - Campus Platform for Moi University" />
        <meta name="twitter:description" content="Learn about Moihub - connecting Moi University students with rentals, food, shopping, and campus services." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
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

            <div className="about-stats-row">
              {stats.map((s, i) => (
                <div className="about-stat" key={i}>
                  <span className="about-stat-value">{s.value}</span>
                  <span className="about-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="about-hero-photos">
              <div className="pinned-photo pinned-photo-sm tilt-l tape">
                <img src={require("../../assets/images/herobg.jpg")} alt="Student using MoiHub" />
              </div>
              <div className="pinned-photo pinned-photo-sm tilt-r pin">
                <img src={require("../../assets/images/herobg.jpg")} alt="Campus life" />
              </div>
            </div>
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
              <div className="pinned-photo pinned-photo-md tilt-sm-r tape-right about-story-photo">
                <img src={require("../../assets/images/herobg.jpg")} alt="Moi University campus" />
              </div>
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
            <div className="about-card about-card-tilt-left">
              <span className="about-label">Our Mission</span>
              <h3 className="about-subheading">Making campus life more connected.</h3>
              <p>
                Our mission is to simplify daily life by giving students and
                businesses a single platform where they can discover
                opportunities, access services, and support one another.
              </p>
            </div>
            <div className="about-card about-card-tilt-right">
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
            <div className="about-section-header about-center">
              <span className="about-label">Features</span>
              <h2 className="about-heading">What You Can Do</h2>
            </div>
            <div className="about-feature-grid">
              {features.map((f) => (
                <div className="about-feature-card" key={f.tag}>
                  <span className="about-card-tag">{f.tag}</span>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="about-center" style={{ marginTop: '2.5rem' }}>
              <div className="pinned-photo pinned-photo-md tilt-l pin">
                <img src={require("../../assets/images/herobg.jpg")} alt="Vendor on MoiHub" />
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="about-section about-section-alt">
          <div className="about-container">
            <div className="about-section-header about-center">
              <span className="about-label">Community</span>
              <h2 className="about-heading">Who We Serve</h2>
              <div className="pinned-photo pinned-photo-lg tilt-sm-l tape" style={{ margin: '2rem auto 0' }}>
                <img src={require("../../assets/images/herobg.jpg")} alt="Students and vendors together" />
              </div>
            </div>
            <div className="about-serve-grid">
              {serveGroups.map((g, i) => (
                <div className="about-serve-card" key={i}>
                  <h4>{g.title}</h4>
                  <p>{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why MoiHub */}
        <section className="about-section">
          <div className="about-container">
            <div className="about-section-header about-center">
              <span className="about-label">Why Us</span>
              <h2 className="about-heading">Why MoiHub?</h2>
            </div>
            <div className="about-why-grid">
              {whyUs.map((w, i) => (
                <div className="about-why-card" key={i}>
                  <h4>{w.title}</h4>
                  <p>{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="about-section about-section-alt">
          <div className="about-container">
            <div className="about-team-header about-center">
              <span className="about-label">The Team</span>
              <h2 className="about-heading">Building MoiHub</h2>
              <p className="about-team-subtitle">
                A small team dedicated to simplifying campus life across Kenya.
              </p>
            </div>

            <div className="about-team-grid">
              {teamMembers.map((member) => (
                <div className="about-team-card" key={member.id}>
                  <div className="about-team-avatar">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="about-team-image"
                      />
                    ) : (
                      <div className="about-team-initials">{member.initials}</div>
                    )}
                  </div>
                  <h4 className="about-team-name">{member.name}</h4>
                  <p className="about-team-role">{member.role}</p>
                  <p className="about-team-bio">{member.bio}</p>
                  <div className="about-team-social">
                    {member.social.github && (
                      <a
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="about-team-social-link"
                        aria-label={`${member.name}'s GitHub`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                      </a>
                    )}
                    {member.social.whatsapp && (
                      <a
                        href={member.social.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="about-team-social-link"
                        aria-label={`${member.name}'s WhatsApp`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                        </svg>
                      </a>
                    )}
                    {member.social.instagram && (
                      <a
                        href={member.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="about-team-social-link"
                        aria-label={`${member.name}'s Instagram`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                        </svg>
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="about-team-social-link"
                        aria-label={`${member.name}'s LinkedIn`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                          <rect x="2" y="9" width="4" height="12"/>
                          <circle cx="4" cy="4" r="2"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Built for Campus Communities */}
        <section className="about-section">
          <div
            className="about-container about-narrow"
            style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}
          >
            <div className="pinned-photo pinned-photo-md tilt-r pin">
              <img src={require("../../assets/images/herobg.jpg")} alt="Campus building" />
            </div>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <h2 className="about-heading">Built for Campus Communities</h2>
              <p>
                MoiHub was first developed with the needs of the Moi University
                community in mind. The platform continues to evolve while
                remaining focused on solving everyday challenges experienced by
                students, vendors, and local businesses around campus.
              </p>
            </div>
          </div>
        </section>

        {/* Closing photo */}
        <section className="about-section about-section-alt">
          <div className="about-container about-center">
            <div className="pinned-photo pinned-photo-lg tilt-sm-r tape" style={{ margin: '0 auto' }}>
              <img src={require("../../assets/images/herobg.jpg")} alt="Happy MoiHub user" />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="about-section">
          <div className="about-container about-narrow">
            <div className="about-section-header about-center">
              <span className="about-label">FAQ</span>
              <h2 className="about-heading">Frequently Asked Questions</h2>
            </div>
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