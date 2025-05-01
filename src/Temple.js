import React from 'react';
import './Temple.css';
import { Link } from 'react-router-dom';
import background from './assets/temple/temple_background.png';
import fountain from './assets/temple/temple_fountain.png';
import moneyGod from './assets/temple/money_god.png';
import mainGod from './assets/temple/main_god.png';
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
          <Link to="/money">
            <img src={moneyGod} alt="Money God" />
          </Link>
        </div>
        <div className="side-god">
          <Link to="/money2">
            <img src={moneyGod} alt="Money God 2" />
          </Link>
        </div>
        <div className="god">
          <Link to="/main">
            <img src={mainGod} alt="Main God" />
          </Link>
        </div>
        <div className="side-god">
          <Link to="/nft">
            <img src={nftGod} alt="NFT God" />
          </Link>
        </div>
        <div className="side-god">
          <Link to="/evil">
            <img src={evilGod} alt="Evil God" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Temple;
