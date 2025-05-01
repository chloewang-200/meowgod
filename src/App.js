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
import CandlePage from './TemplePages/CandlePage';
import WheelPage from './TemplePages/WheelPage'; 
import SlotMachinePage from './TemplePages/SlotMachinePage';
import CatchCoin from './CatchCoin';
import Homepage from './HomePage';
import MarketingPage from './MarketingPage';
import { AuthProvider } from './contexts/AuthContext';
import BackendTest from './components/BackendTest';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* <Route path="/" element={<CatchCoin />} /> */}
          {/* <Route path="/" element={<Cat />} /> */}
          <Route path="/" element={<CatchCoin />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/marketing" element={<MarketingPage />} />
          <Route path="/temple" element={<ProtectedRoute><Temple /></ProtectedRoute>} />
          <Route path="/money" element={<ProtectedRoute><MoneyPage /></ProtectedRoute>} />
          <Route path="/money2" element={<ProtectedRoute><MoneyPage /></ProtectedRoute>} />
          <Route path="/main" element={<ProtectedRoute><MainGodPage /></ProtectedRoute>} />
          <Route path="/nft" element={<ProtectedRoute><NFTPage /></ProtectedRoute>} />
          <Route path="/evil" element={<ProtectedRoute><EvilPage /></ProtectedRoute>} />
          <Route path="/fountain" element={<ProtectedRoute><CandlePage /></ProtectedRoute>} />
          <Route path="/wheel" element={<ProtectedRoute><WheelPage /></ProtectedRoute>} />
          <Route path="/Slot" element={<ProtectedRoute><SlotMachinePage /></ProtectedRoute>} />
          <Route path="/test" element={<ProtectedRoute><BackendTest /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
