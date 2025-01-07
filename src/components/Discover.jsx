import React, { useState } from 'react';
import { Search, Phone, MapPin, ExternalLink, MessageSquare, Share2 } from 'lucide-react';

const ServiceMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const services = [
    {
      category: "Motorbike Services",
      providers: [
        {
          id: "eduu",
          name: "Eduu",
          phone: "0725118223",
          hasPage: false,
          rating: 4.5,
          reviews: 45,
          location: "Main Gate Area",
          tags: ["Bodaboda", "Transport", "24/7"],
          availability: "Available Now"
        },
        {
          id: "feloo",
          name: "Feloo",
          phone: "0717022787",
          hasPage: false,
          rating: 4.6,
          reviews: 38,
          location: "Student Center",
          tags: ["Bodaboda", "Transport"],
          availability: "Available Now"
        },
        {
          id: "biwott",
          name: "Biwott",
          phone: "0748667191",
          hasPage: false,
          rating: 4.4,
          reviews: 42,
          location: "Main Gate",
          tags: ["Bodaboda", "Transport"],
          availability: "Available Now"
        }
      ]
    },
    {
      category: "Gas Deliveries Services",
      providers: [
        {
          id: "africana",
          name: "Africana",
          phone: "0715100949",
          hasPage: false,
          rating: 4.7,
          reviews: 89,
          location: "Campus Wide Delivery",
          tags: ["Gas Refill", "Delivery"],
          availability: "Available Now"
        }
      ]
    },
    {
      category: "Mama Fua",
      providers: [
        {
          id: "rebo",
          name: "Rebo",
          phone: "0717249441",
          hasPage: false,
          rating: 4.8,
          reviews: 156,
          location: "Rebo Area",
          tags: ["Laundry", "Cleaning"],
          availability: "Available Now"
        },
        {
          id: "emerald",
          name: "Emerald",
          phone: "0748446504",
          hasPage: false,
          rating: 4.6,
          reviews: 92,
          location: "Emerald Area",
          tags: ["Laundry", "Cleaning"],
          availability: "Available Now"
        },
        {
          id: "mobile",
          name: "Mobile",
          phone: "0790861147",
          hasPage: false,
          rating: 4.5,
          reviews: 78,
          location: "Mobile Service",
          tags: ["Laundry", "Pickup", "Delivery"],
          availability: "Available Now"
        },
        {
          id: "mercy",
          name: "Mercy (Stage)",
          phone: "0745042970",
          hasPage: false,
          rating: 4.7,
          reviews: 112,
          location: "Stage Area",
          tags: ["Laundry", "Cleaning"],
          availability: "Available Now"
        },
        {
          id: "diana",
          name: "Diana (Stage)",
          phone: "0790907727",
          hasPage: false,
          rating: 4.6,
          reviews: 94,
          location: "Stage Area",
          tags: ["Laundry", "Cleaning"],
          availability: "Available Now"
        }
      ]
    },
    {
      category: "Cake",
      providers: [
        {
          id: "cakist",
          name: "Cakist",
          phone: "+254704866857",
          hasPage: true,
          route: "cakist",
          rating: 4.9,
          reviews: 234,
          location: "Campus Area",
          tags: ["Cakes", "Pastries", "Custom Orders"],
          availability: "Available Now",
          website: "/products/Cakistbakery"
        },
        {
          id: "boss-lady",
          name: "Boss Lady",
          phone: "+254745928593",
          hasPage: true,
          route: "boss-lady",
          rating: 4.8,
          reviews: 189,
          location: "Campus Area",
          tags: ["Cakes", "Pastries", "Events"],
          availability: "Available Now",
          website: "/products/%20bakery"
        }
      ]
    },
    {
      category: "Photoshoot Services",
      providers: [
        {
          id: "evans-media",
          name: "Evans Media",
          phone: "0741845272",
          hasPage: true,
          route: "evans-media",
          rating: 4.8,
          reviews: 167,
          location: "Campus Wide",
          tags: ["Photography", "Events", "Portraits"],
          availability: "Available Now"
        }
      ]
    },
    // Newly Added Categories and Services:
    {
      category: "Tuktuk Services",
      providers: [
        {
          id: "tuktuk1",
          name: "Tuktuk 1",
          phone: "0796208766",
          hasPage: false,
          rating: 4.2,
          reviews: 32,
          location: "Campus Entrance",
          tags: ["Transport", "Tuktuk"],
          availability: "Available Now"
        },
        {
          id: "tuktuk2",
          name: "Tuktuk 2",
          phone: "0714695664",
          hasPage: false,
          rating: 4.3,
          reviews: 28,
          location: "Main Gate",
          tags: ["Transport", "Tuktuk"],
          availability: "Available Now"
        }
      ]
    },
    {
      category: "Best Kinyozi",
      providers: [
        {
          id: "maeneo-cutz",
          name: "Maeneo Cutz",
          phone: "0717241607",
          hasPage: false,
          rating: 4.6,
          reviews: 58,
          location: "Kinyozi Area",
          tags: ["Haircut", "Grooming"],
          availability: "Available Now"
        }
      ]
    },
    {
      category: "Laundry Services",
      providers: [
        {
          id: "campus-laundry",
          name: "Campus Laundry",
          phone: "0700318400",
          hasPage: false,
          rating: 4.7,
          reviews: 65,
          location: "Campus Laundry Area",
          tags: ["Laundry", "Washing"],
          availability: "Available Now"
        },
        {
          id: "talanta",
          name: "Talanta",
          phone: "0799066882",
          hasPage: false,
          rating: 4.5,
          reviews: 47,
          location: "Talanta Area",
          tags: ["Laundry", "Cleaning"],
          availability: "Available Now"
        }
      ]
    },
    {
      category: "Capentry Services",
      providers: [
        {
          id: "rosewood",
          name: "Rosewood",
          phone: "0791446535",
          hasPage: false,
          rating: 4.8,
          reviews: 52,
          location: "Woodworking Shop",
          tags: ["Carpentry", "Woodwork"],
          availability: "Available Now"
        }
      ]
    },
    {
      category: "Electronic Repairs",
      providers: [
        {
          id: "box-office",
          name: "Box Office",
          phone: "0799560552",
          hasPage: false,
          rating: 4.7,
          reviews: 34,
          location: "Tech Area",
          tags: ["Repairs", "Electronics"],
          availability: "Available Now"
        }
      ]
    }
  ];
  

  const filteredServices = services.filter(category => 
    category.category !== "Add your service here." &&
    (searchQuery === '' || 
      category.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.providers.some(provider => 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    )
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-lg p-8 mb-8 text-white">          
          <div className="relative rounded-lg">
            <input
              type="text"
              placeholder="Search for services..."
              className="w-full pl-4 pr-4 py-2 rounded-lg text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>       
      </div>


      <div className="mb-6 overflow-x-auto">
  <div className="flex gap-2 pb-2">
    <button
      onClick={() => setActiveCategory('all')}
      className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-200 ${
        activeCategory === 'all' 
          ? 'bg-green-700 text-white' // Active button
          : 'bg-gray-200 text-gray-800 hover:bg-green-500 hover:text-white' // Non-active button
      }`}
    >
      All Services
    </button>
    {filteredServices.map(category => (
      <button
        key={category.category}
        onClick={() => setActiveCategory(category.category)}
        className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-200 ${
          activeCategory === category.category 
            ? 'bg-green-700 text-white' // Active category
            : 'bg-gray-200 text-gray-800 hover:bg-green-500 hover:text-white' // Non-active category
        }`}
      >
        {category.category}
      </button>
    ))}
  </div>
</div>


      <div className="space-y-8">
        {filteredServices
          .filter(cat => activeCategory === 'all' || cat.category === activeCategory)
          .map((serviceCategory) => (
          <div key={serviceCategory.category}>
            <h2 className="text-2xl font-semibold mb-4 text-green-700">{serviceCategory.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceCategory.providers.map((provider) => (
                <div key={provider.id} className="bg-[#e8f6e9] rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="m-3 p-2 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {provider.name}
                        {provider.hasPage && (
                          <a 
                            href={provider.website}
                            className="text-green-600 hover:text-green-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          )}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      {provider.location}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {provider.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-green-200 text-green-800 text-sm px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-green-200 text-green-800 text-sm px-2 py-1 rounded-full">
                        {provider.availability}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200 flex gap-2">
                    <a 
                      href={`tel:${provider.phone}`}
                      className="flex-1 bg-green-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-800"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </a>
                    <a 
                      href={`https://wa.me/${provider.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 "
                    >
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </a>
                    <button 
                      onClick={() => {
                        navigator.share({
                          title: provider.name,
                          text: `Check out ${provider.name}`,
                          url: window.location.href
                        }).catch(console.error)
                      }}
                      className="p-2 bg-green-900 rounded-lg "
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceMarketplace;
