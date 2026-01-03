/**
 * Firebase Configuration and Initialization
 * Used for analytics, authentication, and storage
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAnalytics, type Analytics } from "firebase/analytics"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBh0emy0kT0uzRYFCFX67A7iqWFjyq2EDw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "artifex-22767.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "artifex-22767",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "artifex-22767.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "173205119970",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:173205119970:web:74383a85188e6a43ea4fbb",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-B4FDS2ZHVV",
}

// Initialize Firebase (only once)
let app: FirebaseApp
let analytics: Analytics | null = null
let auth: Auth
let db: Firestore
let storage: FirebaseStorage

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
  console.log("🔥 Firebase initialized successfully")
} else {
  app = getApps()[0]
  console.log("🔥 Firebase already initialized")
}

// Initialize Analytics (only in browser)
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app)
    console.log("📊 Firebase Analytics initialized")
  } catch (error) {
    console.warn("⚠️ Firebase Analytics not available:", error)
  }
}

// Initialize Auth
auth = getAuth(app)

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Initialize Firestore
db = getFirestore(app)

// Initialize Storage
storage = getStorage(app)

export { app, analytics, auth, db, storage }

// Helper functions
export const isFirebaseInitialized = (): boolean => {
  return getApps().length > 0
}

export const getFirebaseConfig = () => {
  return firebaseConfig
}
