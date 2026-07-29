// src/pages/Storefront/index.jsx
import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from "react-router-dom";
import { Loader, AlertCircle, ArrowLeft } from "lucide-react";
import axios from "axios";
import FoodStorefront from "./FoodStorefront";
import EshopStorefront from "./EshopStorefront";
import "./Storefront.css";

const API_BASE = 'https://moihub.onrender.com/api';

function fetchStorefront(type, slug) {
  return axios.get(`${API_BASE}/storefront/${type}/${slug}`)
    .then(response => response.data)
    .catch(error => {
      if (error.response?.status === 404) {
        throw new Error("not_found");
      }
      throw new Error("server_error");
    });
}

function Storefront({ type }) {
  const { slug } = useParams();
  const [state, setState] = useState({ status: "loading", data: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", data: null });

    fetchStorefront(type, slug)
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({ 
            status: "error", 
            data: null,
            errorCode: err.message 
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [type, slug]);

  if (state.status === "loading") {
    return (
      <>
        <Helmet>
          <title>Loading Storefront - Moihub</title>
          <meta name="description" content="Loading vendor storefront on Moihub." />
          <link rel="canonical" href={`https://moihub-silk.vercel.app/${type}/${slug}`} />
        </Helmet>
        <div className="storefront-page">
          <div className="storefront-loading">
            <Loader size={30} className="spinning" />
            <p>Loading storefront…</p>
          </div>
        </div>
      </>
    );
  }

  if (state.status === "error") {
    return (
      <>
        <Helmet>
          <title>Storefront Not Found - Moihub</title>
          <meta name="description" content="The vendor storefront you're looking for could not be found on Moihub." />
          <link rel="canonical" href="https://moihub-silk.vercel.app/vendors" />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="storefront-page">
          <div className="storefront-error">
            <div className="storefront-error-icon"><AlertCircle size={26} /></div>
            <h2>Shop not found</h2>
            <p>This storefront doesn't exist, or it's no longer active.</p>
            <Link to="/vendors" className="storefront-error-link">
              <ArrowLeft size={15} /> Back to Vendors
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Dynamic meta tags based on vendor data
  const shop = state.data.shop;
  const shareUrl = state.data.shareUrl;
  const typeLabel = type === 'eshop' ? 'E-Shop' : 'Food Vendor';
  const itemCount = type === 'eshop' ? state.data.products?.length : state.data.menu?.length;
  const image = shop.coverImage || shop.logo || "https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg";

  return (
    <>
      <Helmet>
        {/* Dynamic Title */}
        <title>{shop.name} - {typeLabel} on Moihub</title>
        
        {/* Dynamic Meta Description */}
        <meta name="description" content={`${shop.name} - ${typeLabel} serving Moi University. ${shop.description || `View ${itemCount || 'our'} items on Moihub.`}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${shop.name} - ${typeLabel} on Moihub`} />
        <meta property="og:description" content={`${shop.name} - ${typeLabel} serving Moi University. ${shop.description || `View ${itemCount || 'our'} items on Moihub.`}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={shareUrl || `https://moihub-silk.vercel.app/${type}/${slug}`} />
        <meta property="og:image" content={image} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${shop.name} - ${typeLabel} on Moihub`} />
        <meta name="twitter:description" content={`${shop.name} - ${typeLabel} serving Moi University.`} />
        <meta name="twitter:image" content={image} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={shareUrl || `https://moihub-silk.vercel.app/${type}/${slug}`} />
        
        {/* Business-specific structured data */}
        {shop.isVerified && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": type === 'eshop' ? "Store" : "FoodEstablishment",
              "name": shop.name,
              "description": shop.description,
              "image": image,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": shop.location || "Eldoret",
                "addressCountry": "KE"
              },
              "url": shareUrl,
              "priceRange": "KES",
              "servesCuisine": type === 'eshop' ? "Retail" : "Campus Food"
            })}
          </script>
        )}
      </Helmet>

      {type === "eshop" ? (
        <EshopStorefront shop={state.data.shop} items={state.data.products} shareUrl={state.data.shareUrl} />
      ) : (
        <FoodStorefront shop={state.data.shop} items={state.data.menu} shareUrl={state.data.shareUrl} />
      )}
    </>
  );
}

export default Storefront;