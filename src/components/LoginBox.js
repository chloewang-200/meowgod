import React, { useState } from 'react';
import './LoginBox.css';
import { auth, googleProvider } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from 'react-router-dom'; // 👈 Add this


const LoginBox = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 👈 Add this line


  const login = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('✅ Logged in!');
    } catch (err) {
      alert('❌ Login error: ' + err.message);
    }
  };

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('✅ Signed up!');
    } catch (err) {
      alert('❌ Signup error: ' + err.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onLoginSuccess(); 
      // navigate('/temple');
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
        {/* <button type="button" onClick={signup} style={{ marginTop: '10px' }}>
          Sign Up
        </button> */}
        <button type="button" onClick={loginWithGoogle} style={{ marginTop: '10px' }}>
          Sign in with Google
        </button>
      </form>
    </div>
  );
};

export default LoginBox;
