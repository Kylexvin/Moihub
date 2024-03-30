import React  from 'react';
import './market.css'; // Import your custom styles if needed

const ProductList = () => {
  

  const products = [
    {
      id: 1,
      photo: '/products/image1.jpg',
      name: 'Product 1',
      condition: '70% new',
      seller: 'Seller A',
      isAd: false,
    },
    {  
      id: 2,
      photo: 'slide2.jpg',
      name: 'Product 2',
      condition: '85% new',
      seller: 'Seller B',
      isAd: false,
    },
    {
      id: 3,
      photo: 'ad.jpg',
      name: 'Exclusive Web Design Offer',
      condition: 'Limited Time Deal',
      seller: 'kylex inc.',
      isAd: true,
    },
    // Add more product entries as needed
  ];

  const searchProduct = () => {
    var input, filter, cards, card, productName, i, found;
    input = document.getElementById("searchInput");
    filter = input.value.trim().toLowerCase();
    cards = document.getElementsByClassName("card-product");
    found = false;

    for (i = 0; i < cards.length; i++) {
      card = cards[i];
      productName = card.querySelector(".product-name").innerText.toLowerCase();

      if (productName.includes(filter)) {
        card.style.display = "";
        found = true;
      } else {
        card.style.display = "none";
      }
    }

    var searchResult = document.getElementById("searchResult");
    if (found) {
      searchResult.innerHTML = "";
    } else {
      searchResult.innerHTML = "No products found.";
    }
  };


  return (
    <>
      <div className="navigation">
        <a href="/marketplace" className="nav-link active2">
          Sellers
        </a>
        <a href="/sellers" className="nav-link">
          Buyers
        </a>
      </div>

      <div className="search-button-container">
        <div className="neomorphic-search-panel">
          <input type="text" id="searchInput" className="search-input" placeholder="Search by product name" />
          <div className="search-button-container">
            <button className="search-button" onClick={searchProduct}>
              Search
            </button>
          </div>
          <div id="searchResult" className="search-result"></div>
        </div>
      </div>

      <section className="products-container">
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </section>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
        <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
      </svg>
    </>
  );
};

const ProductCard = ({ photo, name, condition, seller, isAd }) => {
  return (
    <div className="card-product">
      <div className="product-photo">
        <img src={photo} alt={name} />
      </div>
      <div className="product-name">{name}</div>
      <div className="condition">{condition}</div>
      <div className="seller-name">{seller}</div>
      <button className="request-button">{isAd ? 'Claim Now' : 'Request'}</button>
    </div>
  );
};

export default ProductList;
