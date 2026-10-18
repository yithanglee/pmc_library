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
        {/* Full-Width Parallax Hero Section featuring /1009.jpg with soft, calm dark overlay */}
        <section
          className="relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed border-b border-slate-200 py-20 lg:py-32"
          style={{
            backgroundImage: `url('/1009.jpg')`,
          }}
        >
          {/* Minimalist soft dark overlay so the library photo /1009.jpg looks natural and calm */}
          <div className="absolute inset-0 bg-slate-900/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-slate-900/30" />

          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
              {/* Left Column: Minimalist Hero Copy & Light-Blue (#00bff2) CTAs */}
              <div className="lg:col-span-7 space-y-6 text-left text-white">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-medium tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-[#00bff2]" />
                  <span>
                    {t('实兆远垦场社区 • 卫理公会宣道堂', 'Pioneer Methodist Community Library')}
                  </span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.18]">
                  {t('线上阅读 • ', 'Discover Great Books & ')}
                  <span className="text-[#00bff2] font-light sm:font-semibold">
                    {t('宣道堂图书馆', 'Manage Loans Easily')}
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed font-normal">
                  {t(
                    '“透过阅读，走入作者的世界，从他人的生命中汲取智慧。” 欢迎浏览教会丛书目录，会友可随时登录查询借阅到期日，或一键办理线上续借。',
                    'Explore our church & community book collection across faith, family, and life. Log in anytime to check when your books are due back or extend your loan online.'
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Link href="/books">
                    <Button
                      size="lg"
                      className="bg-[#00bff2] hover:bg-[#0097bf] text-white rounded-full px-8 h-12 text-sm sm:text-base font-semibold shadow-md flex items-center gap-2 transition-colors"
                    >
                      <Search className="h-4 w-4" />
                      <span>{t('图书馆检索 (一览教会丛书)', 'Explore Book Catalogue')}</span>
                    </Button>
                  </Link>

                  {user ? (
                    <Link href="/profile">
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full px-7 h-12 text-sm sm:text-base font-semibold bg-white/15 hover:bg-white/25 text-white border-white/30 backdrop-blur-md flex items-center gap-2 transition-colors"
                      >
                        <CalendarClock className="h-4 w-4 text-[#00bff2]" />
                        <span>{t('我的借阅与续借', 'My Loans & Due Dates')}</span>
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/signIn">
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full px-7 h-12 text-sm sm:text-base font-semibold bg-white/15 hover:bg-white/25 text-white border-white/30 backdrop-blur-md flex items-center gap-2 transition-colors"
                      >
                        <CalendarClock className="h-4 w-4 text-[#00bff2]" />
                        <span>{t('会友借阅特区 (登录)', 'Member Login & Loans')}</span>
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Minimalist Feature Pills over Parallax */}
                <div className="pt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-normal text-slate-200">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
                    <CheckCircle2 className="h-4 w-4 text-[#00bff2] shrink-0" />
                    <span>{t('实时馆藏状态', 'Live Shelf Status')}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
                    <CheckCircle2 className="h-4 w-4 text-[#00bff2] shrink-0" />
                    <span>{t('一键线上续借', '1-Click Loan Extension')}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
                    <CheckCircle2 className="h-4 w-4 text-[#00bff2] shrink-0" />
                    <span>{t('清晰归还日期提醒', 'Return Date Reminders')}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Clean Minimalist Member Loan Tracker Preview Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none animate-float-slow">
                  <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-xl p-6 sm:p-7 space-y-5">
                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-sky-50 text-[#0097bf] border border-sky-200/60 flex items-center justify-center">
                          <Bookmark className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#0097bf]">
                            {t('会友借阅管理', 'Member Loan Tracker')}
                          </div>
                          <div className="font-display text-base font-bold text-slate-800">
                            {t('轻松掌握归还日期', 'Know When to Return')}
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {t('剩余 5 天', '5 Days Left')}
                      </span>
                    </div>

                    {/* Sample Active Loan Box */}
                    <div className="rounded-xl bg-[#fbfbfc] border border-slate-200/80 p-4 space-y-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-mono font-semibold text-[#0097bf] bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-md">
                            {t('索书号', 'Call No')}: C-204.1
                          </span>
                          <h4 className="font-display font-bold text-slate-800 text-base mt-2">
                            {t('返璞归真 (Mere Christianity)', 'Mere Christianity & Reflections')}
                          </h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <div className="bg-white rounded-lg p-3 border border-slate-200/70">
                          <span className="text-slate-400 font-medium block">
                            {t('借出日期', 'Borrowed On')}
                          </span>
                          <span className="font-semibold text-slate-700 mt-0.5 block">05/10/2026</span>
                        </div>
                        <div className="bg-sky-50/70 rounded-lg p-3 border border-sky-200/70">
                          <span className="text-[#0097bf] font-semibold block">
                            {t('应还日期 (Due)', 'Return Due Date')}
                          </span>
                          <span className="font-bold text-slate-800 mt-0.5 block">19/10/2026</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[#00bff2]" />
                          {t('需要更多时间阅读？', 'Need more time to finish?')}
                        </span>
                        <Link
                          href={user ? '/profile' : '/signIn'}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#00bff2] hover:bg-[#0097bf] px-3.5 py-2 rounded-full transition-colors"
                        >
                          <RefreshCw className="h-3 w-3" />
                          {t('线上续借', 'Extend Loan')}
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Card Callout */}
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-1">
                      <span>{t('随时在线管理您借阅的书籍', 'Manage all your borrowed books online')}</span>
                      <Link
                        href={user ? '/profile' : '/signIn'}
                        className="font-semibold text-[#0097bf] hover:text-[#00bff2] flex items-center gap-1 transition-colors"
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

        {/* 3 Minimalist Feature Cards matching pioneercommunity.org.my */}
        <section className="py-16 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="inline-block px-3.5 py-1 rounded-full bg-sky-50 text-xs font-semibold uppercase tracking-widest text-[#0097bf] border border-sky-100">
              {t('教会图书馆指南', 'How Our Library Works')}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-light sm:font-semibold text-[#00bff2] mt-3">
              {t('把人引进 • 把人留住 • 把人带大', 'Borrowing Books Made Simple')}
            </h2>
            <p className="text-slate-500 mt-3 text-base">
              {t(
                '无论是检索教会丛书，还是在家查询归还日期与办理续借，只需轻松点击即可完成。',
                "Whether you're hunting for your next great read or extending a current loan from home, everything is just a tap away."
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {/* Card 1 */}
            <div className="group bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between transition-all duration-200 hover:border-[#00bff2] hover:shadow-md">
              <div>
                <div className="h-12 w-12 rounded-xl bg-sky-50 text-[#00bff2] border border-sky-100 flex items-center justify-center mb-6">
                  <BookOpen className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0097bf]">
                  {t('第一步 • Step 01', 'Step 01')}
                </span>
                <h3 className="font-display text-xl font-bold text-slate-800 mt-1 mb-2.5">
                  {t('一览教会丛书 (检索目录)', 'Browse the Catalogue')}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {t(
                    '按书籍分类、书名、作者或出版社快速搜索。在前往图书馆前即可查看书籍是否在架及索书号。',
                    'Explore books by category, title, author, or publisher. Check live shelf availability and call numbers before you visit.'
                  )}
                </p>
              </div>
              <div className="pt-5 mt-6 border-t border-slate-100">
                <Link
                  href="/books"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0097bf] group-hover:text-[#00bff2]"
                >
                  <span>{t('进入图书馆检索', 'Browse all books')}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between transition-all duration-200 hover:border-[#00bff2] hover:shadow-md">
              <div>
                <div className="h-12 w-12 rounded-xl bg-sky-50 text-[#00bff2] border border-sky-100 flex items-center justify-center mb-6">
                  <CalendarClock className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0097bf]">
                  {t('第二步 • Step 02', 'Step 02')}
                </span>
                <h3 className="font-display text-xl font-bold text-slate-800 mt-1 mb-2.5">
                  {t('随时查看归还日期', 'Know When to Return')}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {t(
                    '不再忘记还书日期！会友借阅特区清楚显示每本书的借出日期、应还日期以及剩余天数提醒。',
                    'Never miss a due date! Your member dashboard shows clear countdown badges, borrow dates, and exact return deadlines.'
                  )}
                </p>
              </div>
              <div className="pt-5 mt-6 border-t border-slate-100">
                <Link
                  href={user ? "/profile" : "/signIn"}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0097bf] group-hover:text-[#00bff2]"
                >
                  <span>{t('查看我的借阅记录', 'Check return dates')}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between transition-all duration-200 hover:border-[#00bff2] hover:shadow-md">
              <div>
                <div className="h-12 w-12 rounded-xl bg-sky-50 text-[#00bff2] border border-sky-100 flex items-center justify-center mb-6">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0097bf]">
                  {t('第三步 • Step 03', 'Step 03')}
                </span>
                <h3 className="font-display text-xl font-bold text-slate-800 mt-1 mb-2.5">
                  {t('一键办理线上续借', 'Extend Loans Online')}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {t(
                    '书还没读完？只需登录您的会友账号，点击“线上续借”按钮即可延长借阅期限，轻松又方便。',
                    'Still enjoying your book? Extend eligible loans directly from your phone or computer with one click—no need to visit the desk.'
                  )}
                </p>
              </div>
              <div className="pt-5 mt-6 border-t border-slate-100">
                <Link
                  href={user ? "/profile" : "/signIn"}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0097bf] group-hover:text-[#00bff2]"
                >
                  <span>{t('办理线上续借', 'Extend a book loan')}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Minimalist Quick Categories Section */}
        {categories.length > 0 && (
          <section className="py-16 bg-white border-y border-slate-200/80">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#0097bf] flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-[#00bff2]" />
                    {t('书籍分类目录', 'Curated Book Shelves')}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                    {t('按类别探索教会藏书', 'Jump Straight to a Category')}
                  </h2>
                </div>
                <Link
                  href="/books"
                  className="text-sm font-semibold text-[#0097bf] hover:text-[#00bff2] flex items-center gap-1 transition-colors"
                >
                  <span>{t('查看所有分类', 'See all categories')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {categories.map((cat: any) => (
                  <Link
                    key={cat.id || cat.code}
                    href={`/books?category_code=${encodeURIComponent(cat.code)}`}
                    className="group bg-[#fbfbfc] hover:bg-sky-50/50 border border-slate-200/80 hover:border-[#00bff2] rounded-xl p-4 transition-all duration-200 flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <span className="inline-block text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-50 text-[#0097bf] border border-sky-100">
                        {cat.code}
                      </span>
                      <span className="font-semibold text-sm text-slate-700 group-hover:text-[#0097bf] truncate block mt-1.5">
                        {cat.name || t('图书分类', 'Collection')}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#00bff2] shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Clean Minimalist Dark-Slate Footer matching pioneercommunity.org.my */}
      <footer className="bg-[#1e1e1e] text-slate-300 py-14 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-slate-800">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white p-1.5 flex items-center justify-center">
                  <Image src="/pmc_logo.png" alt="卫理公会宣道堂" width={28} height={28} />
                </div>
                <div>
                  <span className="font-display text-lg sm:text-xl font-bold text-white block leading-none">
                    {t('实兆远甘文阁 卫理公会宣道堂', 'Pioneer Methodist Church')}
                  </span>
                  <span className="text-xs font-medium text-[#00bff2] tracking-wider mt-1 block">
                    {t('宣道堂图书馆 • PMC Community Library', 'Discover • Learn • Connect')}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed pt-1">
                {t(
                  '透过阅读，走入作者的世界，从他人的生命中汲取智慧。欢迎弟兄姐妹与社区朋友善用教会图书馆资源，彼此建立，共同成长。',
                  'Our church & community library is open to everyone. Borrow inspiring books, keep track of your return dates online, and grow together.'
                )}
              </p>
            </div>

            {/* Links Column 1: Library */}
            <div className="md:col-span-3 space-y-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#00bff2]">
                {t('线上阅读与服务', 'Library Services')}
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/books" className="hover:text-[#00bff2] transition-colors">
                    {t('图书馆检索 (一览丛书)', 'Browse Book Catalogue')}
                  </Link>
                </li>
                <li>
                  <Link href={user ? '/profile' : '/signIn'} className="hover:text-[#00bff2] transition-colors">
                    {t('会友借阅与续借特区', 'Member Loans & Extensions')}
                  </Link>
                </li>
                <li>
                  <a
                    href="http://rebrand.ly/pmcnewsletter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#00bff2] transition-colors inline-flex items-center gap-1"
                  >
                    <span>{t('主日周刊 (最新秩序单)', 'Sunday Weekly Bulletin')}</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Links Column 2: Church Official Links */}
            <div className="md:col-span-4 space-y-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#00bff2]">
                {t('基督教卫理公会 & 链接', 'Church & Community Links')}
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a
                    href="https://pioneercommunity.org.my/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#00bff2] transition-colors inline-flex items-center gap-1"
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
                    className="hover:text-[#00bff2] transition-colors inline-flex items-center gap-1"
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
                    className="hover:text-[#00bff2] transition-colors inline-flex items-center gap-1"
                  >
                    <span>{t('基督教卫理公会 华人年议会', 'Methodist Church CAC')}</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>
              Copyright © {new Date().getFullYear()} {t('卫理公会宣道堂. 版权所有', 'Pioneer Methodist Community Library. All rights reserved.')}
            </p>
            <div className="flex items-center gap-6">
              <Link href="/books" className="hover:text-[#00bff2] transition-colors">{t('图书馆检索', 'Catalogue')}</Link>
              <Link href="/signIn" className="hover:text-[#00bff2] transition-colors">{t('会友登录', 'Member Login')}</Link>
              <Link href="/signUp" className="hover:text-[#00bff2] transition-colors">{t('注册账号', 'Register')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}