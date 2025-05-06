import React, { useState, useEffect } from 'react';
import './AltarStyles.css';
import prayingLeft from '../assets/altar/praying_left.png';
import prayingRight from '../assets/altar/praying_right.png';
import eyesTree from '../assets/altar/eyes_tree.png';
import { useAuth } from '../contexts/AuthContext';

// Import WebFont for Google Fonts
import WebFont from 'webfontloader';

// Import random items
import redCandle from '../assets/altar/random_items/red_candle.png';
import apple from '../assets/altar/random_items/apple.png';
import threeCandles from '../assets/altar/random_items/three_candles.png';
import patternCandle from '../assets/altar/random_items/pattern_candle.png';
import cakes from '../assets/altar/random_items/cakes.png';
import vaseAndGlass from '../assets/altar/random_items/vase_and_glass.png';
import flowers from '../assets/altar/random_items/flowers.png';
import butterflyVase from '../assets/altar/random_items/butterfly_vase.png';
import pinkTeaSet from '../assets/altar/random_items/pink_tea_set.png';
import dessertPlate from '../assets/altar/random_items/dessert_plate.png';
import yellowNoodles from '../assets/altar/random_items/yellow_noodles.png';
import orangeNoodles from '../assets/altar/random_items/orange_noodles.png';
import strawberry from '../assets/altar/random_items/strawberry.png';

const AltarPage = () => {
  const [randomItems, setRandomItems] = useState([]);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0, tableRect: null });
  const { currentUser } = useAuth();
  
  const BACKEND_URL = 'https://flask-api-717901323721.us-central1.run.app';
  const SACRIFICE_COST = 100;

  // Initialize Google Fonts
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Protest Revolution']
      }
    });
  }, []);

  // Fetch balance when component mounts
  useEffect(() => {
    if (currentUser) {
      getBalance();
    }
  }, [currentUser]);

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
      console.log('Get balance response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Get balance parsed data:', data);
      } catch (e) {
        console.error('Error parsing balance response:', e);
        throw new Error('Invalid response format');
      }
      
      if (data.balance !== undefined) {
        console.log('Setting balance to:', data.balance);
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

  const deductBalance = async () => {
    if (!currentUser) {
      setError('You must be logged in to make offerings');
      return false;
    }

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
        body: JSON.stringify({ amount: 100 })
      });
      
      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Failed to deduct balance: ${response.status} ${responseText}`);
      }
      
      const responseText = await response.text();
      console.log('Deduct balance response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Deduct balance parsed data:', data);
      } catch (e) {
        console.error('Error parsing deduct balance response:', e);
        throw new Error('Invalid response format');
      }
      
      // Check if the response contains the new balance in different formats
      if (data.new_balance !== undefined) {
        console.log('Setting balance to new_balance:', data.new_balance);
        setBalance(data.new_balance);
      } else if (data.balance !== undefined) {
        console.log('Setting balance to balance:', data.balance);
        setBalance(data.balance);
      } else {
        console.warn('Balance not found in response, refreshing:', data);
        // If we can't find the balance in the response, refresh it
        getBalance();
      }
      
      setError('');
      return true;
    } catch (err) {
      console.error('Error in deductBalance:', err);
      setError(err.message);
      return false;
    }
  };
  
  // Array of available items
  const items = [
    { src: redCandle, alt: 'Red Candle', id: 'red_candle', category: 'candle' },
    { src: apple, alt: 'Apple', id: 'apple', category: 'food' },
    { src: threeCandles, alt: 'Three Candles', id: 'three_candles', category: 'candle' },
    { src: patternCandle, alt: 'Pattern Candle', id: 'pattern_candle', category: 'candle' },
    { src: cakes, alt: 'Cakes', id: 'cakes', category: 'food' },
    { src: vaseAndGlass, alt: 'Vase and Glass', id: 'vase_and_glass', category: 'vase' },
    { src: flowers, alt: 'Flowers', id: 'flowers', category: 'flower' },
    { src: butterflyVase, alt: 'Butterfly Vase', id: 'butterfly_vase', category: 'vase' },
    { src: pinkTeaSet, alt: 'Pink Tea Set', id: 'pink_tea_set', category: 'teaware' },
    { src: dessertPlate, alt: 'Dessert Plate', id: 'dessert_plate', category: 'food' },
    { src: yellowNoodles, alt: 'Yellow Noodles', id: 'yellow_noodles', category: 'food' },
    { src: orangeNoodles, alt: 'Orange Noodles', id: 'orange_noodles', category: 'food' },
    { src: strawberry, alt: 'Strawberry', id: 'strawberry', category: 'food' }
  ];
  
  const handleTableClick = (e) => {
    if (!currentUser) {
      setError('You must be logged in to make offerings');
      return;
    }
    
    // Capture dimensions first, before showing popup
    const tableRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - tableRect.left;
    const y = e.clientY - tableRect.top;
    
    // Save click position for later use
    setClickPosition({
      x,
      y,
      tableRect: {
        width: tableRect.width,
        height: tableRect.height
      }
    });
    
    // Show the confirmation popup
    setShowPopup(true);
  };
  
  const handleConfirmSacrifice = async () => {
    // Close the popup
    setShowPopup(false);
    
    // Attempt to deduct balance
    const success = await deductBalance();
    if (!success) {
      return;
    }
    
    // Get a random item
    const randomItem = items[Math.floor(Math.random() * items.length)];
    
    // Add the new item to the array with position info
    setRandomItems([...randomItems, {
      ...randomItem,
      uniqueId: Date.now(), // unique id for React key
      style: {
        left: `${(clickPosition.x / clickPosition.tableRect.width) * 100}%`,
        top: `${(clickPosition.y / clickPosition.tableRect.height) * 100}%`
      }
    }]);
  };
  
  const handleCancelSacrifice = () => {
    setShowPopup(false);
  };

  return (
    <div className="altar-wrapper">
      <div className="altar-container">
        <div className="balance-box">
          <p>Balance: {balance !== null ? balance : "Loading..."}</p>
          {error && <p className="error">{error}</p>}
        </div>
        
        {/* Log the current balance state for debugging */}
        <div style={{ display: 'none' }}>
          {console.log('Current balance state:', balance)}
        </div>
        
        <div className="altar-background">
          <div className="praying-figures-left">
            <img src={prayingLeft} alt="Praying figures left" className="praying-left" />
          </div>
          <div className="praying-figures-right">
            <img src={prayingRight} alt="Praying figures right" className="praying-right" />
          </div>
          <div className="eyes-tree-container">
            <img src={eyesTree} alt="Eyes tree" className="eyes-tree" />
          </div>
          <div className="altar-table" onClick={handleTableClick}>
            {/* Display all the random items that have been added */}
            {randomItems.map((item) => (
              <div 
                key={item.uniqueId}
                className={`random-item item-${item.category}`}
                style={item.style}
              >
                <img src={item.src} alt={item.alt} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Confirmation Popup */}
        {showPopup && (
          <div className="sacrifice-popup-overlay">
            <div className="sacrifice-popup">
              <h3>Confirm Sacrifice</h3>
              <p>Each sacrifice costs {SACRIFICE_COST}.</p>
              <p>Your current balance is {balance}.</p>
              <div className="popup-buttons">
                <button className="cancel-button" onClick={handleCancelSacrifice}>Cancel</button>
                <button className="confirm-button" onClick={handleConfirmSacrifice}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AltarPage;
