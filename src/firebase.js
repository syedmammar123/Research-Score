// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYTJ6-tTnNporOgf6wrHAb5N-_gT-s9dM",
  authDomain: "research-score.firebaseapp.com",
  projectId: "research-score",
  storageBucket: "research-score.appspot.com",
  messagingSenderId: "160892654338",
  appId: "1:160892654338:web:692b5bac0e42a1a3e4a81b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);

export default app;
