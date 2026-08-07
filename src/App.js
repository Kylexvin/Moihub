import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
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

const loaderStyles = `
  .app-loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    min-height: 100vh;
    background: #FBF6EC;
  }
  .loader {
    width: 44px;
    height: 44px;
    border: 4px solid #E4DACB;
    border-top-color: #D8482E;
    border-radius: 50%;
    animation: moihub-spin 0.8s linear infinite;
  }
  .loader-label {
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #093028;
  }
  @keyframes moihub-spin {
    to { transform: rotate(360deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .loader {
      animation: none;
      border-top-color: #E4DACB;
    }
  }
`;

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or wait for resources
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Show loader for 1 second

    return () => clearTimeout(timer);
  }, []);

  // Inject loader styles
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = loaderStyles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

if (loading) {
  return (
    <div className="app-loader-container">
      <div className="loader"></div>
      <span className="loader-label">Loading MoiHub</span>
    </div>
  );
}

  return (
    <GoogleOAuthProvider clientId="440940724570-q2oimhoge0bre1curvl7h8glbnp6rbma.apps.googleusercontent.com">
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
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