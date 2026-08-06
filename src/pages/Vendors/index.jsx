// src/pages/Vendors/index.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Users,
  SlidersHorizontal,
  TrendingUp,
  GraduationCap,
  UtensilsCrossed,
  ShoppingBag,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Search,
  ChevronDown,
  Store,
  Tag,
  BadgeCheck,
} from 'lucide-react';
import './Vendors.css';

/* -----------------------------------------------------------
   Reveal: fades a section up into place the first time it
   scrolls into view. Pure CSS transition, IntersectionObserver
   only toggles a class — respects prefers-reduced-motion via CSS.
------------------------------------------------------------ */
function Reveal({ children, as: Tag = 'div', className = '' }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${inView ? 'in-view' : ''} ${className}`}>
      {children}
    </Tag>
  );
}

const WHY_ITEMS = [
  {
    icon: Users,
    title: 'A campus that already shops',
    body: 'Students order food and browse shops on MoiHub every day — your stall shows up where they’re already looking.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Run it from your phone',
    body: 'Add items, mark things sold out, and confirm orders between classes — all from the MoiHub app, no separate dashboard to learn.',
  },
  {
    icon: TrendingUp,
    title: 'Watch your name spread',
    body: 'Reviews and repeat orders build your reputation faster than word of mouth at the gate ever could.',
  },
  {
    icon: GraduationCap,
    title: 'Built around term time',
    body: 'Promotions, restocks and hours all adjust easily for orientation week, exam season, and the long holiday lull.',
  },
];

const FOOD_ITEMS = ['Restaurants', 'Cafes', 'Fast food joints', 'Home chefs', 'Snack vendors', 'Juice bars'];
const ESHOP_ITEMS = ['Fashion', 'Electronics', 'Beauty', 'Books', 'Accessories', 'General merchandise'];

const STOREFRONT_FEATURES = [
  'A shop profile with logo and cover image',
  'Your own shareable link',
  'A full product catalogue, or menu for food stalls',
  'A verified badge once approved',
  'Business hours customers can see',
];

const HOW_STEPS = [
  { title: 'Register and sign in', body: 'Use your existing MoiHub app account, or create one — registration and the app share the same login.' },
  { title: 'Choose food or eshop', body: 'Pick the category that fits your business and fill in a short application form.' },
  { title: 'We review your application', body: 'A real person checks your details before anything goes live.' },
  { title: 'Get approved', body: 'Once approved, we set your listing’s active period — no card required up front.' },
  { title: 'Your storefront goes live', body: 'Sign back in any time to see your status and grab your shareable storefront link.' },
];

const MANAGE_FOOD = ['Add and edit menu items', 'Upload photos of each dish', 'Update prices in real time', 'Mark items sold out', 'Group items into categories'];
const MANAGE_ESHOP = ['Add new products', 'Upload multiple product photos', 'Track and update stock', 'Edit prices anytime', 'Organise products into categories'];

const TRUST_ITEMS = [
  { icon: BadgeCheck, label: 'Verified businesses only' },
  { icon: Search, label: 'Easy to find and browse' },
  { icon: ShieldCheck, label: 'One flat subscription, no commission' },
  { icon: Zap, label: 'Built for fast browsing' },
];

const FAQS = [
  { q: 'Who can become a vendor?', a: 'Anyone running a business that serves the campus community — food vendors, shop owners, and service providers are all welcome.' },
  { q: 'Do I need a physical shop?', a: 'No. You can run things from home, a kitchen, or a kiosk. MoiHub is how customers find you either way.' },
  { q: 'How do I apply?', a: 'Sign in with your MoiHub app account (or create one), pick food or eshop, and fill in a short form with your shop details.' },
  { q: 'How long does approval take?', a: 'We review every application manually, so it varies — you’ll see your status the moment you sign back in.' },
  { q: 'Is there a monthly subscription?', a: 'Yes. Once approved, your listing is active for a set period with no per-sale commission — just one flat subscription.' },
  { q: 'What happens when my subscription ends?', a: 'Your storefront comes down until it’s renewed. We’ll be in touch about renewing before it lapses.' },
  { q: 'Can I update my prices or menu later?', a: 'Any time, right from the MoiHub app once you’re approved — no separate web dashboard needed.' },
  { q: 'How do I find my storefront link after I’m approved?', a: 'Sign back in on this page — approved vendors see their live link, share button, and active period right there. We also notify you in the app.' },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-question" onClick={onToggle} aria-expanded={isOpen}>
        {item.q}
        <ChevronDown size={20} />
      </button>
      <div className="faq-answer">
        <p>{item.a}</p>
      </div>
    </div>
  );
}

function Vendors() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <Helmet>
        <title>Vendors - Moihub | Become a Campus Vendor</title>
        <meta name="description" content="Sell food, fashion, electronics, and more to Moi University students. Join Moihub as a vendor with a flat subscription, no commission on sales." />
        
        {/* Open Graph */}
        <meta property="og:title" content="Become a Vendor on Moihub - Sell to Moi University Students" />
        <meta property="og:description" content="List your food business or eshop on Moihub. One flat subscription, no commission on sales. Join campus vendors already selling on the platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moihub-silk.vercel.app/vendors" />
        <meta property="og:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Become a Vendor on Moihub - Sell to Moi University Students" />
        <meta name="twitter:description" content="List your food business or eshop on Moihub. One flat subscription, no commission on sales." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://moihub-silk.vercel.app/vendors" />
      </Helmet>

      <div className="vendors-page">
        {/* HERO */}
        <section className="vendor-hero">
          <div className="vendor-hero-container">
            <div className="vendor-hero-content">
              <span className="tag-badge">Sell smarter with MoiHub</span>
              <h1 className="vendor-hero-title">Your stall, online in a weekend.</h1>
              <p className="vendor-hero-description">
                Whether you run a food business or an online shop, MoiHub puts your stall in front of the
                whole campus — one flat subscription, no commission on your sales.
              </p>
              <div className="vendor-hero-buttons">
                <Link to="/vendors/register" className="btn-primary">
                  <Store size={18} /> Become a vendor
                </Link>
                <a href="#how-it-works" className="btn-secondary">See how it works</a>
              </div>
            </div>

            <div className="vendor-hero-visual">
              <span className="hero-float-tag f1">Verified</span>
              <span className="hero-float-tag f2">Live now</span>
              <div className="receipt-card">
                <div className="receipt-head">
                  <span>Foody Deliveries</span>
                  <span>Listing</span>
                </div>
                <div className="receipt-line"><span>Category</span><strong>Food</strong></div>
                <div className="receipt-line"><span>Status</span><strong>Approved</strong></div>
                <div className="receipt-line"><span>Rating</span><strong>4.8 ★</strong></div>
                <hr className="receipt-divider" />
                <div className="receipt-line"><span>Chicken burger</span><span>KES 450</span></div>
                <div className="receipt-line"><span>Pizza</span><span>KES 350</span></div>
                <div className="receipt-line"><span>Smoothie</span><span>KES 250</span></div>
                <hr className="receipt-divider" />
                <div className="receipt-total"><span>Manage in-app →</span><span>foody-deliveries</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY SELL */}
        <section className="vendor-why">
          <div className="container">
            <Reveal>
              <span className="eyebrow">Why vendors stay</span>
              <h2 className="section-title">Why choose MoiHub?</h2>
              <p className="section-subtitle">Four reasons campus businesses set up shop with us.</p>
            </Reveal>
            <div className="why-grid">
              {WHY_ITEMS.map(({ icon: Icon, title, body }) => (
                <Reveal key={title} className="why-card">
                  <div className="icon-frame"><Icon size={24} /></div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* WHO CAN JOIN — real entry points into registration */}
        <section className="vendor-who">
          <div className="container">
            <Reveal>
              <span className="eyebrow">Two kinds of stalls</span>
              <h2 className="section-title">Built for different businesses</h2>
              <p className="section-subtitle">Pick a category to start your application.</p>
            </Reveal>
            <div className="who-grid">
              <Reveal as="div" className="who-card food">
                <div className="icon-frame"><UtensilsCrossed size={24} /></div>
                <h3>Food vendors</h3>
                <p>Perfect for</p>
                <ul>
                  {FOOD_ITEMS.map((item) => (
                    <li key={item}><CheckCircle2 size={16} />{item}</li>
                  ))}
                </ul>
                <Link to="/vendors/register?type=food" className="who-card-cta">
                  Apply as a food vendor <span aria-hidden="true">→</span>
                </Link>
              </Reveal>
              <Reveal as="div" className="who-card eshop">
                <div className="icon-frame"><ShoppingBag size={24} /></div>
                <h3>E-shop owners</h3>
                <p>Perfect for</p>
                <ul>
                  {ESHOP_ITEMS.map((item) => (
                    <li key={item}><CheckCircle2 size={16} />{item}</li>
                  ))}
                </ul>
                <Link to="/vendors/register?type=eshop" className="who-card-cta">
                  Apply as an eshop owner <span aria-hidden="true">→</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* STOREFRONT */}
        <section className="vendor-storefront">
          <div className="container">
            <Reveal>
              <span className="eyebrow">Your storefront</span>
              <h2 className="section-title">Your stall gets its own address</h2>
              <p className="section-subtitle">A professional page customers can find, bookmark, and share.</p>
            </Reveal>
            <div className="storefront-features">
              <Reveal className="features-list">
                <ul>
                  {STOREFRONT_FEATURES.map((f) => (
                    <li key={f}><CheckCircle2 size={18} />{f}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="storefront-mocks">
                <div className="mock-shop food-shop">
                  <div className="mock-shop-header">
                    <span>food/foody-deliveries</span>
                    <span className="verified"><BadgeCheck size={14} /> Verified</span>
                  </div>
                  <div className="mock-shop-body">
                    <div>Foody Palace</div>
                    <div>French fries • Burgers • Snacks</div>
                    <div>★ 4.8 (120 reviews)</div>
                  </div>
                </div>
                <div className="mock-shop eshop-shop">
                  <div className="mock-shop-header">
                    <span>eshop/kx-electronics</span>
                    <span className="verified"><BadgeCheck size={14} /> Verified</span>
                  </div>
                  <div className="mock-shop-body">
                    <div>KX Electronics</div>
                    <div>Phone accessories • Gadgets</div>
                    <div>★ 4.6 (85 reviews)</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="vendor-how" id="how-it-works">
          <div className="container">
            <Reveal>
              <span className="eyebrow">Getting started</span>
              <h2 className="section-title">How it works</h2>
              <p className="section-subtitle">From application to a live, shareable storefront.</p>
            </Reveal>
            <div className="how-timeline">
              {HOW_STEPS.map((step, i) => (
                <Reveal as="div" className="how-step" key={step.title}>
                  <span className="step-number">{i + 1}</span>
                  <div className="how-step-body">
                    <h4>{step.title}</h4>
                    <p>{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* MANAGE PRODUCTS — clarified as an in-app capability, not a web feature */}
        <section className="vendor-manage">
          <div className="container">
            <Reveal>
              <span className="eyebrow">Once you're approved</span>
              <h2 className="section-title">Manage everything from the app</h2>
              <p className="section-subtitle">There's no separate web dashboard — your phone is the dashboard.</p>
            </Reveal>
            <div className="manage-grid">
              <Reveal className="manage-col">
                <h3><UtensilsCrossed size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />Food vendors</h3>
                <ul>{MANAGE_FOOD.map((m) => <li key={m}><Tag size={15} />{m}</li>)}</ul>
              </Reveal>
              <Reveal className="manage-col">
                <h3><ShoppingBag size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />E-shop owners</h3>
                <ul>{MANAGE_ESHOP.map((m) => <li key={m}><Tag size={15} />{m}</li>)}</ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="vendor-trust">
          <div className="container">
            <Reveal>
              <span className="eyebrow">Why customers trust MoiHub</span>
              <h2 className="section-title">Built to be trusted</h2>
            </Reveal>
            <div className="trust-grid">
              {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                <Reveal as="div" className="trust-card" key={label}>
                  <Icon size={20} />
                  <span>{label}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="vendor-faq">
          <div className="container">
            <Reveal>
              <span className="eyebrow">Questions</span>
              <h2 className="section-title" style={{ textAlign: 'center' }}>Frequently asked questions</h2>
            </Reveal>
            <div className="faq-list">
              {FAQS.map((item, i) => (
                <FaqItem
                  key={item.q}
                  item={item}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="vendor-cta-final">
          <div className="container">
            <h2>Ready to open your stall?</h2>
            <p>One flat subscription — no commission on your sales. Join MoiHub today.</p>
            <Link to="/vendors/register" className="btn-primary-large">
              <Store size={20} /> Become a vendor
            </Link>
          </div>
        </section>

        {/* STICKY MOBILE CTA */}
        <div className="mobile-sticky-cta">
          <span>One flat subscription — no commission</span>
          <Link to="/vendors/register" className="btn-primary">Join now</Link>
        </div>
      </div>
    </>
  );
}

export default Vendors;