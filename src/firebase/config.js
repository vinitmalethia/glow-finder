import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration read securely from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAAR1Kas6NOiNkxq-uUY4W_Drr-M29woeI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "glow-finder-9fa86.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "glow-finder-9fa86",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "glow-finder-9fa86.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "801064485111",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:801064485111:web:1f801294a86c58b17693f2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0GVHXPNM57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Analytics conditionally
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export { analytics };
export default app;
