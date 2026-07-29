import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./FAQ.css";

const FAQS = [
  {
    question: "What is MoiHub?",
    answer: "MoiHub is a campus platform that brings together shopping, food ordering, rentals, local services, student opportunities, and more in one mobile app.",
  },
  {
    question: "Is MoiHub free to use?",
    answer: "Yes. Creating an account and accessing most features is free. Some vendor services or premium features may require a subscription.",
  },
  {
    question: "Who can use MoiHub?",
    answer: "MoiHub is designed for students, vendors, landlords, service providers, and anyone looking to connect with the campus community.",
  },
  {
    question: "How do I become a vendor?",
    answer: "Simply register as a vendor through the website or mobile app, submit the required information, and complete the verification process.",
  },
  {
    question: "Which devices are supported?",
    answer: "MoiHub is currently available for Android devices, with support for additional platforms planned for the future.",
  },
  {
    question: "Is my information secure?",
    answer: "Yes. We take user privacy seriously and implement security measures to protect your personal information and account.",
  },
  {
    question: "Can I advertise my business on MoiHub?",
    answer: "Yes. Businesses and service providers can join MoiHub to reach more students and grow their customer base.",
  },
  {
    question: "How can I contact support?",
    answer: "You can reach our support team through the Contact page or directly within the MoiHub app.",
  },
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq" id="faq">
      <div className="faq-container">

        {/* HEADER */}
        <div className="faq-header">
          <span className="faq-badge">Need to know</span>
          <h2 className="faq-title">
            Frequently asked <span className="faq-highlight">questions</span>
          </h2>
          <p className="faq-description">
            Have questions? Here are answers to some of the most common ones about MoiHub.
          </p>
        </div>

        {/* FAQ ACCORDION */}
        <div className="faq-list">
          {FAQS.map((faq, index) => (
            <div
              key={faq.question}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
              >
                <span className="faq-question-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="faq-question-text">{faq.question}</span>
                <span className="faq-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="faq-cta">
          <p className="faq-cta-text">Still have questions?</p>
          <p className="faq-cta-sub">We're here to help.</p>
          <Link to="/contact" className="faq-cta-link">
            Contact us <span className="faq-cta-arrow" aria-hidden="true">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default FAQ;