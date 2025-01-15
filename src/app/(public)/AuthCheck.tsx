"use client"

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // if (user === null) {
    //   router.push('/signIn')
    // }
  }, [user, router])

  if (user === undefined) {
    // Still loading
    return <div>Loading...</div>
  }


  // User is authenticated
  return <>{children}</>
}