import React, { useState, useEffect } from 'react';
import LuckyDraw from '../components/LuckyDraw/LuckyDraw';
import '../components/WheelPage.css';
import wheelHeader from '../assets/wheel-header.png';
import sideImage1 from '../assets/tiger-green.png';
import sideImage2 from '../assets/tiger-red.png';
import sideImage3 from '../assets/tiger-blue.png';
import sideImage4 from '../assets/tiger-gray.png';
import treeHill1 from '../assets/tree-hill.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const WheelPage = () => {
  const { currentUser } = useAuth();
  const [currentPrize, setCurrentPrize] = useState(null);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');
  const [showInsufficientBalancePopup, setShowInsufficientBalancePopup] = useState(false);
  const BACKEND_URL = 'https://meow-god-backend-717901323721.us-central1.run.app';
  const SPIN_COST = 10; // Cost to spin the wheel

  // const prizes = [
  //   "1000 🪙",
  //   "Mystery 📦",
  //   "Special 🐯",
  //   "500 💰",
  //   "Rare 💎",
  //   "100 🌟",
  //   "Gift 🎁",
  //   "Bye 🎲"
  // ];
  const prizes = [
    "👹 1000",
    "💎 500",
    "🐯 100",
    "💰 50",
    "🎲 0",
    "🌟 10",
    "🎁 5",
    "🪙 1",
    "🎲 0"
  ];

  // Function to fetch balance
  const getBalance = async () => {
    try {
      const idToken = await currentUser.getIdToken(true);
      
      const response = await fetch(`${BACKEND_URL}/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Failed to fetch balance: ${response.status} ${responseText}`);
      }
      
      const responseText = await response.text();
      let data = JSON.parse(responseText);
      
      if (data.balance !== undefined) {
        setBalance(data.balance);
      } else {
        console.warn('Balance not found in response:', data);
      }
      
      setError('');
    } catch (err) {
      console.error('Error in getBalance:', err);
      setError(err.message);
    }
  };

  // Function to deduct balance
  const deductBalance = async (amount) => {
    try {
      const idToken = await currentUser.getIdToken();
      
      const response = await fetch(`${BACKEND_URL}/balance/deduct`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ amount: amount })
      });
      
      if (!response.ok) {
        throw new Error('Failed to deduct balance');
      }
      
      await getBalance(); // Refresh balance after deduction
      return true;
    } catch (err) {
      console.error('Error in deductBalance:', err);
      setError(err.message);
      return false;
    }
  };

  // Function to add balance for winnings
  const addBalance = async (amount) => {
    try {
      const idToken = await currentUser.getIdToken();
      
      const response = await fetch(`${BACKEND_URL}/balance/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ amount: amount })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add balance');
      }
      
      await getBalance(); // Refresh balance after adding
      return true;
    } catch (err) {
      console.error('Error in addBalance:', err);
      setError(err.message);
      return false;
    }
  };

  // Update balance periodically
  useEffect(() => {
    if (currentUser) {
      getBalance();
      const intervalId = setInterval(getBalance, 5000);
      return () => clearInterval(intervalId);
    }
  }, [currentUser]);

  const handleDrawResult = async (result) => {
    console.log('Prize number:', result);
    setCurrentPrize(prizes[result]);
    
    // Parse the number from the prize string
    const prizeString = prizes[result];
    const prizeAmount = parseInt(prizeString.split(' ')[1]);
    
    // Add balance if prize amount is greater than 0
    try {
        if (prizeAmount > 0) {
            console.log('Adding prize amount:', prizeAmount);
            await addBalance(prizeAmount);
            await getBalance(); // Refresh balance after adding prize
        }
    } catch (err) {
        console.error('Error updating balance after prize:', err);
        setError('Failed to update balance after winning');
        // Refresh balance anyway to ensure display is accurate
        await getBalance();
    }
  };

  const handleBeforeSpin = async () => {
    if (!currentUser) {
        setError('Please log in to play');
        return false;
    }

    // Refresh balance before checking
    await getBalance();

    if (balance < SPIN_COST) {
        setShowInsufficientBalancePopup(true);
        return false;
    }

    const success = await deductBalance(SPIN_COST);
    if (!success) {
        setShowInsufficientBalancePopup(true);
        return false;
    }

    // Refresh balance after successful deduction
    await getBalance();
    return true;
  };

  const handleLimitExceeded = () => {
    setShowLimitAlert(true);
    setTimeout(() => setShowLimitAlert(false), 3000);
  };

  return (
    <div className="wheel-page-container">
      <Link to="/main" className="back-button">
        ← Back
      </Link>

      {/* Add balance display */}
      <div className="balance-box">
        {currentUser ? (
          <h3>Balance: {balance !== null ? `${balance}` : 'Loading...'}</h3>
        ) : (
          <h3>Please log in to play</h3>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>

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
            onBeforeDraw={handleBeforeSpin}
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
        
        {/* Insufficient Balance Popup */}
        {showInsufficientBalancePopup && (
          <div className="sacrifice-popup-overlay">
            <div className="sacrifice-popup">
              <h3>Insufficient Balance</h3>
              <p>You need at least {SPIN_COST} coins to spin.</p>
              <p>Your current balance is {balance}.</p>
              <div className="popup-buttons">
                <button 
                  className="confirm-button" 
                  onClick={() => setShowInsufficientBalancePopup(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Limit Alert Popup */}
        {/* {showLimitAlert && (
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
        )} */}
      </div>
    </div>
  );
};

export default WheelPage;
