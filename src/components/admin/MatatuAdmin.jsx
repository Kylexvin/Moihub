import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { 
  Home, 
  MapPin, 
  Bus, 
  BookOpen, 
  DollarSign, 
  AlertCircle, 
  User, 
  LogOut,
  Moon,
  Sun,
  BarChart3,
  Settings
} from 'lucide-react';

// Import components
import RoutesManagement from './RoutesManagement';
import MatatusManagement from './MatatusManagement';
import PaymentManagement from './PaymentManagement';
import BookingManagement from './BookingManagement';
import MatatuStats from './MatatuStats';

const MatatuAdmin = () => {
  // Navigation hook
  const navigate = useNavigate();
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  
  // UI states
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Check authentication first
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect if no token
      return;
    }

    try {
      const decoded = jwtDecode(token); // Decode token
      setIsAuthenticated(true);
      setUserRole(decoded.role); // Get role from token
      setUserName(decoded.name || 'Kylex'); // Get user name if available

      if (decoded.role !== "admin") {
        navigate("/"); // Redirect non-admin users
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token"); // Clear invalid token
      navigate("/");
    }
  }, [navigate]);

  // Set axios default headers
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Early return if not authenticated or not admin
  if (!isAuthenticated || userRole !== "admin") {
    return (
      <div className={`flex items-center justify-center h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
        <div className={`text-center p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>You need admin privileges to access this page.</p>
          <button 
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Render the active component based on currentView
  const renderActiveComponent = () => {
    switch (currentView) {
      case 'routes':
        return <RoutesManagement setError={setError} setSuccess={setSuccess} />;
      case 'matatus':
        return <MatatusManagement setError={setError} setSuccess={setSuccess} />;
      case 'stats':
        return <MatatuStats />;
      case 'dashboard':
      default:
        return <BookingManagement setError={setError} setSuccess={setSuccess} />;
      case 'bookings':
        return <BookingManagement setError={setError} setSuccess={setSuccess} />;
      case 'transactions':
        return <PaymentManagement setError={setError} setSuccess={setSuccess} />;
    }
  };

  // Nav item component
  const NavItem = ({ icon: Icon, title, id }) => (
    <button
      className={`flex items-center w-full py-3 px-4 rounded-lg transition-colors duration-300 ${
        currentView === id 
          ? 'bg-orange-500 text-white' 
          : darkMode 
              ? 'text-gray-300 hover:bg-gray-700' 
              : 'text-gray-700 hover:bg-orange-50'
      } ${sidebarCollapsed ? 'justify-center' : ''}`}
      onClick={() => setCurrentView(id)}
    >
      <Icon className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
      {!sidebarCollapsed && <span>{title}</span>}
    </button>
  );

  // Define theme-based colors
  const themeColors = darkMode 
    ? {
        background: 'bg-gray-900',
        sidebar: 'bg-gray-800',
        card: 'bg-gray-800',
        text: 'text-white',
        subtext: 'text-gray-300',
        border: 'border-gray-700',
        highlight: 'bg-gray-700',
      } 
    : {
        background: 'bg-gray-100',
        sidebar: 'bg-white',
        card: 'bg-white',
        text: 'text-gray-800',
        subtext: 'text-gray-600',
        border: 'border-gray-200',
        highlight: 'bg-gray-50',
      };

  return (
    <div className={`flex h-screen ${themeColors.background}`}>
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} ${themeColors.sidebar} shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Logo and brand */}
        <div className={`px-6 pt-6 pb-4 border-b ${themeColors.border} flex items-center justify-between`}>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-2xl font-bold text-orange-500">Matatu</h1>
              <p className={`text-sm ${themeColors.subtext} mt-1`}>Admin Panel</p>
            </div>
          )}
          <button 
            onClick={toggleSidebar}
            className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
          >
            {sidebarCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Navigation - takes up most of the space */}
        <nav className="p-4 space-y-2 flex-grow">
          <NavItem icon={Home} title="Dashboard" id="dashboard" />
          <NavItem icon={MapPin} title="Routes" id="routes" />
          <NavItem icon={Bus} title="Matatus" id="matatus" />
        
          <NavItem icon={DollarSign} title="Transactions" id="transactions" />
          
        </nav>
        
        {/* User info - fixed at the bottom */}
        <div className={`${themeColors.border} border-t p-4`}>
          {!sidebarCollapsed ? (
            <>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className={`font-medium ${themeColors.text}`}>{userName}</p>
                  <p className={`text-xs ${themeColors.subtext}`}>Administrator</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={toggleDarkMode} 
                  className={`flex items-center px-3 py-2 text-sm rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} transition-colors duration-300`}
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                
                <button 
                  onClick={handleLogout} 
                  className={`flex items-center px-3 py-2 text-sm text-red-500 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-50'} transition-colors duration-300`}
                >
                  <LogOut className="h-4 w-4 mr-2" /> 
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <User className="h-6 w-6 text-orange-500" />
              </div>
              <button 
                onClick={toggleDarkMode} 
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} transition-colors duration-300`}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button 
                onClick={handleLogout} 
                className={`p-2 text-red-500 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-50'} transition-colors duration-300`}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className={`${themeColors.card} shadow-sm h-16 flex items-center justify-between px-6`}>
          <h2 className={`text-lg font-medium ${themeColors.text}`}>
            {currentView === 'dashboard' && 'Dashboard'}
            {currentView === 'routes' && 'Routes Management'}
            {currentView === 'matatus' && 'Matatus Management'}
           
            {currentView === 'transactions' && 'Transactions'}
            
          </h2>
          
          {/* Quick actions */}
          <div className="flex items-center space-x-4">
            <span className={`text-sm ${themeColors.subtext}`}>{new Date().toLocaleDateString()}</span>
            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        
        {/* Error and success messages */}
        <div className="px-6 py-4">
          {error && (
            <div className={`${darkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'} border text-red-500 px-4 py-3 rounded-lg mb-4 flex items-center`}>
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className={`${darkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'} border text-green-500 px-4 py-3 rounded-lg mb-4`}>
              {success}
            </div>
          )}
        </div>
        
        {/* Content area */}
        <main className="max-h-full overflow-y-auto pb-10">
  <div className="container mx-auto px-6">
    {renderActiveComponent()}
  </div>
</main>


      </div>
    </div>
  );
};

export default MatatuAdmin;