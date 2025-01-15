import Header from '@/components/ui/header'
import { AuthProvider } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <Header />
      {children}
    </AuthProvider>
  )
}