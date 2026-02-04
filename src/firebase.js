// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuBDdThkoSxQxO4Kssxppk1P6votFjsCc",
  authDomain: "expensetracker-07.firebaseapp.com",
  projectId: "expensetracker-07",
  storageBucket: "expensetracker-07.firebasestorage.app",
  messagingSenderId: "1085738623388",
  appId: "1:1085738623388:web:5e25180a9e2e47a8e12859",
  measurementId: "G-37BBNSJBBK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
