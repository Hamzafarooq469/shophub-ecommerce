
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7wCKFJFQpnnbv7UeBjIlBWTAocECoFFY",
  authDomain: "dara-84e5d.firebaseapp.com",
  projectId: "dara-84e5d",
  storageBucket: "dara-84e5d.appspot.com",
  messagingSenderId: "986621027272",
  appId: "1:986621027272:web:e69fd2d2cea2e1f12496fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export default app;