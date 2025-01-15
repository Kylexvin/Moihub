import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const Payment = ({ bookingDetails, setPaymentStatus, setStep }) => {
  const [localPaymentStatus, setLocalPaymentStatus] = useState('pending');
  const navigate = useNavigate();

  const handleMpesaPayment = async () => {
    try {
      setLocalPaymentStatus('processing');
      const response = await fetch('http://localhost:5000/api/payments/mpesa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bookingId: bookingDetails.bookingId,
          amount: bookingDetails.price
        })
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      setLocalPaymentStatus('completed');
      setPaymentStatus('completed'); // Update the parent state if needed
      setTimeout(() => navigate('/ticket'), 1000); // Move to ticket step after payment
    } catch (err) {
      console.error('Payment error:', err);
      setLocalPaymentStatus('failed');
      setPaymentStatus('failed'); // Update the parent state if needed
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold">Complete Your Payment</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Booking Reference</p>
                <p className="font-medium">{bookingDetails.bookingId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-medium">KSH {bookingDetails.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-medium">{bookingDetails.matatu.registrationNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Departure</p>
                <p className="font-medium">{bookingDetails.matatu.departureTime}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Payment expires in: {Math.floor(bookingDetails.expiresIn / 60)} minutes
            </div>
          </div>
          
          <button
            onClick={handleMpesaPayment}
            disabled={localPaymentStatus === 'processing'}
            className={`w-full p-4 rounded-lg ${
              localPaymentStatus === 'processing'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            } text-white font-semibold transition-colors duration-200`}
          >
            {localPaymentStatus === 'processing' ? 'Processing...' : 'Pay with M-Pesa'}
          </button>

          {localPaymentStatus === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">Payment Failed</h3>
                <p className="text-sm text-red-600">
                  Please try again or contact support if the problem persists.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;