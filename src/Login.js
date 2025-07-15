import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import './Styles/login.css';

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Save user data with lastLogin timestamp
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName || 'Anonymous',
          email: user.email,
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });
      } else {
        // Update lastLogin timestamp
        await setDoc(userDocRef, { lastLogin: new Date().toISOString() }, { merge: true });
      }

      navigate('/main');
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome to Foodversity</h2>
        {error && <p className="error-message">{error}</p>}
        <button className="google-signin-button" onClick={handleGoogleSignIn}>
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google Icon"
            className="google-icon"
          />
          Log In with Google
        </button>
        <p className="login-subtitle">
          Explore Our Amazing Recipes for Cooking Healthy & Delicious Food
        </p>
      </div>
    </div>
  );
};

export default Login;