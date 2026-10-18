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
import { useLanguage } from '@/i18n'

export default function SignIn() {
  const [origin, setOrigin] = useState('')
  const { login } = useAuth()
  const { t } = useLanguage()
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
        setError(t('登录时发生未知错误', 'An unexpected error occurred'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-4xl grid md:grid-cols-12 rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-sm">
          {/* Left Panel: Clean Light-Blue (#00bff2) Soft Tint Panel */}
          <div className="md:col-span-5 bg-sky-50/70 border-b md:border-b-0 md:border-r border-sky-100 p-8 text-slate-800 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2.5 bg-white px-3.5 py-1.5 rounded-full border border-sky-100 shadow-sm">
                <Image
                  src="/pmc_logo.png"
                  alt="PMC Library"
                  width={22}
                  height={22}
                  className="rounded-full"
                />
                <span className="text-xs font-semibold text-[#0097bf] tracking-wide">
                  {t('宣道堂 会友特区', 'PMC Library Portal')}
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 leading-snug">
                  {t('欢迎回来，亲爱的读者', 'Welcome Back, Reader')}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t(
                    '登录您的会友账号，即可查看已借阅书籍、掌握应还日期，并在线一键办理续借。',
                    'Log in to your member account to check your borrowed books, see due dates, and extend loans online.'
                  )}
                </p>
              </div>

              <div className="space-y-3.5 pt-4 border-t border-sky-200/60 text-xs text-slate-700 font-medium">
                <div className="flex items-start gap-2.5">
                  <CalendarClock className="h-4 w-4 text-[#00bff2] shrink-0 mt-0.5" />
                  <span>{t('清晰查看每本书的借出与应还日期', 'Know exact return due dates at a glance')}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <RefreshCw className="h-4 w-4 text-[#00bff2] shrink-0 mt-0.5" />
                  <span>{t('线上轻松一键延长借阅期限', 'Extend your book loans with 1 click')}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <BookOpen className="h-4 w-4 text-[#00bff2] shrink-0 mt-0.5" />
                  <span>{t('专属电子会友借书证', 'View your digital library membership pass')}</span>
                </div>
              </div>
            </div>

            <div className="pt-8 text-[11px] font-medium text-slate-400">
              {t('实兆远甘文阁卫理公会宣道堂 • 图书馆', 'Pioneer Methodist Community Library')}
            </div>
          </div>

          {/* Right Panel: Sign In Form */}
          <div className="md:col-span-7 p-6 sm:p-10 bg-white flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800">
                {t('会友登录', 'Member Login')}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {t('请输入您的电子邮箱与密码以管理借阅记录', 'Enter your email and password to manage your loans')}
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  {t('电子邮箱 (Email)', 'Email Address')}
                </Label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-[#00bff2] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-[#00bff2]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    {t('密码 (Password)', 'Password')}
                  </Label>
                  <Link
                    href="/forgotPassword"
                    className="text-xs font-medium text-[#0097bf] hover:underline"
                  >
                    {t('忘记密码？', 'Forgot password?')}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="h-4 w-4 text-[#00bff2] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('请输入您的密码', 'Enter your password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-[#00bff2]"
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
                className="w-full h-11 bg-[#00bff2] hover:bg-[#0097bf] text-white rounded-full font-semibold text-sm shadow-sm mt-2"
                disabled={isLoading}
              >
                {isLoading ? t('登录中...', 'Signing In...') : t('登录会友借阅特区', 'Sign In to My Account')}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
              <p className="text-slate-500">
                {t('还没有借阅账号？', 'New to the library?')}{' '}
                <Link href="/signUp" className="font-semibold text-[#0097bf] hover:underline">
                  {t('立即免费注册', 'Join Free Today')}
                </Link>
              </p>

              <Link
                href="/"
                className="text-slate-500 font-medium hover:text-[#0097bf] inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{t('返回主页', 'Back Home')}</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}