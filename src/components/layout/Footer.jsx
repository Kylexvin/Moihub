// src/components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  LayoutGrid,
  Store,
  Newspaper,
  Info,
  Mail,
  Download,
  Shield,
  FileText,
  Users,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import "./Footer.css";
import Logo from "../../assets/logos/logo.png";

const PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=com.kylexvin.moihub";

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61553038797986",
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/_moihub/",
    icon: (
      <>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" />
      </>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@themoihub?",
    icon: <path d="M19.589 6.686a4.293 4.293 0 0 1-3.045-1.453A4.29 4.29 0 0 1 15.577 2h-2.464v12.479a2.595 2.595 0 0 1-2.591 2.593 2.594 2.594 0 0 1-2.591-2.593c0-1.734 1.682-3.04 3.331-2.568V9.382c-3.443-.537-6.521 2.136-6.521 5.637 0 3.497 2.836 6.333 6.333 6.333s6.333-2.836 6.333-6.333V8.168c1.131.8 2.495 1.282 3.958 1.282V6.686z" />,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/254768610613",
    icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />,
  },
];

const LINK_COLUMNS = [
  {
    heading: "Quick links",
    icon: <LayoutGrid size={16} />,
    links: [
      { to: "/", label: "Home", icon: <Home size={14} /> },
      { to: "/features", label: "Features", icon: <LayoutGrid size={14} /> },
      { to: "/vendors", label: "Vendors", icon: <Store size={14} /> },
      { to: "/blog", label: "Blog", icon: <Newspaper size={14} /> },
      { to: "/about", label: "About", icon: <Info size={14} /> },
      { to: "/contact", label: "Contact", icon: <Mail size={14} /> },
    ],
  },
  {
    heading: "For users",
    icon: <Users size={16} />,
    links: [
      { href: PLAYSTORE_URL, label: "Download app", external: true, icon: <Download size={14} />, highlight: true },
      { to: "/learnmore", label: "Privacy policy", icon: <Shield size={14} /> },
      { to: "/learnmore", label: "Terms of service", icon: <FileText size={14} /> },
      { to: "/learnmore", label: "Community guidelines", icon: <Users size={14} /> },
    ],
  },
  {
    heading: "For vendors",
    icon: <TrendingUp size={16} />,
    links: [
      { to: "/vendors", label: "Become a vendor", icon: <Store size={14} />, highlight: true },
      { to: "/learnmore", label: "Vendor guidelines", icon: <FileText size={14} /> },
      { to: "/contact", label: "Support", icon: <HelpCircle size={14} /> },
    ],
  },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src={Logo} alt="MoiHub" />
            <span className="footer-logo-text">MoiHub</span>
          </Link>
          <p className="footer-description">Everything you need for campus life, in one app.</p>
          <div className="footer-socials">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="footer-social"
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">{s.icon}</svg>
              </a>
            ))}
          </div>
        </div>

        {/* LINK COLUMNS - TWO COLUMNS */}
        <div className="footer-links-grid">
          {LINK_COLUMNS.map((col) => (
            <div className="footer-links-card" key={col.heading}>
              <div className="footer-card-header">
                <div className="footer-card-icon">
                  {col.icon}
                </div>
                <h4 className="footer-heading">{col.heading}</h4>
              </div>
              <ul>
                {col.links.map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={link.highlight ? "footer-link-highlight" : "footer-link"}
                      >
                        <span className="footer-link-icon">{link.icon}</span>
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link 
                        to={link.to}
                        className={link.highlight ? "footer-link-highlight" : "footer-link"}
                      >
                        <span className="footer-link-icon">{link.icon}</span>
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>© {currentYear} MoiHub. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/learnmore">Privacy</Link>
            <Link to="/learnmore">Terms</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;