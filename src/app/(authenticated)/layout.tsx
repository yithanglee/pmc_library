import Header from '@/components/ui/header'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pl-4">
        {children}
      </main>
    </>
  )
}