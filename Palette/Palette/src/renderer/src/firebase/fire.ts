// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdiswyf2-rP1rIWOGPF7NfLE-qor2hIs8",
  authDomain: "palette-f33e8.firebaseapp.com",
  databaseURL: "https://palette-f33e8-default-rtdb.firebaseio.com",
  projectId: "palette-f33e8",
  storageBucket: "palette-f33e8.firebasestorage.app",
  messagingSenderId: "183268573435",
  appId: "1:183268573435:web:059df7337472608140b05e",
  measurementId: "G-MMFPTGMGRN"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const realtimeDb = getDatabase(app);

