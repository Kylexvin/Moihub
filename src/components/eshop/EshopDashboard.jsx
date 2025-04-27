// src/components/eshop/EshopDashboard.jsx
import React, { useState } from 'react';
import { Package, ShoppingCart, Settings, Home } from 'lucide-react';

// Import components
import DashboardOverview from './DashboardOverview';
import ProductsList from './ProductsList';
import ProductForm from './ProductForm';
import EShopOrders from './EShopOrders';
import OrderDetail from './OrderDetail';
import ShopProfile from './ShopProfile';

const EshopDashboard = () => {
  // State to track which component to display
  const [activeComponent, setActiveComponent] = useState('dashboard'); // Changed default to dashboard
  // State to track if we're adding/editing a product
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  // State to track the product being edited (if any)
  const [editingProductId, setEditingProductId] = useState(null);
  // State to track the order being viewed (if any)
  const [viewingOrderId, setViewingOrderId] = useState(null);
  
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
        return <DashboardOverview />;
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
        return <ShopProfile />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r bg-white">
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-xl font-bold text-blue-600">Shop Dashboard</h1>
          </div>
          
          <div className="flex flex-col flex-grow overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              <button 
                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeComponent === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeComponent === 'products' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeComponent === 'orders' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeComponent === 'settings' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="block md:hidden bg-white border-b">
          <div className="flex items-center justify-between h-16 px-4">
            <h1 className="text-lg font-medium">Shop Dashboard</h1>
            {/* Mobile menu button - you can add a hamburger here */}
          </div>
          
          {/* Mobile navigation tabs */}
          <div className="flex border-b overflow-x-auto">
            <button 
              className={`flex-1 py-2 text-center text-sm font-medium ${
                activeComponent === 'dashboard' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              }`}
              onClick={() => {
                setActiveComponent('dashboard');
                setIsAddingProduct(false);
                setViewingOrderId(null);
              }}
            >
              <Home className="mx-auto h-5 w-5 mb-1" />
              <span>Home</span>
            </button>
            
            <button 
              className={`flex-1 py-2 text-center text-sm font-medium ${
                activeComponent === 'products' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              }`}
              onClick={() => {
                setActiveComponent('products');
                setIsAddingProduct(false);
                setViewingOrderId(null);
              }}
            >
              <Package className="mx-auto h-5 w-5 mb-1" />
              <span>Products</span>
            </button>
            
            <button 
              className={`flex-1 py-2 text-center text-sm font-medium ${
                activeComponent === 'orders' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              }`}
              onClick={() => {
                setActiveComponent('orders');
                setIsAddingProduct(false);
                setViewingOrderId(null);
              }}
            >
              <ShoppingCart className="mx-auto h-5 w-5 mb-1" />
              <span>Orders</span>
            </button>
            
            <button 
              className={`flex-1 py-2 text-center text-sm font-medium ${
                activeComponent === 'settings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              }`}
              onClick={() => {
                setActiveComponent('settings');
                setIsAddingProduct(false);
                setViewingOrderId(null);
              }}
            >
              <Settings className="mx-auto h-5 w-5 mb-1" />
              <span>Account</span>
            </button>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
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
                <h2 className="text-2xl font-bold">
                  {activeComponent === 'dashboard' && 'Dashboard Overview'}
                  {activeComponent === 'products' && 'My Products'}
                  {activeComponent === 'orders' && 'Orders'}
                  {activeComponent === 'settings' && 'Shop Profile'}
                </h2>
              </div>
            )}
            
            {/* Render the active component */}
            {renderComponent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EshopDashboard;