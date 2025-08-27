// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8d1EOZt_YR3StenIJEKpyu5bjnGtGn_k",
  authDomain: "movie-list-search.firebaseapp.com",
  projectId: "movie-list-search",
  storageBucket: "movie-list-search.firebasestorage.app",
  messagingSenderId: "548649867938",
  appId: "1:548649867938:web:887d103a40c33802e755fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;