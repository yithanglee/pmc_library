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
  Bookmark
} from 'lucide-react'
import Header from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { populateData } from '@/components/data/populateData'

export default function CommunityLibrary() {
  const { user } = useAuth()
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
              {/* Left Column: Lively Hero Copy & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-left text-white">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md shadow-sm border border-white/25 text-white text-xs font-extrabold tracking-wide uppercase">
                  <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400 animate-pulse" />
                  <span>Pioneer Methodist Community Library</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-sm">
                  Discover Great Books &{' '}
                  <span className="bg-gradient-to-r from-sky-300 via-white to-red-300 bg-clip-text text-transparent">
                    Manage Loans Easily!
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-blue-100 max-w-2xl leading-relaxed font-medium drop-shadow-sm">
                  Welcome to your friendly neighborhood book hub! Explore hundreds of inspiring reads across faith, family, and life. Log in anytime to check when your books are due back or extend your loan with a single click.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link href="/books">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-8 h-13 text-base font-bold shadow-xl shadow-blue-950/40 border border-blue-400/30 flex items-center gap-2.5 transition-transform hover:scale-105"
                    >
                      <Search className="h-5 w-5" />
                      <span>Explore Book Catalogue</span>
                    </Button>
                  </Link>

                  {user ? (
                    <Link href="/profile">
                      <Button
                        size="lg"
                        className="rounded-full px-7 h-13 text-base font-bold bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-xl shadow-red-950/40 flex items-center gap-2.5 transition-transform hover:scale-105"
                      >
                        <CalendarClock className="h-5 w-5" />
                        <span>My Loans & Due Dates</span>
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/signIn">
                      <Button
                        size="lg"
                        className="rounded-full px-7 h-13 text-base font-bold bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-xl shadow-red-950/40 flex items-center gap-2.5 transition-transform hover:scale-105"
                      >
                        <CalendarClock className="h-5 w-5" />
                        <span>Member Login & Loans</span>
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Fun Feature Pills over Parallax */}
                <div className="pt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold text-white">
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <CheckCircle2 className="h-4 w-4 text-sky-300 shrink-0" />
                    <span>Live Shelf Status</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <CheckCircle2 className="h-4 w-4 text-red-300 shrink-0" />
                    <span>1-Click Loan Extension</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
                    <span>Return Date Reminders</span>
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
                            Member Loan Tracker
                          </div>
                          <div className="font-display text-lg font-extrabold text-slate-900">
                            Know When to Return!
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        5 Days Left
                      </span>
                    </div>

                    {/* Sample Active Loan Box */}
                    <div className="rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-red-50/60 border-2 border-blue-100/90 p-4 space-y-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                            Call No: C-204.1
                          </span>
                          <h4 className="font-display font-extrabold text-slate-900 text-base mt-2">
                            Mere Christianity & Reflections
                          </h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <div className="bg-white rounded-xl p-3 border border-blue-100 shadow-sm">
                          <span className="text-slate-400 font-semibold block">Borrowed On</span>
                          <span className="font-bold text-slate-800 mt-0.5 block">05 Oct 2026</span>
                        </div>
                        <div className="bg-red-50/90 rounded-xl p-3 border border-red-200 shadow-sm">
                          <span className="text-red-600 font-bold block">Return Due Date</span>
                          <span className="font-extrabold text-red-700 mt-0.5 block">19 Oct 2026</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-blue-600" />
                          Need more time to finish?
                        </span>
                        <Link
                          href={user ? '/profile' : '/signIn'}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 px-3.5 py-2 rounded-full shadow-sm transition-transform hover:scale-105"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Extend Loan
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Card Callout */}
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-1">
                      <span>Manage all your borrowed books online</span>
                      <Link
                        href={user ? '/profile' : '/signIn'}
                        className="font-extrabold text-blue-600 hover:text-red-600 flex items-center gap-1 transition-colors"
                      >
                        <span>{user ? 'Go to My Loans' : 'Login Now'}</span>
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
              How Our Library Works
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-blue-950 mt-3">
              Borrowing Books Made Fun & Simple
            </h2>
            <p className="text-slate-600 mt-3 text-base font-medium">
              Whether you're hunting for your next great read or extending a current loan from home, everything is just a tap away.
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
                  Step 01
                </span>
                <h3 className="font-display text-xl font-extrabold text-slate-900 mt-1 mb-2.5">
                  Browse the Catalogue
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Explore books by category, title, author, or publisher. Check live shelf availability and call numbers before you visit!
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-blue-50">
                <Link
                  href="/books"
                  className="inline-flex items-center gap-1.5 text-sm font-extrabold text-blue-600 group-hover:text-blue-800"
                >
                  <span>Browse all books</span>
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
                  Step 02
                </span>
                <h3 className="font-display text-xl font-extrabold text-slate-900 mt-1 mb-2.5">
                  Know When to Return
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Never miss a due date! Your member dashboard shows clear countdown badges, borrow dates, and exact return deadlines.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-red-50">
                <Link
                  href={user ? "/profile" : "/signIn"}
                  className="inline-flex items-center gap-1.5 text-sm font-extrabold text-red-600 group-hover:text-red-700"
                >
                  <span>Check return dates</span>
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
                  Step 03
                </span>
                <h3 className="font-display text-xl font-extrabold text-slate-900 mt-1 mb-2.5">
                  Extend Loans Online
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Still enjoying your book? Extend eligible loans directly from your phone or computer with one click—no need to visit the desk!
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-indigo-50">
                <Link
                  href={user ? "/profile" : "/signIn"}
                  className="inline-flex items-center gap-1.5 text-sm font-extrabold text-indigo-600 group-hover:text-indigo-800"
                >
                  <span>Extend a book loan</span>
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
                    Curated Book Shelves
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-blue-950 mt-1">
                    Jump Straight to a Category
                  </h2>
                </div>
                <Link
                  href="/books"
                  className="text-sm font-extrabold text-blue-600 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <span>See all categories</span>
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
                          {cat.name || 'Collection'}
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

      {/* Vibrant Blue & Red Banner Footer */}
      <footer className="bg-gradient-to-r from-blue-950 via-blue-900 to-red-900 text-white py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/15">
            <div className="space-y-3 max-w-md">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-md">
                  <Image src="/pmc_logo.png" alt="PMC Library" width={32} height={32} />
                </div>
                <div>
                  <span className="font-display text-2xl font-extrabold text-white block leading-none">
                    PMC Library
                  </span>
                  <span className="text-xs font-bold text-red-300 uppercase tracking-wider">
                    Discover • Learn • Connect
                  </span>
                </div>
              </div>
              <p className="text-sm text-blue-100/90 leading-relaxed pt-1">
                Our community library is open to everyone! Borrow inspiring books, keep track of your return dates online, and grow together.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/books">
                <Button
                  variant="outline"
                  className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white hover:text-blue-900 font-bold px-6"
                >
                  Browse Catalogue
                </Button>
              </Link>
              {!user ? (
                <Link href="/signIn">
                  <Button className="rounded-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold px-6 shadow-lg">
                    Member Login / Register
                  </Button>
                </Link>
              ) : (
                <Link href="/profile">
                  <Button className="rounded-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold px-6 shadow-lg">
                    My Loans Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-200/80 gap-4">
            <p>© {new Date().getFullYear()} Pioneer Methodist Community Library. All rights reserved.</p>
            <div className="flex items-center gap-6 font-semibold">
              <Link href="/books" className="hover:text-white transition-colors">Catalogue</Link>
              <Link href="/signIn" className="hover:text-white transition-colors">Member Portal</Link>
              <Link href="/signUp" className="hover:text-white transition-colors">Join Free</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}