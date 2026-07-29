// src/pages/Vendors/Register.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  UtensilsCrossed,
  ShoppingBag,
  Store,
  ArrowLeft,
  ArrowRight,
  Copy,
  Share2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader,
  Phone,
  MapPin,
  Store as StoreIcon,
  Tag,
  FileText,
  User,
  Mail,
  Lock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { checkVendorStatus, applyForVendor, getCategories } from "../../services/vendorService";
import "./Register.css";

function Register() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, login, register: registerUser } = useAuth();
  
  const initialType = searchParams.get("type") === "eshop" || searchParams.get("type") === "food"
    ? searchParams.get("type")
    : null;

  const [authed, setAuthed] = useState(isAuthenticated);
  const [authMode, setAuthMode] = useState("signin");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [status, setStatus] = useState("none");
  const [vendorType, setVendorType] = useState(initialType);
  const [application, setApplication] = useState(null);
  const [approved, setApproved] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Categories for eshop
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Food Vendor Form
  const [foodForm, setFoodForm] = useState({
    shopName: "",
    phone: "",
    location: "",
  });

  // Shop Owner (Eshop) Form
  const [eshopForm, setEshopForm] = useState({
    shopName: "",
    category: "",
    description: "",
    address: "",
    phoneNumber: "",
  });

const checkVendorStatusWrapper = useCallback(async () => {
  try {
    setLoading(true);
    const response = await checkVendorStatus();
    console.log("Status response:", response);
    
    // Check for eshop vendor
    if (response.vendorType === 'eshop' && response.isVendor) {
      setStatus(response.status);
      setVendorType("eshop");
      
      if (response.status === "active" || response.status === "approved") {
        setApproved({
          shopName: response.shopName,
          slug: response.slug,
          expiresOn: response.subscriptionEndDate 
            ? new Date(response.subscriptionEndDate).toLocaleDateString() 
            : null
        });
      }
    } 
    // Check for food vendor
    else if (response.vendorType === 'food' && response.isVendor) {
      setStatus(response.status);
      setVendorType("food");
      
      if (response.status === "approved" || response.status === "active") {
        setApproved({
          shopName: response.shopName,
          slug: response.slug,
          expiresOn: response.subscriptionEndDate 
            ? new Date(response.subscriptionEndDate).toLocaleDateString() 
            : null
        });
      }
    } 
    else {
      setStatus("none");
    }
  } catch (error) {
    console.error("Error checking vendor status:", error);
    setStatus("none");
  } finally {
    setLoading(false);
  }
}, []);

  // Check status on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      checkVendorStatusWrapper();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, checkVendorStatusWrapper]);

  // Check status again when user authenticates
  useEffect(() => {
    if (authed) {
      checkVendorStatusWrapper();
    }
  }, [authed, checkVendorStatusWrapper]);

  const handleAuth = async (e, formData) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      if (authMode === "signin") {
        await login({
          emailOrUsername: formData.emailOrUsername,
          password: formData.password
        });
      } else {
        await registerUser({
          username: formData.username,
          email: formData.emailOrUsername,
          password: formData.password
        });
      }
      setAuthed(true);
    } catch (error) {
      setAuthError(error.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    if (!foodForm.shopName || !foodForm.phone || !foodForm.location) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("vendorType", "food");
      formData.append("shopName", foodForm.shopName);
      formData.append("phone", foodForm.phone);
      formData.append("location", foodForm.location);

      await applyForVendor(formData);
      setApplication(foodForm);
      setStatus("pending");
    } catch (error) {
      alert(error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const handleEshopSubmit = async (e) => {
    e.preventDefault();
    if (!eshopForm.shopName || !eshopForm.category || !eshopForm.address || !eshopForm.phoneNumber) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("vendorType", "eshop");
      formData.append("shopName", eshopForm.shopName);
      formData.append("category", eshopForm.category);
      formData.append("description", eshopForm.description || "");
      formData.append("address", eshopForm.address);
      formData.append("phoneNumber", eshopForm.phoneNumber);

      await applyForVendor(formData);
      setApplication(eshopForm);
      setStatus("pending");
    } catch (error) {
      alert(error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const url = `https://moihub.kxbyte.co.ke/${vendorType || "food"}/${approved?.slug || "your-shop"}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const url = `https://moihub.kxbyte.co.ke/${vendorType || "food"}/${approved?.slug || "your-shop"}`;
    if (navigator.share) {
      navigator.share({ title: approved?.shopName, url }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const storefrontUrl = `moihub.kxbyte.co.ke/${vendorType || "food"}/${approved?.slug || "your-shop"}`;

  if (loading) {
    return (
      <div className="vendor-register">
        <div className="register-container">
          <div className="loading-spinner">
            <Loader size={32} className="spinning" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-register">
      <div className="register-container">

        {!authed && (
          <AuthGate 
            authMode={authMode} 
            setAuthMode={setAuthMode} 
            onSubmit={handleAuth}
            loading={authLoading}
            error={authError}
          />
        )}

        {authed && status === "none" && !vendorType && <CategoryPicker onPick={setVendorType} />}

        {authed && status === "none" && vendorType === "food" && (
          <FoodVendorForm
            form={foodForm}
            setForm={setFoodForm}
            onBack={() => setVendorType(null)}
            onSubmit={handleFoodSubmit}
            loading={loading}
          />
        )}

        {authed && status === "none" && vendorType === "eshop" && (
          <EshopOwnerForm
            form={eshopForm}
            setForm={setEshopForm}
            categories={categories}
            setCategories={setCategories}
            loadingCategories={loadingCategories}
            setLoadingCategories={setLoadingCategories}
            onBack={() => setVendorType(null)}
            onSubmit={handleEshopSubmit}
            loading={loading}
          />
        )}

        {authed && (status === "pending" || status === "pending_approval") && (
          <PendingStatus vendorType={vendorType} application={application} />
        )}

        {authed && (status === "active" || status === "approved") && (
          <ApprovedStatus
            data={approved}
            storefrontUrl={storefrontUrl}
            onCopy={handleCopy}
            onShare={handleShare}
            copied={copied}
            vendorType={vendorType}
          />
        )}

        {authed && status === "subscription_expired" && (
          <ExpiredStatus data={approved} />
        )}
      </div>
    </div>
  );
}

/* ================= AUTH GATE ================= */
function AuthGate({ authMode, setAuthMode, onSubmit, loading, error }) {
  const [formData, setFormData] = useState({
    username: "",
    emailOrUsername: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, formData);
  };

  return (
    <div className="register-card">
      <span className="register-tag">Vendor account</span>
      <h1 className="register-title">Sign in to continue</h1>
      <p className="register-sub">Registration uses the same account as the MoiHub app.</p>

      <div className="auth-tabs">
        <button type="button" className={authMode === "signin" ? "active" : ""} onClick={() => setAuthMode("signin")}>
          Sign in
        </button>
        <button type="button" className={authMode === "signup" ? "active" : ""} onClick={() => setAuthMode("signup")}>
          Create account
        </button>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <form className="register-form" onSubmit={handleSubmit}>
        {authMode === "signup" && (
          <label className="field">
            <span><User size={16} /> Username</span>
            <input
              type="text"
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required={authMode === "signup"}
            />
          </label>
        )}
        <label className="field">
          <span><Mail size={16} /> Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={formData.emailOrUsername}
            onChange={(e) => setFormData({...formData, emailOrUsername: e.target.value})}
            required
          />
        </label>
        <label className="field">
          <span><Lock size={16} /> Password</span>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </label>
        <button type="submit" className="btn-primary full-width" disabled={loading}>
          {loading ? "Loading..." : (authMode === "signin" ? "Sign in" : "Create account")} <ArrowRight size={16} />
        </button>
      </form>
      <p className="register-note">
        {authMode === "signin" ? "Don't have an account?" : "Already have an account?"}
        <button 
          type="button" 
          className="auth-switch-link"
          onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
        >
          {authMode === "signin" ? " Create one" : " Sign in"}
        </button>
      </p>
    </div>
  );
}

/* ================= CATEGORY PICKER ================= */
function CategoryPicker({ onPick }) {
  return (
    <div className="picker-wrap">
      <span className="register-tag">Choose your business type</span>
      <h1 className="register-title">Start Your Journey</h1>
      <p className="register-sub">Choose how you want to grow your business with MoiHub</p>

      <div className="picker-grid">
        <button className="picker-card" onClick={() => onPick("food")}>
          <div className="picker-icon"><UtensilsCrossed size={32} /></div>
          <h3>Food Vendor</h3>
          <p>Sell food items, manage your menu, and accept orders online</p>
          <div className="picker-features">
            <span className="feature-pill">Menu Management</span>
            <span className="feature-pill">Order Tracking</span>
          </div>
          <span className="picker-cta">Apply as food <ArrowRight size={15} /></span>
        </button>
        <button className="picker-card" onClick={() => onPick("eshop")}>
          <div className="picker-icon"><ShoppingBag size={32} /></div>
          <h3>Shop Owner</h3>
          <p>List your products, manage inventory, and reach more customers</p>
          <div className="picker-features">
            <span className="feature-pill">Product Listings</span>
            <span className="feature-pill">Inventory</span>
          </div>
          <span className="picker-cta">Apply as shop <ArrowRight size={15} /></span>
        </button>
      </div>
    </div>
  );
}

/* ================= FOOD VENDOR FORM ================= */
function FoodVendorForm({ form, setForm, onBack, onSubmit, loading }) {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="register-card">
      <button type="button" className="back-link" onClick={onBack}>
        <ArrowLeft size={15} /> Change category
      </button>
      <span className="register-tag">Food Vendor</span>
      <h1 className="register-title">Food Vendor Registration</h1>
      <p className="register-sub">Set up your food business on MoiHub</p>

      <form className="register-form" onSubmit={onSubmit}>
        <label className="field">
          <span><StoreIcon size={16} /> Shop Name <span className="required">*</span></span>
          <input
            type="text"
            name="shopName"
            placeholder="e.g., Campus Bites, Student Café"
            value={form.shopName}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span><Phone size={16} /> Phone Number <span className="required">*</span></span>
          <input
            type="tel"
            name="phone"
            placeholder="e.g., 0712345678"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span><MapPin size={16} /> Location <span className="required">*</span></span>
          <input
            type="text"
            name="location"
            placeholder="e.g., Main Campus, West Side"
            value={form.location}
            onChange={handleChange}
            required
          />
        </label>

        <div className="info-box">
          <AlertCircle size={18} />
          <span>Your application will be reviewed by our team. You'll receive a notification once approved.</span>
        </div>

        <button type="submit" className="btn-primary full-width" disabled={loading}>
          {loading ? "Submitting..." : "Register Business"} <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}

/* ================= ESHOP OWNER FORM ================= */
function EshopOwnerForm({ 
  form, 
  setForm, 
  categories, 
  setCategories,
  loadingCategories, 
  setLoadingCategories,
  onBack, 
  onSubmit, 
  loading 
}) {
  const [fetched, setFetched] = useState(false);

  // Fetch categories only when this component renders
  useEffect(() => {
    if (!fetched) {
      const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
          const response = await getCategories();
          if (response.success) {
            setCategories(response.data);
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        } finally {
          setLoadingCategories(false);
          setFetched(true);
        }
      };
      fetchCategories();
    }
  }, [fetched, setCategories, setLoadingCategories]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (categoryName) => {
    setForm({ ...form, category: categoryName });
  };

  return (
    <div className="register-card">
      <button type="button" className="back-link" onClick={onBack}>
        <ArrowLeft size={15} /> Change category
      </button>
      <span className="register-tag">Shop Owner</span>
      <h1 className="register-title">Shop Owner Application</h1>
      <p className="register-sub">List your retail business on MoiHub</p>

      <form className="register-form" onSubmit={onSubmit}>
        <label className="field">
          <span><StoreIcon size={16} /> Shop Name <span className="required">*</span></span>
          <input
            type="text"
            name="shopName"
            placeholder="e.g., Campus Mart, Student Store"
            value={form.shopName}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span><Tag size={16} /> Business Category <span className="required">*</span></span>
          <p className="field-hint">Select the category that best describes your business</p>
          <div className="categories-grid">
            {loadingCategories ? (
              <div className="loading-categories">
                <Loader size={20} className="spinning" />
                <span>Loading categories...</span>
              </div>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  className={`category-chip ${form.category === cat.name ? "selected" : ""}`}
                  onClick={() => handleCategorySelect(cat.name)}
                >
                  {cat.name}
                </button>
              ))
            )}
          </div>
          {form.category && (
            <div className="selected-indicator">
              <CheckCircle2 size={16} />
              <span>Selected: {form.category}</span>
            </div>
          )}
        </label>

        <label className="field">
          <span><Phone size={16} /> Phone Number <span className="required">*</span></span>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="e.g., 0712345678"
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span><MapPin size={16} /> Address <span className="required">*</span></span>
          <input
            type="text"
            name="address"
            placeholder="e.g., Room 12, KDB House"
            value={form.address}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span><FileText size={16} /> Description</span>
          <textarea
            name="description"
            placeholder="Brief description of your business (optional)"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
        </label>

        <div className="info-box">
          <AlertCircle size={18} />
          <span>Your application will be reviewed by our team. Once approved, you can start listing products.</span>
        </div>

        <button type="submit" className="btn-primary full-width" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"} <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}

/* ================= PENDING STATUS ================= */
function PendingStatus({ vendorType, application }) {
  return (
    <div className="status-card">
      <div className="status-icon pending"><Clock size={32} /></div>
      <span className="register-tag">Under review</span>
      <h1 className="register-title">Application received</h1>
      <p className="register-sub">
        {application?.shopName ? `${application.shopName} is` : "Your application is"} being reviewed manually —
        there's no fixed timeline, but we'll notify you in the app the moment there's a decision.
      </p>
      <div className="status-details">
        <div><span>Category</span><strong>{vendorType === "eshop" ? "Eshop" : "Food vendor"}</strong></div>
        {application?.location && <div><span>Location</span><strong>{application.location}</strong></div>}
        {application?.address && <div><span>Address</span><strong>{application.address}</strong></div>}
      </div>
      <p className="register-note">Come back and sign in any time to check your status.</p>
      <Link to="/vendors" className="btn-secondary">
        Back to vendors
      </Link>
    </div>
  );
}

/* ================= APPROVED STATUS ================= */
function ApprovedStatus({ data, storefrontUrl, onCopy, onShare, copied, vendorType }) {
  return (
    <div className="status-card">
      <div className="status-icon approved"><CheckCircle2 size={32} /></div>
      <span className="register-tag">Live</span>
      <h1 className="register-title">Your stall is live</h1>
      <p className="register-sub">Share your link, or open the MoiHub app to manage your listing.</p>

      <div className="receipt-card">
        <div className="receipt-head">
          <span>{data?.shopName || "Your Shop"}</span>
          <span className="badge-active">Active</span>
        </div>
        <div className="receipt-line"><span>Storefront</span><strong>{storefrontUrl}</strong></div>
        {data?.expiresOn && <div className="receipt-line"><span>Active until</span><strong>{data.expiresOn}</strong></div>}
        <hr className="receipt-divider" />
        <div className="status-actions">
          <button type="button" className="btn-secondary" onClick={onCopy}>
            <Copy size={15} /> {copied ? "Copied" : "Copy link"}
          </button>
          <button type="button" className="btn-primary" onClick={onShare}>
            <Share2 size={15} /> Share
          </button>
        </div>
      </div>
      
      <div className="app-message">
        <p>📱 Download the MoiHub app to:</p>
        <ul>
          <li>✅ Manage your products/menu</li>
          <li>✅ Update prices and availability</li>
          <li>✅ View and confirm orders</li>
          <li>✅ Track your earnings</li>
        </ul>
      </div>
      
      <p className="register-note">
        Manage everything from the MoiHub app — the web is just for onboarding and sharing your link.
      </p>
      <Link to="/vendors" className="btn-secondary">
        Back to vendors
      </Link>
    </div>
  );
}

/* ================= EXPIRED STATUS ================= */
function ExpiredStatus({ data }) {
  return (
    <div className="status-card">
      <div className="status-icon expired"><AlertCircle size={32} /></div>
      <span className="register-tag">Expired</span>
      <h1 className="register-title">Your listing has lapsed</h1>
      <p className="register-sub">
        {data?.shopName || "Your shop"}'s active period ended. Your storefront is offline until it's renewed.
      </p>
      <div className="status-actions">
        <Link to="/contact" className="btn-primary">
          <Store size={16} /> Contact us to renew
        </Link>
        <Link to="/vendors" className="btn-secondary" style={{ marginLeft: '10px' }}>
          Back to vendors
        </Link>
      </div>
    </div>
  );
}

export default Register;