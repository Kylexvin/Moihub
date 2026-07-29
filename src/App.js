import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop"; // ADD THIS
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home/Home";
import Features from "./pages/Features/Features";
import Vendors from "./pages/Vendors";
import VendorRegister from "./pages/Vendors/Register";
import Storefront from "./pages/Storefront";
import Blog from "./pages/Blog";
import BlogPost from "./pages/Blog/Post";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import LearnMore from "./pages/LearnMore";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Forgotpassword from "./pages/Auth/Forgotpassword";
import Resetpassword from "./pages/Auth/Resetpassword";
import ChangePassword from "./pages/Auth/ChangePassword";

import "./styles/globals.css";
import "./styles/variables.css";
import "./styles/animations.css";

function App() {
  return (
    <GoogleOAuthProvider clientId="440940724570-q2oimhoge0bre1curvl7h8glbnp6rbma.apps.googleusercontent.com">
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop /> {/* ADD THIS INSIDE BROWSER ROUTER */}
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/vendors" element={<Vendors />} /> 
            <Route 
              path="/vendors/register" 
              element={
                <ProtectedRoute>
                  <VendorRegister />
                </ProtectedRoute>
              } 
            />
           <Route path="/change-password" element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
            } 
           />
            <Route path="/food/:slug" element={<Storefront type="food" />} />
            <Route path="/eshop/:slug" element={<Storefront type="eshop" />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/learnmore" element={<LearnMore />} />
            <Route path="/forgot-password" element={<Forgotpassword />} />
            <Route path="/reset-password/:token" element={<Resetpassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;