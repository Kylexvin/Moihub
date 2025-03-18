import React from 'react';

export const PaymentStatusIndicator = ({ status }) => {
  const statusConfig = {
    stk_pushed: {
      icon: 'phone',
      color: 'blue',
      title: 'M-PESA Request Sent',
      description: 'Please check your phone and enter your PIN'
    },
    processing: {
      icon: 'refresh',
      color: 'blue',
      title: 'Processing Payment',
      description: 'We are processing your transaction'
    },
    completed: {
      icon: 'check-circle',
      color: 'green',
      title: 'Payment Successful',
      description: 'Your booking has been confirmed'
    },
    failed: {
      icon: 'x-circle',
      color: 'red',
      title: 'Payment Failed',
      description: 'Please try again or use a different number'
    },
    expired: {
      icon: 'clock',
      color: 'yellow',
      title: 'Request Expired',
      description: 'The payment request has expired'
    },
    cancelled: {
      icon: 'x',
      color: 'red',
      title: 'Payment Cancelled',
      description: 'You cancelled the M-PESA request'
    },
    refund_required: {
      icon: 'credit-card',
      color: 'yellow',
      title: 'Refund Required',
      description: 'There was an issue with your booking. A refund will be issued.'
    }
  };

  const config = statusConfig[status] || {
    icon: 'info',
    color: 'gray',
    title: 'Unknown Status',
    description: 'Please wait...'
  };

  const getIcon = () => {
    switch (config.icon) {
      case 'phone':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'refresh':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H9" />
          </svg>
        );
      case 'check-circle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'x-circle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'clock':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'x':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'credit-card': // Added refund_required icon
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    gray: 'text-gray-600 bg-gray-100'
  };

  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className={`p-3 rounded-full ${colorClasses[config.color]}`}>
        {getIcon()}
      </div>
      <div className="ml-4">
        <h3 className="font-medium">{config.title}</h3>
        <p className="text-sm text-gray-500">{config.description}</p>
      </div>
    </div>
  );
};
