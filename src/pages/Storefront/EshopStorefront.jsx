// src/pages/Storefront/EshopStorefront.jsx
import React, { useState } from "react";
import {
  BadgeCheck,
  Star,
  MapPin,
  Share2,
  Smartphone,
  ShoppingBag,
} from "lucide-react";

const PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=com.kylexvin.moihub";

function EshopStorefront({ shop, items, shareUrl }) {
  const [copied, setCopied] = useState(false);

  const initial = shop.name?.charAt(0)?.toUpperCase() || "M";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: shop.name, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareUrl).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="storefront-page">
      {/* COVER */}
      <div className="storefront-cover">
        {shop.coverImage ? (
          <img src={shop.coverImage} alt={`${shop.name} cover`} />
        ) : (
          <div className="storefront-cover-fallback eshop" aria-hidden="true" />
        )}
        <div className="storefront-cover-gradient" />
      </div>

      <div className="storefront-body">
        {/* HEADER */}
        <div className="storefront-header">
          <div className="storefront-logo">
            {shop.logo ? <img src={shop.logo} alt={`${shop.name} logo`} /> : <span>{initial}</span>}
          </div>
          <div className="storefront-header-text">
            <div className="storefront-name-row">
              <h1>{shop.name}</h1>
              {shop.isVerified && (
                <span className="storefront-verified"><BadgeCheck size={16} /> Verified</span>
              )}
            </div>
            <div className="storefront-meta-row">
              <span className="storefront-category">{shop.category}</span>
              <span className={`storefront-status ${shop.isOpen ? "open" : "closed"}`}>
                {shop.isOpen ? "Open now" : "Closed"}
              </span>
            </div>
            <div className="storefront-rating">
              
              <Star size={15} /> {shop.rating} <span>({shop.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        {shop.description && <p className="storefront-description">{shop.description}</p>}

        {/* CONTACT */}
        <div className="storefront-info-card">
          <div className="storefront-info-row">
            <MapPin size={17} />
            <span>{shop.address}</span>
          </div>
        </div>

        {/* PRODUCTS */}
        <h2 className="storefront-section-title">Products</h2>
        <div className="storefront-grid">
          {items.map((item) => (
            <div className={`storefront-item-card ${!item.isAvailable ? "unavailable" : ""}`} key={item.id}>
              <div className="storefront-item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <ShoppingBag size={22} aria-hidden="true" />
                )}
                {!item.isAvailable && <span className="storefront-item-badge">Out of stock</span>}
              </div>
              <div className="storefront-item-body">
                <span className="storefront-item-name">{item.name}</span>
                <span className="storefront-item-price">KES {item.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* SHARE & APP CTA - inline */}
        <div className="storefront-footer-actions">
          <button type="button" className="storefront-btn-secondary" onClick={handleShare}>
            <Share2 size={16} /> {copied ? "Link copied" : "Share"}
          </button>
          <a href={PLAYSTORE_URL} target="_blank" rel="noopener noreferrer" className="storefront-btn-primary">
            <Smartphone size={16} /> Open in MoiHub app
          </a>
        </div>
      </div>
    </div>
  );
}

export default EshopStorefront;