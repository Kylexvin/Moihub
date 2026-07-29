// src/pages/Features/Features.jsx
import React from "react";
import { Helmet } from 'react-helmet-async';
import {
  Utensils,
  Home,
  ShoppingBag,
  Store,
  Pill,
  GraduationCap,
  Users,
  ShoppingCart,
  Bus,
  Wrench,
  Ambulance,
  Wifi,
  Heart,
  Newspaper,
  Bot,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import "./Features.css";

function Features() {
  const features = [
    {
      icon: Utensils,
      title: "Food Delivery",
      desc: "Browse menus from nearby vendors and order meals without leaving campus.",
      tags: ["Live menus", "Order tracking", "Local vendors"],
    },
    {
      icon: Home,
      title: "Rental Booking",
      desc: "Find hostels, bedsitters, and apartments with photos, pricing, and direct landlord contact.",
      tags: ["Photos", "Pricing", "Landlord contact"],
    },
    {
      icon: ShoppingBag,
      title: "E-Shop",
      desc: "Shop from boutiques, electronics, fashion, and groceries — all from verified campus businesses.",
      tags: ["Boutique", "Electronics", "Fashion", "Groceries"],
    },
    {
      icon: Store,
      title: "Second-hand Market",
      desc: "Buy and sell pre-owned items within your campus community — list, search, and connect securely.",
      tags: ["Listings", "Categories", "Secure chat"],
    },
    {
      icon: Pill,
      title: "Chemist / Pharmacy",
      desc: "Order medications and health products from trusted campus pharmacies with quick delivery.",
      tags: ["Prescriptions", "Health products", "Quick delivery"],
    },
    {
      icon: GraduationCap,
      title: "My University",
      desc: "Quick links for daily school ops, student portal, clubs, and organizations — everything in one place.",
      tags: ["Portal", "Clubs", "Organizations", "Quick links"],
    },
    {
      icon: Users,
      title: "Roommate Finder",
      desc: "Browse verified profiles and connect with students looking to share accommodation.",
      tags: ["Profiles", "Compatibility", "Direct connect"],
    },
    {
      icon: ShoppingCart,
      title: "Groceries",
      desc: "Order groceries from campus stores and get them delivered to your doorstep.",
      tags: ["Fresh produce", "Campus stores", "Delivery"],
    },
    {
      icon: Bus,
      title: "Transport Hub",
      desc: "Book rides, find tuktuks, boda bodas, and coordinate campus transport — safe and reliable.",
      tags: ["Tuktuk", "Boda boda", "Campus transport", "Ride booking"],
    },
    {
      icon: Wrench,
      title: "Local Services",
      desc: "Find trusted mama fua, repair services, tutors, barbers, photographers, and more near you.",
      tags: ["Mama fua", "Repairs", "Tutors", "Trusted pros"],
    },
    {
      icon: Ambulance,
      title: "Emergency Services",
      desc: "Quick access to campus security, fire services, ambulance, and emergency contacts when you need them most.",
      tags: ["Security", "Ambulance", "Fire", "Emergency contacts"],
    },
    {
      icon: MessageCircle,
      title: "In-App Messaging",
      desc: "Chat directly with vendors, landlords, service providers, and other students — all within the app, no phone numbers needed.",
      tags: ["Direct chat", "Secure", "Real-time", "No phone number"],
    },
    {
      icon: Wifi,
      title: "Bingwa Sokoni",
      desc: "Buy data bundles and airtime directly — trusted and scam-free, recommended by MoiHub.",
      tags: ["Data bundles", "Airtime", "Trusted"],
    },
    {
      icon: Heart,
      title: "LinkMe",
      desc: "Connect with people, make friends, and find meaningful relationships within the campus community.",
      tags: ["Connect", "Friends", "Dating"],
    },
    {
      icon: Newspaper,
      title: "Blog & Events",
      desc: "Stay updated with weekend events, campus news, and student stories.",
      tags: ["Weekend events", "Campus news", "Student stories"],
    },
    {
      icon: Bot,
      title: "MoiHub AI",
      desc: "Ask naturally and discover services, products, or information in seconds — e.g. 'find a barber near Stage.'",
      tags: ["Smart search", "Natural language", "Instant results"],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Features - Moihub | Rentals, Food, Shopping & Campus Services</title>
        <meta name="description" content="Explore all Moihub features: rental booking, roommate finder, food delivery, e-shop, pharmacy, transport, AI search, and more for Moi University students." />
        
        {/* Open Graph */}
        <meta property="og:title" content="Explore Moihub Features - Rentals, Food, Shopping & Campus Services" />
        <meta property="og:description" content="Find rentals, order food, shop, and more with Moihub's powerful features for Moi University students." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moihub-silk.vercel.app/features" />
        <meta property="og:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Explore Moihub Features - Rentals, Food & Campus Services" />
        <meta name="twitter:description" content="Find rentals, order food, shop, and more with Moihub's powerful features." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://moihub-silk.vercel.app/features" />
      </Helmet>

      <div className="moihub-features-page">
        {/* HERO */}
        <section className="moihub-features-hero">
          <div className="moihub-features-container">
            <span className="moihub-features-badge">Features</span>
            <h1 className="moihub-features-headline">
              Everything campus life needs, <br />
              <span className="moihub-features-highlight">in one app.</span>
            </h1>
            <p className="moihub-features-description">
              MoiHub connects students, vendors, and service providers through a
              single platform — built around how campus life actually works.
            </p>
            <div className="moihub-features-actions">
              <a href="#features" className="moihub-features-btn-primary">
                Explore Features
                <ArrowRight size={18} />
              </a>
              <a href="/about" className="moihub-features-btn-secondary">
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="moihub-features-section" id="features">
          <div className="moihub-features-container">
            <div className="moihub-features-grid">
              {features.map((feature, index) => (
                <div className="moihub-features-card" key={index}>
                  <div className="moihub-features-card-header">
                    <div className="moihub-features-card-icon">
                      <feature.icon size={24} strokeWidth={2} />
                    </div>
                    <h3 className="moihub-features-card-title">{feature.title}</h3>
                  </div>
                  <p className="moihub-features-card-desc">{feature.desc}</p>
                  <div className="moihub-features-card-tags">
                    {feature.tags.map((tag) => (
                      <span className="moihub-features-tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Features;