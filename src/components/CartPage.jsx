// Inside your CartPage component
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './cartpage.css'; // Import the CSS file for styling

function CartPage({ cartItems, handleRemoveFromCart, handleUpdateQuantity }) {
  // Function to generate the WhatsApp message
  const generateWhatsAppMessage = () => {
    // Construct the message with cart details
    let message = "Hello! I would like to purchase the following items:\n\n";
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - ${item.price}\n`;
    });
    // Calculate total amount
    const totalAmount = cartItems.reduce((total, item) => total + parseFloat(item.price.replace('$', '')), 0);
    message += `\nTotal Amount: Ksh ${totalAmount.toFixed(2)}`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Specify the phone number (replace XXXXXXXXXXX with the desired phone number)
    const phoneNumber = '254718055023';

    // Generate the WhatsApp URL with the phone number and pre-filled message
    const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;

    // Open WhatsApp app with the pre-filled message and specified phone number
    window.location.href = whatsappURL;
  };
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page when currentPage changes
  }, []);
  return (
  <>
    <div className="cart">
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <>
          <p>Your cart is empty.</p>
          <Link to="/pharmacy" className="back-to-eshop">Go Back</Link>
        </>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>{item.price}</p>
                <button onClick={() => handleRemoveFromCart(index)}>Remove</button>
              </div>
            </div>
          ))}
          <Link to="/pharmacy" className="back-to-eshop">Go Back</Link>
          <button onClick={generateWhatsAppMessage}>Checkout</button>
          
        </>
        
      )}
    </div>

    
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
     <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
   </svg>
    </>
    
  );
}

export default CartPage;
