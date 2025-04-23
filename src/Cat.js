import React, { useState } from 'react';
import './Cat.css';
import bgImage from './assets/landscape_long.png';
import catTiles from './assets/cat_tiles.png';
import templeImg from './assets/temple.png';

const Cat = () => {
  const [isSitting, setIsSitting] = useState(false);

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
        <div className="temple" onClick={() => window.location.href = '/temple'} >
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

    </div>
  );
};

export default Cat;
