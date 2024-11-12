import AuthCheck from '@/app/(authenticated)/AuthCheck'
import Link from 'next/link'
import Image from 'next/image'
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-red-100">
        <header className="  flex justify-between items-center space-x-4 mx-auto">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">

            <Link href="/" className="flex items-center space-x-4">
              <Image
                src="/pmc_logo.png"
                alt="Pioneer Methodist Library"
                width={40}
                height={40}
              />
              <h1 className="text-2xl font-bold text-blue-800">PMC Library</h1>
            </Link>
            <nav className='pr-8' >
              <ul className="flex space-x-6">
                <li>
                  <Link href="/books" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Books
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </AuthCheck>
  )
}