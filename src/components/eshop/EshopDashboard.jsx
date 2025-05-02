import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, Settings, Home, AlertTriangle, LogOut } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import components
import DashboardOverview from './DashboardOverview';
import ProductsList from './ProductsList';
import ProductForm from './ProductForm';
import EShopOrders from './EShopOrders';
import OrderDetail from './OrderDetail';
import ShopProfile from './ShopProfile';
import SubscriptionExpiredModal from './SubscriptionExpiredModal';

const EshopDashboard = () => {
  // Navigation
  const navigate = useNavigate();
  
  // State to track which component to display
  const [activeComponent, setActiveComponent] = useState('dashboard');
  // State to track if we're adding/editing a product
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  // State to track the product being edited (if any)
  const [editingProductId, setEditingProductId] = useState(null);
  // State to track the order being viewed (if any)
  const [viewingOrderId, setViewingOrderId] = useState(null);
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Loading state
  const [loading, setLoading] = useState(true);
  // Auth state
  const [user, setUser] = useState(null);
  // Subscription state
  const [subscription, setSubscription] = useState(null);
  // Show subscription modal
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Check authentication and subscription on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get auth token and role from localStorage
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');
        
        if (!token) {
          navigate('/login');
          return;
        }

        // Set authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Check if user is a shop owner
        if (role !== 'shopowner') {
          navigate('/unauthorized');
          return;
        }
        
        // Set basic user data from localStorage
        setUser({
          id: userId,
          role: role,
          // You can fetch more user details here if needed
          // or set it from your auth context if available
        });
        
        // Check subscription status
        try {
          const subscriptionResponse = await axios.get('http://localhost:5000/api/eshop/vendor/subscription-status');
          const subscriptionData = subscriptionResponse.data.subscriptionStatus;
          
          setSubscription(subscriptionData);
          
          // Show modal if subscription is not valid
          if (!subscriptionData.isSubscriptionValid) {
            setShowSubscriptionModal(true);
          }
        } catch (subError) {
          console.error('Subscription check error:', subError);
          // Continue showing the dashboard even if subscription check fails
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    navigate('/login');
  };
  
  // Function to render the correct component based on state
  const renderComponent = () => {
    if (isAddingProduct) {
      return <ProductForm 
        productId={editingProductId} 
        onCancel={() => {
          setIsAddingProduct(false);
          setEditingProductId(null);
        }}
        onSuccess={() => {
          setIsAddingProduct(false);
          setEditingProductId(null);
          setActiveComponent('products');
        }}
      />;
    }
    
    if (viewingOrderId) {
      return <OrderDetail 
        orderId={viewingOrderId} 
        onBack={() => setViewingOrderId(null)} 
      />;
    }
    
    switch (activeComponent) {
      case 'dashboard':
        return <DashboardOverview subscription={subscription} />;
      case 'products':
        return <ProductsList 
          onAddProduct={() => setIsAddingProduct(true)}
          onEditProduct={(id) => {
            setEditingProductId(id);
            setIsAddingProduct(true);
          }}
        />;
      case 'orders':
        return <EShopOrders onViewOrder={(id) => setViewingOrderId(id)} />;
      case 'settings':
        return <ShopProfile user={user} />;
      default:
        return <DashboardOverview subscription={subscription} />;
    }
  };

  // Calculate days remaining in subscription
  const getDaysRemaining = () => {
    if (!subscription || !subscription.subscriptionEndDate) return 0;
    
    const endDate = new Date(subscription.subscriptionEndDate);
    const today = new Date();
    const diffTime = endDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = subscription ? getDaysRemaining() : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showSubscriptionModal && (
        <SubscriptionExpiredModal 
          subscription={subscription}
          onClose={() => navigate('/subscription/renew')}
        />
      )}
    
      <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Sidebar - Desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r bg-white shadow-lg">
            <div className="flex items-center justify-center h-20 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
              <h1 className="text-xl font-bold text-white">Shop Dashboard</h1>
            </div>
            
            {/* Subscription status is hidden but functionality remains */}
            <div className="hidden">
              {subscription && subscription.isActive && (
                <div className={`px-4 py-2 text-sm ${daysRemaining <= 7 ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                  <div className="flex items-center">
                    {daysRemaining <= 7 && <AlertTriangle className="w-4 h-4 mr-1" />}
                    <span>
                      {daysRemaining <= 7 
                        ? `Subscription: ${daysRemaining} days left` 
                        : `Subscription active`}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col flex-grow overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                <button 
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeComponent === 'dashboard' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  onClick={() => {
                    setActiveComponent('dashboard');
                    setIsAddingProduct(false);
                    setViewingOrderId(null);
                  }}
                >
                  <Home className="mr-3 h-5 w-5" />
                  Dashboard
                </button>

                <button 
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeComponent === 'products' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  onClick={() => {
                    setActiveComponent('products');
                    setIsAddingProduct(false);
                    setViewingOrderId(null);
                  }}
                >
                  <Package className="mr-3 h-5 w-5" />
                  Products
                </button>

                <button 
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeComponent === 'orders' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  onClick={() => {
                    setActiveComponent('orders');
                    setIsAddingProduct(false);
                    setViewingOrderId(null);
                  }}
                >
                  <ShoppingCart className="mr-3 h-5 w-5" />
                  Orders
                </button>

                <button 
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeComponent === 'settings' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  onClick={() => {
                    setActiveComponent('settings');
                    setIsAddingProduct(false);
                    setViewingOrderId(null);
                  }}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </button>
                
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <button 
                    className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </div>
              </nav>
              
              {user && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {user.name?.charAt(0) || 'S'}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">{user.name || 'Shop Owner'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email || 'ID: ' + user.id?.substring(0, 8)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mobile header */}
          <div className="block md:hidden fixed top-0 left-0 right-0 z-10 bg-white shadow">
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <div className="flex items-center">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 mr-2 text-gray-600 hover:text-blue-600 focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
                <h1 className="text-lg font-medium text-blue-600">Shop Dashboard</h1>
              </div>
              <div>
                {user && (
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {user.name?.charAt(0) || 'S'}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile subscription notification - hidden but functionality remains */}
            <div className="hidden">
              {subscription && subscription.isActive && daysRemaining <= 7 && (
                <div className="px-4 py-2 bg-yellow-50 text-yellow-700 text-sm border-b flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  <span>Subscription: {daysRemaining} days remaining</span>
                </div>
              )}
            </div>
            
            {/* Mobile menu dropdown - Now positioned absolute below the header */}
            {mobileMenuOpen && (
              <div className="absolute w-full bg-white border-b shadow-lg">
                <nav className="px-2 py-3 space-y-1">
                  <button 
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeComponent === 'dashboard' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      setActiveComponent('dashboard');
                      setIsAddingProduct(false);
                      setViewingOrderId(null);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Home className="mr-3 h-5 w-5" />
                    Dashboard
                  </button>

                  <button 
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeComponent === 'products' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      setActiveComponent('products');
                      setIsAddingProduct(false);
                      setViewingOrderId(null);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Package className="mr-3 h-5 w-5" />
                    Products
                  </button>

                  <button 
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeComponent === 'orders' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      setActiveComponent('orders');
                      setIsAddingProduct(false);
                      setViewingOrderId(null);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <ShoppingCart className="mr-3 h-5 w-5" />
                    Orders
                  </button>

                  <button 
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeComponent === 'settings' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      setActiveComponent('settings');
                      setIsAddingProduct(false);
                      setViewingOrderId(null);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                  </button>
                  
                  <button 
                    className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </nav>
              </div>
            )}
          </div>
          
          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
            <div className="max-w-7xl mx-auto">
              {isAddingProduct && (
                <div className="mb-6">
                  <button 
                    className="flex items-center text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setIsAddingProduct(false);
                      setEditingProductId(null);
                    }}
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Products
                  </button>
                  <h2 className="text-2xl font-bold mt-2">{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
                </div>
              )}
              
              {viewingOrderId && (
                <div className="mb-6">
                  <button 
                    className="flex items-center text-blue-600 hover:text-blue-800"
                    onClick={() => setViewingOrderId(null)}
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Orders
                  </button>
                  <h2 className="text-2xl font-bold mt-2">Order Details</h2>
                </div>
              )}
              
              {!isAddingProduct && !viewingOrderId && (
                <div className="mb-6">
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {activeComponent === 'dashboard' && 'Dashboard Overview'}
                      {activeComponent === 'products' && 'My Products'}
                      {activeComponent === 'orders' && 'Orders'}
                      {/* Changed to not display 'Shop Profile' but keep functionality */}
                      {activeComponent === 'settings' && 'Settings'}
                    </h2>
                    
                    {/* Subscription status is hidden but functionality remains */}
                    <div className="hidden">
                      {subscription && (
                        <div className="mt-2 flex items-center">
                          <div className={`
                            px-3 py-1 rounded-full text-sm
                            ${daysRemaining <= 7 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                            }
                          `}>
                            {daysRemaining <= 7 
                              ? `Subscription expires in ${daysRemaining} days` 
                              : 'Subscription active'
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Render the active component */}
              <div className="bg-white rounded-lg shadow-md">
                {renderComponent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default EshopDashboard;