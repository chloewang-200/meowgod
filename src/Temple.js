import React from 'react';
import './Temple.css';
import { Link } from 'react-router-dom';
import background from './assets/grass_background.png';
import fountain from './assets/fountain_2.png';
import moneyGod from './assets/temple/money_god.png';
import mainGod from './assets/main_god.png';
import nftGod from './assets/temple/nft_god.png';
import evilGod from './assets/temple/evil_god.png';

const Temple = () => {
  return (
    <div className="temple-container">
      <img src={background} alt="Temple Background" className="temple-bg" />

      <Link to="/candle">
        <img src={fountain} alt="Fountain" className="fountain" />
      </Link>

      <div className="gods">
       
        <div className="side-god">
          <Link to="/main">
            <img src={moneyGod} alt="Money God 2" />
          </Link>
        </div>

        <div className="god">
          <Link to="/altar">
            <img src={mainGod} alt="Main God" className="temple-main-god"/>
          </Link>
        </div>
        
        <div className="side-god">
          <Link to="/nft">
            <img src={nftGod} alt="NFT God" />
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default Temple;
