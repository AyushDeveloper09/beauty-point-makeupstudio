// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY, // Fixed environment variable access
  authDomain: "beautypoint-d0a65.firebaseapp.com",
  projectId: "beautypoint-d0a65",
  storageBucket: "beautypoint-d0a65.appspot.com",
  messagingSenderId: "1071482451592",
  appId: "1:1071482451592:web:3c92e1bac6077c4b85513d",
  measurementId: "G-ZHLDDT9ZR4"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };