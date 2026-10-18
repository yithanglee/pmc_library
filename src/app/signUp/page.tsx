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
import { useLanguage } from '@/i18n'

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
  const { t } = useLanguage()
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
        setError(t('发生未知错误', 'An unknown error occurred'))
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
          {/* Left Panel: Minimalist Light-Blue Tint */}
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
                  {t('加入宣道堂书香大家庭', 'Join Our Community')}
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 leading-snug">
                  {t('注册成为图书馆会友', 'Become a Library Member')}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t(
                    '免费注册账号，即可借阅教会精选书籍、随时在线查询应还日期与一键续借。',
                    'Sign up for free to borrow books, track return due dates online, and extend your loans anytime.'
                  )}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-sky-200/60 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-[#00bff2] shrink-0" />
                  <span>{t('免费开放予教会会友与社区读者', 'Free membership for everyone')}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-4 w-4 text-[#00bff2] shrink-0" />
                  <span>{t('轻松在线查询应还日期与延长借期', 'Easy online loan extensions & due dates')}</span>
                </div>
              </div>
            </div>

            <div className="pt-8 text-[11px] font-medium text-slate-400">
              {t('实兆远甘文阁卫理公会宣道堂 • 图书馆', 'Pioneer Methodist Community Library')}
            </div>
          </div>

          {/* Right Panel: Registration Form */}
          <div className="md:col-span-7 p-6 sm:p-10 bg-white flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800">
                {t('注册会友借阅账号', 'Create Member Account')}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {t('请输入您的电子邮箱并设定登录密码', 'Enter your email address and choose a password to get started')}
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  {t('电子邮箱 (Email)', 'Email Address')}
                </Label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-[#00bff2] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-[#00bff2]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  {t('设定密码 (Password)', 'Password')}
                </Label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-[#00bff2] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={t('请输入安全密码', 'Create a secure password')}
                    className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-[#00bff2]"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t('注册错误', 'Registration Error')}</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <AlertTitle className="font-semibold">{t('账号注册成功！', 'Account Created!')}</AlertTitle>
                  <AlertDescription>
                    {t('正在为您跳转至登录页面...', 'Registration successful! Redirecting you to sign in...')}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading || success}
                className="w-full h-11 bg-[#00bff2] hover:bg-[#0097bf] text-white rounded-full font-semibold text-sm shadow-sm mt-2 gap-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>{isLoading ? t('正在创建账号...', 'Creating Account...') : t('免费注册借阅账号', 'Join Library Free')}</span>
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
              <p className="text-slate-500">
                {t('已经有账号了？', 'Already have an account?')}{' '}
                <Link href="/signIn" className="font-semibold text-[#0097bf] hover:underline">
                  {t('在此登录', 'Sign in here')}
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