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
        <div className="w-full max-w-4xl grid md:grid-cols-12 rounded-3xl overflow-hidden bg-white border-2 border-blue-100 shadow-2xl shadow-blue-900/10">
          {/* Left Panel */}
          <div className="md:col-span-5 bg-gradient-to-br from-red-600 via-rose-600 to-blue-900 p-8 text-white flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/20">
                <Image
                  src="/pmc_logo.png"
                  alt="PMC Library"
                  width={24}
                  height={24}
                  className="bg-white rounded-full p-0.5"
                />
                <span className="text-xs font-extrabold tracking-wide">
                  {t('加入宣道堂书香大家庭', 'Join Our Community')}
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                  {t('注册成为图书馆会友！', 'Become a Library Member!')}
                </h1>
                <p className="text-xs sm:text-sm text-red-100 leading-relaxed font-medium">
                  {t(
                    '免费注册账号，即可借阅教会精选书籍、随时在线查询应还日期与一键续借！',
                    'Sign up for free to borrow books, track return due dates online, and extend your loans anytime!'
                  )}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/20 text-xs text-white font-semibold">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-yellow-300 shrink-0" />
                  <span>{t('免费开放予教会会友与社区读者', 'Free membership for everyone')}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-4 w-4 text-blue-200 shrink-0" />
                  <span>{t('轻松在线查询应还日期与延长借期', 'Easy online loan extensions & due dates')}</span>
                </div>
              </div>
            </div>

            <div className="pt-8 text-[11px] font-bold text-white/75">
              {t('实兆远甘文阁卫理公会宣道堂 • 图书馆', 'Pioneer Methodist Community Library')}
            </div>
          </div>

          {/* Right Panel: Registration Form */}
          <div className="md:col-span-7 p-6 sm:p-10 bg-white flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-blue-950">
                {t('注册会友借阅账号', 'Create Member Account')}
              </h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                {t('请输入您的电子邮箱并设定登录密码', 'Enter your email address and choose a password to get started')}
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
                  {t('电子邮箱 (Email)', 'Email Address')}
                </Label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="pl-10 h-11 rounded-xl border-blue-200 focus-visible:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
                  {t('设定密码 (Password)', 'Password')}
                </Label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={t('请输入安全密码', 'Create a secure password')}
                    className="pl-10 h-11 rounded-xl border-blue-200 focus-visible:ring-blue-600"
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
                  <AlertTitle className="font-bold">{t('账号注册成功！', 'Account Created!')}</AlertTitle>
                  <AlertDescription>
                    {t('正在为您跳转至登录页面...', 'Registration successful! Redirecting you to sign in...')}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading || success}
                className="w-full h-12 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-full font-bold text-base shadow-lg shadow-red-500/25 mt-2 gap-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>{isLoading ? t('正在创建账号...', 'Creating Account...') : t('免费注册借阅账号', 'Join Library Free')}</span>
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-blue-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
              <p className="text-slate-600 font-medium">
                {t('已经有账号了？', 'Already have an account?')}{' '}
                <Link href="/signIn" className="font-extrabold text-blue-600 hover:underline">
                  {t('在此登录', 'Sign in here')}
                </Link>
              </p>

              <Link
                href="/"
                className="text-blue-600 font-bold hover:text-blue-800 inline-flex items-center gap-1"
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