"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Loader2, Mail, Lock } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")

  // Sign Up State
  const [signUpName, setSignUpName] = useState("")
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("")

  // Convert Firebase errors to user-friendly messages
  const getErrorMessage = (error: any): string => {
    const errorCode = error.code || error.message

    // Common Firebase Auth error codes
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-credential': 'Invalid email or password. Please try again.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password is too weak. Please use a stronger password.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled.',
      'auth/popup-blocked': 'Pop-up was blocked. Please allow pop-ups and try again.',
    }

    // Check if error code exists in our mapping
    for (const [code, message] of Object.entries(errorMessages)) {
      if (errorCode.includes(code)) {
        return message
      }
    }

    // Default error message
    return 'An error occurred. Please try again.'
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signIn(signInEmail, signInPassword)
      onClose()
      // Reset form
      setSignInEmail("")
      setSignInPassword("")
    } catch (error: any) {
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (signUpPassword !== signUpConfirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password length
    if (signUpPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      await signUp(signUpEmail, signUpPassword, signUpName)
      onClose()
      // Reset form
      setSignUpName("")
      setSignUpEmail("")
      setSignUpPassword("")
      setSignUpConfirmPassword("")
    } catch (error: any) {
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError("")
    setLoading(true)

    try {
      await signInWithGoogle()
      onClose()
    } catch (error: any) {
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white">
        <div className="flex flex-col items-center space-y-6 py-4">
          {/* Heading */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setIsSignUp(false)
                      setError("")
                    }}
                    className="text-white hover:underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account yet?{" "}
                  <button
                    onClick={() => {
                      setIsSignUp(true)
                      setError("")
                    }}
                    className="text-white hover:underline"
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Forms */}
          {isSignUp ? (
            <form onSubmit={handleSignUp} className="w-full space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  required
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12 focus:bg-slate-800 focus-visible:ring-slate-600 rounded-lg"
                  autoComplete="name"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12 focus:bg-slate-800 focus-visible:ring-slate-600 rounded-lg"
                  autoComplete="email"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12 focus:bg-slate-800 focus-visible:ring-slate-600 rounded-lg"
                  autoComplete="new-password"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  required
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12 focus:bg-slate-800 focus-visible:ring-slate-600 rounded-lg"
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-md p-3">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium rounded-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="w-full space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12 focus:bg-slate-800 focus-visible:ring-slate-600 rounded-lg"
                  autoComplete="email"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12 focus:bg-slate-800 focus-visible:ring-slate-600 rounded-lg"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-md p-3">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium rounded-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-900 px-2 text-slate-500">OR</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="w-full">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-slate-800 border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-white h-12 flex items-center justify-center gap-3 rounded-xl"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <FcGoogle className="h-5 w-5" />
                  <span>Sign in with Google</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
