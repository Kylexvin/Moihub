// src/pages/Features/Features.jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Utensils, 
  Package, 
  Home, 
  Wrench, 
  Bot, 
  Users, 
  Heart,
  ArrowRight
} from 'lucide-react';
import './Features.css';

function Features() {
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: ShoppingBag,
      title: 'Marketplace',
      desc: 'Buy and sell new or pre-owned items within your campus community.'
    },
    {
      icon: Utensils,
      title: 'Food Delivery',
      desc: 'Order meals from nearby food vendors and enjoy convenient delivery.'
    },
    {
      icon: Package,
      title: 'E-Shop',
      desc: 'Shop from trusted campus businesses offering everyday essentials.'
    },
    {
      icon: Home,
      title: 'Rentals',
      desc: 'Discover hostels, bedsitters, apartments, and available rooms near campus.'
    },
    {
      icon: Wrench,
      title: 'Local Services',
      desc: 'Connect with trusted technicians, tutors, salons, photographers, and more.'
    },
    {
      icon: Bot,
      title: 'MoiHub AI',
      desc: 'Get personalized assistance through an intelligent campus assistant.'
    },
    {
      icon: Users,
      title: 'Roommate Finder',
      desc: 'Meet compatible roommates and find shared accommodation with ease.'
    },
    {
      icon: Heart,
      title: 'LinkMe',
      desc: 'Stay connected with your peers and find meaningful relationships.'
    }
  ];

  return (
    <section className="features-page" id="features">
      <div className="features-container">

        {/* HEADER */}
        <div className="features-header" ref={el => sectionRefs.current[0] = el}>
          <span className="tag-badge">Features</span>
          <h1 className="features-title">
            Everything You Need,<br />
            <span className="features-highlight">All in One Place</span>
          </h1>
          <p className="features-description">
            Explore the tools and services that make everyday campus life simpler,
            faster, and more connected.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="section-divider"></div>

        {/* FEATURES GRID */}
        <div className="features-grid" ref={el => sectionRefs.current[1] = el}>
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="icon-frame">
                <feature.icon size={28} strokeWidth={2} />
              </div>
              <div className="feature-card-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-text">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* DIVIDER */}
        <div className="section-divider"></div>

        {/* CTA */}
        <div className="features-cta" ref={el => sectionRefs.current[2] = el}>
          <Link to="/features" className="btn-primary">
            Explore All Features
            <ArrowRight size={20} />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default Features;