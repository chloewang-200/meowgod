import React from 'react';
import './App.css';
import Cat from './Cat';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Temple from './Temple';
import ProtectedRoute from './components/ProtectedRoute';
import MoneyPage from './TemplePages/MoneyPage';
import MainGodPage from './TemplePages/MainGodPage';
import NFTPage from './TemplePages/NFTPage';
import EvilPage from './TemplePages/EvilPage';
import FountainPage from './TemplePages/FountainPage';
import CatchCoin from './CatchCoin';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<CatchCoin />} />
          {/* <Route path="/" element={<Cat />} /> */}
          <Route path="/temple" element={<ProtectedRoute><Temple /></ProtectedRoute>} />
          <Route path="/money" element={<ProtectedRoute><MoneyPage /></ProtectedRoute>} />
          <Route path="/money2" element={<ProtectedRoute><MoneyPage /></ProtectedRoute>} />
          <Route path="/main" element={<ProtectedRoute><MainGodPage /></ProtectedRoute>} />
          <Route path="/nft" element={<ProtectedRoute><NFTPage /></ProtectedRoute>} />
          <Route path="/evil" element={<ProtectedRoute><EvilPage /></ProtectedRoute>} />
          <Route path="/fountain" element={<ProtectedRoute><FountainPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
