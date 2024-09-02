import React, { useEffect } from 'react';
import './categorylist.css';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import CustomerCare from './customercare';

const CategoryList = ({ categories }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to the top when the component mounts
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  const handleCategoryClick = (categoryId) => {
    navigate(`/shops/${categoryId}`);
  };

  const handleWhatsAppClick = () => {
    // Customize the phone number and message as needed
    const phoneNumber = '254768610613';
    const message = 'Hello, I am here to inquire about MoiHub eShop';

    // Create the WhatsApp link
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp link in a new tab or window
    window.open(whatsappLink, '_blank');
  };

  const handleExploreClick = () => {
    // Redirect to the home page
    window.location.href = "/";
  };

  const handleCallClick = () => {
    // Add additional logic here, such as making a phone call
    window.location.href = "tel:0745276898";
  };

  return (
    <>
      <section className="component-background">
        {/* SEO Metadata */}
        <Helmet>
          <title>MoiHub eShop - Shop Online for Moi University Students</title>
          <meta name="description" content="Shop online for a wide range of products tailored for Moi University students at MoiHub eShop. Explore various categories and enjoy special offers." />
          <link rel="canonical" href="https://moihub.co.ke/eshop" />
        </Helmet>
    
        <div className="card-n">
          <button className="button Explore" onClick={handleExploreClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z" />
            </svg>
            HOME
          </button>
          
          <button className="button Post" onClick={handleCallClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 28 28">
              <path d="M3.59 1.322l2.844-1.322 4.041 7.89-2.725 1.341c-.538 1.259 2.159 6.289 3.297 6.372.09-.058 2.671-1.328 2.671-1.328l4.11 7.932s-2.764 1.354-2.854 1.396c-7.861 3.591-19.101-18.258-11.384-22.281zm1.93 1.274l-1.023.504c-5.294 2.762 4.177 21.185 9.648 18.686l.971-.474-2.271-4.383-1.026.5c-3.163 1.547-8.262-8.219-5.055-9.938l1.007-.497-2.251-4.398zm7.832 7.649l2.917.87c.223-.747.16-1.579-.24-2.317-.399-.739-1.062-1.247-1.808-1.469l-.869 2.916zm1.804-6.059c1.551.462 2.926 1.516 3.756 3.051.831 1.536.96 3.263.498 4.813l-1.795-.535c.325-1.091.233-2.306-.352-3.387-.583-1.081-1.551-1.822-2.643-2.146l.536-1.796zm.95-3.186c2.365.705 4.463 2.312 5.729 4.656 1.269 2.343 1.466 4.978.761 7.344l-1.84-.548c.564-1.895.406-4.006-.608-5.882-1.016-1.877-2.696-3.165-4.591-3.729l.549-1.841z" />
            </svg>
            Call
          </button>
          
          <button className="button Chat" onClick={handleWhatsAppClick}>
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="svg">
              <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -999.000000)">
                <g id="icons" transform="translate(56.000000, 160.000000)">
                  <path d="M97.1784026,840.884344 C92.8882915,837.134592 86.2359857,839.256228 84.7592414,844.817545 C84.139128,847.151543 84.7373784,848.235292 84.7373784,849.987037 C84.7373784,851.787636 84,854.395812 84,854.395812 C84,854.714855 84.2832249,855.025921 84.6320386,854.935194 C85.8792217,854.609172 87.8627895,853.964107 90.2349218,854.608175 C98.2119249,856.770688 103.330841,846.261214 97.1784026,840.884344 M103.447113,859 C103.395437,859 103.341773,858.993021 103.287115,858.979063 C96.9806421,857.395812 97.4039887,859.174477 93.8999507,858.237288 C92.8395967,857.954137 91.8746446,857.443669 91.0418642,856.781655 C97.4059763,857.561316 102.710728,852.016948 101.771614,845.487535 C102.732591,846.487535 103.438169,847.72582 103.7363,849.11266 C104.584981,853.048852 102.430484,852.38285 103.983749,858.364905 C104.075176,858.714855 103.765119,859 103.447113,859" id="messages_chat-[#1557]"></path>
                </g>
              </g>
            </svg>
            Chat
          </button>
        </div>

        <section className="card-intro">
          {/* <div className="landing">
            <div className="square">
              <i className="fas fa-map-marker-alt fa-2x" style={{ color: 'green' }}></i>
              <h3>STAGE</h3>
            </div>
            <div className="rectangle">
              <a href='/learnmore' className="cta">
                Learn More
              </a>
            </div>
          </div> */}

          <div className="ad-card">
            <div className="ad-content">
              <div className="ad-heading">Space for Hire!</div>
              <div className="ad-description">Place your ad here. If you can see this, so can your clients. Contact us today.</div>
              {/* <button className="cta-button">
                Shop Now
              </button> */}
            </div>
          </div>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
  <path
    fill="#27a844"
    fillOpacity="1"
    d="M0,224L48,197.3C96,171,192,117,288,106.7C384,96,480,128,576,149.3C672,171,768,181,864,170.7C960,160,1056,128,1152,138.7C1248,149,1344,203,1392,229.3L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
    transform="scale(1, -1) translate(0, -320)"
  ></path>
</svg>
          <section className="shopping-categories">
            <div className="category-grid">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`/shops/${category.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick(category.id);
                  }}
                  className={`category-card category-${category.id}`}
                >
                  <div className="card-content">
                    <div className="card-icon">
                      <i className={`fas fa-${category.icon}`}></i>
                    </div>
                    <h3 className="card-title">{category.name}</h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
          
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
            <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </section>
        <CustomerCare />
      </section>
    </>
  );
};

export default CategoryList;
