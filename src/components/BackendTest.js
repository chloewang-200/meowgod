import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './BackendTest.css';

const BackendTest = () => {
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const BACKEND_URL = 'https://meow-god-backend-717901323721.us-central1.run.app';
  // const BACKEND_URL = 'http://127.0.0.1:5000'
  const getBalance = async () => {
    try {
      // Force refresh the token
      const idToken = await currentUser.getIdToken(true);
      console.log('Current user:', currentUser);
      console.log('Token length:', idToken.length);
      console.log('Token first 20 chars:', idToken.substring(0, 20));
      
      const response = await fetch(`${BACKEND_URL}/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include'
      });
      
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch balance: ${response.status} ${responseText}`);
      }
      
      const data = JSON.parse(responseText);
      setBalance(data.balance);
      setError('');
    } catch (err) {
      console.error('Error in getBalance:', err);
      setError(err.message);
    }
  };

  const addBalance = async () => {
    try {
      const idToken = await currentUser.getIdToken();
      console.log('Making request to:', `${BACKEND_URL}/balance/add`);
      
      const response = await fetch(`${BACKEND_URL}/balance/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ amount: parseFloat(amount) })
      });
      
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to add balance: ${response.status} ${responseText}`);
      }
      
      const data = JSON.parse(responseText);
      setMessage(data.message);
      setError('');
      getBalance();
    } catch (err) {
      console.error('Error in addBalance:', err);
      setError(err.message);
    }
  };

  const deductBalance = async () => {
    try {
      const idToken = await currentUser.getIdToken();
      console.log('Making request to:', `${BACKEND_URL}/balance/deduct`);
      
      const response = await fetch(`${BACKEND_URL}/balance/deduct`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ amount: parseFloat(amount) })
      });
      
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to deduct balance: ${response.status} ${responseText}`);
      }
      
      const data = JSON.parse(responseText);
      setMessage(data.message);
      setError('');
      getBalance();
    } catch (err) {
      console.error('Error in deductBalance:', err);
      setError(err.message);
    }
  };

  return (
    <div className="backend-test">
      <h2>Backend API Test</h2>
      
      <div className="user-info">
        <p>Current User: {currentUser?.email}</p>
        <p>UID: {currentUser?.uid}</p>
      </div>

      <div className="balance-section">
        <h3>Balance Operations</h3>
        <button onClick={getBalance}>Get Balance</button>
        {balance !== null && <p>Current Balance: {balance}</p>}
      </div>

      <div className="amount-section">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <div className="button-group">
          <button onClick={addBalance}>Add Balance</button>
          <button onClick={deductBalance}>Deduct Balance</button>
        </div>
      </div>

      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default BackendTest; 