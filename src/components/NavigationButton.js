import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavigattionButton.css';

const NavigationButton = ({ to, children, className }) => {
  const navigate = useNavigate();

  return (
    <button
      className={`back-button ${className || ''}`}
      onClick={() => navigate(to)}
    >
      {children}
    </button>
  );
};

export default NavigationButton;