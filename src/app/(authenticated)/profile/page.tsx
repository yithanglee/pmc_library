"use client"

import { useFirebaseAuth } from '@/context/authContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebaseConfig'
import { useRouter } from 'next/navigation'
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from '@/lib/constants'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Book, Calendar, DollarSign } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

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

function LoanCard({ loan, onExtend }: { loan: Loan; onExtend: (loanId: number) => Promise<void> }) {
  const [isExtending, setIsExtending] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const handleExtend = async () => {
    setIsExtending(true)
    try {
      await onExtend(loan.id)
      toast({
        title: "Loan Extended",
        description: `The loan for "${loan.book.title}" has been successfully extended.`,
      })
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

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{loan.book.title}</CardTitle>
        <CardDescription>{loan.book.call_number}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Loan: {format(new Date(loan.loan_date), 'dd/MM/yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Return: {format(new Date(loan.return_date), 'dd/MM/yyyy')}</span>
          </div>
          {loan.late_days > 0 && <div className="flex items-center col-span-2">
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Fine: ${Math.abs(loan.fine_amount).toFixed(2)}</span>
          </div>}

        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {!loan.has_extended && <DialogTrigger asChild>
            <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
              Extend Loan
            </Button>
          </DialogTrigger>}

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Extend Loan</DialogTitle>
              <DialogDescription>
                Are you sure you want to extend the loan for `{loan.book.title}`?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleExtend} disabled={isExtending}>
                {isExtending ? "Extending..." : "Confirm Extension"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

function OutstandingLoans({ loans, onExtend }: { loans: Loan[]; onExtend: (loanId: number) => Promise<void> }) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Book className="mr-2" />
          Outstanding Loans
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loans.length === 0 ? (
          <p>No outstanding loans.</p>
        ) : (
          loans.map((loan) => <LoanCard key={loan.id} loan={loan} onExtend={onExtend} />)
        )}
      </CardContent>
    </Card>
  )
}

export default function MemberProfile() {
  const { user } = useFirebaseAuth()
  const router = useRouter()
  const blog_url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT
  const [outstandingLoans, setOutstandingLoans] = useState<Loan[]>([])

  async function queryMember() {
    try {
      const response = await fetch(`${blog_url}/svt_api/webhook?scope=member_outstanding_loans&uid=${user.uid}`, {
        headers: {
          'content-type': 'application/json'
        },
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const dataList = await response.json()
      setOutstandingLoans(dataList)
    } catch (error) {
      console.error('An error occurred', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/signIn')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleExtendLoan = async (loanId: number) => {
    try {
      const response = await fetch(`${blog_url}/svt_api/webhook?scope=extend_book&loan_id=${loanId}`, {

      })


      if (!response.ok) {
        throw new Error('Failed to extend loan')
      }

      await queryMember() // Refresh the loan list
    } catch (error) {
      console.error('Error extending loan:', error)
      throw error
    }
  }

  useEffect(() => {
    if (user) {
      queryMember()
    }
  }, [user])

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Member Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
              <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user?.displayName || 'Anonymous User'}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
      <OutstandingLoans loans={outstandingLoans} onExtend={handleExtendLoan} />
    </div>
  )
}