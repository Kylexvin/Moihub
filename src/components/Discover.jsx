import React, { useState, useEffect, useRef } from 'react';
import { Search, Phone, MapPin, Loader, X, Star, Clock, Download, Smartphone, ChevronDown } from 'lucide-react';

const Discover = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProvidersModal, setShowProvidersModal] = useState(false);
  const [tapLoading, setTapLoading] = useState(null); // Track which category is being tapped
  const modalContentRef = useRef(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://moihub.onrender.com/api/services/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async (categoryId, categoryName) => {
    try {
      setProvidersLoading(true);
      const response = await fetch(`https://moihub.onrender.com/api/services/providers/${categoryId}`);
      const data = await response.json();
      setProviders(data.providers || []);
      setSelectedCategory({
        name: categoryName,
        id: categoryId
      });
      setShowProvidersModal(true);
      
      // Reset scroll position when new providers load
      setTimeout(() => {
        if (modalContentRef.current) {
          modalContentRef.current.scrollTop = 0;
        }
      }, 100);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setProvidersLoading(false);
      setTapLoading(null);
    }
  };

  const handleCategoryClick = (category) => {
    setTapLoading(category._id); // Set loading state for this specific category
    fetchProviders(category._id, category.name);
  };

  const handleCallProvider = (phoneNumber) => {
    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+254${phoneNumber.replace(/^0/, '')}`;
    window.location.href = `tel:${formattedNumber}`;
  };

  const handleWhatsApp = (phoneNumber, providerName) => {
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    const message = `Hello ${providerName}, I found your contact on MoiHub and I'm interested in your ${selectedCategory?.name} services.`;
    window.open(`https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDownloadApp = () => {
    window.open('https://play.google.com/store/apps/details?id=com.kylexvin.moihub', '_blank');
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProviders = providers.filter(provider =>
    provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#083028] to-[#0a3d2e] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-emerald-200 font-medium">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c5440] to-[#0e6b52]">
      {/* Fixed Header with Search */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0c5440] to-[#0e6b52] pt-4 pb-2 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2">Discover Services</h1>
          <p className="text-emerald-200 text-sm mb-3">Find local services around campus</p>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400" size={20} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#083028] border border-emerald-400/30 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid - Scrollable */}
      <div className="px-4 py-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredCategories.map((category) => {
              const isTapping = tapLoading === category._id;
              
              return (
                <div
                  key={category._id}
                  onClick={() => !isTapping && handleCategoryClick(category)}
                  className={`
                    relative bg-[#083028]/80 backdrop-blur-sm border-2 
                    ${isTapping ? 'border-emerald-400' : 'border-emerald-400/30'} 
                    rounded-2xl p-4 cursor-pointer transition-all duration-300 
                    hover:scale-105 hover:border-emerald-400/60 hover:bg-[#0a3d2e]/80 
                    hover:shadow-lg hover:shadow-emerald-500/20
                    ${isTapping ? 'scale-105' : ''}
                  `}
                >
                  {/* Tap loading indicator */}
                  {isTapping && (
                    <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 bg-emerald-400/10 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full" />
                    </div>
                    <h3 className="text-white font-semibold text-sm leading-tight">
                      {category.name}
                    </h3>
                    <p className="text-emerald-200 text-xs leading-tight line-clamp-2">
                      {category.description || 'No description available'}
                    </p>
                    
                    {/* Provider count indicator (if we had it) */}
                    <span className="text-emerald-400/60 text-xs mt-1">
                      Tap to view providers
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-emerald-300">No services found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Providers Modal */}
      {showProvidersModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
          <div 
            className="bg-[#083028] rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Sticky */}
            <div className="sticky top-0 bg-[#083028] z-10 flex items-center justify-between p-6 border-b border-emerald-400/20">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedCategory?.name}</h2>
                <p className="text-emerald-200 text-sm">
                  {providersLoading ? (
                    <span className="flex items-center">
                      <Loader size={14} className="animate-spin mr-2" />
                      Loading providers...
                    </span>
                  ) : (
                    `${providers.length} ${providers.length === 1 ? 'provider' : 'providers'} available`
                  )}
                </p>
              </div>
              <button
                onClick={() => setShowProvidersModal(false)}
                className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Providers List - Scrollable */}
            <div 
              ref={modalContentRef}
              className="overflow-y-auto p-4"
              style={{ maxHeight: 'calc(85vh - 120px)' }}
            >
              {providersLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-emerald-200 mt-4">Fetching providers...</p>
                </div>
              ) : filteredProviders.length > 0 ? (
                <div className="space-y-3">
                  {filteredProviders.map((provider, index) => {
                    const hasProfile = provider.providerType === 'dashboard' || provider.isDashboardEnabled;
                    
                    return (
                      <div
                        key={provider.id}
                        className={`
                          bg-[#0a3d2e]/50 border rounded-xl p-4 
                          transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                          ${hasProfile ? 'border-emerald-400/40' : 'border-emerald-400/20'}
                          animate-fadeIn
                        `}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-2">
                              <h3 className="text-white font-semibold">{provider.name}</h3>
                              
                              {/* Profile tag - right beside provider name */}
                              {hasProfile && (
                                <span className="inline-flex items-center bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full border border-emerald-400/30">
                                  <Smartphone size={12} className="mr-1" />
                                  Has Profile
                                </span>
                              )}
                            </div>
                            
                            {provider.address && (
                              <div className="flex items-center space-x-1 mt-1">
                                <MapPin size={14} className="text-emerald-400 flex-shrink-0" />
                                <span className="text-emerald-200 text-sm truncate">
                                  {provider.address}
                                </span>
                              </div>
                            )}
                            
                            {/* Rating display if available */}
                            {provider.rating > 0 && (
                              <div className="flex items-center mt-1">
                                <Star size={14} className="text-yellow-400 fill-current flex-shrink-0" />
                                <span className="text-emerald-200 text-sm ml-1">
                                  {provider.rating} ({provider.ratingCount || 0} reviews)
                                </span>
                              </div>
                            )}

                            {/* Open status */}
                            {provider.isOpen !== undefined && (
                              <div className="flex items-center mt-1">
                                <Clock size={14} className={provider.isOpen ? "text-green-400 flex-shrink-0" : "text-red-400 flex-shrink-0"} />
                                <span className={`text-sm ml-1 ${provider.isOpen ? "text-green-400" : "text-red-400"}`}>
                                  {provider.isOpen ? "Open now" : "Closed"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex space-x-2">
                          {/* Call button */}
                          {provider.phone && (
                            <button
                              onClick={() => handleCallProvider(provider.phone)}
                              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white py-2.5 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 active:scale-95 transform"
                            >
                              <Phone size={16} />
                              <span>Call</span>
                            </button>
                          )}

                          {/* WhatsApp button */}
                          {provider.phone && (
                            <button
                              onClick={() => handleWhatsApp(provider.phone, provider.name)}
                              className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2.5 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 active:scale-95 transform"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.209-3.553-8.485"/>
                              </svg>
                              <span>WhatsApp</span>
                            </button>
                          )}
                        </div>

                        {/* App download prompt for profile providers */}
                        {hasProfile && (
                          <div className="mt-2 pt-2 border-t border-emerald-400/20">
                            <button
                              onClick={handleDownloadApp}
                              className="text-emerald-400 text-xs flex items-center hover:text-emerald-300 transition-colors active:text-emerald-200"
                            >
                              <Download size={12} className="mr-1" />
                              Download app to view full profile, photos & reviews
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Scroll indicator for many providers */}
                  {filteredProviders.length > 5 && (
                    <div className="flex justify-center py-2 text-emerald-400/60 text-xs">
                      <ChevronDown size={16} className="animate-bounce" />
                      <span className="mx-1">Scroll for more</span>
                      <ChevronDown size={16} className="animate-bounce" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-emerald-300">No providers found for this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Discover;