"use client"

import { useState } from 'react'
import { forgotPassword } from '@/lib/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from 'next/link'
import Header from '@/components/ui/header'
import { ArrowLeft, KeyRound, Mail, CheckCircle2 } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setIsLoading(true)

    try {
      await forgotPassword(email)
      setMessage('Password reset email sent! Please check your inbox for instructions.')
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

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md paper-card rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="h-12 w-12 rounded-2xl bg-rose-900/10 text-rose-900 flex items-center justify-center mb-5">
            <KeyRound className="h-6 w-6" />
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Reset Your Password
          </h1>
          <p className="text-sm text-stone-500 mt-1.5 mb-6 leading-relaxed">
            Enter the email address associated with your library member account and we'll send you a password reset link.
          </p>

          <form onSubmit={handleForgotPassword} className="space-y-4">
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

            {error && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-rose-900 hover:bg-rose-800 text-white rounded-xl font-medium shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Sending Reset Link...' : 'Send Password Reset Link'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between text-xs sm:text-sm">
            <Link
              href="/signIn"
              className="font-semibold text-rose-900 hover:underline inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Link>
            <Link href="/" className="text-stone-500 hover:text-stone-900">
              Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
