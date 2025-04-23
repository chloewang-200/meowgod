import React from 'react';
import './App.css';
import Cat from './Cat';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Temple from './Temple';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Cat />} />
        <Route path="/temple" element={
            <ProtectedRoute>
              <Temple />
            </ProtectedRoute>
          } />
      </Routes>
    </Router>
  );
}

export default App;
