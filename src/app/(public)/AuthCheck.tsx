"use client"

import { useFirebaseAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user } = useFirebaseAuth()
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