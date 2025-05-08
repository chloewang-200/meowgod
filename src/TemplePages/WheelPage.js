import React, { useState } from 'react';
import LuckyDraw from '../components/LuckyDraw/LuckyDraw';
import '../components/WheelPage.css';
import wheelHeader from '../assets/wheel-header.png';
import sideImage1 from '../assets/tiger-green.png';
import sideImage2 from '../assets/tiger-red.png';
import sideImage3 from '../assets/tiger-blue.png';
import sideImage4 from '../assets/tiger-gray.png';
import treeHill1 from '../assets/tree-hill.png';
import { Link } from 'react-router-dom';

const WheelPage = () => {
  const [currentPrize, setCurrentPrize] = useState(null);
  const [showLimitAlert, setShowLimitAlert] = useState(false);

  const prizes = [
    "1000 🪙",
    "Mystery 📦",
    "Special 🐯",
    "500 💰",
    "Rare 💎",
    "100 🌟",
    "Gift 🎁",
    "Bye 🎲"
  ];

  const handleDrawResult = (result) => {
    console.log('Prize number:', result);
    setCurrentPrize(prizes[result]);
  };

  const handleLimitExceeded = () => {
    setShowLimitAlert(true);
    // Auto-hide after 3 seconds
    setTimeout(() => setShowLimitAlert(false), 3000);
  };

  return (
    <div className="wheel-page-container">
      <Link to="/main" className="back-button">
        ← Back
      </Link>
      <div className="wheel-container">
        <img src={wheelHeader} alt="wheel-header" className="wheel-header" />
        <div className="wheel-section">
          <div className="side-image left-top">
            <img src={sideImage1} alt="decoration" />
          </div>
          <div className="side-image right-top">
            <img src={sideImage2} alt="decoration" />
          </div>
          <LuckyDraw
            width={200}
            height={200}
            range={prizes.length}
            turns={5}
            textArray={prizes}
            drawLimit={2}
            drawLimitSwitch={true}
            fontColor="#F8EFD6"
            fontSize="14px"
            drawButtonLabel="Spin the Wheel! 🎲"
            onSuccessDrawReturn={handleDrawResult}
            onOutLimitAlert={handleLimitExceeded}
            rotateSecond={5}
            showInnerLabels={true}
            fontFamily="Protest Revolution"
          />
          <div className="side-image left-bottom">
            <img src={sideImage3} alt="decoration" />
          </div>
          <div className="side-image right-bottom">
            <img src={sideImage4} alt="decoration" />
          </div>
          <div className="side-image left-bottom">
            <img src={sideImage3} alt="decoration" />
          </div>
          <div className="tree-hill-left-bottom">
              <img src={treeHill1} alt="decoration" />
          </div>
          <div className="tree-hill-right-bottom">
              <img src={treeHill1} alt="decoration" />
          </div>
        </div>
        {currentPrize && (
          <div className="prize-overlay">
            <div className="prize-display">
              <h2>🎉 Congratulations! 🎉</h2>
              <span className="prize-text">{currentPrize}</span>
            </div>
          </div>
        )}
        
        {/* Limit Alert Popup */}
        {showLimitAlert && (
          <div className="limit-alert-overlay">
            <div className="limit-alert">
              <div className="limit-alert-content">
                <h2>🚫 Limit Reached!</h2>
                <p>You have reached the maximum number of draws!</p>
                <button 
                  className="close-button"
                  onClick={() => setShowLimitAlert(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WheelPage;
