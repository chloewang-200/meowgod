import React, { useState, useEffect, useRef } from 'react';
import altarBg from '../assets/altar/altar_bg.png';
import candleImg from '../assets/altar/candle.png';
import '../TemplePages/CandleStyles.css';
import { Link } from 'react-router-dom';

const CandlePage = () => {
  const [isLit, setIsLit] = useState(false);
  const maskRef = useRef(null);

  // Force any body/html styling to allow full height
  useEffect(() => {
    // Save original styles
    const originalBodyStyle = document.body.style.cssText;
    const originalHtmlStyle = document.documentElement.style.cssText;
    
    // Apply full height and remove margins/padding
    document.body.style.cssText = 'margin: 0; padding: 0; height: 100%; overflow: hidden;';
    document.documentElement.style.cssText = 'margin: 0; padding: 0; height: 100%;';
    
    // Cleanup function to restore original styles
    return () => {
      document.body.style.cssText = originalBodyStyle;
      document.documentElement.style.cssText = originalHtmlStyle;
    };
  }, []);

  // Subtle flame flicker effect that affects the light mask
  useEffect(() => {
    if (isLit && maskRef.current) {
      const flickerEffect = () => {
        // Random intensity between 0.9 and 1.05
        const intensity = 0.9 + (Math.random() * 0.15);
        maskRef.current.style.opacity = intensity;
      };
      
      const flickerInterval = setInterval(flickerEffect, 200);
      return () => clearInterval(flickerInterval);
    }
  }, [isLit]);

  const toggleCandle = () => {
    setIsLit(!isLit);
  };

  return (
    <div className={`candle-altar ${isLit ? 'altar-lit' : 'altar-dark'}`}>
      <Link to="/temple" className="back-button">
        ← Back to Temple
      </Link>
      <div className="altar-container">
        <img src={altarBg} alt="Altar Background" className="altar-background" />
        
        {isLit && (
          <div 
            ref={maskRef}
            className="candle-light-mask candle-light-active"
          ></div>
        )}
        
        <div className={`candle-container ${isLit ? 'lit' : ''}`} onClick={toggleCandle}>
          <div className="candle-wrapper">
            <img 
              src={candleImg} 
              alt="Candle" 
              className="candle-image"
            />
            {isLit && (
              <div className="flame-container">
                <div className="flame"></div>
                <div className="incense-smoke">
                  <div className="smoke-line"></div>
                  <div className="smoke-line"></div>
                  <div className="smoke-line"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandlePage; 