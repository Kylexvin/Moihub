import React from 'react';
import './Card.css';
import { MapPin, Bus, CreditCard, Users, Search } from 'lucide-react';

// Card Component
const Card = ({ children, className, variant = 'default', onClick }) => {
  return (
    <div 
      className={`card ${variant === 'hover' ? 'hover' : ''} ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }) => {
  return (
    <div className={`card-header ${className || ''}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className }) => {
  return (
    <div className={`card-content ${className || ''}`}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className }) => {
  return (
    <div className={`card-footer ${className || ''}`}>
      {children}
    </div>
  );
};

// Button Component
const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  disabled = false,
  loading = false,
  ...props 
}) => {
  return (
    <button 
      className={`
        button 
        ${variant === 'primary' ? 'button-primary' : ''}
        ${variant === 'secondary' ? 'button-secondary' : ''}
        ${variant === 'outline' ? 'button-outline' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className || ''}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="loading-spinner mr-2" />
      ) : null}
      {children}
    </button>
  );
};

// Input Component
const Input = ({ 
  className, 
  icon, 
  error,
  ...props 
}) => {
  const input = (
    <input 
      className={`
        input 
        ${error ? 'border-red-500' : ''} 
        ${icon ? 'input-with-icon' : ''} 
        ${className || ''}
      `}
      {...props} 
    />
  );

  if (icon) {
    return (
      <div className="input-icon-wrapper">
        <span className="input-icon">{icon}</span>
        {input}
      </div>
    );
  }

  return input;
};

// Slider Component
const Slider = ({ 
  value, 
  onValueChange, 
  min = 0, 
  max = 100, 
  step = 1,
  className,
  ...props 
}) => {
  return (
    <input
      type="range"
      className={`slider ${className || ''}`}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      min={min}
      max={max}
      step={step}
      {...props}
    />
  );
};

export { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  Button, 
  Input, 
  Slider,
  MapPin, 
  Bus, 
  CreditCard, 
  Users, 
  Search 
};