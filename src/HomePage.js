import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './homePage.css';
import Tiger from './assets/tiger.png';
import Tiger_top from './assets/tiger_top.png';
import Coin from './assets/sun_coin.png';
import TigerEyes from './TigerEyes';
import MainGod from './assets/main_god.png';
import EvilGod from './assets/evil_god.png';
import DogGod from './assets/dog_god.png';
const HomePage = () => {
  const [moveCoinToCenter, setMoveCoinToCenter] = useState(false);
  const [startSpinning, setStartSpinning] = useState(false);
  const [storyFinished, setStoryFinished] = useState(false);
  const [moveToCornerFinished, setMoveToCornerFinished] = useState(false);
  const [spinSlowly, setSpinSlowly] = useState(false);
  const [showMainGod, setShowMainGod] = useState(false);
  const [moveCoinToTopLeft, setMoveCoinToTopLeft] = useState(false);
  const [showEvilGod, setShowEvilGod] = useState(false);
  const [moveCoinToMiddleAgain, setMoveCoinToMiddleAgain] = useState(false);

  const handleBackgroundClick = () => {
    if (moveToCornerFinished) {
      setMoveCoinToTopLeft(true);
    }
    if (showEvilGod) {
      setMoveCoinToMiddleAgain(true);
    }
  };
  


  const storySentences_test = [
    "This is a story of a Coin.",
    "A Coin that was never meant for ordinary hands.",
    "When you possess the Coin, you hold a choice.",
    "You may pledge it as tribute.",
    "You may awaken a God's favor.",
    "You may alter your fate.",
    ""
  ];
  const storySentences = [
    "This is a story of a Coin.",
    ""
  ];
  
  const mainGodText = `
  Guardian of treasures, Protector of fortune, Keeper of sacred vaults.
  Those who kneel before Caelum and offer the Coin shall find their fortunes fortified beyond mortal reach.
  Through storms of chaos and the slow erosion of time, your wealth shall stand untouched, gleaming with the favor of the eternal.
  Pay tribute, and Caelum shall weave shields of gold and iron around your destiny.
  `;
  
  const evilGodText = `Through ritual staking and communion with the chain, visions of the future may be granted. The Cat Gods see the cycles. They see you bla bla bla Through ritual staking and communion with the chain, visions of the future may be granted. The.`
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
  

  useEffect(() => {
    if (currentSentenceIndex >= 0 && currentSentenceIndex < storySentences.length - 1) {
      const interval = setInterval(() => {
        setCurrentSentenceIndex((prev) => {
          if (prev < storySentences.length - 2) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setStoryFinished(true);
            return prev;
          }
        });
      }, 2000);
  
      return () => clearInterval(interval);
    }
  }, [currentSentenceIndex]);
  
  
  useEffect(() => {
    if (moveToCornerFinished) {
      const slowSpinTimer = setTimeout(() => {
        setSpinSlowly(true);
        setShowMainGod(true);
      }, 3000); // 3 seconds after story finishes
  
      return () => clearTimeout(slowSpinTimer);
    }
  }, [moveToCornerFinished]);
  
  useEffect(() => {
    if (moveCoinToTopLeft) {
      const evilGodTimer = setTimeout(() => {
        setShowEvilGod(true);
      }, 1500); // 3 seconds after story finishes 
  
      return () => clearTimeout(evilGodTimer);
    }
  }, [moveCoinToTopLeft]);
  

  const handleDragEnd = () => {
    setMoveCoinToCenter(true); // start moving coin to center
  };

  const handleDragStart = () => {
    setMoveCoinToCenter(false);
    setStartSpinning(false);
    setCurrentSentenceIndex(-1);
  };
  

  const handleCenterAnimationComplete = () => {
    if (moveCoinToCenter && !startSpinning) {
      setStartSpinning(true);
      // Start story 2 seconds after spinning starts
      setTimeout(() => {
        setCurrentSentenceIndex(0); // Start showing the first sentence
      }, 2000);
    } else if (storyFinished && !moveToCornerFinished) {
      setMoveToCornerFinished(true); // 🛑 mark move to corner finished
    }
  };
  
  
  return (
    <div className={`homepage-container ${moveCoinToCenter ? 'background-changed' : ''}`} onClick={handleBackgroundClick}>
      <div className="tiger-wrapper" >
        <img src={Tiger_top} alt="Tiger_top" className="tiger-top-image" style={{ display: moveCoinToCenter ? 'none' : 'block' }} />
        <div className="tiger-eyes-wrapper" style={{ display: moveCoinToCenter ? 'none' : 'block' }}>
          <TigerEyes />
        </div>
         {moveCoinToMiddleAgain && (
          <motion.img
            src={DogGod}
            alt="Dog God"
            className="dog-god-image"
          />
        )}
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
          top: 
            moveCoinToMiddleAgain
            ? '20%'
            : moveCoinToTopLeft
            ? '30%' 
            : moveToCornerFinished 
            ? '90%' 
            : storyFinished 
            ? '95%' 
            : moveCoinToCenter 
            ? '50%' 
            : '60%',
          left: 
            moveCoinToMiddleAgain
            ? '50%'
            : moveCoinToTopLeft
            ? '23%' 
            : moveToCornerFinished 
            ? '85%' 
            : storyFinished 
            ? '85%' 
            : '50%',
          x: '-50%',
          y: '-50%',
          scale: moveCoinToTopLeft ? 1.2 : (storyFinished ? 2.5 : 1),
          rotate: moveCoinToTopLeft ? 360 : (moveToCornerFinished ? 0 : (startSpinning ? 360 : 0)),
          transition: moveCoinToTopLeft
            ? { duration: 1.5, ease: 'easeInOut' }
            : moveToCornerFinished
            ? { duration: 2, ease: 'easeInOut' }
            : storyFinished
            ? {
                top: { duration: 2, ease: "easeInOut" },
                left: { duration: 2, ease: "easeInOut" },
                scale: { duration: 2, ease: "easeInOut" },
                rotate: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: spinSlowly ? 8 : 2,
                  ease: "linear",
                },
              }
            : startSpinning
            ? {
                rotate: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 2,
                  ease: "linear",
                },
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

      {!storyFinished && <div className="story-text">
        {storySentences[currentSentenceIndex]}
      </div>}

      {moveToCornerFinished && !moveCoinToTopLeft && (
          <motion.img
            src={MainGod}
            alt="God"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="god-image"
          />
        )}

        {moveToCornerFinished && !moveCoinToTopLeft && <div className="main-god-text">{mainGodText}</div>}
        {showEvilGod && (
          <motion.img
            src={EvilGod}
            alt="Evil God"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="evil-god-image"
          />
        )}  
        {showEvilGod && !moveCoinToMiddleAgain && <div className="evil-god-text">{evilGodText}</div>}
       
    </div>
  );
};

export default HomePage;
