// Firebase client and auth helpers
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification as fbSendEmailVerification,
  signOut as fbSignOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCw8zaRj2pTAYuSmlOS1DRbDD3QuF9RuE0",
  authDomain: "today-12dec-2024.firebaseapp.com",
  databaseURL: "https://today-12dec-2024-default-rtdb.firebaseio.com",
  projectId: "today-12dec-2024",
  storageBucket: "today-12dec-2024.firebasestorage.app",
  messagingSenderId: "530328497707",
  appId: "1:530328497707:web:5d1d2216c7a8b916d5c46e",
  measurementId: "G-MQLTXWXN6T",
};

// Initialize app (guard for SSR / hot reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Analytics is only available in browser environment
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    // ignore if analytics can't initialize (e.g. in tests or blocked env)
    analytics = null;
  }
}

const auth = getAuth(app);

/**
 * Sign in with Google (popup). Resolves with the Firebase user credential.
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result;
}

/**
 * Create an account with email & password and send verification email.
 * Throws if creation fails.
 */
export async function signUpWithEmail(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Send verification email after sign up
  await fbSendEmailVerification(userCredential.user);
  return userCredential;
}

/**
 * Sign in with email & password.
 */
export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Send verification email to the currently signed-in user.
 */
export async function sendEmailVerificationToCurrentUser() {
  if (!auth.currentUser) throw new Error("No user is signed in");
  return fbSendEmailVerification(auth.currentUser);
}

/**
 * Sign out current user.
 */
export async function signOutUser() {
  return fbSignOut(auth);
}

export { app, analytics, auth };

/* Example usage:
import { signInWithGoogle, signUpWithEmail, sendEmailVerificationToCurrentUser } from 'src/lib/firebase'

// Google popup sign-in
await signInWithGoogle();

// Email signup and verification
await signUpWithEmail('you@example.com', 'supersecret');

// Later: explicitly send verification to current user
await sendEmailVerificationToCurrentUser();
*/
