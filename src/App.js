import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Core Pages
import Home from './components/Home';
import NotFoundPage from './components/NotFoundPage';
import LearnMore from './components/LearnMore';
import OurTeam from './components/Team';
import Discover from './components/Discover';

// Marketplace & Shopping
import BuyersPage from './components/BuyersPage';
import SellersPage from './components/SellersPage';
import ProductList from './components/ProductList';
import CartPage from './components/CartPage';
import CategoryList from './components/CategoryList';
import ShopList from './components/ShopList';
import MarketHub from './components/MarketHub';
import ProviderDetails from './components/ProviderDetails';

// Specialized Services
import Echem from './components/Echem';
import GreenHub from './components/GreenHub';
import MySchool from './components/MySchool';
import RoomateFinder from './components/RoomateFinder';

// Real Estate
import Booking from './components/Booking';
import ApartmentDetails from './components/ApartmentDetails';
import RentalHome from './components/rentals/RentalHome';
import RentalDetail from './components/rentals/RentalDetail';

// Food Delivery
import MoiDelish from './components/MoiDelish';
import VendorPage from './components/VendorPage';
import VendorDashboard from './components/dashboards/VendorDashboard';
import VendorManagement from './components/dashboards/VendorManagement';
import UpgradeToVendor from './components/UpgradeToVendor';

// E-shop
import EshopDashboard from './components/eshop/EshopDashboard';
import AdminDashboard from './components/eshop/AdminDashboard';
import UpgradeEshop from './components/UpgradeEshop';

// Blog System
import BlogHomepage from './components/BlogHomepage';
import BlogPost from './components/BlogPost';
import WritersPage from './components/WritersPage';
import EditPostPage from './components/EditPostPage';

// Authentication
import Login from './components/Login';
import Register from './components/Register';
import EmailVerification from './components/EmailVerification';
import ProtectedRoute from './components/ProtectedRoute';
import ChangePassword  from './components/Auth/ChangePassword';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';

// Transport (MoiLink)
import RouteSelectionPage from './pages/RouteSelectionPage';
import VehicleSelectionPage from './pages/VehicleSelectionPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import PaymentInitiationPage from './pages/PaymentInitiationPage';
import MyBookings from './components/MyBookings';
import QrScanner from './components/admin/QrScanner';
import MatatuAdmin from './components/admin/MatatuAdmin';

// AI Chatbot
import ChatbotDashboard from './components/ChatbotDashboard';

// Data
import plotsData from './data/plots.json';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Loading simulation
    const fetchData = async () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };
    fetchData();
  }, []);

  // Cart Management Functions
  const handleRemoveFromCart = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };

  const handleUpdateQuantity = (index, quantity) => {
    const newCartItems = [...cartItems];
    newCartItems[index].quantity = quantity;
    setCartItems(newCartItems);
  };

  const handleLogin = () => {
    // Login handler for components that need it
  };

  if (isLoading) {
    return (
      <div className='load-c'>
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div>
        <Navbar />
      </div>
      <Router scrollRestoration="auto">
        <Routes>
          {/* Core Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/learnmore" element={<LearnMore />} />
          <Route path="/ourteam" element={<OurTeam />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login setIsAuthenticated={handleLogin} />} />
          <Route path="/register" element={<Register setIsAuthenticated={handleLogin} />} />
          <Route path="/verify-email/:token" element={<EmailVerification />} />          
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Marketplace & Shopping */}
          <Route path="/marketplace" element={<BuyersPage />} />
          <Route path="/sellers" element={<SellersPage />} />
          <Route path="/provider/:providerId" element={<ProviderDetails />} />
          <Route path="/cart" element={<CartPage cartItems={cartItems} handleRemoveFromCart={handleRemoveFromCart} handleUpdateQuantity={handleUpdateQuantity} />} />
          <Route path="/markethub" element={<MarketHub />} />

          {/* E-shop Routes */}
          <Route path="/eshop" element={<CategoryList />} />
          <Route path="/shops/:categorySlug" element={<ShopList />} />
          <Route path="/products/:shopSlug" element={<ProductList />} />
          <Route path="/eshop/dashboard" element={<EshopDashboard />} />
          <Route path="/eshop/upgrade" element={<UpgradeEshop />} />
          <Route path="/admin/eshop" element={<AdminDashboard />} />

          {/* Food Delivery Routes */}
          <Route path="/food-delivery" element={<MoiDelish />} />
          <Route path="/vendor/:vendorId" element={<VendorPage />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/upgrade" element={<UpgradeToVendor />} />
          <Route path="/admin/foodvendors" element={<VendorManagement />} />

          {/* Specialized Services */}
          <Route path="/pharmacy" element={<Echem cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/greenhub" element={<GreenHub />} />
          <Route path="/myschool" element={<MySchool />} />
          <Route path="/find-roommate" element={<RoomateFinder />} />

          {/* Real Estate Routes */}
          <Route path="/book" element={<Booking plots={plotsData} />} />
          <Route path="/apartment-details/:id" element={<ApartmentDetails plots={plotsData} />} />
          {/* Rental Routes */}
          <Route path="/rentals" element={<RentalHome />} />
          <Route path="/rentals/:id" element={<RentalDetail />} />

          {/* Blog Routerentalss */}
          <Route path="/blog" element={<BlogHomepage />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route
            path="/post-list"
            element={
              <ProtectedRoute allowedRoles={['writer', 'admin']}>
                <WritersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['writer', 'admin']}>
                <EditPostPage />
              </ProtectedRoute>
            }
          />

          {/* Transport (MoiLink) Routes */}
          <Route path="/moilinktravellers" element={<RouteSelectionPage />} />
          <Route path="/VehicleSelectionPage/:routeId" element={<VehicleSelectionPage />} />
          <Route path="/seat-selection/:matatuId" element={<SeatSelectionPage />} />
          <Route path="/booking-confirmation/:matatuId/:seatId" element={<BookingConfirmationPage />} />
          <Route path="/payment/initiate" element={<PaymentInitiationPage />} />
          <Route path="/mybookings" element={<MyBookings />} />
          <Route path="/verifybooking" element={<QrScanner />} />
          <Route
            path="/moilinkadmin"
            element={
              <ProtectedRoute allowedRoles={['writer', 'admin']}>
                <MatatuAdmin />
              </ProtectedRoute>
            }
          />

          {/* AI Chatbot */}
          <Route path="/moihub_ai" element={<ChatbotDashboard />} />

          {/* Catch-all Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>

      <div>
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
          <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg> */}
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default App;