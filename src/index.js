import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found! Check your index.html');
}

// Suppress ResizeObserver errors
const originalError = console.error;
console.error = function(...args) {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('ResizeObserver loop')) {
    return;
  }
  originalError.apply(console, args);
};

const root = createRoot(container);

root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);