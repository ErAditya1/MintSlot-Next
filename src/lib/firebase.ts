import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyADwXpwaUiKhRm4IkHaUSzuiF2I4irIR4Y",
  authDomain: "mintslot.firebaseapp.com",
  projectId: "mintslot",
  storageBucket: "mintslot.firebasestorage.app",
  messagingSenderId: "572466421527",
  appId: "1:572466421527:web:aea24c6a566fcc43316152",
  measurementId: "G-22PNN8ZX48"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
