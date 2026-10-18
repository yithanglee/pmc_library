'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Calendar,
  User,
  Hash,
  DollarSign,
  ArrowLeft,
  Building2,
  CheckCircle2,
  XCircle,
  Layers,
  Info,
  Clock
} from 'lucide-react'
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'

interface BookData {
  book: {
    title: string
    description?: string
    inserted_at: string
    isbn?: string
    price: number
  }
  author: {
    name: string
    bio?: string
  }
  publisher: {
    name: string
  }
  book_category: {
    name: string
    description: string
    book_count: number
  }
  available: boolean
  code: string
  book_images: Array<{ img_url: string }>
}

async function getBookData(id: string): Promise<BookData> {
  const res = await fetch(`${PHX_HTTP_PROTOCOL}${PHX_ENDPOINT}/svt_api/webhook?scope=book_data&bi=${id}`)
  if (!res.ok) {
    throw new Error('Failed to fetch book data')
  }
  return res.json()
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const [bookData, setBookData] = useState<BookData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const data = await getBookData(params.id)
        setBookData(data)
      } catch (err) {
        setError('Failed to fetch book data')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto animate-pulse space-y-8">
          <div className="h-5 w-36 bg-stone-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 aspect-[3/4] bg-stone-200 rounded-2xl" />
            <div className="md:col-span-8 space-y-4">
              <div className="h-6 w-32 bg-stone-200 rounded-full" />
              <div className="h-10 w-3/4 bg-stone-200 rounded" />
              <div className="h-5 w-1/3 bg-stone-200 rounded" />
              <div className="h-32 w-full bg-stone-200 rounded-xl mt-6" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !bookData) {
    router.push('/404')
    return null
  }

  const { book, author, publisher, book_category, available, code, book_images } = bookData
  const coverUrl =
    book_images && book_images.length > 0
      ? `${PHX_HTTP_PROTOCOL}${PHX_ENDPOINT}/${book_images[0].img_url.replace(/^\//, '')}`
      : null

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Back navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 -ml-3 gap-2 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Catalogue</span>
          </Button>
        </div>

        {/* Main Book Showcase Card */}
        <div className="paper-card rounded-3xl p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Book Cover */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="w-full max-w-[280px] aspect-[3/4] rounded-2xl bg-[#F5F0E6] border border-stone-200/80 overflow-hidden book-shadow flex items-center justify-center relative">
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={`Cover of ${book.title}`}
                    width={320}
                    height={440}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <BookOpen className="w-16 h-16 text-stone-400/80 mb-3 stroke-[1.25]" />
                    <span className="font-serif text-sm text-stone-500 font-medium">
                      {book.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Availability Status Card under cover */}
              <div
                className={`w-full max-w-[280px] mt-5 rounded-xl p-3.5 border flex items-center justify-between ${
                  available
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/70 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {available ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-amber-600 shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider">
                      {available ? 'Available on Shelf' : 'Currently Checked Out'}
                    </div>
                    <div className="text-[11px] opacity-80">
                      Call No: <span className="font-mono font-semibold">{code}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Book Details & Metadata */}
            <div className="md:col-span-8 flex flex-col justify-between space-y-6">
              <div>
                {/* Category & Availability Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {book_category?.name && (
                    <Badge
                      variant="secondary"
                      className="bg-rose-900/10 text-rose-900 hover:bg-rose-900/15 border border-rose-900/15 px-3 py-1 text-xs font-semibold"
                    >
                      {book_category.name}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={
                      available
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        : 'border-amber-300 bg-amber-50 text-amber-800'
                    }
                  >
                    {available ? 'Available for Loan' : 'On Loan'}
                  </Badge>
                </div>

                {/* Title & Author */}
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
                  {book.title}
                </h1>
                <p className="text-lg text-stone-600 mt-1.5 flex items-center gap-2">
                  <span>By</span>
                  <span className="font-semibold text-stone-900">
                    {author?.name || 'Unknown Author'}
                  </span>
                </p>

                {/* Description / Synopsis */}
                {book.description ? (
                  <div className="mt-6 pt-6 border-t border-stone-200/80">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2.5">
                      About This Book
                    </h2>
                    <p className="text-stone-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                      {book.description}
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 pt-6 border-t border-stone-200/80">
                    <p className="text-sm text-stone-500 italic">
                      No synopsis provided for this volume. Visit the library shelf at call number{' '}
                      <span className="font-mono font-semibold text-stone-700">{code}</span> to browse this book in person.
                    </p>
                  </div>
                )}

                {/* Catalogue Metadata Grid */}
                <div className="mt-6 pt-6 border-t border-stone-200/80">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3.5">
                    Catalogue Record
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="bg-[#FAF7F2] border border-stone-200/70 rounded-xl p-3.5 flex items-start gap-3">
                      <Hash className="h-4 w-4 text-rose-800 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs text-stone-400">Call Number / Barcode</div>
                        <div className="text-sm font-mono font-semibold text-stone-900 mt-0.5">
                          {code || 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FAF7F2] border border-stone-200/70 rounded-xl p-3.5 flex items-start gap-3">
                      <Building2 className="h-4 w-4 text-rose-800 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs text-stone-400">Publisher</div>
                        <div className="text-sm font-medium text-stone-900 mt-0.5">
                          {publisher?.name || 'Not specified'}
                        </div>
                      </div>
                    </div>

                    {book.isbn && (
                      <div className="bg-[#FAF7F2] border border-stone-200/70 rounded-xl p-3.5 flex items-start gap-3">
                        <BookOpen className="h-4 w-4 text-rose-800 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs text-stone-400">ISBN</div>
                          <div className="text-sm font-mono font-medium text-stone-900 mt-0.5">
                            {book.isbn}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-[#FAF7F2] border border-stone-200/70 rounded-xl p-3.5 flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-rose-800 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs text-stone-400">Catalogued Date</div>
                        <div className="text-sm font-medium text-stone-900 mt-0.5">
                          {book.inserted_at
                            ? new Date(book.inserted_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {book.price > 0 && (
                      <div className="bg-[#FAF7F2] border border-stone-200/70 rounded-xl p-3.5 flex items-start gap-3">
                        <DollarSign className="h-4 w-4 text-rose-800 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs text-stone-400">Reference Value</div>
                          <div className="text-sm font-medium text-stone-900 mt-0.5">
                            RM {book.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Borrowing Guidance Callout */}
              <div className="pt-4 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50/80 p-4 rounded-2xl border">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-rose-800 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-stone-600">
                    {available ? (
                      <>
                        <span className="font-semibold text-stone-900">Ready to borrow:</span> Locate this book using call number{' '}
                        <span className="font-mono font-semibold text-stone-800">{code}</span> at the library desk.
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-stone-900">Currently on loan:</span> If you have borrowed this book, you can check its return due date or extend it in your member portal.
                      </>
                    )}
                  </div>
                </div>

                <Link href={user ? '/profile' : '/signIn'} className="shrink-0">
                  <Button
                    variant={available ? 'default' : 'outline'}
                    className={
                      available
                        ? 'bg-rose-900 hover:bg-rose-800 text-white rounded-xl w-full sm:w-auto'
                        : 'border-stone-300 text-stone-800 hover:bg-stone-100 rounded-xl w-full sm:w-auto'
                    }
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {user ? 'My Loans' : 'Member Login'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Info Cards: Category & Author Bio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {book_category && (
            <div className="paper-card rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-800 mb-2">
                <Layers className="h-4 w-4" />
                <span>Collection Shelf</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                {book_category.name}
              </h3>
              {book_category.description && (
                <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                  {book_category.description}
                </p>
              )}
              <div className="inline-flex items-center gap-2 text-xs font-medium text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg">
                <BookOpen className="h-3.5 w-3.5 text-stone-600" />
                <span>{book_category.book_count} books in this category</span>
              </div>
            </div>
          )}

          {author?.bio && (
            <div className="paper-card rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-800 mb-2">
                <User className="h-4 w-4" />
                <span>About the Author</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                {author.name}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">{author.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
