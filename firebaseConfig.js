// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5hJyDnC5kb-VxHT0ovWzOmyHD8mmLmZk",
  authDomain: "react-eksamen-8658c.firebaseapp.com",
  projectId: "react-eksamen-8658c",
  storageBucket: "react-eksamen-8658c.firebasestorage.app",
  messagingSenderId: "618558483919",
  appId: "1:618558483919:web:3e75eb9c9e06052c0bf6ba",
  measurementId: "G-2XB225LHYG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export { app, database };
