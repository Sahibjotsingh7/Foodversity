import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJNdQrMV-9Xu4DjJVO7q82OzcTw-BC1CQ",
  authDomain: "cluster1-df234.firebaseapp.com",
  projectId: "cluster1-df234",
  storageBucket: "cluster1-df234.firebasestorage.app",
  messagingSenderId: "998603248081",
  appId: "1:998603248081:web:305d13c249e15a16b350f0",
  measurementId: "G-4VWBNHVJ96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };