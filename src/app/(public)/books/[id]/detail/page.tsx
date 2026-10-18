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
import { useLanguage } from '@/i18n'

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
  const { t } = useLanguage()

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
          <div className="h-5 w-36 bg-slate-200 rounded-full" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 aspect-[3/4] bg-slate-100 rounded-2xl" />
            <div className="md:col-span-8 space-y-4">
              <div className="h-6 w-32 bg-slate-100 rounded-full" />
              <div className="h-10 w-3/4 bg-slate-100 rounded-xl" />
              <div className="h-5 w-1/3 bg-slate-100 rounded-xl" />
              <div className="h-32 w-full bg-slate-100 rounded-xl mt-6" />
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
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Back navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-slate-600 hover:text-[#0097bf] hover:bg-sky-50/60 -ml-3 gap-2 text-sm font-medium rounded-full px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t('返回图书馆目录', 'Back to Book Catalogue')}</span>
          </Button>
        </div>

        {/* Main Book Showcase Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Book Cover */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="w-full max-w-[280px] aspect-[3/4] rounded-xl bg-[#fbfbfc] border border-slate-200/80 overflow-hidden book-shadow flex items-center justify-center relative">
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
                    <div className="h-14 w-14 rounded-xl bg-sky-50 flex items-center justify-center mb-3 text-[#00bff2]">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <span className="font-display text-sm text-slate-700 font-semibold">
                      {book.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Availability Status Card under cover */}
              <div
                className={`w-full max-w-[280px] mt-5 rounded-xl p-4 border flex items-center justify-between ${
                  available
                    ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900'
                    : 'bg-amber-50/60 border-amber-200/80 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {available ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-amber-600 shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider">
                      {available ? t('在架上 • 可借阅', 'Available on Shelf') : t('已借出 • 外借中', 'Currently Checked Out')}
                    </div>
                    <div className="text-xs opacity-85 mt-0.5">
                      {t('索书号', 'Call No')}: <span className="font-mono font-semibold">{code}</span>
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
                      className="bg-sky-50 text-[#0097bf] hover:bg-sky-100 border border-sky-200/70 px-3.5 py-1 text-xs font-semibold rounded-full"
                    >
                      {book_category.name}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={`rounded-full px-3.5 py-1 text-xs font-semibold ${
                      available
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                    }`}
                  >
                    {available ? t('可借阅 (Available)', 'Ready to Borrow') : t('外借中 (On Loan)', 'On Loan')}
                  </Badge>
                </div>

                {/* Title & Author */}
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
                  {book.title}
                </h1>
                <p className="text-base sm:text-lg text-slate-500 mt-1.5 flex items-center gap-2">
                  <span>{t('作者：', 'By')}</span>
                  <span className="font-semibold text-[#0097bf]">
                    {author?.name || t('未知作者', 'Unknown Author')}
                  </span>
                </p>

                {/* Description / Synopsis */}
                {book.description ? (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0097bf] mb-2.5">
                      {t('内容简介', 'About This Book')}
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                      {book.description}
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-sm text-slate-400 italic">
                      {t(
                        `暂无本书内容简介。欢迎前往教会图书馆书架（索书号：${code}）翻阅借读。`,
                        `No synopsis provided for this volume. Visit the library shelf at call number ${code} to check it out in person.`
                      )}
                    </p>
                  </div>
                )}

                {/* Catalogue Metadata Grid */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0097bf] mb-3.5">
                    {t('馆藏资料 (Catalogue Info)', 'Book Details')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="bg-[#fbfbfc] border border-slate-200/70 rounded-xl p-3.5 flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-sky-50 text-[#00bff2] flex items-center justify-center shrink-0">
                        <Hash className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">
                          {t('索书号 / 条码 (Call Number)', 'Call Number / Barcode')}
                        </div>
                        <div className="text-sm font-mono font-semibold text-slate-800 mt-0.5">
                          {code || 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#fbfbfc] border border-slate-200/70 rounded-xl p-3.5 flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-sky-50 text-[#00bff2] flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">
                          {t('出版社 (Publisher)', 'Publisher')}
                        </div>
                        <div className="text-sm font-semibold text-slate-800 mt-0.5">
                          {publisher?.name || t('未注明', 'Not specified')}
                        </div>
                      </div>
                    </div>

                    {book.isbn && (
                      <div className="bg-[#fbfbfc] border border-slate-200/70 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-sky-50 text-[#00bff2] flex items-center justify-center shrink-0">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">ISBN</div>
                          <div className="text-sm font-mono font-semibold text-slate-800 mt-0.5">
                            {book.isbn}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-[#fbfbfc] border border-slate-200/70 rounded-xl p-3.5 flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-sky-50 text-[#00bff2] flex items-center justify-center shrink-0">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">
                          {t('入库日期 (Added Date)', 'Added to Library')}
                        </div>
                        <div className="text-sm font-semibold text-slate-800 mt-0.5">
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
                      <div className="bg-[#fbfbfc] border border-slate-200/70 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-sky-50 text-[#00bff2] flex items-center justify-center shrink-0">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">
                            {t('参考价格', 'Book Value')}
                          </div>
                          <div className="text-sm font-semibold text-slate-800 mt-0.5">
                            RM {book.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Borrowing Guidance Callout */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-sky-50/60 p-5 rounded-xl border border-sky-100">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-[#00bff2] shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-slate-600">
                    {available ? (
                      <>
                        <span className="font-semibold text-slate-800">
                          {t('想要借阅这本书？', 'Want to borrow this book?')}
                        </span>{' '}
                        {t('请凭索书号 ', 'Find it on the shelf with call number ')}
                        <span className="font-mono font-semibold text-[#0097bf]">{code}</span>
                        {t(' 在教会图书馆书架上取阅并登记借出。', '.')}
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-slate-800">
                          {t('您正在借阅这本书？', 'Borrowed this book?')}
                        </span>{' '}
                        {t(
                          '请登录会友借阅特区查看应还日期或直接办理线上续借。',
                          'Log in to your member portal to check its return due date or extend your loan.'
                        )}
                      </>
                    )}
                  </div>
                </div>

                <Link href={user ? '/profile' : '/signIn'} className="shrink-0">
                  <Button
                    className="bg-[#00bff2] hover:bg-[#0097bf] text-white font-semibold rounded-full px-6 shadow-sm w-full sm:w-auto"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {user ? t('我的借阅', 'My Loans') : t('会友登录', 'Member Login')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Info Cards: Category & Author Bio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {book_category && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#0097bf] mb-2">
                <Layers className="h-4 w-4 text-[#00bff2]" />
                <span>{t('所属书籍分类', 'Collection Shelf')}</span>
              </div>
              <h3 className="font-display text-lg font-bold text-slate-800 mb-2">
                {book_category.name}
              </h3>
              {book_category.description && (
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  {book_category.description}
                </p>
              )}
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0097bf] bg-sky-50 border border-sky-100 px-3.5 py-1.5 rounded-full">
                <BookOpen className="h-3.5 w-3.5 text-[#00bff2]" />
                <span>
                  {t(
                    `此分类共有 ${book_category.book_count} 本藏书`,
                    `${book_category.book_count} books in this category`
                  )}
                </span>
              </div>
            </div>
          )}

          {author?.bio && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#0097bf] mb-2">
                <User className="h-4 w-4 text-[#00bff2]" />
                <span>{t('作者简介', 'About the Author')}</span>
              </div>
              <h3 className="font-display text-lg font-bold text-slate-800 mb-2">
                {author.name}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{author.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
