'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  BookOpen,
  CalendarClock,
  RefreshCw,
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
  Heart,
  Layers,
  Bookmark,
  ExternalLink
} from 'lucide-react'
import Header from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { useLanguage } from '@/i18n'
import { populateData } from '@/components/data/populateData'

export default function CommunityLibrary() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    populateData({ model: 'BookCategory' })
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          setCategories(
            res.data
              .sort((a: any, b: any) => (a.code || '').localeCompare(b.code || ''))
              .slice(0, 8)
          )
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Full-Width Parallax Hero Section featuring /1009.jpg */}
        <section
          className="relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed border-b border-blue-200 py-20 lg:py-32"
          style={{
            backgroundImage: `url('/1009.jpg')`,
          }}
        >
          {/* Multi-layered Blue & Red Gradient Overlay for readability & lively brand vibe */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/75 to-red-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-blue-950/30" />

          {/* Decorative glowing orbs over parallax */}
          <div className="pointer-events-none absolute -top-24 right-10 h-96 w-96 rounded-full bg-red-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-96 w-96 rounded-full bg-blue-400/25 blur-3xl" />

          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
              {/* Left Column: Lively Hero Copy & CTAs matching pioneercommunity.org.my */}
              <div className="lg:col-span-7 space-y-6 text-left text-white">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md shadow-sm border border-white/25 text-white text-xs font-extrabold tracking-wide uppercase">
                  <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400 animate-pulse" />
                  <span>
                    {t('实兆远垦场社区 • 卫理公会宣道堂', 'Pioneer Methodist Community Library')}
                  </span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.16] drop-shadow-sm">
                  {t('线上阅读 • ', 'Discover Great Books & ')}
                  <span className="bg-gradient-to-r from-sky-300 via-white to-red-300 bg-clip-text text-transparent">
                    {t('宣道堂图书馆', 'Manage Loans Easily!')}
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-blue-100 max-w-2xl leading-relaxed font-medium drop-shadow-sm">
                  {t(
                    '“透过阅读，走入作者的世界，从他人的生命中汲取智慧。” 欢迎浏览教会丛书目录，会友可随时登录查询借阅到期日，或一键办理线上续借！',
                    'Welcome to your friendly church & community book hub! Explore hundreds of inspiring reads across faith, family, and life. Log in anytime to check when your books are due back or extend your loan with a single click.'
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link href="/books">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-8 h-13 text-base font-bold shadow-xl shadow-blue-950/40 border border-blue-400/30 flex items-center gap-2.5 transition-transform hover:scale-105"
                    >
                      <Search className="h-5 w-5" />
                      <span>{t('图书馆检索 (一览教会丛书)', 'Explore Book Catalogue')}</span>
                    </Button>
                  </Link>

                  {user ? (
                    <Link href="/profile">
                      <Button
                        size="lg"
                        className="rounded-full px-7 h-13 text-base font-bold bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-xl shadow-red-950/40 flex items-center gap-2.5 transition-transform hover:scale-105"
                      >
                        <CalendarClock className="h-5 w-5" />
                        <span>{t('我的借阅与续借', 'My Loans & Due Dates')}</span>
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/signIn">
                      <Button
                        size="lg"
                        className="rounded-full px-7 h-13 text-base font-bold bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-xl shadow-red-950/40 flex items-center gap-2.5 transition-transform hover:scale-105"
                      >
                        <CalendarClock className="h-5 w-5" />
                        <span>{t('会友借阅特区 (登录)', 'Member Login & Loans')}</span>
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Fun Feature Pills over Parallax */}
                <div className="pt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold text-white">
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <CheckCircle2 className="h-4 w-4 text-sky-300 shrink-0" />
                    <span>{t('实时馆藏状态', 'Live Shelf Status')}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <CheckCircle2 className="h-4 w-4 text-red-300 shrink-0" />
                    <span>{t('一键线上续借', '1-Click Loan Extension')}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
                    <span>{t('清晰归还日期提醒', 'Return Date Reminders')}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Floating Glassmorphic Member Loan Tracker Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none animate-float-slow">
                  <div className="relative rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-white/60 shadow-2xl p-6 sm:p-7 space-y-5">
                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                          <Bookmark className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                            {t('会友借阅管理', 'Member Loan Tracker')}
                          </div>
                          <div className="font-display text-lg font-extrabold text-slate-900">
                            {t('轻松掌握归还日期！', 'Know When to Return!')}
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        {t('剩余 5 天', '5 Days Left')}
                      </span>
                    </div>

                    {/* Sample Active Loan Box */}
                    <div className="rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-red-50/60 border-2 border-blue-100/90 p-4 space-y-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                            {t('索书号', 'Call No')}: C-204.1
                          </span>
                          <h4 className="font-display font-extrabold text-slate-900 text-base mt-2">
                            {t('返璞归真 (Mere Christianity)', 'Mere Christianity & Reflections')}
                          </h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <div className="bg-white rounded-xl p-3 border border-blue-100 shadow-sm">
                          <span className="text-slate-400 font-semibold block">
                            {t('借出日期', 'Borrowed On')}
                          </span>
                          <span className="font-bold text-slate-800 mt-0.5 block">05/10/2026</span>
                        </div>
                        <div className="bg-red-50/90 rounded-xl p-3 border border-red-200 shadow-sm">
                          <span className="text-red-600 font-bold block">
                            {t('应还日期 (Due)', 'Return Due Date')}
                          </span>
                          <span className="font-extrabold text-red-700 mt-0.5 block">19/10/2026</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-blue-600" />
                          {t('需要更多时间阅读？', 'Need more time to finish?')}
                        </span>
                        <Link
                          href={user ? '/profile' : '/signIn'}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 px-3.5 py-2 rounded-full shadow-sm transition-transform hover:scale-105"
                        >
                          <RefreshCw className="h-3 w-3" />
                          {t('线上续借', 'Extend Loan')}
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Card Callout */}
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-1">
                      <span>{t('随时在线管理您借阅的书籍', 'Manage all your borrowed books online')}</span>
                      <Link
                        href={user ? '/profile' : '/signIn'}
                        className="font-extrabold text-blue-600 hover:text-red-600 flex items-center gap-1 transition-colors"
                      >
                        <span>{user ? t('进入借阅特区', 'Go to My Loans') : t('立即登录', 'Login Now')}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Lively Feature Cards */}
        <section className="py-16 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="inline-block px-3.5 py-1 rounded-full bg-blue-50 text-xs font-extrabold uppercase tracking-widest text-blue-600 border border-blue-200">
              {t('教会图书馆指南', 'How Our Library Works')}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-blue-950 mt-3">
              {t('把人引进 • 把人留住 • 把人带大', 'Borrowing Books Made Fun & Simple')}
            </h2>
            <p className="text-slate-600 mt-3 text-base font-medium">
              {t(
                '无论是检索教会丛书，还是在家查询归还日期与办理续借，只需轻松点击即可完成。',
                "Whether you're hunting for your next great read or extending a current loan from home, everything is just a tap away."
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Blue Theme */}
            <div className="group bg-white rounded-3xl p-7 border-2 border-blue-100 shadow-lg shadow-blue-900/5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-xl">
              <div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-600/25 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-7 w-7" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                  {t('第一步 • Step 01', 'Step 01')}
                </span>
                <h3 className="font-display text-xl font-extrabold text-slate-900 mt-1 mb-2.5">
                  {t('一览教会丛书 (检索目录)', 'Browse the Catalogue')}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t(
                    '按书籍分类、书名、作者或出版社快速搜索。在前往图书馆前即可查看书籍是否在架及索书号！',
                    'Explore books by category, title, author, or publisher. Check live shelf availability and call numbers before you visit!'
                  )}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-blue-50">
                <Link
                  href="/books"
                  className="inline-flex items-center gap-1.5 text-sm font-extrabold text-blue-600 group-hover:text-blue-800"
                >
                  <span>{t('进入图书馆检索', 'Browse all books')}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Card 2: Red Theme */}
            <div className="group bg-white rounded-3xl p-7 border-2 border-red-100 shadow-lg shadow-red-900/5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-red-300 hover:shadow-xl">
              <div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center mb-6 shadow-md shadow-red-500/25 group-hover:scale-110 transition-transform">
                  <CalendarClock className="h-7 w-7" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-red-500">
                  {t('第二步 • Step 02', 'Step 02')}
                </span>
                <h3 className="font-display text-xl font-extrabold text-slate-900 mt-1 mb-2.5">
                  {t('随时查看归还日期', 'Know When to Return')}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t(
                    '不再忘记还书日期！会友借阅特区清楚显示每本书的借出日期、应还日期以及剩余天数提醒。',
                    'Never miss a due date! Your member dashboard shows clear countdown badges, borrow dates, and exact return deadlines.'
                  )}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-red-50">
                <Link
                  href={user ? "/profile" : "/signIn"}
                  className="inline-flex items-center gap-1.5 text-sm font-extrabold text-red-600 group-hover:text-red-700"
                >
                  <span>{t('查看我的借阅记录', 'Check return dates')}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Card 3: Indigo/Blue-Red Blend Theme */}
            <div className="group bg-white rounded-3xl p-7 border-2 border-indigo-100 shadow-lg shadow-indigo-900/5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-300 hover:shadow-xl">
              <div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-red-500 text-white flex items-center justify-center mb-6 shadow-md shadow-indigo-500/25 group-hover:scale-110 transition-transform">
                  <RefreshCw className="h-7 w-7" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                  {t('第三步 • Step 03', 'Step 03')}
                </span>
                <h3 className="font-display text-xl font-extrabold text-slate-900 mt-1 mb-2.5">
                  {t('一键办理线上续借', 'Extend Loans Online')}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t(
                    '书还没读完？只需登录您的会友账号，点击“线上续借”按钮即可延长借阅期限，轻松又方便！',
                    'Still enjoying your book? Extend eligible loans directly from your phone or computer with one click—no need to visit the desk!'
                  )}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-indigo-50">
                <Link
                  href={user ? "/profile" : "/signIn"}
                  className="inline-flex items-center gap-1.5 text-sm font-extrabold text-indigo-600 group-hover:text-indigo-800"
                >
                  <span>{t('办理线上续借', 'Extend a book loan')}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Categories Section */}
        {categories.length > 0 && (
          <section className="py-16 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-red-50/80 border-y border-blue-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-red-500 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    {t('书籍分类目录', 'Curated Book Shelves')}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-blue-950 mt-1">
                    {t('按类别探索教会藏书', 'Jump Straight to a Category')}
                  </h2>
                </div>
                <Link
                  href="/books"
                  className="text-sm font-extrabold text-blue-600 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <span>{t('查看所有分类', 'See all categories')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((cat: any, i: number) => {
                  const isRedAccent = i % 2 === 1
                  return (
                    <Link
                      key={cat.id || cat.code}
                      href={`/books?category_code=${encodeURIComponent(cat.code)}`}
                      className={`group bg-white border-2 rounded-2xl p-4 transition-all duration-200 shadow-sm hover:-translate-y-1 hover:shadow-md flex items-center justify-between ${
                        isRedAccent
                          ? 'border-red-100 hover:border-red-400 hover:bg-gradient-to-br hover:from-red-500 hover:to-rose-600'
                          : 'border-blue-100 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-600'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span
                          className={`inline-block text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-md ${
                            isRedAccent
                              ? 'bg-red-50 text-red-600 group-hover:bg-white/20 group-hover:text-white'
                              : 'bg-blue-50 text-blue-600 group-hover:bg-white/20 group-hover:text-white'
                          }`}
                        >
                          {cat.code}
                        </span>
                        <span className="font-bold text-sm text-slate-800 group-hover:text-white truncate block mt-1.5">
                          {cat.name || t('图书分类', 'Collection')}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Vibrant Blue & Red Banner Footer matching pioneercommunity.org.my */}
      <footer className="bg-gradient-to-r from-blue-950 via-blue-900 to-red-900 text-white py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/15">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-md">
                  <Image src="/pmc_logo.png" alt="卫理公会宣道堂" width={32} height={32} />
                </div>
                <div>
                  <span className="font-display text-xl sm:text-2xl font-extrabold text-white block leading-none">
                    {t('实兆远甘文阁 卫理公会宣道堂', 'Pioneer Methodist Church')}
                  </span>
                  <span className="text-xs font-bold text-red-300 uppercase tracking-wider mt-1 block">
                    {t('宣道堂图书馆 • PMC Community Library', 'Discover • Learn • Connect')}
                  </span>
                </div>
              </div>
              <p className="text-sm text-blue-100/90 leading-relaxed pt-1">
                {t(
                  '透过阅读，走入作者的世界，从他人的生命中汲取智慧。欢迎弟兄姐妹与社区朋友善用教会图书馆资源，彼此建立，共同成长。',
                  'Our church & community library is open to everyone! Borrow inspiring books, keep track of your return dates online, and grow together.'
                )}
              </p>
            </div>

            {/* Links Column 1: Library */}
            <div className="md:col-span-3 space-y-2.5">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-red-300">
                {t('线上阅读与服务', 'Library Services')}
              </h3>
              <ul className="space-y-2 text-sm text-blue-100 font-medium">
                <li>
                  <Link href="/books" className="hover:text-white transition-colors">
                    {t('图书馆检索 (一览丛书)', 'Browse Book Catalogue')}
                  </Link>
                </li>
                <li>
                  <Link href={user ? '/profile' : '/signIn'} className="hover:text-white transition-colors">
                    {t('会友借阅与续借特区', 'Member Loans & Extensions')}
                  </Link>
                </li>
                <li>
                  <a
                    href="http://rebrand.ly/pmcnewsletter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <span>{t('主日周刊 (最新秩序单)', 'Sunday Weekly Bulletin')}</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Links Column 2: Church Official Links */}
            <div className="md:col-span-4 space-y-2.5">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-red-300">
                {t('基督教卫理公会 & 链接', 'Church & Community Links')}
              </h3>
              <ul className="space-y-2 text-sm text-blue-100 font-medium">
                <li>
                  <a
                    href="https://pioneercommunity.org.my/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <span>{t('卫理公会宣道堂官方网站', 'Pioneer Methodist Church Website')}</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/Pioneer-Methodist-Church-264899473685436"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <span>{t('甘文阁宣道堂 Facebook', 'PMC Official Facebook')}</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                </li>
                <li>
                  <a
                    href="http://www.methodist.org.my/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <span>{t('基督教卫理公会 华人年议会', 'Methodist Church CAC')}</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-200/80 gap-4">
            <p>
              Copyright © {new Date().getFullYear()} {t('卫理公会宣道堂. 版权所有', 'Pioneer Methodist Community Library. All rights reserved.')}
            </p>
            <div className="flex items-center gap-6 font-semibold">
              <Link href="/books" className="hover:text-white transition-colors">{t('图书馆检索', 'Catalogue')}</Link>
              <Link href="/signIn" className="hover:text-white transition-colors">{t('会友登录', 'Member Login')}</Link>
              <Link href="/signUp" className="hover:text-white transition-colors">{t('注册账号', 'Register')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}