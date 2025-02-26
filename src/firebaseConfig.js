import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Import Firebase Storage

const firebaseConfig = {
  apiKey: "AZaSyBVaquJlWGNxuQtZkvKGQkY7AbLZW0P74",
  authDomain: "beautypoint-d0a65.firebaseapp.com",
  projectId: "beautypoint-d0a65",
  storageBucket: "beautypoint-d0a65.appspot.com", // ✅ Ensure this is correct
  messagingSenderId: "1071482451592",
  appId: "1:1071482451592:web:3c92e1bac6077c4b85513d",
  measurementId: "G-ZHLDDT9ZR4"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Initialize Firebase Storage

export { db, storage }; // ✅ Export Firestore & Storage
