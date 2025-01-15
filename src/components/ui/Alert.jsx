// src/components/ui/Alert.jsx

import React from 'react';

// Define the types of alert messages
const alertTypes = {
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
};

const Alert = ({ message, type = 'info', onClose }) => {
  return (
    <div
      className={`flex items-center p-4 mb-4 rounded-lg shadow-md ${alertTypes[type]}`}
      role="alert"
    >
      <div className="flex-grow">
        <span className="font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-4 p-1 text-lg font-semibold text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
    </div>
  );
};

export default Alert;
