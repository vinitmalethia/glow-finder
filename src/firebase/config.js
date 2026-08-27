import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAR1Kas6NOiNkxq-uUY4W_Drr-M29woeI",
  authDomain: "glow-finder-9fa86.firebaseapp.com",
  projectId: "glow-finder-9fa86",
  storageBucket: "glow-finder-9fa86.firebasestorage.app",
  messagingSenderId: "801064485111",
  appId: "1:801064485111:web:1f801294a86c58b17693f2",
  measurementId: "G-0GVHXPNM57"
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
