import React, { useState } from 'react';
import './LoginBox.css';
import { auth, googleProvider } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginBox = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const BACKEND_URL = 'http://127.0.0.1:5000';

  const getBalance = async (user) => {
    try {
      const idToken = await user.getIdToken(true);
      console.log('Getting balance for user:', user.email);
      console.log('Token length:', idToken.length);
      
      const response = await fetch(`${BACKEND_URL}/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }
      
      const data = await response.json();
      console.log("User balance:", data.balance);
      return data.balance;
    } catch (err) {
      console.error('Error getting balance:', err);
      return null;
    }
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      console.log('Email login successful for:', user.email);
      
      // Get and log balance
      const balance = await getBalance(user);
      console.log('Initial balance after login:', balance);
      
      alert('✅ Logged in!');
      navigate('/temple');
    } catch (err) {
      alert('❌ Login error: ' + err.message);
    }
  };

  const signup = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      console.log('Signup successful for:', user.email);
      
      // Get and log balance for new user
      const balance = await getBalance(user);
      console.log('Initial balance for new user:', balance);
      
      alert('✅ Signed up!');
      navigate('/temple');
    } catch (err) {
      alert('❌ Signup error: ' + err.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Google login successful for:', user.email);
  
      // Get and log balance
      const balance = await getBalance(user);
      console.log('Initial balance after Google login:', balance);
  
      navigate('/temple');
    } catch (err) {
      alert('❌ Google login failed: ' + err.message);
    }
  };

  return (
    <div className="login-box">
      <h2>Login</h2>
      <form onSubmit={login}>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign In</button>
        <button type="button" onClick={signup} style={{ marginTop: '10px' }}>
          Sign Up
        </button>
        <button type="button" onClick={loginWithGoogle} style={{ marginTop: '10px' }}>
          Sign in with Google
        </button>
      </form>
    </div>
  );
};

export default LoginBox;
