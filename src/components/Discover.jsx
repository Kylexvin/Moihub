import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Phone, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link for routing
import "./discover.css";
import CustomerCare from './customercare';

const jsonData = [
  {
    category: "Motorbike Services",
    services: [
      { name: "Bernard", phone: "0729451143", hasPage: false },
      { name: "Feloo", phone: "0717022787", hasPage: false },
      { name: "Biwott", phone: "0748667191", hasPage: false }
    ]
  },
  {
    category: "Gas Deliveries Services",
    services: [
      { name: "Africana", phone: "0715100949", hasPage: false }
    ]
  },
  {
    category: "Mama Fua",
    services: [
      { name: "(Rebo)", phone: "0717249441", hasPage: true, route: "rebo" },
      { name: "Rodha(Mobile)", phone: "+254 741 260404", hasPage: true, route: "rodha-mobile" },
      { name: "(Emerald)", phone: "0748446504", hasPage: true, route: "emerald" },
      { name: "Mobile", phone: "0790861147", hasPage: false }
    ]
  },
  {
    category: "Tuktuk Services",
    services: [
      { name: "Arap Koech", phone: "0714695664", hasPage: false }
    ]
  },
  {
    category: "Best Kinyozi",
    services: [
      { name: "Maeneo Cutz", phone: "0717241607", hasPage: false }
    ]
  },
  {
    category: "Cake",
    services: [
      { name: "Cakist", phone: "+254704866857", hasPage: true, route: "cakist" },
      { name: "Boss Lady", phone: "+254745928593", hasPage: true, route: "boss-lady" }
    ]
  },
  {
    category: "Laundry Services",
    services: [
      { name: "Talanta", phone: "0799066882", hasPage: false },
      { name: "Nyunja Solutions", phone: "0114678616", hasPage: false }
    ]
  },
  {
    category: "Capentry Services",
    services: [
      { name: "Rosewood", phone: "0791446535", hasPage: false }
    ]
  },
  {
    category: "Photoshoot Services",
    services: [
      { name: "Evans Media", phone: "0741845272", hasPage: true, route: "evans-media" }
    ]
  },
  {
    category: "Electronic Repairs",
    services: [
      { name: "Box Office", phone: "0799560552", hasPage: false }
    ]
  },
  {
    category: "Add your service here.",
    services: [
      { name: "Contact us", phone: "0768610613", hasPage: false }
    ]
  }
];

const Card = ({ category, services, isOpen, toggleCard }) => (
  <div className={`category-card-discover ${isOpen ? 'open' : ''}`}>
    <div className="service-card-title-discover" onClick={toggleCard}>
      <div className="service-name-discover">{category}</div>
      <ChevronDown className={`chevron ${isOpen ? 'rotate' : ''}`} />
    </div>
    {isOpen && (
      <div className="service-card-discover">
        {services && services.map((service, index) => (
          <div key={index} className="service-card-info-discover">
            <div className="service-name-discover">
              {service.hasPage ? (
                <Link to={`/${service.route}`} className="service-link">{service.name}</Link>
              ) : (
                service.name
              )}
            </div>
            <div className="phone-number">
              <Phone size={16} />
              <a href={`tel:${service.phone}`}>{service.phone}</a>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(jsonData);
  const [openCards, setOpenCards] = useState({});

  useEffect(() => {
    const filtered = jsonData.filter(data => {
      const categoryMatch = data.category.toLowerCase().includes(searchTerm.toLowerCase());
      const serviceMatch = data.services.some(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.phone.includes(searchTerm)
      );
      return categoryMatch || serviceMatch;
    });
    setFilteredData(filtered);
  }, [searchTerm]);

  const toggleCard = (index) => {
    setOpenCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="discover-page">
      <Helmet>
        <title>Discover Services</title>
        <meta name="description" content="Discover various services including motorbike, gas deliveries, laundry, and more." />
      </Helmet>

      <svg id="unique-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(180)">
        <path fill="#27a844" fillOpacity="1" d="M0,0L24,32C48,64,96,128,144,149.3C192,171,240,149,288,138.7C336,128,384,128,432,144C480,160,528,192,576,213.3C624,235,672,245,720,229.3C768,213,816,171,864,144C912,117,960,107,1008,112C1056,117,1104,139,1152,144C1200,149,1248,139,1296,112C1344,85,1392,43,1416,21.3L1440,0L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z" />
      </svg>

      <div className="container-s">
        <div className="search-panel">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              id="search"
              placeholder="Search for a service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container-discover">
        {filteredData.map((data, index) => (
          <Card 
            key={index} 
            category={data.category} 
            services={data.services}
            isOpen={openCards[index]}
            toggleCard={() => toggleCard(index)}
          />
        ))}
      </div>

      <CustomerCare />
    </div>
  );
};

export default Discover;
