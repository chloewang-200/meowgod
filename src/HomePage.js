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
import Hand from './assets/human_hand.png';
import TempleEntry from './TempleEntry2.js'

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
  const [allGodsFinished, setAllGodsFinished] = useState(false);
  const [showHand, setShowHand] = useState(false);
  const [lockedHandPos, setLockedHandPos] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDraggingWithHand, setIsDraggingWithHand] = useState(false);
  const [showEntryBackground, setShowEntryBackground] = useState(false);
  const [isSaturated, setIsSaturated] = useState(false);
  const [goToTemple, setGoToTemple] = useState(false);

  const handleBackgroundClick = () => {
    if (moveToCornerFinished) {
      setMoveCoinToTopLeft(true);
    }
    if (showEvilGod) {
      setMoveCoinToMiddleAgain(true);
    }
    if (moveCoinToMiddleAgain) {
      setAllGodsFinished(true);
    }
  };

  const handleOpenTemple = () => {
    setIsSaturated(true);
    console.log('open temple');
  };

  const handStyle = {
    position: 'fixed',
    left: (lockedHandPos || mousePos).x,
    top: (lockedHandPos || mousePos).y,
    transform: 'translate(-50%, -50%)',
    width: '45vw',
    pointerEvents: 'none',
    zIndex: 99,
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
    if (!allGodsFinished) { return; }
    const allGodsTimer = setTimeout(() => {
      setShowHand(true);
    }, 1500);
    return () => clearTimeout(allGodsTimer);
  }, [allGodsFinished]);
  
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

  useEffect(() => {
    if (!isSaturated) { return; }
    const entryTimer = setTimeout(() => {
      setGoToTemple(true);
      console.log('go to temple');
    }, 1500);
    return () => clearTimeout(entryTimer);
  }, [isSaturated]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);


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
  
  useEffect(() => {
    if (!showHand) { return; }
    const entryBackgroundTimer = setTimeout(() => {
      setShowEntryBackground(true);
    }, 1500);
    return () => clearTimeout(entryBackgroundTimer);
  }, [isDraggingWithHand]);
  
  return (
    <div className={`homepage-container 
      ${showEntryBackground ? (isSaturated ? 'background-entry saturated' : 'background-entry') 
      : moveCoinToCenter ? 'background-changed' : ''}`
    } onClick={handleBackgroundClick}>
      <div className="tiger-wrapper" >
        <img src={Tiger_top} alt="Tiger_top" className="tiger-top-image" style={{ display: moveCoinToCenter ? 'none' : 'block' }} />
        <div className="tiger-eyes-wrapper" style={{ display: moveCoinToCenter ? 'none' : 'block' }}>
          <TigerEyes />
        </div>
         {moveCoinToMiddleAgain && !allGodsFinished && (
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
        onClick={() => {
          if (showHand) {
            setIsDraggingWithHand(true);
          }
        }}
        
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
          top: isSaturated
            ? '38%'
            : isDraggingWithHand
            ? mousePos.y
            : allGodsFinished
            ? '50%'
            :moveCoinToMiddleAgain
            ? '33%'
            : moveCoinToTopLeft
            ? '30%' 
            : moveToCornerFinished 
            ? '90%' 
            : storyFinished 
            ? '95%' 
            : moveCoinToCenter 
            ? '50%' 
            : '60%',
          left: isSaturated
            ? '48.5%'
            : isDraggingWithHand
            ? mousePos.x
            : moveCoinToMiddleAgain
            ? '49%'
            : moveCoinToTopLeft
            ? '23%' 
            : moveToCornerFinished 
            ? '85%' 
            : storyFinished 
            ? '85%' 
            : '50%',
          x: '-50%',
          y: '-50%',
          scale: isSaturated? 0.8 : moveCoinToMiddleAgain ? 1.1 : moveCoinToTopLeft ? 1.2 : (storyFinished ? 2.5 : 1),
          rotate: allGodsFinished ? [0, 360] : (moveCoinToMiddleAgain ? [360, 0] : moveCoinToTopLeft ? [0, 360] : (moveToCornerFinished ? 0 : (startSpinning ? 360 : 0))),
          transition: isDraggingWithHand
            ? { duration: 0 }  // no animation when following mouse
            : allGodsFinished
            ? { rotate: { duration: 2, ease: 'linear', repeat: Infinity, repeatType: "loop" } }
            : moveCoinToMiddleAgain
            ? { duration: 1.5, ease: 'easeInOut' }
            : moveCoinToTopLeft
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
        {showEvilGod && !moveCoinToMiddleAgain && !allGodsFinished && (
          <motion.img
            src={EvilGod}
            alt="Evil God"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="evil-god-image"
          />
        )}  
        {showEvilGod && !moveCoinToMiddleAgain && !allGodsFinished && <div className="evil-god-text">{evilGodText}</div>}
        {showHand && !isSaturated && (
            <img
              src={Hand}
              alt="hand"
              style={handStyle}
            />)}

        {showEntryBackground && (
          <div class="circle" onClick={handleOpenTemple}></div>
        )}
        {goToTemple && <TempleEntry />}
    </div>
  );
};

export default HomePage;
