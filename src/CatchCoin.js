import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import coinImg from './assets/coin.png';
import './catchCoin.css';
import catSquatImg from './assets/cat_squat.png';
import catWizard from './assets/cat_wizard.png'; // running pose
import catWizardStand from './assets/cat_wizard_stand.png'; // standing pose
import { useEffect } from 'react';
import mainGod from './assets/main_god.png';
import godCatBody from './assets/god_cat_body.png';
import { animate, stagger } from "motion"
import { splitText } from "motion-plus"
import godLucky from './assets/god_cat_lucky.png';
import handCursor from './assets/hand.png';
import Cat from './Cat';
export default function CoinWithCat() {
    const [coinDropped, setCoinDropped] = useState(false);
    const [origin, setOrigin] = useState({ x: 0, y: 0 });
    const [showFlyingCoin, setShowFlyingCoin] = useState(false);
    const [showSquatCat, setShowSquatCat] = useState(false);
    const [showWalkingCat, setShowWalkingCat] = useState(true);
    const [triggerCoinDrop, setTriggerCoinDrop] = useState(false);
    const [coinHasLanded, setCoinHasLanded] = useState(false);
    const [dropPosition, setDropPosition] = useState({ top: 0, left: 0 });
    const [catExiting, setCatExiting] = useState(false);
    const [showMainGod, setShowMainGod] = useState(false);
    const [showGodCatBody, setShowGodCatBody] = useState(false);
    const [textAnimationFinished, setTextAnimationFinished] = useState(false);
    const [secondTextAnimationFinished, setSecondTextAnimationFinished] = useState(false);
    const [hasAnimatedMainText, setHasAnimatedMainText] = useState(false);
    const [hasSecondAnimatedText, setHasSecondAnimatedText] = useState(false);
    const [hasThirdAnimatedText, setHasThirdAnimatedText] = useState(false);
    const [thirdTextAnimationFinished, setThirdTextAnimationFinished] = useState(false);
    const [showHand, setShowHand] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [coinDropToHand, setCoinDropToHand] = useState(false);
    const [coinFrozen, setCoinFrozen] = useState(false);
    const [lockedHandPos, setLockedHandPos] = useState(null);
    const [enterTemple, setEnterTemple] = useState(false);
    const [pressRightArrow, setPressRightArrow] = useState(false);
    const handStyle = {
      position: 'fixed',
      left: (lockedHandPos || mousePos).x,
      top: (lockedHandPos || mousePos).y,
      transform: 'translate(-50%, -50%)',
      width: '45vw',
      pointerEvents: 'none',
      zIndex: 1,
    };
    

    useEffect(() => {
      const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);


    useEffect(() => {
      if (!coinFrozen || !lockedHandPos) return;
      setTimeout(() => {
        setEnterTemple(true);
      }, 5000);
    }, [coinFrozen]);
    


    const [catX, setCatX] = useState(-300);
    const [isWalking, setIsWalking] = useState(false);
    const [catPose, setCatPose] = useState(catWizardStand);
    const containerRef = useRef(null);
    const [canAscend, setCanAscend] = useState(false);
    const [showGodLucky, setShowGodLucky] = useState(false);




    const oRef = useRef(null);
    const dragRef = useRef(null);
    const dropRef = useRef(null);
    const catExitingRef = useRef(false);


    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      catExitingRef.current = catExiting;
    }, [catExiting]);

    useEffect(() => {
      console.log("✅ showMainGod changed:", showMainGod);
    }, [showMainGod]);
    
    useEffect(() => {
      console.log("✅ canAscend changed:", canAscend);
      if (canAscend) {
        console.log("canAscend", canAscend);
        setTimeout(() => {
          setShowGodCatBody(true);
        }, 1200); // match coin's animation duration or tweak to match visually
      }
    }, [canAscend]);
    
    
    useEffect(() => {
      const handleWheel = () => {
        console.log("catExiting", catExiting, "coinDropped", coinDropped);
        if (catExitingRef.current) {
          setScrolled(true);
          setShowSquatCat(false);
          setTimeout(() => {
            console.log("showMainGod", showMainGod);
            setShowMainGod(true);
          }, 1200); // delay in ms
        
        }
      };
      window.addEventListener("wheel", handleWheel);
      return () => window.removeEventListener("wheel", handleWheel);
    }, []);
    
    useEffect(() => {
      if (!scrolled || !textAnimationFinished) return;
    
      const handleAscend = () => {
        setCanAscend(true);
        // console.log("✅ canAscend set after text animation");
      };
    
      const timer = setTimeout(handleAscend, 400);
      return () => clearTimeout(timer);
    }, [scrolled, textAnimationFinished]);

    useEffect(() => {
      if (!scrolled || !secondTextAnimationFinished) return;
    
      const handleAscend = () => {
        setTimeout(() => {
          setShowGodLucky(true);
        }, 1000);
        // console.log("✅ canAscend set after text animation");
      };
    
      const timer = setTimeout(handleAscend, 400);
      return () => clearTimeout(timer);
    }, [scrolled, secondTextAnimationFinished]);

    useEffect(() => {
      if (!scrolled || !thirdTextAnimationFinished) return;
    
      const handleAscend = () => {
        setTimeout(() => {
          setCoinDropToHand(true);
        }, 1000);
        // console.log("✅ canAscend set after text animation");
      };
    
      const timer = setTimeout(handleAscend, 400);
      return () => clearTimeout(timer);
    }, [scrolled, thirdTextAnimationFinished]);
    
    useEffect(() => {
      if (!coinDropToHand) return;
      setTimeout(() => {
        setShowHand(true);
      }, 1000);
    }, [coinDropToHand]);
    useEffect(() => {
      if (!catExiting) return;
    
      const interval = setInterval(() => {
        setCatX((prevX) => {
          const newX = prevX - 5;
          if (newX < -300) {
            clearInterval(interval);
            setShowWalkingCat(false); // hide cat after exit
            return -300;
          }
          return newX;
        });
      }, 16); // ~60fps
    
      return () => clearInterval(interval);
    }, [catExiting]);

    
    useEffect(() => {
        const handleKeyDown = (e) => {
          if (e.key === 'ArrowRight') {
            setIsWalking(true);
            setPressRightArrow(true);
          }
        };
      
        const handleKeyUp = (e) => {
          if (e.key === 'ArrowRight') {
            setIsWalking(false);
            setCatPose(catWizardStand);
          }
        };
      
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
        };
      }, []);

      const frameToggleRef = useRef(false);

      useEffect(() => {
        let intervalId;
      
        if (isWalking) {
          intervalId = setInterval(() => {
            setCatX((prevX) => {
              const maxRight = window.innerWidth * 0.3;
              const newX = Math.min(prevX + 2, maxRight);
              if (newX >= window.innerWidth * 0.3 && !triggerCoinDrop) {
                setTriggerCoinDrop(true);
              }
      
              if (newX >= maxRight) {
                setIsWalking(false);
                setCatPose(catWizardStand);
              } else {
                frameToggleRef.current = !frameToggleRef.current;
                const newPose = frameToggleRef.current ? catWizard : catWizardStand;
                // console.log("Switching to", newPose); // ✅ confirm switching
                setCatPose(newPose);
              }
      
              return newX;
            });
          }, 10); // slower for easier debugging
        }
      
        return () => clearInterval(intervalId);
      }, [isWalking]);
      
      
      
      
      
    const handleDragEnd = () => {
        if (!oRef.current || !dragRef.current) return;

        const coinBox = dragRef.current.getBoundingClientRect();
        const oBox = oRef.current.getBoundingClientRect();

        const fromX = coinBox.left + coinBox.width / 2;
        const fromY = coinBox.top + coinBox.height / 2;

        const toX = oBox.left + oBox.width / 2;
        const toY = oBox.top + oBox.height / 2;

        const deltaX = fromX - toX;
        const deltaY = fromY - toY;

        // Invert direction so the motion starts from drop and animates into the "o"
        setOrigin({ x: -deltaX, y: -deltaY });
        setShowFlyingCoin(true);
        setShowSquatCat(true);

        setTimeout(() => {
            setShowFlyingCoin(false);
            setCoinDropped(true);
        }, 1000);
        setTimeout(() => {
          // 🐱 trigger cat run away
          setCatPose(catWizard);     // running pose
          setCatExiting(true);
      }, 0);
    };

    return (
        <div className="coin-container hand-cursor" ref={containerRef}
        >
            <div className="mew-text">
      {(!scrolled && (showFlyingCoin || coinDropped)) && <span className="letter">m</span>}
  {/* Coin 1: Drop animation */}
{triggerCoinDrop && !coinHasLanded && (
  <div>
  <motion.img
    src={coinImg}
    alt="coin-drop"
    ref={dropRef}
    initial={{ y: '-100vh', opacity: 0 }}
    animate={{ y: '-10vh', opacity: 1 }}
    transition={{ type: 'spring', bounce: 0.4, duration: 1.2 }}
    onAnimationComplete={() => {
      if (dropRef.current) {
        const dropBox = dropRef.current.getBoundingClientRect();
          const containerBox = containerRef.current.getBoundingClientRect();
          setDropPosition({
            top: dropBox.top - containerBox.top,
            left: dropBox.left - containerBox.left,
          });

      }
      setCoinHasLanded(true);
    }}
    
    className="coin-draggable"
    style={{
      position: 'absolute',
      left: '50%',
      // transform: 'translateX(-50%)',
      width: '15vw',
      height: 'auto',
      zIndex: 10,
      pointerEvents: 'none',
    }}
  />


  </div>
)}
{/* Coin 2: Draggable, appears exactly where Coin 1 lands */}
{coinHasLanded && !coinDropped && !showFlyingCoin && (
  <div>
  <motion.img
    src={coinImg}
    alt="coin-draggable"
    ref={dragRef}
    drag
    dragMomentum={false}
    onDragEnd={handleDragEnd}
    className="coin-draggable"

    style={{
      position: 'absolute',
      top: `${dropPosition.top}px`,
      left: `${dropPosition.left}px`,
      width: '15vw',
      height: 'auto',
      // transform: 'translate(-50%, -50%)',
      // transform: 'translate(-50%, 0)',
      cursor: 'grab',
      zIndex: 11,
    }}
  />

{(<div><h1 style={
  {
  position: 'absolute',
  fontSize: '4vw', 
  color: 'white', 
  top: '20vh',
  left: '50vw',
  rotate: '-20deg',
  transform: 'translate(-50%, -50%)',
  fontFamily: "Caveat", 
  fontWeight: 'bold', 
  textAlign: 'center', 
  whiteSpace: 'nowrap', 
  zIndex: 1000}}>Catch the coin!</h1></div>)}
  </div>
)}



  <div className="o-placeholder" ref={oRef}>

    {showFlyingCoin && (
      <motion.img
        src={coinImg}
        alt="coin-flying"
        initial={{ x: origin.x, y: origin.y }}
        animate={{ x: 0, y: 0 }}
        transition={{
          type: "spring",
          bounce: 0.6,
          duration: 1,
        }}
        className="coin-o"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "auto",
          transform: "translate(0, 0)",
          pointerEvents: "none",
          zIndex: 100,
        }}
      />
    )}

        {showSquatCat && (
          <div>
        <motion.img
            src={catSquatImg}
            alt="cat-squat"
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: '-20%', opacity: 1 }}
            transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: 0.3, // ⏱️ optional delay to match the bounce
            }}
            className="cat-squat"
            style={{
            position: 'absolute',
            top: "-45%",
            left: "-115%",
            transform: 'translateX(-50%)',
            width: '50vw',
            height: 'auto',
            zIndex: 101,
            pointerEvents: 'none',
            }}
        />
        {(<div><p style={
  {
  position: 'absolute',
  fontSize: '3vw', 
  color: 'white', 
  top: '10vh',
  right: '25vw',
  rotate: '-10deg',
  transform: 'translate(-50%, -50%)',
  fontFamily: "Caveat", 
  fontWeight: 'bold', 
  textAlign: 'center', 
  whiteSpace: 'nowrap',
  zIndex: 1000}}>NOOO! <br></br>It took the coin!</p></div>)}
        </div>
        )}
    {/* {console.log("coinDropped", coinDropped, "showFlyingCoin", showFlyingCoin, "scrolled", scrolled)} */}

    {coinDropped && !showFlyingCoin && !enterTemple && (
  <>
  
  <motion.div
  onClick={() => {
    coinDropped && coinDropToHand && setCoinFrozen(true);
    setLockedHandPos(mousePos); // ⛓️ freeze hand at last known position
  }}
  animate={{
    x: coinDropToHand ? 0 : (showGodLucky ? 0 : (canAscend ? '-30vw' : (scrolled ? '30vw' : 0))),
    y: coinDropToHand ? '20vh' : (showGodLucky ? '-10vh' : (canAscend ? '-5vh' : (scrolled ? '50vh' : 0))),
    scale: coinDropToHand ? 1.2 : (showGodLucky ? 1.2 : (canAscend ? 1.5 : (scrolled ? 2.5 : 1))),
    rotate: coinDropToHand ? 360 : (showGodLucky ? 360 : (scrolled ? 360 : 0)),
  }}
  transition={{ type: 'spring', stiffness: 50, damping: 20 }}
  style={{
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
  }}
>
  <motion.div
    animate={
      coinDropToHand
        ? { rotate: 360 }
        : { rotate: 0 }
    }
    transition={
      coinDropToHand
        ? { repeat: Infinity, duration: 2, ease: 'linear' }
        : { duration: 0.3 }
    }
    style={{
      width: '15vw',
      height: '15vw',
      transformOrigin: 'center center',
    }}
  >
    <img
      src={coinImg}
      alt="coin"
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  </motion.div>
</motion.div>


    {catExiting && showMainGod && !canAscend && (
      <>
      <img
        src={mainGod}
        alt="main-god"
        className="main-god"
        style={{
          position: 'absolute',
          left: 'calc(30vw + 7.5vw)', // match coin center + half its width
          top: 'calc(60vh + 25vw)',    // adjust vertically to sit on top
          width: '60vw',
          transform: 'translate(-50%, -100%)', // center and raise
          zIndex: 999,
          pointerEvents: 'none',
        }}
      />
      <div
  style={{
    position: 'absolute',
    top: 'calc(10vh)',
    left: '-35vw', // place to the LEFT of the coin+god
    width: '35vw',
    fontSize: '1.5vw',
    fontWeight: 'bold',
    fontFamily: 'Major Mono Display',
    color: 'white',
    zIndex: 12,
    visibility: 'hidden',
  }}
  className="use-client-text"
  ref={(ref) => {
    if (ref && !hasAnimatedMainText) {
      document.fonts.ready.then(() => {
        ref.style.visibility = 'visible';
        const { words } = splitText(ref.querySelector('h1'));
        animate(
          words,
          { opacity: [0, 1], y: [10, 0] },
          {
            type: 'spring',
            duration: 2,
            bounce: 0,
            delay: stagger(0.05),
          }
        ).then(() => {
          setTextAnimationFinished(true);
          setHasAnimatedMainText(true); // ✅ block it from running again
        });
      });
    }
  }}
  
>
  <h1 style={{ margin: 0 }}>Through ritual staking and communion with the chain, visions of the future may be granted. The Cat Gods see the cycles. They see you.</h1>
</div>
      </>
    )}
    {showGodCatBody && !showGodLucky && (
      <>
  <motion.img
    src={godCatBody}
    alt="god-cat-body"
    initial={{ opacity: 0, scale: 0.8, y: 100 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 1, type: 'spring' }}
    style={{
      position: 'absolute',
      top: '-13vh',
      left: '-41vw',
      // transform: 'translate(-50%, -50%)',
      width: '40vw',
      zIndex: 999,
      pointerEvents: 'none',
    }}
  />
    <div
  style={{
    position: 'absolute',
    top: 'calc(0vh)',
    right: '-35vw', // place to the LEFT of the coin+god
    width: '35vw',
    fontSize: '0.8vw',
    fontWeight: 'bold',
    fontFamily: 'Major Mono Display',
    color: 'white',
    zIndex: 12,
    visibility: 'hidden',
  }}
  className="use-client-text"
  ref={(ref) => {
    if (ref && !hasSecondAnimatedText) {
      document.fonts.ready.then(() => {
        ref.style.visibility = 'visible'
        const { words } = splitText(ref.querySelector('h1'))
        animate(
          words,
          { opacity: [0, 1], y: [10, 0] },
          {
            type: 'spring',
            duration: 2,
            bounce: 0,
            delay: stagger(0.05),
          }
        ).then(() => {
          setSecondTextAnimationFinished(true);
          setHasSecondAnimatedText(true);
        });
      })
    }
  }}
>
  <h1 style={{ margin: 0 }}>Not all prayers seek light. To those who operate in grey corners of the market, who seek refuge from the eyes of men and machines, the Veiled One offers sanctuary.
Through M$W, the faithful may pass unseen. Noise becomes signal. Trails grow cold. Waters run clear.
But beware: the Veiled Cat does not bless the careless. Only those who offer tribute in full, who respect the rites, who know when to speak and when to disappear—only they are spared the burn of unwanted light.</h1>
</div>
  </>
)}
{showGodLucky && !coinDropToHand && (
  <>
  <img src={godLucky} alt="god-lucky" className="god-lucky"
   style={{
    position: 'absolute',
    top: '-15vh',
    right: '-10vw',
    zIndex: 5,
  }}
   />
  <div
  style={{
    position: 'absolute',
    top: 'calc(0vh)',
    right: '25vw', // place to the LEFT of the coin+god
    width: '30vw',
    fontSize: '0.8vw',
    fontWeight: 'bold',
    fontFamily: 'Major Mono Display',
    color: 'white',
    zIndex: 12,
    visibility: 'hidden',
  }}
  className="use-client-text"
  ref={(ref) => {
    if (ref && !hasThirdAnimatedText && !coinDropToHand) {
      document.fonts.ready.then(() => {
        ref.style.visibility = 'visible'
        const { words } = splitText(ref.querySelector('h1'))
        animate(
          words,
          { opacity: [0, 1], y: [10, 0] },
          {
            type: 'spring',
            duration: 2,
            bounce: 0,
            delay: stagger(0.05),
          }
        ).then(() => {
          setThirdTextAnimationFinished(true);
          setHasThirdAnimatedText(true);
        });
      })
    }
  }}
>
  <h1 style={{ margin: 0 }}>Through ritual staking and communion with the chain, visions of the future may be granted. The Cat Gods see the cycles. They see you.</h1>
</div>
<div
  style={{
    position: 'absolute',
    top: 'calc(0vh)',
    left: '25vw', // place to the LEFT of the coin+god
    width: '30vw',
    fontSize: '0.8vw',
    fontWeight: 'bold',
    fontFamily: 'Major Mono Display',
    color: 'white',
    zIndex: 12,
    visibility: 'hidden',
  }}
  className="use-client-text"
  ref={(ref) => {
    if (ref && !hasThirdAnimatedText && !coinDropToHand) {
      document.fonts.ready.then(() => {
        ref.style.visibility = 'visible'
        const { words } = splitText(ref.querySelector('h1'))
        animate(
          words,
          { opacity: [0, 1], y: [10, 0] },
          {
            type: 'spring',
            duration: 2,
            bounce: 0,
            delay: stagger(0.05),
          }
        )
      })
    }
  }}
>
  <h1 style={{ margin: 0 }}>Through ritual staking and communion with the chain, visions of the future may be granted. The Cat Gods see the cycles. They see you.</h1>
</div>
  </>
)}
  </>
)}
{showHand && !enterTemple && (
  <div>
  <img
    src={handCursor}
    alt="hand"
    style={handStyle}
  />
  {!coinFrozen && (<div><h1 style={
  {
  position: 'absolute',
  fontSize: '4vw', 
  color: 'white', 
  top: '20vh',
  left: '40vw',
  rotate: '-20deg',
  transform: 'translate(-50%, -50%)',
  fontFamily: "Caveat", 
  fontWeight: 'bold', 
  textAlign: 'center', 
  whiteSpace: 'nowrap', 
  zIndex: 1000}}>Quick, catch the coin!</h1></div>)}
  </div>
)}
{coinFrozen && !enterTemple && (<div><h1 style={
  {
  position: 'absolute',
  fontSize: '4vw', 
  color: 'white', 
  top: '-15vh',
  left: '-18vw',
  rotate: '-30deg',
  transform: 'translate(-50%, -50%)',
  fontFamily: "Caveat", 
  fontWeight: 'bold', 
  textAlign: 'center', 
  whiteSpace: 'nowrap', 
  zIndex: 1000}}>You caught the coin!</h1></div>)}


  {coinFrozen && !enterTemple && (<div><h1 style={
  {
  position: 'absolute',
  fontSize: '4vw', 
  color: 'white', 
  top: '-15vh',
  right: '-18vw',
  rotate: '-30deg',
  transform: 'translate(-50%, -50%)',
  fontFamily: "Caveat", 
  fontWeight: 'bold', 
  textAlign: 'center', 
  whiteSpace: 'nowrap', 
  zIndex: 1000}}>Now you can enter the Temple</h1></div>)}


  </div>
  {enterTemple && (<Cat />)}
  {(showFlyingCoin || coinDropped) && !scrolled && <span className="letter">w</span>}
  {showWalkingCat && (
    <div>
  <motion.img
    key={catPose === catWizard ? 'run' : 'stand'} // 👈 Force React to rerender
    src={catPose}
    alt="cat-walking"
    className="cat-walking"
    style={{
      left: `${catX}px`,
      transition: 'transform 0.05s linear',
      transform: catExiting ? 'scaleX(-1)' : 'scaleX(1)',
    }}
    />
    {!pressRightArrow && (<div><h1 style={
  {
  position: 'absolute',
  fontSize: '2.5vw', 
  color: 'white', 
  top: '30vh',
  left: '20vw',
  rotate: '0deg',
  transform: 'translate(-50%, -50%)',
  fontFamily: "Caveat", 
  fontWeight: 'bold', 
  textAlign: 'center', 
  whiteSpace: 'nowrap', 
  zIndex: 1000}}>Try pressing the right arrow key!</h1></div>)}
    </div>
  )}

</div>


        </div>
    );
}
