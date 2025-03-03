import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setSearchQuery, resetProducts } from '../redux/slices/productSlice';
import './MarkertHub.css';

const getRelativeTime = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (let interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return count === 1 ? `${count} ${interval.label} ago` : `${count} ${interval.label}s ago`;
    }
  }
  return 'just now';
};

const SearchPanel = ({ onSearch }) => {
  const searchQuery = useSelector(state => state.products.searchQuery);
  
  const handleSearch = (e) => {
    const value = e.target.value;
    onSearch(value);
  };

  return (
    <div className="bg-gradient-to-r from-green-500 to-green-900 rounded-lg shadow-lg p-4 mb-3">
      <div className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Search by name or description..." 
          value={searchQuery} 
          onChange={handleSearch} 
          className="w-full px-4 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent" 
        />
      </div>
    </div>
  );
};

const ProductCard = ({ product, contactSeller }) => {
  const [imageStatus, setImageStatus] = React.useState('loading');
  const [retryCount, setRetryCount] = React.useState(0);
  const [relativeTime, setRelativeTime] = React.useState(getRelativeTime(product.createdAt));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRelativeTime(getRelativeTime(product.createdAt));
    }, 60000);
    return () => clearInterval(intervalId);
  }, [product.createdAt]);

  const handleImageLoad = () => {
    setImageStatus('loaded');
    setRetryCount(0);
  };

  const handleImageError = () => {
    if (retryCount < 3) {
      setRetryCount((prev) => prev + 1);
      setImageStatus('error');
    } else {
      setImageStatus('error');
    }
  };

  return (
    <div className="product-cardd" key={product._id}>
      <div className={`product-imagee ${imageStatus}`}>
        {imageStatus === 'loading' && (
          <div className="image-placeholderr">
            <div className="loading-spinner"></div>
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            opacity: imageStatus === 'loaded' ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
        {imageStatus === 'error' && (
          <div className="image-error">
            <i className="fas fa-image"></i>
            <p className="text-red-500 text-sm text-center italic mt-2 mb-2">
              Image unavailable, inquire from the seller
            </p>
          </div>
        )}
      </div>

      <div className="product-infoo">
        <h3 className="product-namee">{product.name}</h3>
        <div className="price-roww">
          <div className="product-pricee">
            <i className="fas fa-tag"></i> Price Ksh {product.price.toLocaleString()}
          </div>
          <div className="timestamp">
            <i className="fas fa-clock"></i> <b>Posted</b> {relativeTime}
          </div>
        </div>
        <div className="product-descriptionn">
          <b>
            <i className="fas fa-info-circle"></i> Description:
          </b>
          <br />
          <p className="product-descriptionn">{product.description}</p>
        </div>
        <div className="seller-infoo">
          <div className="seller-namee">
            <i className="fas fa-user"></i> <b>Seller:</b>{' '}
            {product.sellerId ? product.sellerId.username || product.sellerId.phone : 'Unknown Seller'}
          </div>
        </div>
        <button className="contact-btnn" onClick={() => contactSeller(product.sellerWhatsApp)}>
          <i className="fab fa-whatsapp"></i> Contact Seller
        </button>
      </div>
    </div>
  );
};

const MarketHub = () => {
  const dispatch = useDispatch();
  const { 
    filteredItems, 
    loading, 
    error, 
    page, 
    hasMore 
  } = useSelector(state => state.products);
  
  const observer = useRef();
  
  // Reset products when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetProducts());
    };
  }, [dispatch]);

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchProducts({ page: 1 }));
  }, [dispatch]);

  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        dispatch(fetchProducts({ page: page + 1 }));
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, page, dispatch]);

  const handleSearch = (searchTerm) => {
    // If search term changes drastically, reset to page 1
    if (searchTerm !== '') {
      dispatch(resetProducts());
      dispatch(setSearchQuery(searchTerm));
      dispatch(fetchProducts({ page: 1 }));
    } else {
      dispatch(setSearchQuery(searchTerm));
    }
  };

  const contactSeller = (sellerWhatsApp) => {
    const whatsappLink = `https://wa.me/${sellerWhatsApp}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <>
      <div className="Homee">
        <nav className="navv">
          <div className="nav-contentt">
            <div className="logoo">MarketHub</div>
            <div className="nav-buttonss">
              <button
                className="nav-btn login-btnn"
                onClick={() => window.location.href = 'https://markethub-mocha.vercel.app/login'}
              >
                <i className="fas fa-sign-in-alt"></i> Login
              </button>
              <button
                className="nav-btn register-btnn"
                onClick={() => window.location.href = 'https://markethub-mocha.vercel.app/register'}
              >
                Register
              </button>
            </div>
          </div>
        </nav>

        <section className="heroo">
          <div className="hero-contentt">
            <h1>Buy and Sell in Moi University</h1>
            <p>Join us and trade your items safely and easily on your trusted marketplace platform.</p>
          </div>
        </section>

        <div className="seller-cardd">
          <div className="seller-card-contentt">
            <h2>Want to Sell Your Items?</h2>
            <p>Create a free account and start selling to potential buyers in Moi University.</p>
            <button 
              className="nav-btn register-btnn" 
              onClick={() => window.location.href = 'https://markethub-mocha.vercel.app/register'}
            >
              <i className="fas fa-plus-circle"></i> Start Selling Today
            </button>
          </div>
        </div>
      
        <div className="containerr">
          <SearchPanel onSearch={handleSearch} />
          
          <h2 className="section-titlee">Products for you</h2>
          <div className="products-gridd">
            {filteredItems.map((product, index) => {
              if (filteredItems.length === index + 1) {
                return (
                  <div ref={lastProductElementRef} key={product._id}>
                    <ProductCard 
                      product={product} 
                      contactSeller={contactSeller} 
                    />
                  </div>
                );
              } else {
                return (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    contactSeller={contactSeller} 
                  />
                );
              }
            })}
            
            {loading && (
              <div className="w-full text-center p-4">
                <p><i className="fas fa-spinner fa-spin"></i> Loading more products...</p>
              </div>
            )}
            
            {error && <p className="text-red-500 text-center p-4">{error}</p>}
            
            {!loading && !hasMore && filteredItems.length > 0 && (
              <p className="w-full text-center p-4 text-gray-500">
                No more products to load
              </p>
            )}
            
            {!loading && filteredItems.length === 0 && (
              <p className="w-full text-center p-4 text-gray-500">
                No products found matching your search
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketHub;