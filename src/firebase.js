// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCC7dMpcn-uHqZQPYmrXGrpX46U4fb3w5Q",
  authDomain: "model-town-90318.firebaseapp.com",
  databaseURL: "https://model-town-90318-default-rtdb.firebaseio.com",
  projectId: "model-town-90318",
  storageBucket: "model-town-90318.firebasestorage.app",
  messagingSenderId: "369880217025",
  appId: "1:369880217025:web:2d6f31f332115bdd31eb40"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const PROJECT_CFG = {
  projectName: "Broadway Model Town",
  startDate: "2026-06-01",
  launchDate: "2026-09-25",
  PID: "main"
};
