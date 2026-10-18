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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-4xl grid md:grid-cols-12 rounded-3xl overflow-hidden bg-white border-2 border-blue-100 shadow-2xl shadow-blue-900/10">
          {/* Left Panel: Vibrant Blue & Red Brand & Benefits */}
          <div className="md:col-span-5 bg-gradient-to-br from-blue-900 via-blue-800 to-red-700 p-8 text-white flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/20">
                <Image
                  src="/pmc_logo.png"
                  alt="PMC Library"
                  width={24}
                  height={24}
                  className="bg-white rounded-full p-0.5"
                />
                <span className="text-xs font-extrabold tracking-wide">PMC Library Portal</span>
              </div>

              <div className="space-y-2 pt-2">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                  Welcome Back, Reader!
                </h1>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
                  Log in to your member account to check your borrowed books, see due dates, and extend loans online!
                </p>
              </div>

              <div className="space-y-3.5 pt-4 border-t border-white/20 text-xs text-white font-semibold">
                <div className="flex items-start gap-2.5">
                  <CalendarClock className="h-4 w-4 text-red-300 shrink-0 mt-0.5" />
                  <span>Know exact return due dates at a glance</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <RefreshCw className="h-4 w-4 text-red-300 shrink-0 mt-0.5" />
                  <span>Extend your book loans with 1 click</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <BookOpen className="h-4 w-4 text-red-300 shrink-0 mt-0.5" />
                  <span>View your digital library membership pass</span>
                </div>
              </div>
            </div>

            <div className="pt-8 text-[11px] font-bold text-blue-200/80">
              Pioneer Methodist Community Library
            </div>
          </div>

          {/* Right Panel: Sign In Form */}
          <div className="md:col-span-7 p-6 sm:p-10 bg-white flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-blue-950">
                Member Login
              </h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Enter your email and password to manage your loans
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-11 rounded-xl border-blue-200 focus-visible:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
                    Password
                  </Label>
                  <Link
                    href="/forgotPassword"
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="h-4 w-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-11 rounded-xl border-blue-200 focus-visible:ring-blue-600"
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
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-bold text-base shadow-lg shadow-blue-600/25 mt-2"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In to My Account'}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-blue-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
              <p className="text-slate-600 font-medium">
                New to the library?{' '}
                <Link href="/signUp" className="font-extrabold text-red-600 hover:underline">
                  Join Free Today
                </Link>
              </p>

              <Link
                href="/"
                className="text-blue-600 font-bold hover:text-blue-800 inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back Home</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}