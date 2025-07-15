import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check user session in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const { lastLogin } = userDoc.data();
          const lastLoginTime = new Date(lastLogin).getTime();
          const currentTime = new Date().getTime();
          const twelveHoursInMs = 12 * 60 * 60 * 1000;

          if (currentTime - lastLoginTime > twelveHoursInMs) {
            await auth.signOut();
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
          }
        } else {
          // User document doesn't exist, sign out
          await auth.signOut();
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;