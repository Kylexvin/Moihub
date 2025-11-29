import React, { useState, useEffect } from 'react';
import { Search, Phone, MapPin, ChevronLeft, Loader, X } from 'lucide-react';

const Discover = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProvidersModal, setShowProvidersModal] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://moihub.onrender.com/api/services/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async (categoryId) => {
    try {
      setProvidersLoading(true);
      const response = await fetch(`https://moihub.onrender.com/api/services/providers/${categoryId}`);
      const data = await response.json();
      setProviders(data.providers || []);
      setSelectedCategory(data.category);
      setShowProvidersModal(true);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setProvidersLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    fetchProviders(category._id);
  };

  const handleCallProvider = (phoneNumber) => {
    // Format phone number for tel link
    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+254${phoneNumber.replace(/^0/, '')}`;
    window.open(`tel:${formattedNumber}`, '_self');
  };

  const handleWhatsApp = (phoneNumber) => {
    // Format phone number for WhatsApp
    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber.replace('+', '') : `254${phoneNumber.replace(/^0/, '')}`;
    const message = `Hello, I found your contact on MoiHub and I'm interested in your ${selectedCategory} services.`;
    window.open(`https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProviders = providers.filter(provider =>
    provider.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.areasOfOperation.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#083028] to-[#0a3d2e] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-emerald-200">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c5440] to-[#0e6b52] p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400" size={20} />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#083028] border border-emerald-400/30 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              onClick={() => handleCategoryClick(category)}
              className="bg-[#083028]/80 backdrop-blur-sm border-2 border-emerald-400/30 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-emerald-400/60 hover:bg-[#0a3d2e]/80 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-400/10 rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full" />
                </div>
                <h3 className="text-white font-semibold text-sm leading-tight">
                  {category.name}
                </h3>
                <p className="text-emerald-200 text-xs leading-tight line-clamp-2">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-emerald-300">No services found matching your search.</p>
          </div>
        )}
      </div>

      {/* Providers Modal */}
      {showProvidersModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#083028] border border-emerald-400/30 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-emerald-400/20">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedCategory}</h2>
                <p className="text-emerald-200 text-sm">
                  {providers.length} service {providers.length === 1 ? 'provider' : 'providers'} available
                </p>
              </div>
              <button
                onClick={() => setShowProvidersModal(false)}
                className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Providers List */}
            <div className="overflow-y-auto max-h-[60vh] p-4">
              {providersLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-6 h-6 text-emerald-400 animate-spin" />
                </div>
              ) : filteredProviders.length > 0 ? (
                <div className="space-y-3">
                  {filteredProviders.map((provider) => (
                    <div
                      key={provider._id}
                      className="bg-[#0a3d2e]/50 border border-emerald-400/20 rounded-xl p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-white font-semibold">{provider.providerName}</h3>
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin size={14} className="text-emerald-400" />
                            <span className="text-emerald-200 text-sm">
                              {provider.areasOfOperation.join(', ')}
                            </span>
                          </div>
                        </div>
                        {provider.isApproved && (
                          <span className="bg-emerald-400/20 text-emerald-400 text-xs px-2 py-1 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleCallProvider(provider.phoneNumber)}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          <Phone size={16} />
                          <span>Call</span>
                        </button>
                        <button
                          onClick={() => handleWhatsApp(provider.phoneNumber)}
                          className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.209-3.553-8.485"/>
                          </svg>
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-emerald-300">No providers found for this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;