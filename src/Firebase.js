import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBO8wRMLUul8I3NgNTtaEPQZ9QgWVwywEs",
  authDomain: "charity-application-a333d.firebaseapp.com",
  projectId: "charity-application-a333d",
  storageBucket: "charity-application-a333d.appspot.com",
  messagingSenderId: "980092772450",
  appId: "1:980092772450:web:d37181381d5146ac6ef13b",
};


// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export {db}