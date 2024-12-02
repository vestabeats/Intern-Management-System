// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY ,
  authDomain: "taskmanager-32393.firebaseapp.com",
  projectId: "taskmanager-32393",
  storageBucket: "taskmanager-32393.appspot.com",
  messagingSenderId: "771223532424",
  appId: "1:771223532424:web:a269f0745171dad541803d",
  measurementId: "G-7RJG0TRJ1J"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
