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
  LogOut 
} from 'lucide-react';

// Import components
import RoutesManagement from './RoutesManagement';
import MatatusManagement from './MatatusManagement';
import PaymentManagement from './PaymentManagement';

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
      setUserName(decoded.name || 'Admin'); // Get user name if available

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

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Early return if not authenticated or not admin
  if (!isAuthenticated || userRole !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <button 
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
      case 'dashboard':
      default:
        return <div className="p-4">Dashboard - Coming Soon</div>;
      case 'bookings':
        return <div className="p-4">Bookings - Coming Soon</div>;
      case 'transactions':
        return <PaymentManagement setError={setError} setSuccess={setSuccess} />;
    }
  };

  // Nav item component
  const NavItem = ({ icon: Icon, title, id }) => (
    <button
      className={`flex items-center w-full py-3 px-4 rounded-lg transition-colors ${
        currentView === id 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-700 hover:bg-blue-50'
      }`}
      onClick={() => setCurrentView(id)}
    >
      <Icon className="h-5 w-5 mr-3" />
      <span>{title}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        {/* Logo and brand */}
        <div className="px-6 pt-6 pb-4 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Matatu Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Management System</p>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <NavItem icon={Home} title="Dashboard" id="dashboard" />
          <NavItem icon={MapPin} title="Routes" id="routes" />
          <NavItem icon={Bus} title="Matatus" id="matatus" />
          <NavItem icon={BookOpen} title="Bookings" id="bookings" />
          <NavItem icon={DollarSign} title="Transactions" id="transactions" />
        </nav>
        
        {/* User info */}
        <div className="absolute bottom-0 w-64 border-t border-gray-200 p-4">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-700">{userName}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" /> 
            Log Out
          </button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <h2 className="text-lg font-medium">
            {currentView === 'dashboard' && 'Dashboard'}
            {currentView === 'routes' && 'Routes Management'}
            {currentView === 'matatus' && 'Matatus Management'}
            {currentView === 'bookings' && 'Bookings Management'}
            {currentView === 'transactions' && 'Transactions'}
          </h2>
          <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
        </header>
        
        {/* Error and success messages */}
        <div className="px-6 py-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
        </div>
        
        {/* Content area */}
        <main className="flex-1 overflow-y-auto pb-10">
          <div className="container mx-auto px-6">
            {renderActiveComponent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MatatuAdmin;