// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBq9yamViOCWj8c_-1bY1HsTVJqcBi5Hi0",
  authDomain: "talentshow-voting-system.firebaseapp.com",
  projectId: "talentshow-voting-system",
  storageBucket: "talentshow-voting-system.firebasestorage.app",
  messagingSenderId: "377206928973",
  appId: "1:377206928973:web:3686ee9cabf09ef1ad8e04",
  measurementId: "G-KSC9WFHZTE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);