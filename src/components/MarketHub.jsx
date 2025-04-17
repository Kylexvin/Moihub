import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, resetProducts, setSearching } from '../redux/slices/productSlice';
import { useGetProductsQuery } from '../services/productApi';
import './MarkertHub.css';
import debounce from 'lodash/debounce';

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
  const searching = useSelector(state => state.products.searching);
  
  // Create a debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 500),
    [onSearch]
  );
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="bg-gradient-to-r from-green-500 to-green-900 rounded-lg shadow-lg p-4 mb-3">
      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <input 
            type="text" 
            placeholder="Search by name or description..." 
            value={searchQuery} 
            onChange={handleSearchChange} 
            className="w-full px-4 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent" 
          />
          {searching && (
            <div className="absolute right-3 top-2">
              <i className="fas fa-spinner fa-spin text-gray-500"></i>
            </div>
          )}
        </div>
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
          loading="lazy" // Add lazy loading for images
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
  const searchQuery = useSelector(state => state.products.searchQuery);
  const cachedItems = useSelector(state => state.products.items);
  
  const [currentPage, setCurrentPage] = useState(1);
  
  // RTK Query hook with pagination and search parameters
  const {
    data,
    error: rtkError,
    isLoading,
    isFetching,
    isSuccess
  } = useGetProductsQuery({
    page: currentPage,
    limit: 10,
    searchQuery
  });
  
  // Determine what data to display - RTK Query data or cached items
  const displayItems = (data?.products || []).length > 0 ? data.products : cachedItems;
  const hasMore = data?.pagination?.hasMore || false;
  
  const observer = useRef();
  const lastProductElementRef = useCallback(node => {
    if (isLoading || isFetching) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [isLoading, isFetching, hasMore]);

  // Reset pagination when search query changes
  useEffect(() => {
    setCurrentPage(1);
    dispatch(resetProducts());
  }, [searchQuery, dispatch]);
  
  const handleSearch = (searchTerm) => {
    dispatch(setSearching(true));
    dispatch(setSearchQuery(searchTerm));
    // The search will trigger through the useGetProductsQuery parameters
  };

  const contactSeller = (sellerWhatsApp) => {
    const whatsappLink = `https://wa.me/${sellerWhatsApp}`;
    window.open(whatsappLink, '_blank');
  };

  // Show cached data immediately on first render
  useEffect(() => {
    // If we have cached data and are on the first load, show a message
    if (cachedItems.length > 0 && isLoading && currentPage === 1 && !searchQuery) {
      console.log('Showing cached data while fetching fresh data');
    }
  }, [cachedItems, isLoading, currentPage, searchQuery]);

  return (
    <>
      <div className="Homee">
        

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
    
    <div className="seller-buttons">
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
        <i className="fas fa-plus-circle"></i> Start Selling Today
      </button>
    </div>
  </div>
</div>

      
        <div className="containerr">
          <SearchPanel onSearch={handleSearch} />
          
          <h2 className="section-titlee">Products for you</h2>
          
          {/* Show "Using cached data" notification if applicable */}
          {cachedItems.length > 0 && isLoading && currentPage === 1 && !searchQuery && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded" role="alert">
              <p className="text-sm">Showing cached products while loading fresh data...</p>
            </div>
          )}
          
          <div className="products-gridd">
            {/* Show cached data if available and still loading fresh data */}
            {displayItems.map((product, index) => {
              if (displayItems.length === index + 1) {
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
            
            {/* Loading indicators */}
            {(isLoading || isFetching) && (
              <div className="w-full text-center p-4">
                <p><i className="fas fa-spinner fa-spin"></i> Loading products...</p>
              </div>
            )}
            
            {/* Error handling */}
            {rtkError && (
              <div className="w-full text-center p-4">
                <p className="text-red-500">
                  {typeof rtkError === 'string' ? rtkError : 'Error loading products. Please try again.'}
                </p>
              </div>
            )}
            
            {/* End of list message */}
            {isSuccess && !isFetching && !hasMore && displayItems.length > 0 && (
              <p className="w-full text-center p-4 text-gray-500">
                You've reached the end of the list
              </p>
            )}
            
            {/* No products message */}
            {isSuccess && !isLoading && !isFetching && displayItems.length === 0 && (
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