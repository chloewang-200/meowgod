import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDytiScKHVYrhFNSHMobZ6FXsyFni1-0TQ",
  authDomain: "meow-god.firebaseapp.com",
  projectId: "meow-god",
  storageBucket: "meow-god.firebasestorage.app",
  messagingSenderId: "717901323721",
  appId: "1:717901323721:web:4a58f8ed560fb30a64dc18",
  measurementId: "G-NTFCEQKC21"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth
export const auth = getAuth(app);

// ✅ Set persistence AFTER auth is created
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Failed to set persistence:", err);
});

// ✅ Google Sign-in provider
export const googleProvider = new GoogleAuthProvider();
