import React, { useState, useEffect, useRef } from 'react';
import { Home, ShoppingBag, Users, Heart, Package, FileText, UtensilsCrossed, MessageCircle, Wrench } from 'lucide-react';

const Hero = () => {
  const [currentView, setCurrentView] = useState(0);
  const [showPreview, setShowPreview] = useState(null);
  const [filmStripPosition, setFilmStripPosition] = useState(0);
  const heroRef = useRef(null);
  const orbRef = useRef(null);
  const filmStripRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [pulseWaves, setPulseWaves] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const services = {
    rentals: { name: 'Rentals', icon: Home, color: '#ffffff', desc: 'Find perfect student housing' },
    eshops: { name: 'E-Shops', icon: ShoppingBag, color: '#fbbf24', desc: 'Campus store marketplace' },
    roommate: { name: 'Roommate Finder', icon: Users, color: '#60a5fa', desc: 'Match with compatible roommates' },
    linkme: { name: 'LinkMe', icon: Heart, color: '#f87171', desc: 'Campus dating & connections' },
    marketplace: { name: 'Marketplace', icon: Package, color: '#a78bfa', desc: 'Buy & sell with peers' },
    blogs: { name: 'Blogs', icon: FileText, color: '#34d399', desc: 'Campus news & stories' },
    food: { name: 'Food Delivery', icon: UtensilsCrossed, color: '#fcd34d', desc: 'Order from campus vendors' },
    messaging: { name: 'Messaging', icon: MessageCircle, color: '#38bdf8', desc: 'Real-time chat with friends' },
    services: { name: 'Local Services', icon: Wrench, color: '#fb7185', desc: 'Laundry, printing & more' }
  };

  const views = [
    {
      orbiting: ['rentals', 'eshops'],
      rightSide: ['food', 'roommate'],
      headline: 'Everything Campus. Instantly.',
      subtext: 'Your all-in-one campus companion'
    },
    {
      orbiting: ['food', 'linkme'],
      rightSide: ['marketplace', 'messaging'],
      headline: 'All your campus needs. In one place.',
      subtext: 'Connect, shop, and discover with ease'
    },
    {
      orbiting: ['blogs', 'services'],
      rightSide: ['rentals', 'food'],
      headline: 'Campus life simplified.',
      subtext: 'Everything you need, when you need it'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentView((prev) => (prev + 1) % views.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.target.closest('.film-strip')) {
        e.preventDefault();
        const maxScroll = (Object.keys(services).length * 120) - window.innerHeight + 200;
        setFilmStripPosition(prev => {
          const newPos = prev + e.deltaY * 0.5;
          return Math.max(-maxScroll, Math.min(0, newPos));
        });
      }
    };

    const handleMouseDown = (e) => {
      if (e.target.closest('.film-strip')) {
        setIsDragging(true);
        e.preventDefault();
      }
    };

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      if (isDragging) {
        const maxScroll = (Object.keys(services).length * 120) - window.innerHeight + 200;
        setFilmStripPosition(prev => {
          const newPos = prev + e.movementY;
          return Math.max(-maxScroll, Math.min(0, newPos));
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const createPulseWave = (x, y) => {
    const id = Date.now() + Math.random();
    setPulseWaves(prev => [...prev, { id, x, y, scale: 0 }]);
    setTimeout(() => {
      setPulseWaves(prev => prev.filter(wave => wave.id !== id));
    }, 1500);
  };

  const handleIconClick = (service) => {
    setShowPreview(service);
    setTimeout(() => setShowPreview(null), 3000);
  };

  const handleSwipe = (direction) => {
    if (direction === 'left') {
      setCurrentView((prev) => (prev + 1) % views.length);
    } else {
      setCurrentView((prev) => (prev - 1 + views.length) % views.length);
    }
  };

  useEffect(() => {
    let startX = 0;
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 100) {
        handleSwipe(diff > 0 ? 'left' : 'right');
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('touchstart', handleTouchStart);
      hero.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (hero) {
        hero.removeEventListener('touchstart', handleTouchStart);
        hero.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  const currentViewData = views[currentView];

  return (
<div
  ref={heroRef}
  className="relative w-full overflow-hidden lg:h-screen"
  style={{
    height: window.innerWidth <= 768 ? '400px' : 'auto',
    minHeight: window.innerWidth <= 768 ? '400px' : `calc(100vh - 64px)`,
    backgroundImage: `
      url('/herobg.jpg'),
      url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"><defs><pattern id="campus" patternUnits="userSpaceOnUse" width="200" height="200"><rect width="200" height="200" fill="%23134e4a" opacity="0.05"/><circle cx="50" cy="50" r="20" fill="%2310b981" opacity="0.1"/><rect x="120" y="30" width="40" height="60" rx="5" fill="%2306d6a0" opacity="0.08"/><polygon points="30,150 70,120 110,150 110,180 30,180" fill="%23059669" opacity="0.06"/><circle cx="150" cy="150" r="15" fill="%230d9488" opacity="0.08"/></pattern></defs><rect width="100%" height="100%" fill="url(%23campus)"/><rect width="100%" height="100%" fill="url(data:image/svg+xml,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot;><circle cx=&quot;20&quot; cy=&quot;20&quot; r=&quot;2&quot; fill=&quot;%2310b981&quot; opacity=&quot;0.2&quot;/><circle cx=&quot;80&quot; cy=&quot;40&quot; r=&quot;1.5&quot; fill=&quot;%2306d6a0&quot; opacity=&quot;0.15&quot;/><circle cx=&quot;40&quot; cy=&quot;70&quot; r=&quot;1&quot; fill=&quot;%23059669&quot; opacity=&quot;0.18&quot;/></svg>)"/></svg>'),
      radial-gradient(ellipse at ${mousePos.x * 0.1}% ${mousePos.y * 0.1}%,
        rgba(16, 185, 129, 0.35) 0%,
        rgba(6, 78, 59, 0.15) 40%,
        rgba(17, 24, 39, 0.6) 80%,
        rgba(0, 0, 0, 0.7) 100%)
    `,
    backgroundSize: 'cover, cover, cover',
    backgroundBlendMode: 'soft-light, normal, normal',
    backgroundColor: '#111827',
    filter: 'brightness(1.1) contrast(1.05)'
  }}
  onClick={(e) => createPulseWave(e.clientX, e.clientY)}
>

      {/* Pulse Waves */}
      {pulseWaves.map(wave => (
        <div
          key={wave.id}
          className="absolute pointer-events-none"
          style={{
            left: wave.x,
            top: wave.y,
            transform: 'translate(-50%, -50%)',
            animation: 'pulseWave 1.5s ease-out forwards'
          }}
        >
          <div className="w-4 h-4 border-2 border-emerald-400 rounded-full opacity-70 animate-ping" />
        </div>
      ))}

      {/* Floating 3D Orb */}
      <div className="absolute left-4 lg:left-1/4 top-1/2 transform -translate-y-1/2">
        <div 
          ref={orbRef}
          className="relative w-24 h-24 lg:w-32 lg:h-32 animate-pulse"
          style={{ animation: 'float 6s ease-in-out infinite' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-80 blur-lg animate-spin" 
               style={{ animationDuration: '20s' }} />
          <div className="absolute inset-2 bg-gradient-to-br from-emerald-300 to-emerald-600 rounded-full shadow-2xl border border-emerald-200/30" />
          <div className="absolute inset-4 bg-gradient-to-tl from-transparent to-white/20 rounded-full" />
          
          {/* Orbiting Icons */}
          {currentViewData.orbiting.map((serviceKey, index) => {
            const service = services[serviceKey];
            const Icon = service.icon;
            const angle = (index * 180) + (Date.now() * 0.001 % 360);
            const x = Math.cos(angle * Math.PI / 180) * (window.innerWidth <= 768 ? 60 : 80);
            const y = Math.sin(angle * Math.PI / 180) * (window.innerWidth <= 768 ? 60 : 80);
            
            return (
              <div
                key={serviceKey}
                className="absolute w-10 h-10 lg:w-12 lg:h-12 cursor-pointer transform transition-all duration-300 hover:scale-125"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleIconClick(serviceKey)}
              >
                <div className="w-full h-full bg-gray-900/90 backdrop-blur-sm border-2 border-emerald-400/70 rounded-full flex items-center justify-center hover:border-white hover:bg-gray-800/90 transition-all duration-300 shadow-lg">
                  <Icon size={window.innerWidth <= 768 ? 16 : 20} color={service.color} className="drop-shadow-lg" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Camera Film Strip - Desktop Only */}
      <div className="hidden lg:block absolute right-8 top-0 h-screen w-24 film-strip">
        {/* Film Strip Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 border-l-4 border-r-4 border-gray-600 opacity-90">
          {/* Film holes */}
          <div className="absolute left-1 top-0 bottom-0 w-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-4 bg-black rounded-sm mb-4 mt-2 opacity-80"
                style={{ top: `${i * 8}%` }}
              />
            ))}
          </div>
          <div className="absolute right-1 top-0 bottom-0 w-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-4 bg-black rounded-sm mb-4 mt-2 opacity-80"
                style={{ top: `${i * 8}%` }}
              />
            ))}
          </div>
        </div>

        {/* Service Icons on Film */}
        <div
          className="absolute inset-x-0 transition-transform duration-300 ease-out"
          style={{ 
            transform: `translateY(${filmStripPosition}px)`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          {Object.entries(services).map(([serviceKey, service], index) => {
            const Icon = service.icon;
            return (
              <div
                key={serviceKey}
                className="relative mx-auto my-8 w-16 h-16 cursor-pointer transform transition-all duration-300 hover:scale-110"
                onClick={() => handleIconClick(serviceKey)}
              >
                {/* Film frame */}
                <div className="absolute -inset-2 bg-gray-700/50 border border-gray-500 rounded"></div>
                
                {/* Icon container */}
                <div className="relative w-full h-full bg-black/60 backdrop-blur-sm border-2 border-gray-400/60 rounded-lg flex flex-col items-center justify-center hover:border-white hover:bg-gray-800/80 transition-all duration-300 group shadow-lg">
                  <Icon size={24} color={service.color} className="group-hover:scale-110 transition-transform duration-300 drop-shadow-lg mb-1" />
                  <span className="text-xs text-gray-300 font-medium leading-none">{service.name.split(' ')[0]}</span>
                </div>

                {/* Film frame number */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-mono">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Right Side Icons (Fallback) */}
      <div className="lg:hidden absolute right-4 top-1/2 transform -translate-y-1/2 space-y-6">
        {currentViewData.rightSide.map((serviceKey, index) => {
          const service = services[serviceKey];
          const Icon = service.icon;
          
          return (
            <div
              key={serviceKey}
              className="w-12 h-12 cursor-pointer transform transition-all duration-500 hover:scale-110"
              style={{
                animationDelay: `${index * 0.2}s`,
                animation: 'slideInRight 0.8s ease-out forwards'
              }}
              onClick={() => handleIconClick(serviceKey)}
            >
              <div className="w-full h-full bg-gray-900/80 backdrop-blur-sm border-2 border-emerald-500/60 rounded-xl flex items-center justify-center hover:border-white hover:bg-gray-800/90 transition-all duration-300 group shadow-lg">
                <Icon size={20} color={service.color} className="group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Left Content */}
      <div className="absolute bottom-1/4 lg:bottom-16 left-4 lg:left-16 max-w-xs lg:max-w-lg pr-4">
        <h1 
          key={currentView}
          className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight"
          style={{ animation: 'glitchIn 0.8s ease-out forwards' }}
        >
          {currentViewData.headline}
        </h1>
        <p 
          key={`${currentView}-sub`}
          className="text-emerald-200 text-base lg:text-lg mb-8 opacity-90"
          style={{ animation: 'fadeInUp 1s ease-out 0.3s forwards', opacity: 0 }}
        >
          {currentViewData.subtext}
        </p>
        
        <div className="flex justify-start">
         <a
  href="https://moihubapk.vercel.app"
  className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 border border-emerald-400/30 inline-block text-center text-sm lg:text-base"
>
  Download App
</a>

        </div>
      </div>

      {/* Service Preview */}
      {showPreview && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-lg border border-emerald-400/50 rounded-2xl p-6 lg:p-8 text-center shadow-2xl z-50 animate-pulse max-w-xs lg:max-w-sm mx-4">
          <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
            {React.createElement(services[showPreview].icon, { size: window.innerWidth <= 768 ? 24 : 32, color: 'white' })}
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">{services[showPreview].name}</h3>
          <p className="text-emerald-200 mb-4 text-sm lg:text-base">{services[showPreview].desc}</p>
          <button className="px-4 lg:px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-400 transition-colors duration-300 text-sm lg:text-base">
            Learn More
          </button>
        </div>
      )}

      {/* View Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {views.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentView(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentView ? 'bg-emerald-400' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulseWave {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(20); opacity: 0; }
        }
        
        @keyframes glitchIn {
          0% { transform: translateX(-100%); opacity: 0; }
          20% { transform: translateX(10px); opacity: 0.8; }
          40% { transform: translateX(-5px); opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeInUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0.9; }
        }
        
        @keyframes slideInRight {
          0% { transform: translateX(50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @media (max-width: 1024px) {
          .lg\\:h-screen {
            height: auto;
            min-height: calc(100vh - 64px);
            padding-bottom: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;