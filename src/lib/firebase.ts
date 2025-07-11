// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJStYL8kkv7xfQ3LvMsxUwdLWyOIFW1Vk",
  authDomain: "zerocycle-b1a93.firebaseapp.com",
  projectId: "zerocycle-b1a93",
  storageBucket: "zerocycle-b1a93.appspot.com",
  messagingSenderId: "955055643388",
  appId: "1:955055643388:web:321c3f59759e89df1e1579",
  measurementId: "G-MY099RZZ25",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, firestore, auth };
