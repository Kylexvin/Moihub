import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Calendar, MapPin, Utensils, Users, Smartphone, ShoppingCart, Store, LogIn, LogOut, Home, User, Pill } from 'lucide-react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [username, setUsername] = useState('');

  // Authentication check - integrate with your authService
  useEffect(() => {
    // Replace with your actual auth service integration:
    // const token = authService.getToken();
    // const user = authService.getCurrentUser()?.username;
    // setIsLoggedIn(authService.isAuthenticated());
    // setUsername(user || '');
    
    // For demo purposes (remove in production):
    const token = localStorage?.getItem('token');
    const user = localStorage?.getItem('username');
    setIsLoggedIn(!!token);
    setUsername(user || '');
  }, []);

  const handleLogout = () => {
    // Replace with your actual auth service:
    // authService.logout();
    
    // For demo purposes (remove in production):
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
    
    setIsLoggedIn(false);
    setUsername('');
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdownName) => {
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownName);
    }
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const services = [
    { name: 'Rental Booking', href: '/rentals', icon: Calendar },
    { name: 'E-Chem', href: '/pharmacy', icon: Pill },
    { name: 'Local Services', href: '/discover', icon: MapPin },
    { name: 'Food Delivery', href: '/food-delivery', icon: Utensils },
    { name: 'Find Roommate', href: '/find-roommate', icon: Users },
    { name: 'Data Bundles', href: 'https://mvobingwa.godaddysites.com', icon: Smartphone },
  ];

  const shopping = [
    { name: 'E-Shop', href: '/eshop', icon: ShoppingCart },
    { name: 'Grocery', href: '/greenhub', icon: ShoppingCart },
    { name: 'E-Chem', href: '/pharmacy', icon: Pill },
    { name: 'Marketplace', href: 'https://markethub-mocha.vercel.app/', icon: Store },
  ];

  return (
    <nav style={{ 
      position: 'relative', 
      backgroundColor: '#083028', 
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      borderBottom: '1px solid rgba(34, 197, 94, 0.2)'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        inset: '0',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '-8px',
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '25%',
          width: '64px',
          height: '64px',
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          borderRadius: '50%',
          animation: 'pulse 2s infinite',
          animationDelay: '1s'
        }}></div>
      </div>

      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '0 16px' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          height: '64px' 
        }}>
          {/* Logo Section */}
     
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '12px' 
}}>
  <div style={{ position: 'relative' }}>
    <img 
      src="/logo2.png" 
      alt="MoiHub Logo"
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        objectFit: 'cover',
        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
      }}
    />
    <div style={{
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      width: '12px',
      height: '12px',
      backgroundColor: '#22c55e',
      borderRadius: '50%',
      animation: 'ping 1s infinite'
    }}></div>
  </div>
  <div style={{
    fontSize: '24px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #22c55e, #dcfce7)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent' 
  }}>
    MoiHub
  </div>
</div>


          {/* Desktop Navigation */}
          <div style={{ 
            display: 'none', 
            alignItems: 'center', 
            gap: '32px' 
          }} className="desktop-nav">
            <a
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#dcfce7',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                padding: '8px 12px',
                borderRadius: '6px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#22c55e';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#dcfce7';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <Home size={18} />
              <span>Home</span>
            </a>

            {/* Services Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onMouseEnter={() => setActiveDropdown('services')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#dcfce7',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#22c55e';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  if (activeDropdown !== 'services') {
                    e.target.style.color = '#dcfce7';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                <span>Services</span>
                <ChevronDown size={16} style={{
                  transition: 'transform 0.2s ease',
                  transform: activeDropdown === 'services' ? 'rotate(180deg)' : 'rotate(0deg)'
                }} />
              </button>
              
              {activeDropdown === 'services' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    marginTop: '8px',
                    width: '256px',
                    backgroundColor: 'rgba(8, 48, 40, 0.95)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    overflow: 'hidden',
                    zIndex: '50000000000000'
                  }}
                >
                  {services.map((service, index) => {
                    const IconComponent = service.icon;
                    return (
                      <a
                        key={index}
                        href={service.href}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          color: '#dcfce7',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                          borderBottom: index < services.length - 1 ? '1px solid rgba(34, 197, 94, 0.1)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#22c55e';
                          e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#dcfce7';
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        <IconComponent size={18} style={{ color: '#22c55e' }} />
                        <span>{service.name}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Shopping Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onMouseEnter={() => setActiveDropdown('shopping')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#dcfce7',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#22c55e';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  if (activeDropdown !== 'shopping') {
                    e.target.style.color = '#dcfce7';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                <span>Shopping</span>
                <ChevronDown size={16} style={{
                  transition: 'transform 0.2s ease',
                  transform: activeDropdown === 'shopping' ? 'rotate(180deg)' : 'rotate(0deg)'
                }} />
              </button>
              
              {activeDropdown === 'shopping' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    marginTop: '8px',
                    width: '256px',
                    backgroundColor: 'rgba(8, 48, 40, 0.95)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    overflow: 'hidden',
                    zIndex: '5000000000'
                  }}
                >
                  {shopping.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <a
                        key={index}
                        href={item.href}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          color: '#dcfce7',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                          borderBottom: index < shopping.length - 1 ? '1px solid rgba(34, 197, 94, 0.1)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#22c55e';
                          e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#dcfce7';
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        <IconComponent size={18} style={{ color: '#22c55e' }} />
                        <span>{item.name}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            <a
              href="/ourteam"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#dcfce7',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                padding: '8px 12px',
                borderRadius: '6px'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#22c55e';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#dcfce7';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <User size={18} />
              <span>Our Team</span>
            </a>
          </div>

          {/* Auth Button & Mobile Menu */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px' 
          }}>
            {/* Desktop Auth Button */}
            <div style={{ display: 'none' }} className="desktop-auth">
              {isLoggedIn ? (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px' 
                }}>
                  <span style={{ 
                    color: '#dcfce7', 
                    fontSize: '14px' 
                  }}>
                    Welcome, {username}
                  </span>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.background = 'linear-gradient(135deg, #b91c1c, #dc2626)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)';
                    }}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <a
                  href="/login"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.background = 'linear-gradient(135deg, #15803d, #16a34a)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';
                  }}
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </a>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              style={{
                display: 'block',
                padding: '8px',
                color: '#22c55e',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
              className="mobile-menu-btn"
              onMouseEnter={(e) => e.target.style.color = '#dcfce7'}
              onMouseLeave={(e) => e.target.style.color = '#22c55e'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          backgroundColor: 'rgba(8, 48, 40, 0.98)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(34, 197, 94, 0.2)',
          zIndex: '4000000000'
        }}>
          <div style={{ 
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <a
              href="/"
              onClick={closeAllMenus}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#dcfce7',
                textDecoration: 'none',
                padding: '8px 0',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#22c55e'}
              onMouseLeave={(e) => e.target.style.color = '#dcfce7'}
            >
              <Home size={20} />
              <span>Home</span>
            </a>

            {/* Mobile Services */}
            <div>
              <button
                onClick={() => toggleDropdown('services')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  color: '#dcfce7',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 0',
                  fontSize: '16px',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#22c55e'}
                onMouseLeave={(e) => e.target.style.color = '#dcfce7'}
              >
                <span>Services</span>
                <ChevronDown size={16} style={{
                  transition: 'transform 0.2s ease',
                  transform: activeDropdown === 'services' ? 'rotate(180deg)' : 'rotate(0deg)'
                }} />
              </button>
              {activeDropdown === 'services' && (
                <div style={{ 
                  marginLeft: '16px', 
                  marginTop: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {services.map((service, index) => {
                    const IconComponent = service.icon;
                    return (
                      <a
                        key={index}
                        href={service.href}
                        onClick={closeAllMenus}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          color: '#dcfce7',
                          textDecoration: 'none',
                          padding: '8px 0',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#22c55e'}
                        onMouseLeave={(e) => e.target.style.color = '#dcfce7'}
                      >
                        <IconComponent size={18} />
                        <span>{service.name}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Shopping */}
            <div>
              <button
                onClick={() => toggleDropdown('shopping')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  color: '#dcfce7',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 0',
                  fontSize: '16px',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#22c55e'}
                onMouseLeave={(e) => e.target.style.color = '#dcfce7'}
              >
                <span>Shopping</span>
                <ChevronDown size={16} style={{
                  transition: 'transform 0.2s ease',
                  transform: activeDropdown === 'shopping' ? 'rotate(180deg)' : 'rotate(0deg)'
                }} />
              </button>
              {activeDropdown === 'shopping' && (
                <div style={{ 
                  marginLeft: '16px', 
                  marginTop: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {shopping.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <a
                        key={index}
                        href={item.href}
                        onClick={closeAllMenus}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          color: '#dcfce7',
                          textDecoration: 'none',
                          padding: '8px 0',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#22c55e'}
                        onMouseLeave={(e) => e.target.style.color = '#dcfce7'}
                      >
                        <IconComponent size={18} />
                        <span>{item.name}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            <a
              href="/ourteam"
              onClick={closeAllMenus}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#dcfce7',
                textDecoration: 'none',
                padding: '8px 0',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#22c55e'}
              onMouseLeave={(e) => e.target.style.color = '#dcfce7'}
            >
              <User size={20} />
              <span>Our Team</span>
            </a>

            {/* Mobile Auth */}
            <div style={{ 
              paddingTop: '16px', 
              borderTop: '1px solid rgba(34, 197, 94, 0.2)' 
            }}>
              {isLoggedIn ? (
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <p style={{ 
                    color: '#dcfce7', 
                    fontSize: '14px',
                    margin: '0'
                  }}>
                    Welcome, {username}
                  </p>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeAllMenus();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <a
                  href="/login"
                  onClick={closeAllMenus}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    width: '100%',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: '30'
          }}
          onClick={closeAllMenus}
        />
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-auth {
            display: block !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;