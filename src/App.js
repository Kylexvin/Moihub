import React, { useState, useEffect } from 'react'; // Add this line
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Booking from './components/Booking';
import ApartmentDetails from './components/ApartmentDetails';
import Home from './components/Home';
import ProductList from './components/ProductList';
import SellersPage from './components/SellersPage';
import NotFoundPage from './components/NotFoundPage'; // Import the NotFoundPage component
import RoomateFinder from './components/RoomateFinder'; 
import Emergency from './components/Emergency';
import plotsData from './data/plots.json'; // Import JSON data
import CategoryList from './components/CategoryList';
import ShopList from './components/ShopList';
import ShopData from './data/ShopData.json';
import BuyersPage from './components/BuyersPage';
import LearnMore from './components/LearnMore';
import Echem from './components/Echem';
import CartPage from './components/CartPage';
import Discover from './components/Discover';
import BlogHome  from './components/BlogHome';
import BlogDetail from './components/BlogDetail';
import MoiDelish from './components/MoiDelish';
import ProviderDetails from './components/ProviderDetails';
import GreenHub from './components/GreenHub';



const App = () => {
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [cartItems, setCartItems] = useState([]); // State to store items in the cart

  useEffect(() => {
    // Simulating an asynchronous operation (e.g., fetching data)
    const fetchData = async () => {
      // Perform some async operation here
      // For demonstration purposes, using setTimeout to simulate loading
      setTimeout(() => {
        setIsLoading(false); // Once loading is done, set isLoading to false
      }, 2000); // Simulating a 2-second loading time
    };

    fetchData(); // Call the async function
  }, []); 

  // Function to handle removing item from cart
  const handleRemoveFromCart = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };

  // Function to handle updating item quantity
  const handleUpdateQuantity = (index, quantity) => {
    const newCartItems = [...cartItems];
    newCartItems[index].quantity = quantity;
    setCartItems(newCartItems);
  };

  if (isLoading) {
    return (
      <div className='load-c'>
        <span className="loader">
        </span>
      </div>
    ); 
  }
  
  return (
    <>
      <div>
        <Navbar />
      </div>
      <Router scrollRestoration="auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='emergency' element={<Emergency/>}/>
          <Route path="/marketplace" element={<BuyersPage/>} />
          <Route path="/food-delivery" element={<MoiDelish/>} />
          <Route path="/provider/:providerId" component={ProviderDetails} />
          <Route path='/discover' element={<Discover/>}  />
          <Route path='/blog' element={<BlogHome/>} /> 
          <Route path="/blog/:id" element={<BlogDetail/>} />
          <Route path="/sellers" element={<SellersPage />} />
          <Route path="/find-roommate" element={<RoomateFinder />} />
          <Route path='/learnmore' element={<LearnMore/>}/>
          <Route path='/greenhub' element={<GreenHub/>}/>
          <Route path="/cart" element={<CartPage cartItems={cartItems} handleRemoveFromCart={handleRemoveFromCart} handleUpdateQuantity={handleUpdateQuantity} />} />
          <Route path="/pharmacy" element={<Echem cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/book" element={<Booking plots={plotsData} />} />
          <Route path="/apartment-details/:id" element={<ApartmentDetails plots={plotsData} />} />
          <Route path="/eshop" element={<CategoryList categories={ShopData.categories} />} />
          <Route path="/shops/:categoryId" element={<ShopList shops={ShopData.shops} />} />
          <Route path="/products/:shopId" element={<ProductList shops={ShopData.shops} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>

      <div>
        <Footer/>
      </div>
    </>
  );
};

export default App;
