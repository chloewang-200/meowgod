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


  return (
    <div className="container">
     
      {true && (
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
