
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxZ774hseNn2643Qib7UP9vNwqB0BqyyQ",
  authDomain: "to-do-list-ff37e.firebaseapp.com",
  projectId: "to-do-list-ff37e",
  storageBucket: "to-do-list-ff37e.appspot.com",
  messagingSenderId: "817042857003",
  appId: "1:817042857003:web:fd13e5a8da4c64da3c3fdc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
