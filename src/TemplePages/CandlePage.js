import React, { useState, useEffect } from 'react';
import altarBg from '../assets/altar/altar_bg.png';
import candleImg from '../assets/altar/candle.png';
import '../TemplePages/CandleStyles.css';

const CandlePage = () => {
  const [isLit, setIsLit] = useState(false);

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

  const toggleCandle = () => {
    setIsLit(!isLit);
  };

  return (
    <div className="candle-altar">
      <div className="altar-container">
        <img src={altarBg} alt="Altar Background" className="altar-background" />
        
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
          {isLit && <div className="glow-effect glow-active"></div>}
        </div>
      </div>
    </div>
  );
};

export default CandlePage; 