import React, { useState } from 'react';
import './templeEntry.css';
import { motion } from "framer-motion";
import bgImage from './assets/landscape_long.png';
import catTiles from './assets/cat_tiles.png';
import templeImg from './assets/temple.png';
import catWorm from './assets/cat_worm.png';
import catWormSingle from './assets/tiger_worm_single.png';
import LoginBox from './components/LoginBox';
import catWizard from './assets/cat_wizard.png';
import catWizardStand from './assets/cat_wizard_stand.png';
import { useEffect, useRef } from 'react';
const TempleEntry = () => {
  const [catX, setCatX] = useState(-300);
  const [isSitting, setIsSitting] = useState(false);
  const [showWorm, setShowWorm] = useState(false);
  const [tigerClicked, setTigerClicked] = useState(false);
  const [startExit, setStartExit] = useState(false);
  const [hideScene, setHideScene] = useState(false);
  const [catPose, setCatPose] = useState(catWizardStand);
  const [isWalking, setIsWalking] = useState(false);
  const catRef = useRef(null);
  const templeRef = useRef(null);
  const [isFrozen, setIsFrozen] = useState(false);



  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFrozen) return; // ❄️ block controls if frozen
      if (e.key === 'ArrowRight') {
        setIsWalking(true);
        setCatPose(catWizard);
      }
    };
  
    const handleKeyUp = (e) => {
      if (isFrozen) return; // ❄️ block controls if frozen
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
  }, [isFrozen]);
  
  
  useEffect(() => {
    const checkCatTempleOverlap = () => {
      if (!catRef.current || !templeRef.current) return;
  
      const catBox = catRef.current.getBoundingClientRect();
      const templeBox = templeRef.current.getBoundingClientRect();
  
      const catCenterX = catBox.left + catBox.width / 2;
  
      const overlap =
        catCenterX >= templeBox.left &&
        catCenterX <= templeBox.right;
  
      const catCoverPercent =
        (Math.min(catBox.right, templeBox.right) - Math.max(catBox.left, templeBox.left)) / catBox.width;
  
        if (overlap && catCoverPercent >= 0.5) {
          setIsWalking(false);
          setCatPose(catWizardStand);
          setShowWorm(true);
          setIsFrozen(true); // 🧊 freeze the cat!
        }
        
    };
  
    const interval = setInterval(() => {
      if (isWalking && !showWorm) checkCatTempleOverlap();
    }, 100); // check every 100ms while walking
  
    return () => clearInterval(interval);
  }, [isWalking, showWorm]);
  
  useEffect(() => {
    let intervalId;
  
    if (isWalking) {
      intervalId = setInterval(() => {
        setCatX((prevX) => {
          const maxRight = window.innerWidth 
          const newX = Math.min(prevX + 2, maxRight);

          // if (newX >= maxRight) {
          //   setIsWalking(false);
          //   setCatPose(catWizardStand);
          // } 
  
          return newX;
        });
      }, 10); // slower for easier debugging
    }
  
    return () => clearInterval(intervalId);
  }, [isWalking]);

  const handleAnimationEnd = () => {
    console.log("🌄 Background finished scrolling");
    setIsSitting(true);
  };
  const [done, setDone] = useState(false);
  
  return (
    <div className="container">
      {!hideScene && ( 
        <>
        <div
        className="background-scroll"
        onAnimationEnd={handleAnimationEnd}
        // style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="temple" ref={templeRef} onClick={() => {
          setShowWorm(true);
          // setTimeout(() => {
          //     window.location.href = '/temple';
          //   }, 1000); // matches animation duration
          }}>
          <img src={templeImg} alt="Temple" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
     

     {/* <div
        className={`cat ${!done ? 'walk-then-sit' : ''}`}
        style={{
          backgroundImage: `url(${catTiles})`,
          backgroundPosition: done ? '-400px -1000px' : undefined,
        }}
        onAnimationEnd={(e) => {
          if (e.animationName === 'sit-animation') {
            setDone(true);
          }
        }}
      ></div> */}
       <motion.img
        ref={catRef}
        key={catPose === catWizard ? 'run' : 'stand'} // 👈 Force React to rerender
        src={catPose}
        alt="cat-walking"
        className="cat-walking"
        style={{
          left: `${catX}px`,
          transition: 'transform 0.05s linear',
          transform:'scaleX(1)',
        }}
        />
        </>
              )}
      {showWorm && (
          <div>
           <div className={`worm ${startExit ? 'worm-exit' : ''}`}>
            <img src={catWorm} alt="Worm" />
          </div>
            <div
              className={`tiger-worm ${tigerClicked ? 'tiger-ascend' : ''} ${startExit ? 'tiger-exit' : ''}`}
              onClick={() => setTigerClicked(true)}
            >
              <img src={catWormSingle} alt="Tiger Worm" />
            </div>

            {tigerClicked && (
              <div className="login-container">
                <LoginBox onLoginSuccess={() => {
                  setTigerClicked(false);
                  setHideScene(true);    
                  setStartExit(true);
                  setTimeout(() => {
                  window.location.href = '/temple';
                  }, 500); // matches animation time
                }} />
              </div>
            )}
          </div>
        )}


    </div>
  );
};

export default TempleEntry;
