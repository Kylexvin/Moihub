import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Camera, Calendar, Users, User, Mail, Phone } from 'lucide-react';
import "./evansmedia.css";

const services = [
  { icon: Camera, name: "Wedding Photography", description: "Capture your special day in stunning detail" },
  { icon: Calendar, name: "Event Photography", description: "Professional coverage for all types of events" },
  { icon: Users, name: "Corporate Photography", description: "Elevate your business image with professional shots" },
  { icon: User, name: "Portrait Sessions", description: "Bring out your best in our portrait sessions" }
];

const galleryImages = [
  { src: "https://via.placeholder.com/400x300", alt: "Wedding photo", category: "Wedding" },
  { src: "https://via.placeholder.com/400x300", alt: "Corporate event", category: "Event" },
  { src: "https://via.placeholder.com/400x300", alt: "Portrait", category: "Portrait" },
  { src: "https://via.placeholder.com/400x300", alt: "Product shot", category: "Corporate" },
  { src: "https://via.placeholder.com/400x300", alt: "Family portrait", category: "Portrait" },
  { src: "https://via.placeholder.com/400x300", alt: "Concert photo", category: "Event" }
];

const TestimonialCard = ({ name, text }) => (
  <div className="testimonial-card fade-in">
    <p>"{text}"</p>
    <h4>{name}</h4>
  </div>
);

const EvansMedia = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredImages, setFilteredImages] = useState(galleryImages);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredImages(galleryImages);
    } else {
      setFilteredImages(galleryImages.filter(img => img.category === activeCategory));
    }
  }, [activeCategory]);

  useEffect(() => {
    const fadeElems = document.querySelectorAll('.fade-in');
    
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    fadeElems.forEach(elem => appearOnScroll.observe(elem));

    return () => {
      fadeElems.forEach(elem => appearOnScroll.unobserve(elem));
    };
  }, []);

  return (
    <div className="evans-media-page">
      <Helmet>
        <title>Evans Media - Professional Photography Services</title>
        <meta name="description" content="Evans Media provides top-notch professional photography services for weddings, events, corporate needs, and portraits." />
      </Helmet>

      <header className="evans-media-header">
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <section id="home" className="hero-section">
        <h1>Welcome to Evans Media</h1>
        <p>Capturing life's precious moments with artistry and precision</p>
        <a href="#contact" className="cta-button">Book a Session</a>
      </section>

      <section id="services" className="services-section">
        <h2>Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card fade-in">
              <service.icon size={48} />
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" className="gallery-section">
        <h2>Our Portfolio</h2>
        <div className="gallery-filter">
          {['All', 'Wedding', 'Event', 'Corporate', 'Portrait'].map(category => (
            <button 
              key={category} 
              className={activeCategory === category ? 'active' : ''}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="gallery-grid">
          {filteredImages.map((img, index) => (
            <img key={index} src={img.src} alt={img.alt} className="fade-in" />
          ))}
        </div>
      </section>

      <section id="about" className="about-section">
        <h2>About Evans Media</h2>
        <p>With over a decade of experience, Evans Media has been at the forefront of capturing life's most precious moments. Our team of skilled photographers combines technical expertise with an artistic eye to deliver stunning visuals that tell your unique story.</p>
      </section>

      <section id="testimonials" className="testimonials-section">
        <h2>What Our Clients Say</h2>
        <div className="testimonials-grid">
          <TestimonialCard name="Sarah J." text="Evans Media captured our wedding day beautifully. The photos are beyond our expectations!" />
          <TestimonialCard name="John D." text="Professional, creative, and a joy to work with. Highly recommend for any corporate event." />
          <TestimonialCard name="Emma T." text="The portrait session was so much fun, and the results are amazing. Thank you, Evans Media!" />
        </div>
      </section>

      <section id="contact" className="contact-section">
        <h2>Get in Touch</h2>
        <div className="contact-info">
          <p><Phone size={16} /> <a href="tel:0741845272">0741845272</a></p>
          <p><Mail size={16} /> info@evansmedia.com</p>
        </div>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>

      <footer className="evans-media-footer">
        <div className="social-links">
          <a href="#"><Instagram size={24} /></a>
          <a href="#"><Facebook size={24} /></a>
          <a href="#"><Twitter size={24} /></a>
        </div>
        <p>&copy; 2024 Evans Media. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default EvansMedia;
