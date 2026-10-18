"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebaseConfig'
import { useRouter } from 'next/navigation'
import { PHX_COOKIE, PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from '@/lib/constants'
import { useEffect, useState } from 'react'
import { format, differenceInCalendarDays, startOfDay } from 'date-fns'
import {
  BookOpen,
  Calendar,
  DollarSign,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  LogOut,
  Settings,
  Barcode,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import Link from 'next/link'
import { useAuth } from "@/lib/auth"
import Cookies from 'js-cookie'

interface Loan {
  has_extended: boolean
  id: number
  book: {
    title: string
    call_number: string
  }
  late_days: number
  loan_date: string
  return_date: string
  fine_amount: number
}

interface ExtendLoanResponse {
  status: 'success' | 'error'
  reason?: string
}

function getLoanTimingStatus(loan: Loan) {
  const returnDate = startOfDay(new Date(loan.return_date))
  const today = startOfDay(new Date())
  const daysRemaining = differenceInCalendarDays(returnDate, today)

  if (loan.late_days > 0 || daysRemaining < 0) {
    const overdueDays = loan.late_days > 0 ? loan.late_days : Math.abs(daysRemaining)
    return {
      type: 'overdue' as const,
      label: `Overdue by ${overdueDays} ${overdueDays === 1 ? 'day' : 'days'}`,
      sublabel: 'Please return to the library as soon as possible',
      badgeClass: 'bg-red-100 text-red-700 border-red-300',
      borderClass: 'border-red-300 bg-red-50/30',
      dateBoxClass: 'bg-red-50 border-red-200 text-red-800',
      daysRemaining,
    }
  }

  if (daysRemaining === 0) {
    return {
      type: 'due-soon' as const,
      label: 'Due Today!',
      sublabel: 'Return or extend your loan today',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      borderClass: 'border-amber-300 bg-amber-50/20',
      dateBoxClass: 'bg-amber-50 border-amber-200 text-amber-900',
      daysRemaining,
    }
  }

  if (daysRemaining <= 3) {
    return {
      type: 'due-soon' as const,
      label: `Due in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}`,
      sublabel: 'Return deadline approaching soon',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      borderClass: 'border-amber-200 bg-white',
      dateBoxClass: 'bg-amber-50/80 border-amber-200 text-amber-900',
      daysRemaining,
    }
  }

  return {
    type: 'active' as const,
    label: `${daysRemaining} days left`,
    sublabel: 'Active loan on schedule',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    borderClass: 'border-blue-100 bg-white',
    dateBoxClass: 'bg-red-50/60 border-red-200 text-red-700',
    daysRemaining,
  }
}

function LoanCard({
  loan,
  onExtend
}: {
  loan: Loan
  onExtend: (loanId: number) => Promise<ExtendLoanResponse>
}) {
  const [isExtending, setIsExtending] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const status = getLoanTimingStatus(loan)

  const handleExtend = async () => {
    setIsExtending(true)
    try {
      const res = await onExtend(loan.id)
      if (res?.status === "error") {
        toast({
          title: "Unable to Extend Loan",
          description: `${res?.reason || 'Could not extend this loan.'}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Loan Extended!",
          description: `The return due date for "${loan.book.title}" has been extended.`,
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error extending loan:', error)
      toast({
        title: "Error",
        description: "Failed to extend the loan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExtending(false)
    }
  }

  const formattedLoanDate = format(new Date(loan.loan_date), 'dd MMM yyyy')
  const formattedReturnDate = format(new Date(loan.return_date), 'dd MMM yyyy')

  return (
    <div
      className={`rounded-3xl border-2 p-5 sm:p-6 transition-all shadow-md hover:shadow-lg ${status.borderClass}`}
    >
      {/* Top Row: Call Number, Status Pill, Extension Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Barcode className="h-3.5 w-3.5 text-blue-600" />
            {loan.book.call_number || 'No Call #'}
          </span>

          {loan.has_extended && (
            <Badge variant="outline" className="text-[11px] font-bold bg-indigo-50 text-indigo-700 border-indigo-200 rounded-full">
              Extended 1x
            </Badge>
          )}
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold border ${status.badgeClass}`}
        >
          {status.type === 'overdue' ? (
            <AlertTriangle className="h-3.5 w-3.5" />
          ) : status.type === 'due-soon' ? (
            <Clock className="h-3.5 w-3.5" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5" />
          )}
          {status.label}
        </span>
      </div>

      {/* Book Title */}
      <h3 className="font-display text-xl font-extrabold text-blue-950 leading-snug mb-4">
        {loan.book.title}
      </h3>

      {/* Dates & Fine Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div className="rounded-2xl p-3.5 bg-blue-50/60 border border-blue-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
              Borrowed Date
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">
              {formattedLoanDate}
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-3.5 border flex items-center gap-3 ${status.dateBoxClass}`}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider opacity-85">
              Return Due Date
            </div>
            <div className="text-sm font-extrabold mt-0.5">
              {formattedReturnDate}
            </div>
          </div>
        </div>
      </div>

      {/* Fine Alert if applicable */}
      {(loan.late_days > 0 || loan.fine_amount > 0) && (
        <div className="mb-4 rounded-2xl bg-red-100/90 border border-red-300 px-4 py-3 flex items-center justify-between text-red-900 text-sm">
          <div className="flex items-center gap-2 font-bold">
            <DollarSign className="h-4 w-4 text-red-600 shrink-0" />
            <span>Overdue Fine ({loan.late_days} days late)</span>
          </div>
          <span className="font-extrabold font-mono text-base">
            ${Math.abs(loan.fine_amount).toFixed(2)}
          </span>
        </div>
      )}

      {/* Action Footer: Extend Loan Button or Status Note */}
      <div className="pt-3 border-t border-blue-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500">
          {!loan.has_extended
            ? 'Want more time to read? Extend your loan online!'
            : 'This book loan has already been extended once.'}
        </span>

        {!loan.has_extended ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold rounded-full px-6 shadow-md shadow-red-500/20 gap-2 sm:w-auto w-full transition-transform hover:scale-105"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Extend Loan</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-white border-2 border-blue-100 rounded-3xl sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl font-extrabold text-blue-950">
                  Extend Your Book Loan
                </DialogTitle>
                <DialogDescription className="text-slate-600 pt-1 font-medium">
                  Would you like to extend the return due date for{' '}
                  <span className="font-bold text-blue-700">"{loan.book.title}"</span>?
                </DialogDescription>
              </DialogHeader>

              <div className="my-2 rounded-2xl bg-gradient-to-r from-blue-50 to-red-50 p-4 border border-blue-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Call Number:</span>
                  <span className="font-mono font-bold text-blue-800">{loan.book.call_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Current Return Date:</span>
                  <span className="font-extrabold text-red-600">{formattedReturnDate}</span>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-full border-blue-200 font-bold text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExtend}
                  disabled={isExtending}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-full gap-2 shadow-md"
                >
                  <RefreshCw className={`h-4 w-4 ${isExtending ? 'animate-spin' : ''}`} />
                  {isExtending ? "Extending..." : "Confirm Extension"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            variant="outline"
            disabled
            className="rounded-full border-slate-200 text-slate-400 font-bold sm:w-auto w-full"
          >
            Already Extended
          </Button>
        )}
      </div>
    </div>
  )
}

export default function MemberProfile() {
  const { user } = useAuth()
  const router = useRouter()
  const blog_url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT
  const [outstandingLoans, setOutstandingLoans] = useState<Loan[]>([])
  const [isLoadingLoans, setIsLoadingLoans] = useState<boolean>(true)

  async function queryMember() {
    setIsLoadingLoans(true)
    try {
      const response = await fetch(
        `${blog_url}/svt_api/webhook?scope=member_outstanding_loans&uid=${user?.uid}`,
        {
          headers: {
            'content-type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const dataList = await response.json()
      setOutstandingLoans(Array.isArray(dataList) ? dataList : [])
    } catch (error) {
      console.error('An error occurred', error)
    } finally {
      setIsLoadingLoans(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      Cookies.remove(PHX_COOKIE)
      router.push('/signIn')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleExtendLoan = async (loanId: number): Promise<ExtendLoanResponse> => {
    try {
      const response = await fetch(
        `${blog_url}/svt_api/webhook?scope=extend_book&loan_id=${loanId}`,
        {
          headers: {
            'content-type': 'application/json',
          },
        }
      )

      const responseData: ExtendLoanResponse = await response.json()

      if (!response.ok) {
        return { status: 'error', reason: 'Failed to extend loan' }
      }

      await queryMember() // Refresh the loan list
      return responseData
    } catch (error) {
      console.error('Error extending loan:', error)
      return { status: 'error', reason: 'An unexpected error occurred' }
    }
  }

  useEffect(() => {
    if (user) {
      queryMember()
    } else {
      setIsLoadingLoans(false)
    }
  }, [user])

  // Summary metrics
  const totalLoans = outstandingLoans.length
  const dueSoonOrOverdueCount = outstandingLoans.filter((l) => {
    const s = getLoanTimingStatus(l)
    return s.type === 'overdue' || s.type === 'due-soon'
  }).length
  const extendableCount = outstandingLoans.filter((l) => !l.has_extended).length

  const memberName = user?.userStruct?.name || user?.username || 'Library Member'
  const memberEmail = user?.userStruct?.email || ''
  const memberCode = user?.userStruct?.code || 'Member'

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-blue-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-extrabold uppercase tracking-widest text-red-600 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Member Loan Portal</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-blue-950">
            My Loans & Return Dates
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 font-medium">
            See when your borrowed books are due back and extend active loans with one click!
          </p>
        </div>

        <Link href="/books">
          <Button className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 shadow-md gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Browse More Books</span>
          </Button>
        </Link>
      </div>

      {/* Quick Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-5 flex items-center gap-4 shadow-md shadow-blue-900/5">
          <div className="h-13 w-13 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shrink-0 p-3.5 shadow-md shadow-blue-600/20">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
              Active Loans
            </div>
            <div className="font-display text-2xl font-extrabold text-slate-900">
              {totalLoans} {totalLoans === 1 ? 'Book' : 'Books'}
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-red-100 rounded-3xl p-5 flex items-center gap-4 shadow-md shadow-red-900/5">
          <div
            className={`h-13 w-13 rounded-2xl flex items-center justify-center shrink-0 p-3.5 shadow-md ${
              dueSoonOrOverdueCount > 0
                ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/20'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/20'
            }`}
          >
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-red-500">
              Return Schedule
            </div>
            <div className="font-display text-2xl font-extrabold text-slate-900">
              {dueSoonOrOverdueCount === 0 ? 'All On Time!' : `${dueSoonOrOverdueCount} Due Soon`}
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-indigo-100 rounded-3xl p-5 flex items-center gap-4 shadow-md shadow-indigo-900/5">
          <div className="h-13 w-13 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shrink-0 p-3.5 shadow-md shadow-indigo-500/20">
            <RefreshCw className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
              Can Extend Online
            </div>
            <div className="font-display text-2xl font-extrabold text-slate-900">
              {extendableCount} {extendableCount === 1 ? 'Loan' : 'Loans'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Grid: Member Card (Left) + Loans List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Library Membership Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border-2 border-blue-100 rounded-3xl overflow-hidden shadow-xl shadow-blue-900/5">
            {/* Digital Library Card Header */}
            <div className="bg-gradient-to-br from-blue-900 via-indigo-800 to-red-700 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-200">
                  PMC Library Pass
                </span>
                <UserCheck className="h-4 w-4 text-red-300" />
              </div>

              <div className="flex items-center gap-4">
                <Avatar className="h-15 w-15 border-2 border-white/40 bg-red-500 text-white shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-red-500 to-rose-600 text-white font-display text-xl font-extrabold">
                    {memberName?.[0]?.toUpperCase() || 'M'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h2 className="font-display text-xl font-extrabold text-white truncate">
                    {memberName}
                  </h2>
                  {memberEmail && (
                    <p className="text-xs text-blue-100 truncate mt-0.5 font-medium">
                      {memberEmail}
                    </p>
                  )}
                </div>
              </div>

              {memberCode && (
                <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-between text-xs">
                  <span className="text-blue-100 font-semibold">Member Code</span>
                  <span className="font-mono font-extrabold text-white bg-white/20 px-3 py-1 rounded-full">
                    {memberCode}
                  </span>
                </div>
              )}
            </div>

            {/* Member Actions */}
            <div className="p-5 space-y-2.5 bg-white">
              <Link href="/profile/edit" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2.5 rounded-2xl border-blue-100 text-blue-900 hover:bg-blue-50 font-bold h-11"
                >
                  <Settings className="h-4 w-4 text-blue-600" />
                  <span>Edit My Profile</span>
                </Button>
              </Link>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="w-full justify-start gap-2.5 rounded-2xl text-red-600 hover:bg-red-50 hover:text-red-700 font-bold h-11"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>

          {/* Helpful Borrowing Policy Note */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-red-50 border-2 border-blue-100 p-5 space-y-2">
            <h3 className="font-display font-extrabold text-blue-950 text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-red-500" />
              Quick Loan Tip
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Each borrowed book can be extended online once before its return due date. Returning books on time helps everyone in our community enjoy them!
            </p>
          </div>
        </div>

        {/* Right Column: Outstanding Loans List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-extrabold text-blue-950 flex items-center gap-2.5">
              <BookOpen className="h-6 w-6 text-red-500" />
              <span>Your Borrowed Books</span>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={queryMember}
              className="text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-full gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingLoans ? 'animate-spin' : ''}`} />
              <span>Refresh List</span>
            </Button>
          </div>

          {isLoadingLoans ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white border-2 border-blue-100 rounded-3xl p-6 animate-pulse space-y-4">
                  <div className="h-4 w-1/4 bg-blue-100 rounded-full" />
                  <div className="h-6 w-2/3 bg-blue-100 rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-14 bg-blue-50 rounded-2xl" />
                    <div className="h-14 bg-red-50 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : outstandingLoans.length === 0 ? (
            <div className="bg-white border-2 border-blue-100 rounded-3xl p-10 text-center space-y-4 shadow-sm">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-display text-xl font-extrabold text-blue-950">
                  No Active Loans Right Now!
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  You don't have any borrowed books due for return. Ready to discover your next favorite read?
                </p>
              </div>
              <div className="pt-2">
                <Link href="/books">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-full px-7 shadow-md gap-2">
                    <span>Explore Book Catalogue</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {outstandingLoans.map((loan) => (
                <LoanCard key={loan.id} loan={loan} onExtend={handleExtendLoan} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}