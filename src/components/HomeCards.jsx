import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  Heart, 
  Home, 
  GraduationCap, 
  UtensilsCrossed, 
  Pill, 
  ShoppingBag, 
  Apple, 
  Package, 
  UserSearch, 
  Smartphone, 
  MessageSquare, 
  FileText,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const ServiceCards = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

const services = [
  { 
    id: 'food', 
    name: 'Food Delivery', 
    icon: UtensilsCrossed, 
    color: '#fcd34d', 
    path: '/food-delivery',
    description: 'Order from campus vendors'
  },
  { 
    id: 'rental', 
    name: 'Rental Booking', 
    icon: Home, 
    color: '#ffffff', 
    path: '/rentals',
    description: 'Find perfect student housing'
  },
  { 
    id: 'eshop', 
    name: 'E-Shop', 
    icon: ShoppingBag, 
    color: '#fbbf24', 
    path: '/eshop',
    description: 'Campus store marketplace'
  },
  { 
    id: 'groceries', 
    name: 'Groceries', 
    icon: Apple, 
    color: '#34d399', 
    path: '/greenhub',
    description: 'Fresh groceries & essentials'
  },
  { 
    id: 'pharmacy', 
    name: 'Chemist', 
    icon: Pill, 
    color: '#a78bfa', 
    path: '/pharmacy',
    description: 'Medical supplies & pharmacy'
  },
  { 
    id: 'university', 
    name: 'My University', 
    icon: GraduationCap, 
    color: '#34d399', 
    path: '/myschool',
    description: 'Academic resources & info'
  },
  { 
    id: 'roommate', 
    name: 'Roommate Finder', 
    icon: UserSearch, 
    color: '#60a5fa', 
    path: '/find-roommate',
    description: 'Match with compatible roommates'
  },
  { 
    id: 'secondhand', 
    name: 'Second-hand Market', 
    icon: Package, 
    color: '#a78bfa', 
    path: '/markethub',
    description: 'Buy & sell with peers'
  },
  { 
    id: 'moilink', 
    name: 'Transport Hub', 
    icon: Users, 
    color: '#60a5fa', 
    path: '/moilinktravellers',
    description: 'Connect with fellow travelers'
  },
  { 
    id: 'bundles', 
    name: 'Bingwa Sokoni', 
    icon: Smartphone, 
    color: '#fb7185', 
    path: 'https://mvobingwa.godaddysites.com',
    description: 'Mobile bundles & services',
    external: true
  },
  { 
    id: 'linkme', 
    name: 'LinkMe', 
    icon: Heart, 
    color: '#f87171', 
    path: '/linkme',
    description: 'Campus dating & connections'
  },
  { 
    id: 'gossip', 
    name: 'Moi Gossip', 
    icon: MessageSquare, 
    color: '#38bdf8', 
    path: 'https://whatsapp.com/channel/0029VaaSTiF8PgsQn25sXK1I',
    description: 'Campus news & updates',
    external: true
  },
  { 
    id: 'blog', 
    name: 'Blog Post', 
    icon: FileText, 
    color: '#34d399', 
    path: '/blog',
    description: 'Community stories & articles'
  }
];

  const DiscoverBanner = () => (
    <div 
      className="block mb-8 no-underline cursor-pointer"
      onMouseEnter={() => setHoveredCard('discover')}
      onMouseLeave={() => setHoveredCard(null)}
      onClick={() => window.location.href = '/discover'}
    >
      <div className={`relative overflow-hidden bg-gradient-to-r from-[#083028] to-[#0a3d2e] backdrop-blur-sm border-2 border-emerald-400/40 rounded-2xl p-6 transition-all duration-300 ${
        hoveredCard === 'discover' ? 'scale-105 border-white shadow-lg shadow-emerald-500/25' : ''
      }`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-emerald-400 to-transparent rounded-full blur-xl" />
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-teal-400 to-transparent rounded-full blur-lg" />
        </div>

<div className="relative flex items-center justify-between">
  <div className="flex items-center space-x-3">
    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
      <Search size={22} color="white" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white mb-0.5">Discover Services</h3>
      <p className="text-emerald-200 text-sm">Find the best around Moi University</p>
      <div className="mt-2">
        <p className="text-emerald-300/80 text-xs font-medium">
          <Sparkles size={14} className="inline mr-1" />
          Bodaboda, TukTuks, Mamafua, Gas Deliveries & more
        </p>
      </div>
    </div>
  </div>
  <ChevronRight 
    size={24} 
    color="#10b981" 
    className={`transition-transform duration-300 ${
      hoveredCard === 'discover' ? 'translate-x-1' : ''
    }`} 
  />
</div>

      </div>
    </div>
  );

  const ServiceCard = ({ service }) => {
    const Icon = service.icon;
    const isExternal = service.external;
    
    const CardContent = () => (
      <div 
        className={`relative group bg-[#083028]/80 backdrop-blur-sm border-2 border-emerald-400/30 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:border-white hover:bg-[#0a3d2e]/80 hover:shadow-lg hover:shadow-emerald-500/20 ${
          hoveredCard === service.id ? 'border-white shadow-lg shadow-emerald-500/20' : ''
        }`}
        onMouseEnter={() => setHoveredCard(service.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Subtle background glow */}
        <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-500/5 rounded-2xl transition-opacity duration-300 ${
          hoveredCard === service.id ? 'opacity-100' : 'opacity-0'
        }`} />

        <div className="relative flex flex-col items-center text-center space-y-3">
          {/* Icon Container */}
          <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-[#083028] border-2 border-emerald-400/30 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:border-emerald-400/60 group-hover:scale-110 shadow-lg`}>
            <Icon 
              size={28} 
              color={service.color} 
              className="drop-shadow-lg transition-transform duration-300 group-hover:scale-110" 
            />
          </div>

          {/* Service Name */}
          <h4 className="text-white font-semibold text-sm sm:text-base leading-tight group-hover:text-emerald-100 transition-colors duration-300">
            {service.name}
          </h4>

          {/* Hover indicator */}
          <div className={`w-6 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-300 ${
            hoveredCard === service.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`} />
        </div>
      </div>
    );

    return isExternal ? (
      <a 
        href={service.path} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block no-underline"
      >
        <CardContent />
      </a>
    ) : (
      <div 
        className="block no-underline cursor-pointer" 
        onClick={() => window.location.href = service.path}
      >
        <CardContent />
      </div>
    );
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#083028] via-emerald-950/30 to-[#083028] px-4 py-8">
      {/* Discover Banner */}
      <DiscoverBanner />

      {/* Services Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* Bottom gradient fade */}
      {/* <div className="mt-12 h-8 bg-gradient-to-t from-[#083028] to-transparent" /> */}
    </div>
  );
};

export default ServiceCards;