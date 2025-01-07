import React from 'react';
import { Link } from 'react-router-dom';
import './Homecards.css';


const HomeCards = () => {
  return (
    <div>
   <div className="discover-banner">
  <div className="discover-content">
    <div className="discover-info">
      <div className="discover-icon">
        <img src="images/eshop.jpg" alt="Discover Icon" />
      </div>
      <div className="discover-text">
        <h3 className="discover-title">Discover Services</h3>
        <p className="discover-subtitle">Find the best around Moi University</p>
      </div>
    </div>
    <Link to="/discover" className="chevron-right">
      <svg viewBox="0 0 24 24">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </Link>
  </div>
</div>

      <div className="service-card">
      <div className="service-grid">
  {/* Rental Booking */}
  <Link to="/book" className="service-itemm">
    <div className="service-icon">
      <img src="images/rental.png" alt="Rental Booking Logo" />
    </div>
    <div className="service-namee">Rental Booking</div>
  </Link>

  {/* My University */}
  <Link to="/myschool" className="service-itemm">
    <div className="service-icon">
      <img src="images/moi.png" alt="My University Logo" />
    </div>
    <div className="service-namee">My University</div>
  </Link>

  {/* Food Delivery */}
  <Link to="/food-delivery" className="service-itemm">
    <div className="service-icon">
      <img src="images/foodlogo.png" alt="Food Delivery Logo" />
    </div>
    <div className="service-namee">Food Delivery</div>
  </Link>

  {/* Pharmacy (E-Chem) */}
  <Link to="/pharmacy" className="service-itemm">
    <div className="service-icon">
      <img src="images/pharmacy.png" alt="Pharmacy Logo" />
    </div>
    <div className="service-namee">Chemist</div>
  </Link>

  {/* E-Shop */}
  <Link to="/eshop" className="service-itemm">
    <div className="service-icon">
      <img src="images/eshop.png" alt="E-shop Logo" />
    </div>
    <div className="service-namee">E-Shop</div>
  </Link>

  {/* Groceries */}
  <Link to="/greenhub" className="service-itemm">
    <div className="service-icon">
      <img src="images/groceries.png" alt="Groceries Logo" />
    </div>
    <div className="service-namee">Groceries</div>
  </Link>

  {/* Second-hand Market */}
  <Link to="/markethub" className="service-itemm">
    <div className="service-icon">
      <img src="images/secondhand.png" alt="Second-hand Market Logo" />
    </div>
    <div className="service-namee">Second-hand</div>
  </Link>

  {/* Roommate Finder */}
  <Link to="/find-roommate" className="service-itemm">
    <div className="service-icon">
      <img src="images/roommate.png" alt="Roommate Finder Logo" />
    </div>
    <div className="service-namee">Roommate Finder</div>
  </Link>

  {/* Bingwa Sokoni Bundles (External Link) */}
  <a href="https://mvobingwa.godaddysites.com" className="service-itemm" target="_blank" rel="noopener noreferrer">
    <div className="service-icon">
      <img src="images/mavo.png" alt="Bingwa Sokoni Bundles Logo" />
    </div>
    <div className="service-namee">Bingwa Sokoni Bundles</div>
  </a>

  {/* Moi Gossip (External Link) */}
  <a href="https://whatsapp.com/channel/0029VaaSTiF8PgsQn25sXK1I" className="service-itemm" target="_blank" rel="noopener noreferrer">
    <div className="service-icon">
      <img src="images/mgc.png" alt="Moi Gossip Logo" />
    </div>
    <div className="service-namee">Moi Gossip</div>
  </a>

  {/* Blog Post */}
  <Link to="/blog" className="service-itemm">
    <div className="service-icon">
      <img src="images/blogs.png" alt="Blog Logo" />
    </div>
    <div className="service-namee">Blog Post</div>
  </Link>
</div>
      </div>
    </div>
  );
};

export default HomeCards;
