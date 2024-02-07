// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBDd_Ut1jVWXPVYmW2DXKJYcB_V-aEwbVk",
    authDomain: "my-stickies-d6e8b.firebaseapp.com",
    projectId: "my-stickies-d6e8b",
    storageBucket: "my-stickies-d6e8b.appspot.com",
    messagingSenderId: "211010285849",
    appId: "1:211010285849:web:acb483e7c2b28db09d9588"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Add this line to get the authentication object
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider }; // Export both db and auth

export default app;