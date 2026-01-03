"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      if (user) {
        console.log("✅ User authenticated:", user.email)
      } else {
        console.log("🔓 User not authenticated")
      }
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      console.log("✅ Sign in successful")
    } catch (error: any) {
      console.error("❌ Sign in error:", error)
      throw new Error(error.message || "Failed to sign in")
    }
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with display name if provided
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName })
      }
      
      console.log("✅ Sign up successful")
    } catch (error: any) {
      console.error("❌ Sign up error:", error)
      throw new Error(error.message || "Failed to sign up")
    }
  }

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      console.log("✅ Google sign in successful")
    } catch (error: any) {
      console.error("❌ Google sign in error:", error)
      throw new Error(error.message || "Failed to sign in with Google")
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      console.log("✅ Sign out successful")
    } catch (error: any) {
      console.error("❌ Sign out error:", error)
      throw new Error(error.message || "Failed to sign out")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
