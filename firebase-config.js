// Firebase configuration — replace with real values from Firebase console
// Project setup: https://console.firebase.google.com
// 1. Create project → "tora-app"
// 2. Add web app → copy config below
// 3. Enable Authentication → Email/Password + Google
// 4. Enable Firestore Database → start in test mode

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Save quiz results to Firestore
export async function saveQuizResults(userId, answers) {
  await setDoc(doc(db, 'users', userId), {
    answers,
    savedAt: new Date().toISOString(),
    paid: false
  }, { merge: true });
}

// Check if user has paid
export async function checkPaidStatus(userId) {
  const snap = await getDoc(doc(db, 'users', userId));
  return snap.exists() ? snap.data().paid === true : false;
}

// Sign in with Google
export async function signInGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// Get current user's saved answers
export async function getSavedAnswers(userId) {
  const snap = await getDoc(doc(db, 'users', userId));
  return snap.exists() ? snap.data().answers : null;
}

// Export onAuthStateChanged for use in other files
export { onAuthStateChanged };
