// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "website-bulder-ai.firebaseapp.com",
  projectId: "website-bulder-ai",
  storageBucket: "website-bulder-ai.firebasestorage.app",
  messagingSenderId: "1022538780408",
  appId: "1:1022538780408:web:d5ae1fd1438ce94cab350d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)
const provider=new GoogleAuthProvider()

export {auth,provider}
