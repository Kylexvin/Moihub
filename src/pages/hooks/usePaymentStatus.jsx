import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_BASE_URL = 'https://moihub.onrender.com/api';

export const usePaymentStatus = (onStatusComplete) => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const pollIntervalRef = useRef(null);

  const STATUS_MESSAGES = {
    stk_pushed: 'M-PESA request sent to your phone',
    processing: 'Processing your payment...',
    completed: 'Payment successful! Your seat has been booked.',
    failed: 'Payment failed. Please try again.',
    cancelled: 'Payment was cancelled. Please try again.',
    expired: 'Payment request expired. Please try again.',
    refund_required: 'There was an issue confirming your seat. A refund will be processed.',
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const handlePaymentStatusUpdate = (status, customMessage = null, data = null) => {
    const finalStatus = data?.status || status; // Ensuring we get the correct status
    setPaymentStatus(finalStatus);
    if (data) setPaymentResponse(data);

    const message = customMessage || STATUS_MESSAGES[finalStatus] || finalStatus;
    const type = finalStatus === 'completed' ? 'success' 
                : ['failed', 'cancelled', 'expired', 'refund_required'].includes(finalStatus) ? 'error'
                : 'info';

    toast[type](message);

    // Stop polling for final states
    if (['completed', 'failed', 'expired', 'cancelled', 'refund_required'].includes(finalStatus)) {
      stopPolling();
    }

    if (finalStatus === 'completed' && onStatusComplete) {
      onStatusComplete(finalStatus, data || paymentResponse);
    }
  };

  const startPaymentStatusCheck = (paymentId) => {
    if (pollIntervalRef.current) return; // Prevent duplicate polling

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication error. Please try logging in again.');
      return;
    }

    let failedAttempts = 0;

    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/bookings/payments/status/${paymentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        handlePaymentStatusUpdate(response.data.status, null, response.data);
      } catch (error) {
        failedAttempts++;
        if (failedAttempts >= 3) {
          stopPolling();
          toast.error('Network issues while checking payment status. Please check My Bookings section.');
        }
      }
    }, 6000);

    // Auto-stop polling after 5 minutes
    setTimeout(() => {
      if (pollIntervalRef.current) {
        stopPolling();
        if (['initiated', 'stk_pushed', 'processing'].includes(paymentStatus)) {
          handlePaymentStatusUpdate('expired');
        }
      }
    }, 300000);
  };

  return {
    paymentStatus,
    paymentResponse,
    handlePaymentStatusUpdate,
    startPaymentStatusCheck,
  };
};
