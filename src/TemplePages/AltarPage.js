import React, { useState } from 'react';
import './AltarStyles.css';
import prayingLeft from '../assets/altar/praying_left.png';
import prayingRight from '../assets/altar/praying_right.png';
import eyesTree from '../assets/altar/eyes_tree.png';

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
    // Calculate position relative to the table
    const tableRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - tableRect.left;
    const y = e.clientY - tableRect.top;
    
    // Get a random item
    const randomItem = items[Math.floor(Math.random() * items.length)];
    
    // Add the new item to the array with position info
    setRandomItems([...randomItems, {
      ...randomItem,
      uniqueId: Date.now(), // unique id for React key
      style: {
        left: `${(x / tableRect.width) * 100}%`,
        top: `${(y / tableRect.height) * 100}%`
      }
    }]);
  };
  
  return (
    <div className="altar-container">
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
    </div>
  );
};

export default AltarPage;
