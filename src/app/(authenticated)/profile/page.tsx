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
      badgeClass: 'bg-red-100 text-red-900 border-red-300',
      borderClass: 'border-red-300 bg-red-50/30',
      dateBoxClass: 'bg-red-50 border-red-200 text-red-900',
      daysRemaining,
    }
  }

  if (daysRemaining === 0) {
    return {
      type: 'due-soon' as const,
      label: 'Due Today',
      sublabel: 'Return or extend your loan today',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
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
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      borderClass: 'border-amber-200/90 bg-white',
      dateBoxClass: 'bg-amber-50/80 border-amber-200 text-amber-900',
      daysRemaining,
    }
  }

  return {
    type: 'active' as const,
    label: `${daysRemaining} days remaining`,
    sublabel: 'Active loan on schedule',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    borderClass: 'border-stone-200/90 bg-white',
    dateBoxClass: 'bg-[#FAF7F2] border-stone-200/80 text-stone-900',
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
          title: "Loan Extended Successfully",
          description: `The return due date for "${loan.book.title}" has been updated.`,
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
      className={`rounded-2xl border p-5 sm:p-6 transition-all shadow-sm hover:shadow-md ${status.borderClass}`}
    >
      {/* Top Row: Call Number, Status Pill, Extension Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
            <Barcode className="h-3.5 w-3.5 text-stone-500" />
            {loan.book.call_number || 'No Call #'}
          </span>

          {loan.has_extended && (
            <Badge variant="outline" className="text-[11px] bg-stone-100 text-stone-600 border-stone-200">
              Already Extended
            </Badge>
          )}
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.badgeClass}`}
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
      <h3 className="font-serif text-xl font-bold text-stone-900 leading-snug mb-4">
        {loan.book.title}
      </h3>

      {/* Dates & Fine Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl p-3.5 bg-[#FAF7F2] border border-stone-200/70 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white border border-stone-200/80 flex items-center justify-center text-stone-500 shrink-0">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-stone-400">
              Borrowed On
            </div>
            <div className="text-sm font-semibold text-stone-800 mt-0.5">
              {formattedLoanDate}
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-3.5 border flex items-center gap-3 ${status.dateBoxClass}`}>
          <div className="h-9 w-9 rounded-lg bg-white/90 border border-current/15 flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider opacity-75">
              Return Due Date
            </div>
            <div className="text-sm font-bold mt-0.5">
              {formattedReturnDate}
            </div>
          </div>
        </div>
      </div>

      {/* Fine Alert if applicable */}
      {(loan.late_days > 0 || loan.fine_amount > 0) && (
        <div className="mb-4 rounded-xl bg-red-100/80 border border-red-200 px-4 py-3 flex items-center justify-between text-red-900 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <DollarSign className="h-4 w-4 text-red-700 shrink-0" />
            <span>Overdue Fine Accrued ({loan.late_days} days late)</span>
          </div>
          <span className="font-bold font-mono">
            ${Math.abs(loan.fine_amount).toFixed(2)}
          </span>
        </div>
      )}

      {/* Action Footer: Extend Loan Button or Status Note */}
      <div className="pt-3 border-t border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-stone-500">
          {!loan.has_extended
            ? 'Need more time? You can extend this loan once online.'
            : 'This loan has already been extended once.'}
        </span>

        {!loan.has_extended ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-rose-900 hover:bg-rose-800 text-white rounded-xl shadow-sm gap-2 sm:w-auto w-full"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Extend Loan</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-[#FDFBF7] border-stone-200 rounded-2xl sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl font-bold text-stone-900">
                  Extend Book Loan
                </DialogTitle>
                <DialogDescription className="text-stone-600 pt-1">
                  Would you like to extend your loan for{' '}
                  <span className="font-semibold text-stone-900">"{loan.book.title}"</span>?
                </DialogDescription>
              </DialogHeader>

              <div className="my-2 rounded-xl bg-white p-4 border border-stone-200/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Call Number:</span>
                  <span className="font-mono font-medium text-stone-900">{loan.book.call_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Current Return Due Date:</span>
                  <span className="font-semibold text-rose-900">{formattedReturnDate}</span>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-xl border-stone-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExtend}
                  disabled={isExtending}
                  className="bg-rose-900 hover:bg-rose-800 text-white rounded-xl gap-2"
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
            className="rounded-xl border-stone-200 text-stone-400 sm:w-auto w-full"
          >
            Extension Used
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-rose-800 mb-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Member Loan Portal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            My Loans & Return Schedule
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-1">
            Track your borrowed books, check upcoming return deadlines, and extend active loans.
          </p>
        </div>

        <Link href="/books">
          <Button variant="outline" className="rounded-xl border-stone-300 bg-white hover:bg-stone-100 text-stone-800 gap-2">
            <BookOpen className="h-4 w-4 text-rose-800" />
            <span>Browse More Books</span>
          </Button>
        </Link>
      </div>

      {/* Quick Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="paper-card rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-rose-900/10 text-rose-900 flex items-center justify-center shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Active Loans
            </div>
            <div className="font-serif text-2xl font-bold text-stone-900">
              {totalLoans} {totalLoans === 1 ? 'Book' : 'Books'}
            </div>
          </div>
        </div>

        <div className="paper-card rounded-2xl p-5 flex items-center gap-4">
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
              dueSoonOrOverdueCount > 0
                ? 'bg-amber-500/15 text-amber-800'
                : 'bg-emerald-500/10 text-emerald-800'
            }`}
          >
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Due Soon / Overdue
            </div>
            <div className="font-serif text-2xl font-bold text-stone-900">
              {dueSoonOrOverdueCount === 0 ? 'All On Time' : `${dueSoonOrOverdueCount} Attention`}
            </div>
          </div>
        </div>

        <div className="paper-card rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
            <RefreshCw className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Eligible to Extend
            </div>
            <div className="font-serif text-2xl font-bold text-stone-900">
              {extendableCount} {extendableCount === 1 ? 'Loan' : 'Loans'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Grid: Member Card (Left) + Loans List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Library Membership Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="paper-card rounded-2xl overflow-hidden">
            {/* Digital Library Card Header */}
            <div className="bg-gradient-to-br from-rose-950 via-rose-900 to-stone-900 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-rose-200/90">
                  PMC Community Library
                </span>
                <UserCheck className="h-4 w-4 text-rose-200" />
              </div>

              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-white/20 bg-rose-800 text-white">
                  <AvatarFallback className="bg-rose-800 text-white font-serif text-xl font-bold">
                    {memberName?.[0]?.toUpperCase() || 'M'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h2 className="font-serif text-xl font-bold text-white truncate">
                    {memberName}
                  </h2>
                  {memberEmail && (
                    <p className="text-xs text-rose-100/80 truncate mt-0.5">
                      {memberEmail}
                    </p>
                  )}
                </div>
              </div>

              {memberCode && (
                <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between text-xs">
                  <span className="text-rose-200/80">Member ID / Code</span>
                  <span className="font-mono font-semibold text-white bg-white/10 px-2.5 py-0.5 rounded">
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
                  className="w-full justify-start gap-2.5 rounded-xl border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900 h-10"
                >
                  <Settings className="h-4 w-4 text-stone-500" />
                  <span>Edit Personal Details</span>
                </Button>
              </Link>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="w-full justify-start gap-2.5 rounded-xl text-rose-800 hover:bg-rose-50 hover:text-rose-900 h-10"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out of Account</span>
              </Button>
            </div>
          </div>

          {/* Helpful Borrowing Policy Note */}
          <div className="rounded-2xl bg-[#FAF6EE] border border-stone-200/80 p-5 space-y-2">
            <h3 className="font-serif font-bold text-stone-900 text-base">
              Loan Renewal Guidelines
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Each borrowed book can be extended online once before its return due date. Please return books on time so other community members may enjoy them.
            </p>
          </div>
        </div>

        {/* Right Column: Outstanding Loans List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2.5">
              <BookOpen className="h-5 w-5 text-rose-800" />
              <span>Outstanding Loans</span>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={queryMember}
              className="text-xs text-stone-500 hover:text-stone-900 gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingLoans ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>

          {isLoadingLoans ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="paper-card rounded-2xl p-6 animate-pulse space-y-4">
                  <div className="h-4 w-1/4 bg-stone-200 rounded" />
                  <div className="h-6 w-2/3 bg-stone-200 rounded" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-14 bg-stone-200 rounded-xl" />
                    <div className="h-14 bg-stone-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : outstandingLoans.length === 0 ? (
            <div className="paper-card rounded-2xl p-10 text-center space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  No Outstanding Loans
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  You don't have any borrowed books due for return right now. Explore our catalogue to discover your next great read!
                </p>
              </div>
              <div className="pt-2">
                <Link href="/books">
                  <Button className="bg-rose-900 hover:bg-rose-800 text-white rounded-xl gap-2">
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