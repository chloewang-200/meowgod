import NavigationButton from '../components/NavigationButton';
import '../components/NFTPage.css';
import leftNFT from '../assets/left-nft-decor.png';
import rightNFT from '../assets/right-nft-decor.png';
import leftCat from '../assets/left-cat-circle.png';
import rightCat from '../assets/right-cat-circle.png';
import nftGod from '../assets/nft-god.png';
import { Link } from 'react-router-dom';

const NFTPage = () => (
    <div className="nft-page-container">
      <div className="nft-decor-container">
        <img src={leftNFT} alt="left-nft" className="nft-decor left-nft" />
        <img src={rightNFT} alt="right-nft" className="nft-decor right-nft" />
      </div>
      <div className="nft-cat-container">
        <Link to="/slot">
            <img src={leftCat} alt="left-cat" className="nft-cat left-cat" />
        </Link>
        <Link to="/slot">
            <img src={rightCat} alt="right-cat" className="nft-cat right-cat" />
        </Link>
      </div>
      <div className="nft-god-container">
        <img src={nftGod} alt="nft-god" className="nft-god" />
      </div>
        <NavigationButton to="/Temple">
        ← Back
        </NavigationButton>
    </div>
  );
  
  export default NFTPage;
  