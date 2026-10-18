"use client"

import { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, ArrowLeft, Mail, Lock, UserPlus, BookOpen, Sparkles } from "lucide-react"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/ui/header'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      setSuccess(true)
      setTimeout(() => {
        router.replace('/signIn')
      }, 2000)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-4xl grid md:grid-cols-12 rounded-3xl overflow-hidden paper-card shadow-lg">
          {/* Left Panel */}
          <div className="md:col-span-5 bg-gradient-to-br from-stone-900 via-rose-950 to-rose-900 p-8 text-white flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15">
                <Image
                  src="/pmc_logo.png"
                  alt="PMC Library"
                  width={24}
                  height={24}
                  className="bg-white rounded p-0.5"
                />
                <span className="text-xs font-semibold tracking-wide">Join Our Community</span>
              </div>

              <div className="space-y-2 pt-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                  Become a Library Member
                </h1>
                <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed">
                  Register an online account to connect with our community catalogue, track your borrowed books, and renew loans with ease.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/15 text-xs text-rose-100/90">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-rose-300 shrink-0" />
                  <span>Free membership for community readers</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-4 w-4 text-rose-300 shrink-0" />
                  <span>Full online loan management & extensions</span>
                </div>
              </div>
            </div>

            <div className="pt-8 text-[11px] text-rose-200/60">
              Pioneer Methodist Community Library
            </div>
          </div>

          {/* Right Panel: Registration Form */}
          <div className="md:col-span-7 p-6 sm:p-10 bg-white flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Create Member Account
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                Enter your email address and choose a password to get started
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="pl-10 h-11 rounded-xl border-stone-300 focus-visible:ring-rose-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create a secure password"
                    className="pl-10 h-11 rounded-xl border-stone-300 focus-visible:ring-rose-800"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Registration Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <AlertTitle className="font-semibold">Account Created!</AlertTitle>
                  <AlertDescription>
                    Registration successful! Redirecting you to sign in...
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading || success}
                className="w-full h-11 bg-rose-900 hover:bg-rose-800 text-white rounded-xl font-medium shadow-sm mt-2 gap-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>{isLoading ? 'Creating Account...' : 'Register Member Account'}</span>
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
              <p className="text-stone-600">
                Already have an account?{' '}
                <Link href="/signIn" className="font-semibold text-rose-900 hover:underline">
                  Sign in here
                </Link>
              </p>

              <Link
                href="/"
                className="text-stone-500 hover:text-stone-900 inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back home</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}