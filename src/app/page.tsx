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
  Sparkles,
  CheckCircle2,
  Bookmark,
  Users,
  ShieldCheck,
  Clock
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
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-stone-200/80 bg-gradient-to-b from-[#FAF6EE] to-[#FDFBF7] pt-12 pb-20 lg:pt-20 lg:pb-28">
          {/* Subtle decorative background accents */}
          <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-rose-900/5 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-10 h-80 w-80 rounded-full bg-amber-600/5 blur-3xl" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Editorial Copy & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-900/10 border border-rose-900/15 text-rose-900 text-xs font-semibold tracking-wide uppercase">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Pioneer Methodist Community Library</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.12]">
                  A sanctuary for readers, <br className="hidden sm:inline" />
                  <span className="text-rose-900 italic font-normal">shared by our community.</span>
                </h1>

                <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
                  Explore our curated collection of books across faith, literature, family, and personal growth. Members can effortlessly track borrowed books, check return due dates, and extend active loans online.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link href="/books">
                    <Button size="lg" className="bg-rose-900 hover:bg-rose-800 text-white rounded-xl px-7 h-12 text-base font-medium shadow-sm flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      <span>Explore Book Catalogue</span>
                    </Button>
                  </Link>

                  {user ? (
                    <Link href="/profile">
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-xl px-6 h-12 text-base font-medium border-stone-300 bg-white hover:bg-stone-100 text-stone-800 flex items-center gap-2"
                      >
                        <CalendarClock className="h-4 w-4 text-rose-800" />
                        <span>Manage My Loans</span>
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/signIn">
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-xl px-6 h-12 text-base font-medium border-stone-300 bg-white hover:bg-stone-100 text-stone-800 flex items-center gap-2"
                      >
                        <CalendarClock className="h-4 w-4 text-rose-800" />
                        <span>Member Login & Loans</span>
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Quick Trust / Utility Pills */}
                <div className="pt-6 grid grid-cols-3 gap-4 max-w-lg border-t border-stone-200/80 text-xs sm:text-sm text-stone-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                    <span>Live Availability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                    <span>1-Click Extensions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                    <span>Clear Due Dates</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Preview of Member Loan & Catalogue Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative back card */}
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-rose-900/10 via-stone-200/40 to-amber-500/10 blur-xl" />

                  <div className="relative rounded-2xl bg-white border border-stone-200/90 shadow-xl p-6 sm:p-7 space-y-6">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-rose-900/10 text-rose-900 flex items-center justify-center">
                          <Bookmark className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                            Member Portal Preview
                          </div>
                          <div className="font-serif text-lg font-bold text-stone-900">
                            Active Loan Tracker
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        On Time
                      </span>
                    </div>

                    {/* Sample Loan Item 1 */}
                    <div className="rounded-xl bg-[#FAF7F2] border border-stone-200/80 p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                            Call No: C-204.1
                          </span>
                          <h4 className="font-serif font-semibold text-stone-900 text-base mt-1.5">
                            Mere Christianity & Reflections
                          </h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                        <div className="bg-white rounded-lg p-2.5 border border-stone-200/60">
                          <span className="text-stone-400 block">Borrowed Date</span>
                          <span className="font-medium text-stone-700 mt-0.5 block">05 Oct 2026</span>
                        </div>
                        <div className="bg-white rounded-lg p-2.5 border border-amber-200/80">
                          <span className="text-amber-800/80 block font-medium">Return Due Date</span>
                          <span className="font-semibold text-amber-900 mt-0.5 block">19 Oct 2026</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-stone-500 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-amber-600" />
                          Eligible for online renewal
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-900 bg-rose-900/10 px-3 py-1.5 rounded-lg">
                          <RefreshCw className="h-3 w-3" />
                          Extend Loan
                        </span>
                      </div>
                    </div>

                    {/* Bottom Card Callout */}
                    <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                      <span>Log in anytime to check return dates</span>
                      <Link href={user ? '/profile' : '/signIn'} className="font-semibold text-rose-900 hover:underline flex items-center gap-1">
                        <span>{user ? 'Go to My Loans' : 'Sign in now'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works / Core Pillars */}
        <section className="py-16 lg:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-rose-800">
              Designed for Members
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
              Everything you need for your reading journey
            </h2>
            <p className="text-stone-600 mt-3 text-base">
              Whether you are browsing from home or checking when your borrowed books are due back, our digital catalogue keeps you connected.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="paper-card rounded-2xl p-7 flex flex-col justify-between transition-all hover:shadow-md hover:border-stone-300">
              <div>
                <div className="h-12 w-12 rounded-xl bg-rose-900/10 text-rose-900 flex items-center justify-center mb-6">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2.5">
                  1. Browse the Catalogue
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Search our complete book inventory by title, author, publisher, or category code. Check real-time shelf availability and call numbers before visiting.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-stone-100">
                <Link href="/books" className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-900 hover:text-rose-700">
                  <span>View all books</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="paper-card rounded-2xl p-7 flex flex-col justify-between transition-all hover:shadow-md hover:border-stone-300">
              <div>
                <div className="h-12 w-12 rounded-xl bg-amber-600/10 text-amber-800 flex items-center justify-center mb-6">
                  <CalendarClock className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2.5">
                  2. Track Return Dates
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Never lose track of when a book is due. Your member profile displays all active loans, borrow dates, upcoming return deadlines, and any overdue alerts.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-stone-100">
                <Link href={user ? "/profile" : "/signIn"} className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-900 hover:text-amber-700">
                  <span>Check due dates</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="paper-card rounded-2xl p-7 flex flex-col justify-between transition-all hover:shadow-md hover:border-stone-300">
              <div>
                <div className="h-12 w-12 rounded-xl bg-emerald-700/10 text-emerald-800 flex items-center justify-center mb-6">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2.5">
                  3. Extend Loans Online
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Need a little more time to finish a chapter? Extend eligible book loans directly from your member dashboard with a single click—no trip required.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-stone-100">
                <Link href={user ? "/profile" : "/signIn"} className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-700">
                  <span>Extend a loan</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Categories Section (Dynamic if loaded) */}
        {categories.length > 0 && (
          <section className="py-14 bg-[#F5F0E6]/70 border-y border-stone-200/80">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                    Curated Shelves
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                    Explore by Category
                  </h2>
                </div>
                <Link href="/books" className="text-sm font-semibold text-rose-900 hover:underline flex items-center gap-1">
                  <span>View all categories</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {categories.map((cat: any) => (
                  <Link
                    key={cat.id || cat.code}
                    href={`/books?category_code=${encodeURIComponent(cat.code)}`}
                    className="group bg-white hover:bg-rose-900 hover:text-white border border-stone-200/90 rounded-xl p-4 transition-all duration-200 shadow-sm flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <span className="text-xs font-mono font-semibold text-rose-800 group-hover:text-rose-200 block">
                        {cat.code}
                      </span>
                      <span className="font-medium text-sm text-stone-800 group-hover:text-white truncate block mt-0.5">
                        {cat.name || 'Collection'}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-stone-400 group-hover:text-white shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Warm Editorial Footer */}
      <footer className="bg-stone-900 text-stone-300 py-14 border-t border-stone-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-stone-800">
            <div className="space-y-2 max-w-md">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-white p-1 flex items-center justify-center">
                  <Image src="/pmc_logo.png" alt="PMC Library" width={28} height={28} />
                </div>
                <span className="font-serif text-xl font-bold text-white">
                  PMC Library
                </span>
              </div>
              <p className="text-sm text-stone-400 leading-relaxed pt-1">
                A community resource hub fostering learning, reflection, and connection. Borrow books, manage your reading schedule, and grow together.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/books">
                <Button variant="outline" className="border-stone-700 bg-stone-800/60 text-stone-200 hover:bg-stone-800 hover:text-white">
                  Browse Catalogue
                </Button>
              </Link>
              {!user ? (
                <Link href="/signIn">
                  <Button className="bg-rose-800 hover:bg-rose-700 text-white">
                    Member Login
                  </Button>
                </Link>
              ) : (
                <Link href="/profile">
                  <Button className="bg-rose-800 hover:bg-rose-700 text-white">
                    My Loans Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
            <p>© {new Date().getFullYear()} Pioneer Methodist Community Library. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/books" className="hover:text-stone-300 transition-colors">Catalogue</Link>
              <Link href="/signIn" className="hover:text-stone-300 transition-colors">Member Portal</Link>
              <Link href="/signUp" className="hover:text-stone-300 transition-colors">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}