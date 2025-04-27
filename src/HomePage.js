import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './homePage.css';
import Tiger from './assets/tiger.png';
import Tiger_top from './assets/tiger_top.png';
import Coin from './assets/sun_coin.png';
import TigerEyes from './TigerEyes';

const HomePage = () => {
  const [moveCoinToCenter, setMoveCoinToCenter] = useState(false);
  const [startSpinning, setStartSpinning] = useState(false);
  

  const handleDragEnd = () => {
    setMoveCoinToCenter(true); // start moving coin to center
  };

  const handleDragStart = () => {
    setMoveCoinToCenter(false);
    setStartSpinning(false);
  };
  

  const handleCenterAnimationComplete = () => {
    if (moveCoinToCenter && !startSpinning) {
      setStartSpinning(true);
    }
  };

  return (
    <div className={`homepage-container ${moveCoinToCenter ? 'background-changed' : ''}`}>
      <div className="tiger-wrapper" style={{ display: moveCoinToCenter ? 'none' : 'block' }}>
        <img src={Tiger_top} alt="Tiger_top" className="tiger-top-image" />
        <TigerEyes />
      </div>

      <motion.img
  key={moveCoinToCenter ? 'centered' : 'dragging'} // FORCE remount to clear internal drag
  src={Coin}
  alt="Coin"
  className="coin-image"
  drag={!moveCoinToCenter}
  dragElastic={0.5}
  dragMomentum={false}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
  whileTap={{
    scale: 1,
    zIndex: 9999,
  }}
  initial={{
    top: '60%',
    left: '50%',
    x: '-50%',
    y: '-50%',
    scale: 1,
    position: 'absolute',
  }}
  animate={{
  top: moveCoinToCenter ? '50%' : '60%',
  left: '50%',
  x: '-50%',
  y: '-50%',
  rotate: startSpinning ? 360 : 0,
  transition: startSpinning
    ? {
        repeat: Infinity,
        repeatType: "loop",
        duration: 2,
        ease: "linear",
      }
    : {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
}}

  onAnimationComplete={handleCenterAnimationComplete}
/>



      <img src={Tiger} alt="Tiger" className="tiger-image" style={{ display: moveCoinToCenter ? 'none' : 'block' }} />
    </div>
  );
};

export default HomePage;
