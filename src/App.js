import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Existing Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Booking from './components/Booking';
import ApartmentDetails from './components/ApartmentDetails';
import Home from './components/Home';
import ProductList from './components/ProductList';
import SellersPage from './components/SellersPage';
import NotFoundPage from './components/NotFoundPage';
import RoomateFinder from './components/RoomateFinder'; 
import CategoryList from './components/CategoryList';
import ShopList from './components/ShopList';
import BuyersPage from './components/BuyersPage';
import LearnMore from './components/LearnMore';
import Echem from './components/Echem';
import CartPage from './components/CartPage';
import Discover from './components/Discover';
import MoiDelish from './components/MoiDelish';
import ProviderDetails from './components/ProviderDetails';
import GreenHub from './components/GreenHub';
import OurTeam from './components/Team';
import DownloadApp from './components/DownloadApp';
import MarketHub from './components/MarkertHub';

// Blog-related Components
//import BlogHome from './components/BlogHome';
import BlogDetail from './components/BlogDetail';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import WritersPage from './components/WritersPage';
import EditPostPage from './components/EditPostPage';
//import BlogPost from './components/BlogPost';
import BlogHomepage from './components/BlogHomepage';
import BlogPost from './components/BlogPost';

// Data Imports
import plotsData from './data/plots.json';
import ShopData from './data/ShopData.json';

// Authentication Service
import { authService } from './services/authService';
import SpectacularFireworks from './components/SpectacularFireworks';



const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Loading simulation
    const fetchData = async () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };

    // Check authentication status
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

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

  // Authentication Handlers
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className='load-c'>
        <span className="loader"></span>
      </div>
    ); 
  }
  
  return (
    <>

    <SpectacularFireworks/>
      <div>
        <Navbar />
      </div>
      <Router scrollRestoration="auto">
        <Routes>
          {/* Existing Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<BuyersPage/>} />
          <Route path="/food-delivery" element={<MoiDelish/>} />
          <Route path="/provider/:providerId" element={<ProviderDetails />} />
          <Route path='/discover' element={<Discover/>}  />
          <Route path="/sellers" element={<SellersPage />} />
          <Route path="/find-roommate" element={<RoomateFinder />} />
          <Route path='/learnmore' element={<LearnMore/>}/>
          <Route path='/greenhub' element={<GreenHub/>}/>
          <Route path='/ourteam' element={<OurTeam/>}/>
          <Route path="/cart" element={<CartPage cartItems={cartItems} handleRemoveFromCart={handleRemoveFromCart} handleUpdateQuantity={handleUpdateQuantity} />} />
          <Route path="/pharmacy" element={<Echem cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/book" element={<Booking plots={plotsData} />} />
          <Route path="/apartment-details/:id" element={<ApartmentDetails plots={plotsData} />} />
          <Route path="/eshop" element={<CategoryList categories={ShopData.categories} />} />
          <Route path="/shops/:categoryId" element={<ShopList shops={ShopData.shops} />} />
          <Route path="/products/:shopId" element={<ProductList shops={ShopData.shops} />} />
          <Route path='/markethub' element ={<MarketHub/> }/>

          {/* Blog Routes */}
          <Route path='/blog' element={<BlogHomepage/>} /> 
          <Route path="/blog/:id" element={<BlogPost/>} />

          {/* New Blog Authentication Routes */}
          <Route path="/login" element={<Login setIsAuthenticated={handleLogin} />} />
          <Route path="/register" element={<Register setIsAuthenticated={handleLogin} />} />
          
          {/* Protected Blog Routes */}
          <Route
            path="/post-list"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <WritersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <EditPostPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>

      <div>
        <DownloadApp/>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
          <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
        <Footer/>
      </div>
    </>
  );
};

export default App;