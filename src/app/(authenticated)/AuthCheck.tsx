"use client"

import { useFirebaseAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user } = useFirebaseAuth()
  const router = useRouter()

  useEffect(() => {
   
  }, [user, router])

  if (user === undefined) {
    // Still loading
    return <div>Loading...</div>
  }

  if (user === null) {
    // Not authenticated, but we'll redirect in the useEffect
    return null
  }

  // User is authenticated
  return <>{children}</>
}