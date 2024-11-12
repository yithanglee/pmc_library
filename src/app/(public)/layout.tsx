import AuthCheck from '@/app/(public)/AuthCheck'
import Header from '@/components/ui/header'
import Image from 'next/image'
import Link from 'next/link'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <AuthCheck>
     <Header ></Header>
      {children}

    </AuthCheck>
  )
}