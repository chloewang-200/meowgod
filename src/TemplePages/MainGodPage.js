import React from 'react';
import NavigationButton from '../components/NavigationButton';
import '../components/MainGod.css';
import moneyGod from '../assets/money-god.png';
import rightmoon from '../assets/redMoon.png';
import leftmoon from '../assets/whiteMoon.png';
import lefthill from '../assets/lefthill.png';
import rightpine from '../assets/rightpine.png';
import { Link } from 'react-router-dom';

const MainGodPage = () => (
  <div className="main-god-page-container">
    <div className="navigation-container">
      <NavigationButton to="/Temple">
        ← Back
      </NavigationButton>
    </div>
    <div className="main-god-container">
      <img src={moneyGod} alt="main-god" className="main-god" />
      <div className="maingod-decor-container">
      <img src={lefthill} alt="left-hill" className="maingod-decor left-hill" />
        <img src={rightpine} alt="right-pine" className="maingod-decor right-pine" />
        </div>
      <div className="maingod-moon-container">
        <Link to="/wheel">
        <img src={leftmoon} alt="left-moon" className="maingod-moon left-moon" />
        </Link>
        <Link to="/wheel">
        <img src={rightmoon} alt="right-moon" className="maingod-moon right-moon" />
        </Link>
      </div>
    </div>
  </div>
);

export default MainGodPage;