import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

// In your main file
const originalError = console.error;
console.error = function(...args) {
  if (args[0]?.includes?.('ResizeObserver loop')) return;
  originalError.apply(console, args);
};

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);