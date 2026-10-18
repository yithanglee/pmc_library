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
import { useLanguage } from '@/i18n'

export default function ForgotPassword() {
  const { t } = useLanguage()
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
      setMessage(
        t(
          '密码重置邮件已发送！请前往您的电子邮箱查看重置步骤。',
          'Password reset email sent! Please check your inbox for instructions.'
        )
      )
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(t('发生未知错误', 'An unexpected error occurred'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white border-2 border-blue-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-blue-900/10">
          <div className="h-13 w-13 rounded-2xl bg-gradient-to-br from-blue-600 to-red-500 text-white flex items-center justify-center mb-5 p-3 shadow-md">
            <KeyRound className="h-6 w-6" />
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-blue-950">
            {t('重置您的密码', 'Reset Your Password')}
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 mb-6 leading-relaxed font-medium">
            {t(
              '请输入您注册图书馆会友账号的电子邮箱，我们将发送密码重置链接给您！',
              "Enter the email address for your library member account and we'll send you a password reset link!"
            )}
          </p>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
                {t('电子邮箱 (Email)', 'Email Address')}
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

            {error && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="font-medium">{message}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-bold shadow-md"
              disabled={isLoading}
            >
              {isLoading ? t('正在发送重置链接...', 'Sending Reset Link...') : t('发送密码重置链接', 'Send Password Reset Link')}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-blue-50 flex items-center justify-between text-xs sm:text-sm">
            <Link
              href="/signIn"
              className="font-extrabold text-blue-600 hover:underline inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t('返回会友登录', 'Back to Sign In')}</span>
            </Link>
            <Link href="/" className="font-bold text-red-500 hover:text-red-600">
              {t('返回主页', 'Home')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
