import React, { useState } from 'react';
import './Cat.css';
import bgImage from './assets/landscape_long.png';
import catTiles from './assets/cat_tiles.png';
import templeImg from './assets/temple.png';
import catWorm from './assets/cat_worm.png';
import catWormSingle from './assets/tiger_worm_single.png';
import LoginBox from './components/LoginBox';

const Cat = () => {
  const [isSitting, setIsSitting] = useState(false);
  const [showWorm, setShowWorm] = useState(false);
  const [tigerClicked, setTigerClicked] = useState(false);


  const handleAnimationEnd = () => {
    console.log("🌄 Background finished scrolling");
    setIsSitting(true);
  };
  const [done, setDone] = useState(false);
  
  return (
    <div className="container">
      <div
        className="background-scroll"
        onAnimationEnd={handleAnimationEnd}
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="temple" onClick={() => {
          setShowWorm(true);
          // setTimeout(() => {
          //     window.location.href = '/temple';
          //   }, 1000); // matches animation duration
          }}>
          <img src={templeImg} alt="Temple" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
      

     <div
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
      ></div>
      {showWorm && (
          <div>
            <div className="worm">
              <img src={catWorm} alt="Worm" />
            </div>

            <div
              className={`tiger-worm ${tigerClicked ? 'tiger-ascend' : 'tiger-hover'}`}
              onClick={() => setTigerClicked(true)}
            >
              <img src={catWormSingle} alt="Tiger Worm" />
            </div>

            {tigerClicked && (
              <div className="login-container">
                <LoginBox />
              </div>
            )}
          </div>
        )}


    </div>
  );
};

export default Cat;
