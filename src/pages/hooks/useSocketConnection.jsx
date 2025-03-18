import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const SOCKET_URL = 'https://moihub.onrender.com';

export const useSocketConnection = ({ onStatusUpdate, paymentResponse, paymentStatus }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);

  // Extract user ID from JWT token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return payload.userId || payload.id;
    } catch (e) {
      console.error('Error extracting user ID from token:', e);
      return null;
    }
  };

  useEffect(() => {
    // Socket.io connection
    const token = localStorage.getItem('token');
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      setSocketConnected(true);

      // Join user-specific room
      const userId = getUserIdFromToken();
      if (userId) {
        // The server automatically joins the user to their room,
        // but we can explicitly join for redundancy
        socketRef.current.emit('join_user_room', { userId });
      }
    });

    socketRef.current.on('disconnect', () => {
      setSocketConnected(false);
    });

    // Listen for payment status updates - Updated event name
    socketRef.current.on('payment_status_update', (data) => {
      console.log('Payment Status Update:', data);
      if (onStatusUpdate) {
        onStatusUpdate(data.status, data.message, data);
      }

      // Notify user based on payment status
      if (data.status === 'completed') {
        toast.success('Payment Successful!');
      } else if (data.status === 'failed') {
        toast.error(data.message || 'Payment Failed. Try again.');
      } else if (data.status === 'expired') {
        toast.warning(data.message || 'Payment Request Expired.');
      } else if (data.status === 'processing') {
        toast.info(data.message || 'Processing Payment...');
      } else if (data.status === 'refund_required') {
        toast.error(data.message || 'There was an issue with your booking. A refund will be issued.');
      }
    });

    // Listen for specific payment completion event
    socketRef.current.on('payment_completed', (data) => {
      console.log('Payment Completed Event:', data);
      if (onStatusUpdate) {
        onStatusUpdate('completed', data.message, data);
      }
      toast.success(data.message || 'Payment Successful!');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [onStatusUpdate]);

  return { socketConnected };
};
