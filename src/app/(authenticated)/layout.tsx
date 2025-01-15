import AuthCheck from '@/app/(authenticated)/AuthCheck'
import Link from 'next/link'
import Image from 'next/image'
import { AuthProvider } from '@/lib/auth'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/ui/header'
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pl-4">
        {children}
      </main>

      <Toaster />
    </AuthProvider>
  )
}