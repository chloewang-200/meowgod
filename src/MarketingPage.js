import React, { useRef, useEffect, useState } from 'react';
import styles from'./marketingPage.module.css';
import bgImage from './assets/homepage_bg.png';
import { motion } from 'framer-motion';
import Tiger from './assets/tiger.png';
import Tiger_top from './assets/tiger_top.png';
import Coin from './assets/sun_coin.png';
import TigerEyes from './TigerEyes';
import MainGod from './assets/main_god.png';
import EvilGod from './assets/evil_god.png';
import DogGod from './assets/dog_god.png';
import Hand from './assets/human_hand.png';
import TempleEntry from './TempleEntry2.js'
import StarGlitter from './assets/star-glitter.gif';
import StarGlitter6 from './assets/star_glitter_6.gif'
import HintCursor from './HintCursor';
const MarketingPage = () => {

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
  const [zIndex, setZIndex] = useState(2);
  const [showStar, setShowStar] = useState(false);


  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    imgNaturalWidth: 0,
    imgNaturalHeight: 0,
    displayWidth: 0,
    displayHeight: 0,
    scale: 1
  });
  
  // Elements with coordinates based on the original image
  const elements = [
    { id: 1, x: 300, y: 200, content: "Element 1" },
    { id: 2, x: 700, y: 400, content: "Element 2" }
  ];
  const [isResizing, setIsResizing] = useState(false);

useEffect(() => {
  let resizeTimer;
  
  const handleResize = () => {
    setIsResizing(true);
    
    // Clear previous timer
    if (resizeTimer) {
      clearTimeout(resizeTimer);
    }
    
    // Reset after resize is "complete" (user stopped resizing)
    resizeTimer = setTimeout(() => {
      setIsResizing(false);
    }, 100);
  };
  
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
    if (resizeTimer) clearTimeout(resizeTimer);
  };
}, []);
  
  useEffect(() => {
    // Get natural image dimensions
    const img = new Image();
    img.onload = () => {
      setDimensions(prev => ({
        ...prev,
        imgNaturalWidth: img.naturalWidth,
        imgNaturalHeight: img.naturalHeight
      }));
    };
    img.src = bgImage;
    
    const updateDimensions = () => {
      if (!containerRef.current || !dimensions.imgNaturalWidth || !dimensions.imgNaturalHeight) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      // Calculate scaling factors for both dimensions
      const widthScale = containerWidth / dimensions.imgNaturalWidth;
      const heightScale = containerHeight / dimensions.imgNaturalHeight;
      
      // Use the smaller scale to ensure full image is visible
      const scale = Math.min(widthScale, heightScale);
      
      // Calculate the displayed dimensions
      const displayWidth = dimensions.imgNaturalWidth * scale;
      const displayHeight = dimensions.imgNaturalHeight * scale;
      
      setDimensions(prev => ({
        ...prev,
        displayWidth,
        displayHeight,
        scale
      }));
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, [dimensions.imgNaturalWidth, dimensions.imgNaturalHeight]);
  

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
  


  const storySentences = [
    "This is a story of a Coin.",
    "A Coin that was never meant for ordinary hands.",
    "When you possess the Coin, you hold a choice.",
    "You may pledge it as tribute.",
    "You may awaken a God's favor.",
    "You may alter your fate.",
    ""
  ];
  // const storySentences = [
  //   "This is a story of a Coin.",
  //   ""
  // ];
  
  const mainGodText = `
  Guardian of treasures, Protector of fortune, Keeper of sacred vaults.
  Those who kneel before Caelum and offer the Coin shall find their fortunes fortified beyond mortal reach.
  Through storms of chaos and the slow erosion of time, your wealth shall stand untouched, gleaming with the favor of the eternal.
  Pay tribute, and Caelum shall weave shields of gold and iron around your destiny.
  `;
  
  const evilGodText = `Through ritual staking and communion with the chain, visions of the future may be granted. The Cat Gods see the cycles. They see you bla bla bla Through ritual staking and communion with the chain, visions of the future may be granted. The.`
  const dogGodText = `Through ritual staking and communion with the chain, visions of the future may be granted. The Cat Gods see the cycles. They see you bla bla bla Through ritual staking and communion with the chain, visions of the future may be granted. The.`
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
  const [backgroundReady, setBackgroundReady] = useState(false);

useEffect(() => {
  if (showEntryBackground) {
    // Next tick, after showing, allow transitions
    const timer = setTimeout(() => {
      setBackgroundReady(true);
    }, 50); // just a tiny delay (50ms)
    return () => clearTimeout(timer);
  }
}, [showEntryBackground]);


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
    setZIndex(99);
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
    if (!isDraggingWithHand) { return; }
    const entryBackgroundTimer = setTimeout(() => {
      setShowEntryBackground(true);
    }, 1500);
    return () => clearTimeout(entryBackgroundTimer);
  }, [isDraggingWithHand]);

  
  return (
    <div className={styles.pageContainer}>
      <div 
        ref={containerRef} 
        className={`${styles.homepageContainer} 
        ${showEntryBackground ? ` ${styles.backgroundEntry} ${backgroundReady ? styles.ready : ''} ${isSaturated ? styles.saturated : ''}` 
        : moveCoinToCenter ? styles.homepageContainerChanged : ''}`}
        onClick={handleBackgroundClick}
      >
        
        <div 
          className={styles.imageContainer}
          style={{
            width: `${dimensions.displayWidth}px`,
            height: `${dimensions.displayHeight}px`
          }}
        >
          <div 
            className="tiger-wrapper"
            style={{
              position: 'absolute',
              // Position it somewhere in the image - adjust percentages as needed
              left: '50%', 
              top: '55%',
              transform: `translate(-50%, -50%)`,
              transformOrigin: 'center center',
              width: `${dimensions.displayWidth * 0.4}px`, // 30% of background width
              height: 'auto',
            }}>
          <img 
            src={Tiger_top} 
            alt="Tiger_top" 
            className="tiger-top-image" 
            style={{ 
              display: moveCoinToCenter ? 'none' : 'block',
              width: '100%', // Fill the wrapper width
              height: 'auto'  // Maintain aspect ratio
            }} 
          />
        <div className="tiger-eyes-wrapper" 
          style={{ display: moveCoinToCenter ? 'none' : 'block',
          }}>
          <TigerEyes style = {{width: `${dimensions.displayWidth * 0.35}px`,}}/>
        </div>
        
      </div>

      {/* Coin */}
     {/* Coin wrapper */}
     <div 
  className="coin-wrapper"
  style={{
    position: 'absolute',
    left: isSaturated 
      ? `${48.5 * dimensions.displayWidth / 100 + (window.innerWidth - dimensions.displayWidth)/2}px`
      : isDraggingWithHand
      ? `${mousePos.x}px`
      : moveCoinToMiddleAgain
      ? `${41 * dimensions.displayWidth / 100 + (window.innerWidth - dimensions.displayWidth)/2}px`
      : moveCoinToTopLeft
      ? `${10 * dimensions.displayWidth / 100 + (window.innerWidth - dimensions.displayWidth)/2}px` 
      : moveToCornerFinished 
      ? `${85 * dimensions.displayWidth / 100 + (window.innerWidth - dimensions.displayWidth)/2 }px` 
      : storyFinished 
      ? `${85 * dimensions.displayWidth / 100 + (window.innerWidth - dimensions.displayWidth)/2}px` 
      : `${41.5 * dimensions.displayWidth / 100 + (window.innerWidth - dimensions.displayWidth)/2}px`,
    top: isSaturated
      ? `${38 * dimensions.displayHeight / 100 + (window.innerHeight - dimensions.displayHeight)/2}px`
      : isDraggingWithHand
      ?`${mousePos.y}px`
      : allGodsFinished
      ? `${50 * dimensions.displayHeight / 100  + (window.innerHeight - dimensions.displayHeight)/2}px`
      : moveCoinToMiddleAgain
      ? `${31 * dimensions.displayHeight / 100  + (window.innerHeight - dimensions.displayHeight)/2}px`
      : moveCoinToTopLeft
      ? `${30 * dimensions.displayHeight / 100  + (window.innerHeight - dimensions.displayHeight)/2}px` 
      : moveToCornerFinished 
      ? `${95 * dimensions.displayHeight / 100  + (window.innerHeight - dimensions.displayHeight)/2}px` 
      : storyFinished 
      ? `${95 * dimensions.displayHeight / 100  + (window.innerHeight - dimensions.displayHeight)/2}px` 
      : moveCoinToCenter 
      ? `${50 * dimensions.displayHeight / 100  + (window.innerHeight - dimensions.displayHeight)/2}px` 
      : `${60 * dimensions.displayHeight / 100 + (window.innerHeight - dimensions.displayHeight)/2}px`,
    transform: isDraggingWithHand ? 'translate(-100%, -50%)' : 'translate(-50%, -50%)',
    width: `${dimensions.displayWidth * 0.16}px`,
    height: 'auto',
    transformOrigin: 'center center',
    display: goToTemple ? 'none' : 'block',
    filter: showStar ? 'drop-shadow(0 0 20px rgb(255, 217, 0))' : 'none',
    zIndex: zIndex,
    // Track position updates for smooth animations
    transition: (!isDraggingWithHand && !isResizing )? 'left 0.5s ease-in-out, top 0.5s ease-in-out' : 'none',
    pointerEvents: showEntryBackground ? 'none' : 'auto',
  }}
>
  <motion.img
    key={`coin-${dimensions.displayWidth}-${moveCoinToCenter ? 'centered' : 'dragging'}`}
    src={Coin}
    alt="Coin"
    className={styles.coinImage}
    style={{
      width: '100%',
      height: 'auto',
      position: 'relative',
    }}
    drag={!moveCoinToCenter}
    onClick={() => {
      if (showHand) {
        setIsDraggingWithHand(true);
      }
    }}
    onMouseEnter={() => setShowStar(true)}
    onMouseLeave={() => setShowStar(false)}

    // dragElastic={0.5}
    dragMomentum={false}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
    animate={{
      rotate: allGodsFinished 
        ? [0, 360] 
        : moveCoinToMiddleAgain 
        ? [360, 0] 
        : moveCoinToTopLeft 
        ? [0, 360] 
        : moveToCornerFinished 
        ? 0 
        : startSpinning 
        ? 360 
        : 0,
      scale: isSaturated 
        ? 0.8 
        : moveCoinToMiddleAgain 
        ? 1.1 
        : moveCoinToTopLeft 
        ? 1.9 
        : storyFinished 
        ? 2.5 
        : 1,
      transition: (isDraggingWithHand || isResizing)
        ? { duration: 0 }
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
</div>
{/* End of Coin */}
{/* Bottom Tiger */}
<img src={Tiger} alt="Tiger" className="tiger-image" 
style={{ display: moveCoinToCenter ? 'none' : 'block',
  width: `${dimensions.displayWidth * 0.35}px`,
  height: 'auto',
}} />
{/* End of Bottom Tiger */}
        {/* Story Text */}
        {!storyFinished && <div className="story-text" 
        style={{
          left: `${50 * dimensions.displayWidth / 100 + (window.innerWidth - dimensions.displayWidth)/2}px`,
          top: `${85 * dimensions.displayHeight / 100 + (window.innerHeight - dimensions.displayHeight)/2}px`,
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
          position: 'absolute',
          fontSize: `${dimensions.displayWidth * 0.020}px`,
          fontFamily: 'Protest Revolution',
          color: 'white',
          zIndex: 99,
        }}
        > 
                {storySentences[currentSentenceIndex]}
              </div>}
        {/* End of Story Text */}

        {/* Main God */}
        <div className="main-god-wrapper"
        style={{
          left: `${94 * dimensions.displayWidth / 100 + (window.innerWidth - dimensions.displayWidth)/2}px`,
          top: `${80 * dimensions.displayHeight / 100 + (window.innerHeight - dimensions.displayHeight)/2}px`,
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
          position: 'absolute',
          zIndex: 9999,
        }}>
          {moveToCornerFinished && !moveCoinToTopLeft && (
            <motion.img
              src={MainGod}
              alt="God"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style = {{
                width: `${dimensions.displayWidth * 0.8}px`,
                height: 'auto',
              }}
              // className="god-image"
            />
        )}
        </div>
        {/* End of Main God */}
        <div className="main-god-text-wrapper"
         style={{
          left: `${30 * dimensions.displayWidth / 100 + (window.innerWidth - dimensions.displayWidth)/2}px`,
          top: `${50 * dimensions.displayHeight / 100 + (window.innerHeight - dimensions.displayHeight)/2}px`,
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
          position: 'absolute',
          fontSize: `${dimensions.displayWidth * 0.020}px`,
          fontFamily: 'Protest Revolution',
          width: `${dimensions.displayWidth * 0.3}px`,
          color: 'white',
          zIndex: 9999,
         }}
        >
          {moveToCornerFinished && !moveCoinToTopLeft && <div >{mainGodText}</div>}
        </div>
        {/* End of Main God Text */}

        {/* Evil God */}
        <div className="evil-god-wrapper"
        style={{
          left: `${20 * dimensions.displayWidth / 100 + (window.innerWidth - dimensions.displayWidth)/2}px`,
          top: `${55 * dimensions.displayHeight / 100 + (window.innerHeight - dimensions.displayHeight)/2}px`,
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
          position: 'absolute',
          zIndex: 9999,
        }}>

        {showEvilGod && !moveCoinToMiddleAgain && !allGodsFinished && (
          <motion.img
            src={EvilGod}
            alt="Evil God"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              width: `${dimensions.displayWidth * 0.4}px`,
              height: 'auto',
            }}
            // className="evil-god-image"
          />
        )}  
        </div>
        {/* End of Evil God */}
        <div className="evil-god-text-wrapper"
         style={{
          left: `${70 * dimensions.displayWidth / 100 + (window.innerWidth - dimensions.displayWidth)/2}px`,
          top: `${50 * dimensions.displayHeight / 100 + (window.innerHeight - dimensions.displayHeight)/2}px`,
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
          position: 'absolute',
          fontSize: `${dimensions.displayWidth * 0.020}px`,
          fontFamily: 'Protest Revolution',
          width: `${dimensions.displayWidth * 0.3}px`,
          color: 'white',
          zIndex: 9999,
         }}
        >
        {moveToCornerFinished || showEvilGod || moveCoinToMiddleAgain || allGodsFinished && <HintCursor />}
        {showEvilGod && !moveCoinToMiddleAgain && !allGodsFinished && <div>{evilGodText}</div>}
        </div>
        {/* End of Evil God Text */}

        {/* Dog God */}
        <div className="dog-god-wrapper"
        style={{
          left: `${50 * dimensions.displayWidth / 100 + (window.innerWidth - dimensions.displayWidth)/2}px`,
          top: `${55 * dimensions.displayHeight / 100 + (window.innerHeight - dimensions.displayHeight)/2}px`,
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
          position: 'absolute',
          zIndex: 9999,
        }}> 

        {moveCoinToMiddleAgain && !allGodsFinished && (
          <motion.img
            src={DogGod}
            alt="Dog God"
            style={{
              width: `${dimensions.displayWidth * 0.35}px`,
              height: 'auto',
            }}
            transition={{ duration: 2, ease: "easeOut" }}
            // className="dog-god-image"
          />
        )}
        </div>
        <div className="dog-god-text-wrapper"
         style={{
          left: `${82 * dimensions.displayWidth / 100 + (window.innerWidth - dimensions.displayWidth)/2}px`,
          top: `${50 * dimensions.displayHeight / 100 + (window.innerHeight - dimensions.displayHeight)/2}px`,
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
          position: 'absolute',
          fontSize: `${dimensions.displayWidth * 0.025}px`,
          fontFamily: 'Protest Revolution',
          width: `${dimensions.displayWidth * 0.28}px`,
          color: 'white',
          zIndex: 9999,
         }}
        >
        {moveToCornerFinished || showEvilGod || moveCoinToMiddleAgain || allGodsFinished && <HintCursor />}
        {moveCoinToMiddleAgain && !allGodsFinished && <div>{dogGodText}</div>}
        </div>

        <div className="dog-god-text-wrapper"
         style={{
          left: `${18 * dimensions.displayWidth / 100 + (window.innerWidth - dimensions.displayWidth)/2}px`,
          top: `${50 * dimensions.displayHeight / 100 + (window.innerHeight - dimensions.displayHeight)/2}px`,
          transform: 'translate(-50%, -50%) scaleX(-1)',
          transformOrigin: 'center center',
          position: 'absolute',
          fontSize: `${dimensions.displayWidth * 0.025}px`,
          fontFamily: 'Protest Revolution',
          width: `${dimensions.displayWidth * 0.28}px`,
          color: 'white',
          zIndex: 9999,
         }}
        >
        {moveToCornerFinished || showEvilGod || moveCoinToMiddleAgain || allGodsFinished && <HintCursor />}
        {moveCoinToMiddleAgain && !allGodsFinished && <div>{dogGodText}</div>}
        </div>


        {showHand &&showStar && <img 
        style = {{
          left: `${10 * dimensions.displayWidth / 100 + (window.innerWidth - dimensions.displayWidth)/2}px`,
          top: `${20 * dimensions.displayHeight / 100 + (window.innerHeight - dimensions.displayHeight)/2}px`,
          width: `${dimensions.displayWidth * 0.1}px`,
          height: 'auto',
          position: 'absolute',
        }}
        src={StarGlitter6} alt="Star"
         />}

{showHand &&showStar && !showEntryBackground && <img 
        style = {{
          left: `${75 * dimensions.displayWidth / 100 + (window.innerWidth - dimensions.displayWidth)/2}px`,
          top: `${60 * dimensions.displayHeight / 100 + (window.innerHeight - dimensions.displayHeight)/2}px`,
          width: `${dimensions.displayWidth * 0.16}px`,
          transform: 'rotate(200deg)',
          height: 'auto',
          position: 'absolute',
        }}
        src={StarGlitter6} alt="Star"
         />}
        {showHand && !isSaturated && (
            <img
              src={Hand}
              alt="hand"
              style={handStyle}
            />)}

        {showEntryBackground && (
          <div class="circle" onClick={handleOpenTemple} style={{display: goToTemple ? 'none' : 'block'}}></div>
        )}
        {goToTemple && <TempleEntry />}
       
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;