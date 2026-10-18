"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/ui/header'
import { ArrowLeft, BookOpen, CalendarClock, Lock, Mail, RefreshCw } from 'lucide-react'

export default function SignIn() {
  const [origin, setOrigin] = useState('')
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login(email, password, origin)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred')
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
          {/* Left Panel: Editorial Brand & Member Benefits */}
          <div className="md:col-span-5 bg-gradient-to-br from-rose-950 via-rose-900 to-stone-900 p-8 text-white flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15">
                <Image
                  src="/pmc_logo.png"
                  alt="PMC Library"
                  width={24}
                  height={24}
                  className="bg-white rounded p-0.5"
                />
                <span className="text-xs font-semibold tracking-wide">PMC Library Portal</span>
              </div>

              <div className="space-y-2 pt-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                  Welcome back to your library shelf.
                </h1>
                <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed">
                  Sign in with your member account to manage your active loans and stay on top of return dates.
                </p>
              </div>

              <div className="space-y-3.5 pt-4 border-t border-white/15 text-xs text-rose-100/90">
                <div className="flex items-start gap-2.5">
                  <CalendarClock className="h-4 w-4 text-rose-300 shrink-0 mt-0.5" />
                  <span>Check exact return due dates for all borrowed books</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <RefreshCw className="h-4 w-4 text-rose-300 shrink-0 mt-0.5" />
                  <span>Extend eligible loans online with a single click</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <BookOpen className="h-4 w-4 text-rose-300 shrink-0 mt-0.5" />
                  <span>Access your personal digital membership card</span>
                </div>
              </div>
            </div>

            <div className="pt-8 text-[11px] text-rose-200/60">
              Pioneer Methodist Community Library
            </div>
          </div>

          {/* Right Panel: Sign In Form */}
          <div className="md:col-span-7 p-6 sm:p-10 bg-white flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Member Sign In
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                Enter your email and password to access your loans
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-11 rounded-xl border-stone-300 focus-visible:ring-rose-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Password
                  </Label>
                  <Link
                    href="/forgotPassword"
                    className="text-xs font-medium text-rose-800 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="h-4 w-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-11 rounded-xl border-stone-300 focus-visible:ring-rose-800"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-rose-900 hover:bg-rose-800 text-white rounded-xl font-medium shadow-sm mt-2"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In to My Account'}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
              <p className="text-stone-600">
                New to the library?{' '}
                <Link href="/signUp" className="font-semibold text-rose-900 hover:underline">
                  Create a member account
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