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
import { useLanguage } from '@/i18n'

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

function getLoanTimingStatus(loan: Loan, t: (zh: string, en: string) => string) {
  const returnDate = startOfDay(new Date(loan.return_date))
  const today = startOfDay(new Date())
  const daysRemaining = differenceInCalendarDays(returnDate, today)

  if (loan.late_days > 0 || daysRemaining < 0) {
    const overdueDays = loan.late_days > 0 ? loan.late_days : Math.abs(daysRemaining)
    return {
      type: 'overdue' as const,
      label: t(
        `已逾期 ${overdueDays} 天`,
        `Overdue by ${overdueDays} ${overdueDays === 1 ? 'day' : 'days'}`
      ),
      sublabel: t('请尽快归还至教会图书馆', 'Please return to the library as soon as possible'),
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      borderClass: 'border-amber-200 bg-amber-50/20',
      dateBoxClass: 'bg-amber-50/70 border-amber-200 text-amber-900',
      daysRemaining,
    }
  }

  if (daysRemaining === 0) {
    return {
      type: 'due-soon' as const,
      label: t('今日到期', 'Due Today'),
      sublabel: t('请于今日归还或线上续借', 'Return or extend your loan today'),
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      borderClass: 'border-amber-200 bg-white',
      dateBoxClass: 'bg-amber-50/60 border-amber-200 text-amber-900',
      daysRemaining,
    }
  }

  if (daysRemaining <= 3) {
    return {
      type: 'due-soon' as const,
      label: t(
        `剩余 ${daysRemaining} 天到期`,
        `Due in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}`
      ),
      sublabel: t('归还期限即将到来', 'Return deadline approaching soon'),
      badgeClass: 'bg-sky-50 text-[#0097bf] border-sky-200',
      borderClass: 'border-slate-200/80 bg-white',
      dateBoxClass: 'bg-sky-50/60 border-sky-200/70 text-slate-800',
      daysRemaining,
    }
  }

  return {
    type: 'active' as const,
    label: t(`还剩 ${daysRemaining} 天`, `${daysRemaining} days left`),
    sublabel: t('借阅期正常', 'Active loan on schedule'),
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    borderClass: 'border-slate-200/80 bg-white',
    dateBoxClass: 'bg-sky-50/60 border-sky-100 text-slate-800',
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
  const { t } = useLanguage()
  const [isExtending, setIsExtending] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const status = getLoanTimingStatus(loan, t)

  const handleExtend = async () => {
    setIsExtending(true)
    try {
      const res = await onExtend(loan.id)
      if (res?.status === "error") {
        toast({
          title: t("无法续借图书", "Unable to Extend Loan"),
          description: `${res?.reason || t('目前无法续借此书。', 'Could not extend this loan.')}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: t("续借成功！", "Loan Extended!"),
          description: t(
            `《${loan.book.title}》的应还日期已成功延长。`,
            `The return due date for "${loan.book.title}" has been extended.`
          ),
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error extending loan:', error)
      toast({
        title: t("错误", "Error"),
        description: t("续借失败，请稍后再试。", "Failed to extend the loan. Please try again."),
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
      className={`rounded-2xl border p-5 sm:p-6 transition-all shadow-sm hover:border-[#00bff2] ${status.borderClass}`}
    >
      {/* Top Row: Call Number, Status Pill, Extension Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1 rounded-full bg-sky-50 text-[#0097bf] border border-sky-100">
            <Barcode className="h-3.5 w-3.5 text-[#00bff2]" />
            {loan.book.call_number || t('无索书号', 'No Call #')}
          </span>

          {loan.has_extended && (
            <Badge variant="outline" className="text-[11px] font-medium bg-slate-50 text-slate-600 border-slate-200 rounded-full">
              {t('已续借 1 次', 'Extended 1x')}
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
      <h3 className="font-display text-lg sm:text-xl font-bold text-slate-800 leading-snug mb-4">
        {loan.book.title}
      </h3>

      {/* Dates & Fine Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl p-3.5 bg-[#fbfbfc] border border-slate-200/70 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {t('借出日期', 'Borrowed Date')}
            </div>
            <div className="text-sm font-semibold text-slate-800 mt-0.5">
              {formattedLoanDate}
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-3.5 border flex items-center gap-3 ${status.dateBoxClass}`}>
          <div className="h-9 w-9 rounded-lg bg-[#00bff2] text-white flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#0097bf]">
              {t('应还日期 (Due Date)', 'Return Due Date')}
            </div>
            <div className="text-sm font-bold mt-0.5">
              {formattedReturnDate}
            </div>
          </div>
        </div>
      </div>

      {/* Fine Alert if applicable */}
      {(loan.late_days > 0 || loan.fine_amount > 0) && (
        <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center justify-between text-amber-900 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <DollarSign className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              {t(`逾期罚款 (逾期 ${loan.late_days} 天)`, `Overdue Fine (${loan.late_days} days late)`)}
            </span>
          </div>
          <span className="font-bold font-mono text-base">
            RM {Math.abs(loan.fine_amount).toFixed(2)}
          </span>
        </div>
      )}

      {/* Action Footer: Extend Loan Button or Status Note */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-slate-500">
          {!loan.has_extended
            ? t('需要更多阅读时间？可在线一键延长借阅期限。', 'Want more time to read? Extend your loan online.')
            : t('此书已续借过一次，请按应还日期归还。', 'This book loan has already been extended once.')}
        </span>

        {!loan.has_extended ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-[#00bff2] hover:bg-[#0097bf] text-white font-semibold rounded-full px-6 shadow-sm gap-2 sm:w-auto w-full transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>{t('一键线上续借', 'Extend Loan')}</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-white border border-slate-200 rounded-2xl sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-bold text-slate-800">
                  {t('延长图书借阅期限', 'Extend Your Book Loan')}
                </DialogTitle>
                <DialogDescription className="text-slate-500 pt-1">
                  {t('您确定要延长', 'Would you like to extend the return due date for')}{' '}
                  <span className="font-semibold text-[#0097bf]">“{loan.book.title}”</span>
                  {t(' 的应还日期吗？', '?')}
                </DialogDescription>
              </DialogHeader>

              <div className="my-2 rounded-xl bg-sky-50/60 p-4 border border-sky-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('索书号：', 'Call Number:')}</span>
                  <span className="font-mono font-semibold text-slate-800">{loan.book.call_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('当前应还日期：', 'Current Return Date:')}</span>
                  <span className="font-bold text-[#0097bf]">{formattedReturnDate}</span>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-full border-slate-200 font-medium text-slate-600"
                >
                  {t('取消', 'Cancel')}
                </Button>
                <Button
                  onClick={handleExtend}
                  disabled={isExtending}
                  className="bg-[#00bff2] hover:bg-[#0097bf] text-white font-semibold rounded-full gap-2 shadow-sm"
                >
                  <RefreshCw className={`h-4 w-4 ${isExtending ? 'animate-spin' : ''}`} />
                  {isExtending ? t("续借处理中...", "Extending...") : t("确认续借", "Confirm Extension")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            variant="outline"
            disabled
            className="rounded-full border-slate-200 text-slate-400 font-medium sm:w-auto w-full"
          >
            {t('已续借过', 'Already Extended')}
          </Button>
        )}
      </div>
    </div>
  )
}

export default function MemberProfile() {
  const { user } = useAuth()
  const { t } = useLanguage()
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
        return { status: 'error', reason: t('续借失败', 'Failed to extend loan') }
      }

      await queryMember() // Refresh the loan list
      return responseData
    } catch (error) {
      console.error('Error extending loan:', error)
      return { status: 'error', reason: t('发生未知错误', 'An unexpected error occurred') }
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
    const s = getLoanTimingStatus(l, t)
    return s.type === 'overdue' || s.type === 'due-soon'
  }).length
  const extendableCount = outstandingLoans.filter((l) => !l.has_extended).length

  const memberName = user?.userStruct?.name || user?.username || t('图书馆会友', 'Library Member')
  const memberEmail = user?.userStruct?.email || ''
  const memberCode = user?.userStruct?.code || t('会友', 'Member')

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-xs font-semibold uppercase tracking-widest text-[#0097bf] mb-2">
            <span>{t('宣道堂 会友借阅特区', 'Member Loan Portal')}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-800">
            {t('我的借阅与应还日期', 'My Loans & Return Dates')}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            {t(
              '随时查看所借书籍的应还日期，并可在线一键延长借阅期限。',
              'See when your borrowed books are due back and extend active loans with one click.'
            )}
          </p>
        </div>

        <Link href="/books">
          <Button className="rounded-full bg-[#00bff2] hover:bg-[#0097bf] text-white font-semibold px-6 shadow-sm gap-2">
            <BookOpen className="h-4 w-4" />
            <span>{t('浏览更多书籍', 'Browse More Books')}</span>
          </Button>
        </Link>
      </div>

      {/* Quick Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-sky-50 text-[#00bff2] border border-sky-100 flex items-center justify-center shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('当前借阅书籍', 'Active Loans')}
            </div>
            <div className="font-display text-2xl font-bold text-slate-800">
              {t(`${totalLoans} 本书`, `${totalLoans} ${totalLoans === 1 ? 'Book' : 'Books'}`)}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border ${
              dueSoonOrOverdueCount > 0
                ? 'bg-amber-50 text-amber-600 border-amber-100'
                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}
          >
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('归还状态提醒', 'Return Schedule')}
            </div>
            <div className="font-display text-2xl font-bold text-slate-800">
              {dueSoonOrOverdueCount === 0
                ? t('全部准时', 'All On Time')
                : t(`${dueSoonOrOverdueCount} 本即将到期`, `${dueSoonOrOverdueCount} Due Soon`)}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-sky-50 text-[#00bff2] border border-sky-100 flex items-center justify-center shrink-0">
            <RefreshCw className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('可线上续借', 'Can Extend Online')}
            </div>
            <div className="font-display text-2xl font-bold text-slate-800">
              {t(`${extendableCount} 本可续借`, `${extendableCount} ${extendableCount === 1 ? 'Loan' : 'Loans'}`)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Grid: Member Card (Left) + Loans List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Minimalist Library Membership Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
            {/* Digital Library Card Header */}
            <div className="bg-gradient-to-br from-[#00bff2] to-[#0097bf] p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-white/90">
                  {t('宣道堂图书馆 • 会友借书证', 'PMC Library Pass')}
                </span>
                <UserCheck className="h-4 w-4 text-white/90" />
              </div>

              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-white/50 bg-white/20 text-white">
                  <AvatarFallback className="bg-white/20 text-white font-display text-xl font-bold">
                    {memberName?.[0]?.toUpperCase() || 'M'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h2 className="font-display text-xl font-bold text-white truncate">
                    {memberName}
                  </h2>
                  {memberEmail && (
                    <p className="text-xs text-white/85 truncate mt-0.5">
                      {memberEmail}
                    </p>
                  )}
                </div>
              </div>

              {memberCode && (
                <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-between text-xs">
                  <span className="text-white/85">{t('会友编号', 'Member Code')}</span>
                  <span className="font-mono font-semibold text-white bg-white/20 px-3 py-1 rounded-full">
                    {memberCode}
                  </span>
                </div>
              )}
            </div>

            {/* Member Actions */}
            <div className="p-5 space-y-2 bg-white">
              <Link href="/profile/edit" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2.5 rounded-xl border-slate-200 text-slate-700 hover:border-[#00bff2] hover:text-[#0097bf] hover:bg-sky-50/40 font-medium h-11"
                >
                  <Settings className="h-4 w-4 text-[#00bff2]" />
                  <span>{t('编辑会友资料', 'Edit My Profile')}</span>
                </Button>
              </Link>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="w-full justify-start gap-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-medium h-11"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('退出登录', 'Sign Out')}</span>
              </Button>
            </div>
          </div>

          {/* Helpful Borrowing Policy Note */}
          <div className="rounded-2xl bg-sky-50/60 border border-sky-100 p-5 space-y-2">
            <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#00bff2]" />
              {t('借阅与续借温馨提示', 'Quick Loan Tip')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t(
                '每本借阅的图书在到期前均可在线免费续借一次。准时归还图书能让教会更多弟兄姐妹一同享受阅读的祝福。',
                'Each borrowed book can be extended online once before its return due date. Returning books on time helps everyone in our community enjoy them.'
              )}
            </p>
          </div>
        </div>

        {/* Right Column: Outstanding Loans List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-slate-800 flex items-center gap-2.5">
              <BookOpen className="h-5 w-5 text-[#00bff2]" />
              <span>{t('您当前借阅的书籍', 'Your Borrowed Books')}</span>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={queryMember}
              className="text-xs font-semibold text-[#0097bf] hover:bg-sky-50 rounded-full gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingLoans ? 'animate-spin' : ''}`} />
              <span>{t('刷新列表', 'Refresh List')}</span>
            </Button>
          </div>

          {isLoadingLoans ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white border border-slate-200/80 rounded-2xl p-6 animate-pulse space-y-4">
                  <div className="h-4 w-1/4 bg-slate-100 rounded-full" />
                  <div className="h-6 w-2/3 bg-slate-100 rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-14 bg-slate-50 rounded-xl" />
                    <div className="h-14 bg-sky-50/50 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : outstandingLoans.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center space-y-4 shadow-sm">
              <div className="h-14 w-14 rounded-xl bg-sky-50 text-[#00bff2] flex items-center justify-center mx-auto border border-sky-100">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-display text-lg font-bold text-slate-800">
                  {t('目前没有待归还的借阅书籍', 'No Active Loans Right Now')}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {t(
                    '您目前没有任何外借中的书籍。欢迎前往图书馆检索，发掘您的下一本好书。',
                    "You don't have any borrowed books due for return. Ready to discover your next favorite read?"
                  )}
                </p>
              </div>
              <div className="pt-2">
                <Link href="/books">
                  <Button className="bg-[#00bff2] hover:bg-[#0097bf] text-white font-semibold rounded-full px-7 shadow-sm gap-2">
                    <span>{t('进入教会图书馆检索', 'Explore Book Catalogue')}</span>
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