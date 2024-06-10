import React, { useState, useEffect } from 'react';
import './home.css';
import HeroSection from './HeroSection';

const Home = () => {
  const [cardVisibility, setCardVisibility] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const cards = document.querySelectorAll('.service-card');

      cards.forEach(card => {
        const cardId = card.getAttribute('data-card-id');
        const cardTop = card.getBoundingClientRect().top;
        const cardBottom = card.getBoundingClientRect().bottom;

        if (cardTop < windowHeight && cardBottom >= 0) {
          setCardVisibility(prevState => ({ ...prevState, [cardId]: true }));
        } else {
          setCardVisibility(prevState => ({ ...prevState, [cardId]: false }));
        }
      });
    };

    // Trigger handleScroll once initially
    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>


    <svg id="unique-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(180)">
    <path fill="#27a844" fillOpacity="1" d="M0,0L24,32C48,64,96,128,144,149.3C192,171,240,149,288,138.7C336,128,384,128,432,144C480,160,528,192,576,213.3C624,235,672,245,720,229.3C768,213,816,171,864,144C912,117,960,107,1008,112C1056,117,1104,139,1152,144C1200,149,1248,139,1296,112C1344,85,1392,43,1416,21.3L1440,0L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z" />
</svg>
      <HeroSection />
      <div className="ministrip-card">
      <div className="emergency-number left">
        <p> <i className="fas fa-ambulance"></i> Medical:0710761679</p>
      </div>
      <div className="emergency-number right">
        <p><i className="fas fa-shield-alt"></i>
        Security:0720253976</p>
      </div>
    </div>

      <section className="body-cards">
        <div className={`service-card ${cardVisibility['rent-space'] ? 'show' : ''}`} data-card-id="rent-space">
  <div className="neumorphic-v2">
    <h3 className="neumorphic">Rent Your Space<br /><i className="fas fa-home"></i></h3>
    <p className="neumorphic">Discover the perfect space for your stay. Browse through a variety of rental houses, check prices, locations, and other details—all from the comfort of your device.</p>
    <a href="/book"><div className="neumorphic"> <button className="button-b">Explore Rentals <i className="fas fa-key"></i></button></div></a>
  </div>
</div>

<div className={`service-card ${cardVisibility['e-chem'] ? 'show' : ''}`} data-card-id="e-chem">
  <div className="neumorphic-v2">
    <h3 className="neumorphic">E-Chem<br /><i className="fas fa-stethoscope"></i></h3>
    <p className="neumorphic">Discover our diverse selection of pharmaceutical items and easily buy them through our user-friendly online platform, simplifying your shopping experience.
</p>
    <div className="neumorphic"><a href='/pharmacy'><button className="button-b">Shop Now <i className="fas fa-medkit"></i></button></a></div>
  </div>
</div>

<div className={`service-card ${cardVisibility['food'] ? 'show' : ''}`} data-card-id="food">
  <div className="neumorphic-v2">
    <h3 className="neumorphic">MoiDelish<br /> <i className="fas fa-utensils"></i></h3>
    <p className="neumorphic">MoiDelish allows you to order food. The deliveries are done around Moi university. Browse for different foods offered by available providers. We are assuring you a best service.</p>
    <div className="neumorphic"><a href='/food-delivery'><button className="button-b">Order Now <i className="fas fa-motorcycle"></i></button></a></div>
  </div>
</div>

<div className={`service-card ${cardVisibility['emergency-assistance'] ? 'show' : ''}`} data-card-id="emergency-assistance">
  <div className="neumorphic-v2">
    <h3 className="neumorphic">Discover Services<br /><i className="fas fa-search"></i></h3>
    <p className="neumorphic">Discover outstanding local services near Moi University with our guide. Support these businesses to foster community growth and prosperity.</p>
    <a href="/discover"><div className="neumorphic"> <button className="button-b">Explore Now <i className="fas fa-arrow-right"></i></button></div></a>
  </div>
</div>

<div className={`service-card ${cardVisibility['e-shop'] ? 'show' : ''}`} data-card-id="e-shop">
  <div className="neumorphic-v2">
    <h3 className="neumorphic">E-shop<br /><i className="fas fa-shopping-cart"></i></h3>
    <p className="neumorphic">Browse a wide range of products from the comfort of your own home. Enjoy hassle-free online shopping with our collection of products.Shop now.</p>
    <a href="/eshop"><div className="neumorphic"> <button className="button-b">Start Shopping <i className="fas fa-store"></i></button></div></a>
  </div>
</div>

<div className={`service-card ${cardVisibility['second-hand-market'] ? 'show' : ''}`} data-card-id="second-hand-market">
  <div className="neumorphic-v2">
    <h3 className="neumorphic">Second-hand Market<br /><i className="fas fa-shopping-bag"></i></h3>
    <p className="neumorphic">Explore a variety of gently used items. From home items to beddings, find great deals on second-hand products right from your screen.</p>
    <a href="/marketplace"><div className="neumorphic"> <button className="button-b">Explore Now <i className="fas fa-tags"></i></button></div></a>
  </div>
</div>

<div className={`service-card ${cardVisibility['find-roommate'] ? 'show' : ''}`} data-card-id="find-roommate">
  <div className="neumorphic-v2">
    <h3 className="neumorphic">Roommate Finder<br /><i className="fas fa-users"></i></h3>
    <p className="neumorphic">Discover compatible roommates for your living space. Browse through profiles, preferences, and connect with potential roommates hassle-free.</p>
    <a href="/find-roommate"><div className="neumorphic"> <button className="button-b">Explore Roommates <i className="fas fa-search"></i></button></div></a>
  </div>
</div>

<div className={`service-card ${cardVisibility['blog-news'] ? 'show' : ''}`} data-card-id="blog-news">
  <div className="neumorphic-v2">
    <h3 className="neumorphic">Blog Post and News<br /><i className="fas fa-newspaper"></i></h3>
    <p className="neumorphic">Stay informed and entertained! Read our latest blog posts and news articles covering a wide range of topics.Business ideas included.</p>
    <div className="neumorphic"><a href='/blog'><button className="button-b">Read Now <i className="fas fa-book-open"></i></button></a></div>
  </div>
</div>




        {/* Other cards go here */}
      </section>
      <section className="bodyy">
  <div className="container-fix">
    <div className="card-vinny">
      <div className="card-profile">
        <div className="image-container-profile">
          <img src="MoiHub.png" alt="Booking an Apartment at MoiHub" />
        </div>
      </div>
    </div>
  </div>
</section>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
     <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
   </svg>


    </>
  );
};

export default Home;