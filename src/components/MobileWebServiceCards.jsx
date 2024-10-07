import React, { useEffect, useRef } from 'react';
import './MobileWebServiceCards.css'; // Custom styles

const serviceData = [
  {
    title: 'Rental Booking',
    icon: '🏠',
    description: 'Find the perfect space for your stay.',
    action: 'Explore Rentals',
    link: '/book',
    category: 'living'
  },
  {
    title: 'E-shop',
    icon: '🛒',
    description: 'Browse and shop online with ease.',
    action: 'Start Shopping',
    link: '/eshop',
    category: 'shopping'
  },
  {
    title: 'E-Chem',
    icon: '💊',
    description: 'Order pharmaceutical items.',
    action: 'Shop Now',
    link: '/pharmacy',
    category: 'health'
  },
  {
    title: 'MoiDelish',
    icon: '🍽️',
    description: 'Order food for delivery.',
    action: 'Order Now',
    link: '/food-delivery',
    category: 'food'
  },
  {
    title: 'Groceries',
    icon: '🥕',
    description: 'Order groceries around Moi University.',
    action: 'Order Now',
    link: '/greenhub',
    category: 'shopping'
  },
  {
    title: 'Local Services',
    icon: '🔍',
    description: 'Find local services near Moi University.',
    action: 'Explore Now',
    link: '/discover',
    category: 'services'
  },
  {
    title: 'Second-hand Market',
    icon: '🏷️',
    description: 'Find great deals on gently used items.',
    action: 'Explore Now',
    link: '/marketplace',
    category: 'shopping'
  },
  {
    title: 'Buy Bundles',
    icon: '📱',
    description: 'Purchase Safaricom even with an okoa.',
    action: 'Buy Data Now',
    link: 'https://mvobingwa.godaddysites.com',
    category: 'services'
  },
  {
    title: 'Roommate Finder',
    icon: '👥',
    description: 'Discover compatible roommates for you.',
    action: 'Explore Roommates',
    link: '/find-roommate',
    category: 'living'
  },
  {
    title: 'Blog Post and News',
    icon: '📰',
    description: 'Our latest blog posts and news articles.',
    action: 'Read Now',
    link: '/blog',
    category: 'information'
  }
];

const ServiceCard = ({ title, icon, description, action, link, category, index }) => {
  const cardRef = useRef(null); // Reference to each card

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view'); // Add 'in-view' class when in viewport
          } else {
            entry.target.classList.remove('in-view'); // Remove it when out of view
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the card is visible
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <div 
      ref={cardRef} 
      className={`service-card ${category}`}
      style={{ transitionDelay: `${index * 100}ms` }} // Add a slight delay for staggered effects
    >
      <div className="service-card-content">
        <div className="service-icon">{icon}</div>
        <h3 className="service-title">{title}</h3>
        <p className="service-description">{description}</p>
        <a href={link} className="service-action">{action}</a>
      </div>
    </div>
  );
};

const MobileWebServiceCards = () => {
  return (
    <div className="service-cards-container">
      {serviceData.map((service, index) => (
        <ServiceCard key={index} {...service} index={index} />
      ))}
    </div>
  );
};

export default MobileWebServiceCards;
