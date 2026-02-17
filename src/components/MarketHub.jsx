import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Phone,
  MessageCircle,
  Image as ImageIcon,
  X,
  Loader
} from 'lucide-react';

const MarketHub = () => {
  const [activeTab, setActiveTab] = useState('sellers');
  const [wantedPosts, setWantedPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    urgency: '',
    condition: '',
    minBudget: '',
    maxBudget: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Categories and options
  const categories = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Sports', 'Tools', 'Home & Garden', 'Automotive', 'Other'];
  const urgencyLevels = ['low', 'medium', 'high', 'urgent'];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  // Build query parameters
  const buildQueryParams = useCallback((page = 1, tab = activeTab) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10'
    });

    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (filters.category) params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);

    // For wanted posts
    if (tab === 'buyers') {
      if (filters.urgency) params.append('urgency', filters.urgency);
      if (filters.minBudget) params.append('minBudget', filters.minBudget);
      if (filters.maxBudget) params.append('maxBudget', filters.maxBudget);
    }

    // For products
    if (tab === 'sellers') {
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    }

    // Add sorting
    params.append('sortBy', filters.sortBy);
    params.append('sortOrder', filters.sortOrder);

    return params.toString();
  }, [searchQuery, filters, activeTab]);

  // Fetch wanted posts
  const fetchWantedPosts = useCallback(async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);

      const queryParams = buildQueryParams(page, 'buyers');
      const response = await fetch(`https://moihub.onrender.com/api/wanted/active?${queryParams}`);
      const data = await response.json();

      const newPosts = data.wantedPosts || [];

      setWantedPosts(prev => append ? [...prev, ...newPosts] : newPosts);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      setHasMore(data.hasMore || false);

    } catch (err) {
      console.error('Wanted fetch error:', err);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [buildQueryParams]);

  // Fetch products
  const fetchProducts = useCallback(async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);

      const queryParams = buildQueryParams(page, 'sellers');
      const response = await fetch(`https://moihub.onrender.com/api/marketplace/approved?${queryParams}`);
      const data = await response.json();

      const newProducts = data.products || [];

      setProducts(prev => append ? [...prev, ...newProducts] : newProducts);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      setHasMore(data.hasMore || false);

    } catch (err) {
      console.error('Products fetch error:', err);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [buildQueryParams]);

  // Load data when tab changes or search/filters change
  useEffect(() => {
    setCurrentPage(1);
    if (activeTab === 'sellers') {
      fetchProducts(1, false);
    } else {
      fetchWantedPosts(1, false);
    }
  }, [activeTab, searchQuery, filters, fetchProducts, fetchWantedPosts]);

  // WhatsApp Integration
  const openWhatsApp = (phoneNumber, message = '') => {
    if (!phoneNumber) {
      alert('WhatsApp number not available');
      return;
    }

    // Clean phone number
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Format for WhatsApp
    const whatsappNumber = cleanNumber.startsWith('0') ? `254${cleanNumber.substring(1)}` : cleanNumber;
    
    // Create message
    const defaultMessage = activeTab === 'sellers' 
      ? `Hello! I saw your product on Marketplace and I'm interested.`
      : `Hello! I saw your wanted post on Marketplace and I might have what you're looking for.`;
    
    const finalMessage = message || defaultMessage;
    const encodedMessage = encodeURIComponent(finalMessage);
    
    // Web WhatsApp URL
    const webUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(webUrl, '_blank');
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Get urgency color utility
  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-yellow-500';
      case 'medium': return 'text-blue-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  const getUrgencyBg = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent': return 'bg-red-500/10';
      case 'high': return 'bg-yellow-500/10';
      case 'medium': return 'bg-blue-500/10';
      case 'low': return 'bg-green-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  // Expandable Description Component
  const ExpandableDescription = ({ description, itemId, maxLines = 2 }) => {
    const isExpanded = expandedDescriptions[itemId] || false;
    const [showButton, setShowButton] = useState(false);
    const descriptionRef = React.useRef(null);

    React.useEffect(() => {
      if (descriptionRef.current) {
        const lineHeight = 20; // Approximate line height
        const height = descriptionRef.current.scrollHeight;
        const lines = Math.ceil(height / lineHeight);
        setShowButton(lines > maxLines);
      }
    }, [description, maxLines]);

    const toggleExpanded = () => {
      setExpandedDescriptions(prev => ({
        ...prev,
        [itemId]: !prev[itemId]
      }));
    };

    if (!description || description.trim() === '') {
      return null;
    }

    return (
      <div className="mb-2">
        <p 
          ref={descriptionRef}
          className={`text-sm text-gray-300 leading-relaxed ${
            !isExpanded ? `line-clamp-${maxLines}` : ''
          }`}
        >
          {description}
        </p>
        
        {showButton && (
          <button 
            onClick={toggleExpanded}
            className="text-emerald-400 text-xs font-medium mt-1 hover:text-emerald-300 transition-colors"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    );
  };

  // Load more items
  const loadMore = useCallback(() => {
    if (hasMore && !loading && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      if (activeTab === 'sellers') {
        fetchProducts(nextPage, true);
      } else {
        fetchWantedPosts(nextPage, true);
      }
    }
  }, [hasMore, loading, currentPage, totalPages, activeTab, fetchProducts, fetchWantedPosts]);

  // Refresh data
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    if (activeTab === 'sellers') {
      fetchProducts(1, false);
    } else {
      fetchWantedPosts(1, false);
    }
  }, [activeTab, fetchProducts, fetchWantedPosts]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      urgency: '',
      condition: '',
      minBudget: '',
      maxBudget: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setSearchQuery('');
  };

  // Handle infinite scroll
  const handleScroll = useCallback((e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMore();
    }
  }, [loadMore]);

  // Product Card Component
  const ProductCard = ({ item }) => {
    const { image, name, price, category, condition, location, createdAt, sellerId, sellerWhatsApp } = item;

    return (
      <div className="bg-[#083028]/80 backdrop-blur-sm border-2 border-emerald-400/30 rounded-xl overflow-hidden hover:scale-[1.02] hover:border-emerald-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20">
        {/* Image Container */}
        <div className="relative h-40 bg-gradient-to-br from-emerald-900/50 to-teal-900/50">
          {image ? (
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <ImageIcon size={32} className="text-emerald-400/50 mb-1" />
              <span className="text-emerald-400/50 text-xs">No Image</span>
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-2 right-2 bg-emerald-500 px-2 py-1 rounded-lg">
            <span className="text-black text-xs font-bold">
              Ksh {price?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
            {name}
          </h3>

          {/* Seller Username */}
          {sellerId?.username && (
            <p className="text-emerald-400 text-xs font-medium mb-1">
              @{sellerId.username}
            </p>
          )}

          {/* Category and Condition */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-200 text-xs">
              {category}
            </span>
            <span className="bg-emerald-400/10 border border-emerald-400/30 px-2 py-0.5 rounded text-emerald-300 text-[10px] font-medium">
              {condition}
            </span>
          </div>

          {/* Location */}
          {location && (
            <div className="flex items-center mb-2">
              <MapPin size={12} className="text-emerald-400 mr-1" />
              <span className="text-emerald-200 text-xs truncate">
                {location}
              </span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-400/20">
            <span className="text-emerald-400/60 text-[10px]">
              {formatTimeAgo(createdAt)}
            </span>

            <button
              onClick={() => openWhatsApp(sellerWhatsApp || sellerId?.phone)}
              className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
            >
              <MessageCircle size={12} />
              <span>Chat</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Wanted Card Component
  const WantedCard = ({ item }) => {
    return (
      <div className="bg-[#083028]/80 backdrop-blur-sm border-2 border-emerald-400/30 rounded-xl p-4 hover:scale-[1.01] hover:border-emerald-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 border-l-4 border-l-emerald-500">
        {/* Header with Title and Urgency */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-white font-semibold text-base flex-1 mr-2">
            {item.title}
          </h3>
          {item.urgency && (
            <span className={`${getUrgencyBg(item.urgency)} ${getUrgencyColor(item.urgency)} text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap`}>
              {item.urgency.toUpperCase()}
            </span>
          )}
        </div>

        {/* Buyer Info */}
        <div className="mb-3">
          {item.buyerId?.username && (
            <p className="text-emerald-400 text-sm font-medium mb-1">
              @{item.buyerId.username}
            </p>
          )}
          
          <p className="text-emerald-500 font-bold">
            Budget: Ksh {item.maxBudget?.toLocaleString()}
          </p>
        </div>

        {/* Category and Condition */}
        <p className="text-emerald-200 text-sm mb-2">
          📂 {item.category} • {item.preferredCondition}
        </p>

        {/* Location */}
        {item.location && (
          <div className="flex items-center mb-2">
            <MapPin size={14} className="text-emerald-400 mr-1" />
            <span className="text-emerald-200 text-sm">
              {item.location}
            </span>
          </div>
        )}

        {/* Expandable Description */}
        <ExpandableDescription 
          description={item.description} 
          itemId={item._id}
          maxLines={2}
        />

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-emerald-400/20">
          <span className="text-emerald-400/60 text-xs">
            {formatTimeAgo(item.createdAt)}
          </span>
          
          <button
            onClick={() => openWhatsApp(item.buyerId?.phone)}
            className="bg-green-600 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    );
  };

  // Filters Component
  const FiltersPanel = () => (
    <div className="bg-[#083028] border border-emerald-400/30 rounded-xl p-4 mb-4 max-h-96 overflow-y-auto">
      {/* Category Filter */}
      <div className="mb-4">
        <label className="text-emerald-200 text-sm font-medium block mb-2">Category</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              !filters.category 
                ? 'bg-emerald-500 text-black font-medium' 
                : 'bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filters.category === cat 
                  ? 'bg-emerald-500 text-black font-medium' 
                  : 'bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Budget/Price Range */}
      <div className="mb-4">
        <label className="text-emerald-200 text-sm font-medium block mb-2">
          {activeTab === 'buyers' ? 'Budget Range (Ksh)' : 'Price Range (Ksh)'}
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={activeTab === 'buyers' ? filters.minBudget : filters.minPrice}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              [activeTab === 'buyers' ? 'minBudget' : 'minPrice']: e.target.value 
            }))}
            className="flex-1 bg-emerald-400/10 border border-emerald-400/30 rounded-lg px-3 py-2 text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400"
          />
          <span className="text-emerald-200">to</span>
          <input
            type="number"
            placeholder="Max"
            value={activeTab === 'buyers' ? filters.maxBudget : filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              [activeTab === 'buyers' ? 'maxBudget' : 'maxPrice']: e.target.value 
            }))}
            className="flex-1 bg-emerald-400/10 border border-emerald-400/30 rounded-lg px-3 py-2 text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Urgency Filter (for buyers) */}
      {activeTab === 'buyers' && (
        <div className="mb-4">
          <label className="text-emerald-200 text-sm font-medium block mb-2">Urgency</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, urgency: '' }))}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                !filters.urgency 
                  ? 'bg-emerald-500 text-black font-medium' 
                  : 'bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'
              }`}
            >
              All
            </button>
            {urgencyLevels.map((level) => (
              <button
                key={level}
                onClick={() => setFilters(prev => ({ ...prev, urgency: level }))}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filters.urgency === level 
                    ? 'bg-emerald-500 text-black font-medium' 
                    : 'bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Condition Filter (for sellers) */}
      {activeTab === 'sellers' && (
        <div className="mb-4">
          <label className="text-emerald-200 text-sm font-medium block mb-2">Condition</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, condition: '' }))}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                !filters.condition 
                  ? 'bg-emerald-500 text-black font-medium' 
                  : 'bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'
              }`}
            >
              All
            </button>
            {conditions.map((condition) => (
              <button
                key={condition}
                onClick={() => setFilters(prev => ({ ...prev, condition }))}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filters.condition === condition 
                    ? 'bg-emerald-500 text-black font-medium' 
                    : 'bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Location Filter */}
      <div className="mb-4">
        <label className="text-emerald-200 text-sm font-medium block mb-2">Location</label>
        <input
          type="text"
          placeholder="Enter location"
          value={filters.location}
          onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          className="w-full bg-emerald-400/10 border border-emerald-400/30 rounded-lg px-3 py-2 text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400"
        />
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-2 rounded-lg transition-colors border border-red-500/30"
      >
        Clear All Filters
      </button>
    </div>
  );

  // Loading State
  if (loading && !refreshing && products.length === 0 && wantedPosts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c5440] to-[#0e6b52] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-emerald-200 font-medium">Loading Marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c5440] to-[#0e6b52]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0c5440] to-[#0e6b52] pt-4 pb-2 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-emerald-200 text-sm mb-3">Buy and sell with campus community</p>
          
          {/* Search Bar */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#083028] border border-emerald-400/30 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl transition-colors ${
                showFilters 
                  ? 'bg-emerald-500 text-black' 
                  : 'bg-[#083028] text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10'
              }`}
            >
              <Filter size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Tabs */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setActiveTab('sellers')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'sellers'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25'
                : 'bg-[#083028] text-emerald-200 border border-emerald-400/30 hover:bg-emerald-400/10'
            }`}
          >
            For Sale
          </button>
          <button
            onClick={() => setActiveTab('buyers')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'buyers'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25'
                : 'bg-[#083028] text-emerald-200 border border-emerald-400/30 hover:bg-emerald-400/10'
            }`}
          >
            On Demand
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && <FiltersPanel />}

        {/* Content */}
        <div 
          className="overflow-y-auto"
          onScroll={handleScroll}
          style={{ maxHeight: 'calc(100vh - 280px)' }}
        >
          {activeTab === 'sellers' ? (
            // Products Grid
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-4">
              {products.map((product) => (
                <ProductCard key={product._id} item={product} />
              ))}
            </div>
          ) : (
            // Wanted Posts List
            <div className="space-y-3 pb-4">
              {wantedPosts.map((post) => (
                <WantedCard key={post._id} item={post} />
              ))}
            </div>
          )}

          {/* Loading More Indicator */}
          {loading && (
            <div className="flex justify-center py-4">
              <Loader className="w-6 h-6 text-emerald-400 animate-spin" />
            </div>
          )}

          {/* Empty State */}
          {(activeTab === 'sellers' ? products.length === 0 : wantedPosts.length === 0) && !loading && (
            <div className="text-center py-12">
              <p className="text-emerald-200 text-lg mb-2">
                {activeTab === 'sellers' ? 'No products found' : 'No requests found'}
              </p>
              <p className="text-emerald-300/60 text-sm">
                Try adjusting your search or filters
              </p>
            </div>
          )}

          {/* Scroll Indicator */}
          {hasMore && (activeTab === 'sellers' ? products.length > 0 : wantedPosts.length > 0) && (
            <div className="flex justify-center py-4 text-emerald-400/60 text-sm">
              <ChevronDown size={20} className="animate-bounce" />
              <span className="mx-1">Scroll for more</span>
              <ChevronDown size={20} className="animate-bounce" />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MarketHub;