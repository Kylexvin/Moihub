import React from "react";
import { Helmet } from 'react-helmet-async';
import { FaEnvelope, FaMapMarkerAlt, FaClock, FaPhone, FaWhatsapp } from "react-icons/fa";
import "./Contact.css";

function Contact() {
  return (
    <>
      <Helmet>
        {/* Title */}
        <title>Contact Moihub - Get Support & Feedback</title>
        
        {/* Meta Description */}
        <meta name="description" content="Get in touch with Moihub support team. Questions, feedback, or partnership ideas — reach out and we'll get back to you within 24 hours." />
        
        {/* Open Graph */}
        <meta property="og:title" content="Contact Moihub - Get Support & Feedback" />
        <meta property="og:description" content="Questions, feedback, or partnership ideas — reach out to the Moihub team and we'll get back to you within 24 hours." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moihub-silk.vercel.app/contact" />
        <meta property="og:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Moihub - Get Support & Feedback" />
        <meta name="twitter:description" content="Questions, feedback, or partnership ideas — reach out to the Moihub team." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://moihub-silk.vercel.app/contact" />
      </Helmet>

      <div className="contact-page">
        {/* Hero */}
        <section className="contact-hero">
          <div className="contact-container">
            <span className="contact-eyebrow">Contact Us</span>
            <h1 className="contact-headline">We'd love to hear from you.</h1>
            <p className="contact-description">
              Questions, feedback, or partnership ideas — reach out and the
              MoiHub team will get back to you.
            </p>
          </div>
        </section>

        <section className="contact-section">
          <div className="contact-container contact-grid">
            {/* Info column */}
            <div className="contact-info">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <FaEnvelope />
                </div>
                <div>
                  <h4>Email</h4>
                  <p>info.moihub@gmail.com</p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <FaPhone />
                </div>
                <div>
                  <h4>Phone</h4>
                  <p>
                    <a href="tel:+254768610613" className="contact-link">
                      +254 768 610 613
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <FaWhatsapp />
                </div>
                <div>
                  <h4>WhatsApp</h4>
                  <p>
                    <a 
                      href="https://wa.me/254768610613" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="contact-link"
                    >
                      +254 768 610 613
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4>Location</h4>
                  <p>Moi University, Eldoret, Kenya</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <FaClock />
                </div>
                <div>
                  <h4>Response Time</h4>
                  <p>We typically reply within 24 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Contact;