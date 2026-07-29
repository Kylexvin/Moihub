import React from "react";
import { Helmet } from 'react-helmet-async';
import Hero from "../../components/sections/Hero/Hero";
//import Stats from "../../components/sections/Statistics/Stats";
import About from "../../components/sections/About/About";
import Features from "../../components/sections/Features/Features";
import HowItWorks from "../../components/sections/HowItWorks/HowItWorks";
import Screenshots from "../../components/sections/Screenshots/Screenshots";
import Testimonials from "../../components/sections/Testimonials/Testimonials";
import FAQ from "../../components/sections/FAQ/FAQ";

function Home() {
  return (
    <>
      <Helmet>
        {/* Title */}
        <title>Moihub - Find Rentals, Food & Campus Services</title>
        
        {/* Meta Description */}
        <meta name="description" content="Discover the best rentals, food delivery, and shopping services at Moi University. Your all-in-one campus platform for students and locals." />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Moihub - Everything You Need at Moi University" />
        <meta property="og:description" content="Find rentals, order food, shop, and more — all in one place. Explore Moihub today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moihub-silk.vercel.app/" />
        <meta property="og:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Moihub - Everything You Need at Moi University" />
        <meta name="twitter:description" content="Find rentals, order food, shop, and more — all in one place." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://moihub-silk.vercel.app/" />
      </Helmet>
      
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <Screenshots />
      <Testimonials />
      <FAQ />
    </>
  );
}

export default Home;