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

// Read config from NEXT_PUBLIC_ environment variables (set these in Vercel)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyCw8zaRj2pTAYuSmlOS1DRbDD3QuF9RuE0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "today-12dec-2024.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? "https://today-12dec-2024-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "today-12dec-2024",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "today-12dec-2024.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "530328497707",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:530328497707:web:5d1d2216c7a8b916d5c46e",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-MQLTXWXN6T",
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
