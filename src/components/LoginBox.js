import React, { useState } from 'react';
import './LoginBox.css';
import { auth, googleProvider } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  fetchSignInMethodsForEmail
} from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginBox = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const BACKEND_URL = 'https://meow-god-backend-717901323721.us-central1.run.app';

  const getBalance = async (user) => {
    try {
      const idToken = await user.getIdToken(true);
      console.log('Getting balance for user:', user.email);
      
      const response = await fetch(`${BACKEND_URL}/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
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

  const addInitialBalance = async (user) => {
    try {
      const idToken = await user.getIdToken(true);
      const response = await fetch(`${BACKEND_URL}/balance/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({ amount: 1000 })
      });

      if (!response.ok) {
        throw new Error('Failed to add initial balance');
      }

      const data = await response.json();
      console.log("Initial balance added:", data.message);
      return true;
    } catch (err) {
      console.error('Error adding initial balance:', err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        // Sign up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Add initial balance of 1000
        const balanceAdded = await addInitialBalance(user);
        if (balanceAdded) {
          console.log('Added initial balance of 1000');
        }
        
        // Get and log final balance
        const balance = await getBalance(user);
        console.log('Final balance after signup:', balance);
        
        alert('✅ Signed up! You received 1000 coins as a welcome bonus!');
      } else {
        // Sign in
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const balance = await getBalance(userCredential.user);
          console.log('Initial balance after login:', balance);
        } catch (signInError) {
          // Check if the email exists with Google
          const methods = await fetchSignInMethodsForEmail(auth, email);
          if (methods.includes('google.com')) {
            setError('This email was registered with Google. Please use the "Sign in with Google" button.');
          } else if (methods.length === 0) {
            setError('No account found with this email. Please sign up first.');
          } else {
            setError('Incorrect password. Please try again.');
          }
          return;
        }
      }
      navigate('/temple');
    } catch (error) {
      console.error('Auth error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to authenticate. Please try again.');
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Google login successful for:', user.email);
  
      // Check if this is a new user
      const balance = await getBalance(user);
      if (balance === 0) {
        // Add initial balance for new Google users
        const balanceAdded = await addInitialBalance(user);
        if (balanceAdded) {
          console.log('Added initial balance of 1000 for new Google user');
          alert('Welcome! You received 1000 coins as a welcome bonus!');
        }
      }
  
      navigate('/temple');
    } catch (err) {
      console.error('Google login error:', err);
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError('This email is already registered with email/password. Please sign in with your password.');
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="login-box">
      <h2>{isSignUp ? 'Create Account' : 'Login'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="primary-button">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <button 
          type="button" 
          className="secondary-button"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
        <div className="divider">or</div>
        <button 
          type="button" 
          className="google-button"
          onClick={loginWithGoogle}
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
};

export default LoginBox;
