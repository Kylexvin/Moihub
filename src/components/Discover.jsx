import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import "./discover.css"
import CustomerCare from './customercare';

const jsonData = [
  {
    category: "Motorbike Services",
    services: [
      { name: "Bernard", phone: "0729451143" },
      { name: "Feloo", phone: "0717022787" },
      { name: "Biwott", phone: "0748667191" }
      
    ]
  },
  {
    category: "Gas Deliveries Services",
    services: [
      { name: "Africana", phone: "0715100949" }
    ]
  },
  {
    category: "Mama Fua",
    services: [
      { name: "(Rebo)", phone: "0717249441" },
      { name: "(Emerald)", phone: "0748446504"},
      { name: "Mobile", phone: "0790861147"}
    ]
  },
  {
    category: "Tuktuk Services",
    services: [
      { name: "Arap Koech", phone: "0714695664" }
    ]
  },
  {
    category: "Best Kinyozi",
    services: [
      { name: "Maeneo Cutz", phone: "0717241607" }
    ]
  },
  {
    category: "Cake",
    services: [
      { name: "Cakist", phone: "+254704866857" }
    ]
  },
  
  {
    category: "Laundry Services",
    services: [
      { name: "Talanta", phone: "0799066882" },
      { name: "Nyunja Solutions", phone: "0114678616" }
    ]
  },
  {
    category: "Capentry Services",
    services: [
      { name: "Rosewood", phone: "0791446535" }
    ]
  },
  
  {
    category: "Photoshoot Services",
    services: [
      { name: "Evans Media", phone: "0741845272" }
    ]
  },
  {
    category: "Electronic Repairs",
    services: [
      { name: "Box Office", phone: "0799560552" }
    ]
  },
  {
    category: "Add your service here.",
    services: [
      { name: "Contact us", phone: "0768610613" }
    ]
  }
];

const Card = ({ category, services }) => (
  <div className="category-card-discover">
    <div className="service-card-title-discover">
      <div className="service-name-discover">{category}</div>
    </div>
    <div className="service-card-discover">
      {services && services.map((service, index) => (
        <div key={index} className="service-card-info-discover">
          <div className="service-name-discover">{service.name}</div>
          <div>{service.phone}</div>
        </div>
      ))}
    </div>
  </div>
);

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = jsonData.filter(data => {
    const categoryMatch = data.category.toLowerCase().includes(searchTerm.toLowerCase());
    const serviceMatch = data.services.some(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return categoryMatch || serviceMatch;
  });

  return (
    <>
      <svg id="unique-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(180)">
        <path fill="#27a844" fillOpacity="1" d="M0,0L24,32C48,64,96,128,144,149.3C192,171,240,149,288,138.7C336,128,384,128,432,144C480,160,528,192,576,213.3C624,235,672,245,720,229.3C768,213,816,171,864,144C912,117,960,107,1008,112C1056,117,1104,139,1152,144C1200,149,1248,139,1296,112C1344,85,1392,43,1416,21.3L1440,0L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z" />
      </svg>
  <div className="container-s">
      <div className="search-panel">
        <div className="search-container">
          <input
            type="text"
            id="search"
            placeholder="Search for a service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="button" id="button">
            Search
          </button>
        </div>
      </div>
</div>
      <div className="container-discover">
        <Helmet>
          <title>Discover Services</title>
          <meta name="description" content="Discover various services for gas deliveries and plumbing services." />
        </Helmet>
        {filteredData.map((data, index) => (
          <Card key={index} category={data.category} services={data.services} />
        ))}
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
        <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
      </svg>
      <CustomerCare/>
    </>
  );
};

export default Discover;
