import React, { useState } from 'react';
import './greenhub.css';

// Define products array outside the component
const products = [
  {
    img: "../greenH/onion.jpg",
    alt: "Onions",
    name: "Onions",
    price: "Ksh 130 per Kilo",
  },
  {
    img: "../greenH/garlic.jpg",
    alt: "Garlic",
    name: "Garlic",
    price: "Ksh 30 per Piece",
  },
  {
    img: "../greenH/eggs.jpg",
    alt: "Eggs",
    name: "Eggs",
    price: "Ksh 17 each / Ksh 480 per Tray",
  },
  {
    img: "../greenH/tomatoes.jpg",
    alt: "Tomatoes",
    name: "Tomatoes",
    price: "Ksh 20 per Kilo",
  },
  {
    img: "../greenH/dhania.jpg",
    alt: "Dhania",
    name: "Dhania",
    price: "Ksh 20 per Bunch",
  },
  {
    img: "../greenH/hoho.jpg",
    alt: "Pilipili Hoho",
    name: "Pilipili Hoho",
    price: "Ksh 20 per Kilo",
  },
  {
    img: "../greenH/ginger.jpg",
    alt: "Ginger",
    name: "Ginger",
    price: "Ksh 20 per Kilo",
  },
  {
    img: "../greenH/milk.jpg",
    alt: "Milk",
    name: "Milk",
    price: "Ksh 60 per 500ml / Ksh 30 per 300ml",
  },
  {
    img: "../greenH/cabbage.jpg",
    alt: "Cabbage",
    name: "Cabbage",
    price: "Ksh 20 per Kilo",
  },
  {
    img: "../greenH/carrots.jpg",
    alt: "Carrots",
    name: "Carrots",
    price: "Ksh 20 per Kilo",
  },
  {
    img: "../greenH/banana.jpg",
    alt: "Banana",
    name: "Banana",
    price: "Ksh 20 per Piece",
  },
  {
    img: "../greenH/mangoes.jpg",
    alt: "Mangos",
    name: "Mangos",
    price: "Ksh 20 per Piece",
  },
  {
    img: "../greenH/oranges.jpg",
    alt: "Orange",
    name: "Orange",
    price: "Ksh 20 per Piece",
  },
  {
    img: "../greenH/avocado.jpg",
    alt: "Avocado",
    name: "Avocado",
    price: "Ksh 20 per Piece",
  },
  {
    img: "../greenH/apple.jpg",
    alt: "Apple",
    name: "Apple",
    price: "Ksh 20 per Piece",
  },
];

const GreenHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const orderProduct = (productName) => {
    const phoneNumber = '254759778478'; // Replace with the actual phone number
    const message = `Hello GreenHub, I would like to order: ${productName}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  return ( 
    <>
      <div className="container-gtop">
        <div className="container-gtop">
          <div className="neumorphism-sname">
            <span className="shop-name">GreenHub Grocery Store</span>
            {/* <span className="phone-number">Phone Number</span> */}
          </div>
          <div className="neumorphism-cardg">
            <div className="container-gtop">
              <div className="carousel-control-next-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
            </div>
            <span className="deliveries">Deliveries done around Moi University.</span>
            <div className="container-gtop">
              <div className="carousel-control-next-icon">
                <i className="fas fa-motorcycle"></i>
              </div>
            </div>
          </div>

          <div className="pannel-gtop">
            <div className="neumorphism-search-panel">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-buttong" onClick={handleSearch}>
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-grocery">
        {filteredProducts.map((product, index) => (
          <div className="product-cardg" key={index} onClick={() => orderProduct(product.name)}>
            <div className="icon-container">
              <div className="icon"><i className="fas fa-shopping-cart"></i></div>
              {/* <div className="icon"><i className="fas fa-bookmark"></i></div> */}
            </div>
            <img src={product.img} alt={product.alt} />
            <div className="product-detailsg">
              <h2>{product.name}</h2>
              <p className="price">Price: {product.price}</p>
              <p className="delivery-info">Delivery available!</p>
              <button className="order-btng">Order Now</button>
            </div>
          </div>
        ))}
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
        <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
      </svg>
    </>
  );
};

export default GreenHub;
