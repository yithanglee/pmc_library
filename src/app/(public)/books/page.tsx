"use client"

import { populateData } from '@/components/data/populateData'
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from '@/lib/constants'
import { useLanguage } from '@/i18n'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  User,
  Building2,
  Barcode,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react'

const ITEMS_PER_PAGE = 15

function buildQueryString(data: any, parentKey: any = null): string {
  return Object.keys(data)
    .map((key): any => {
      const nestedKey = parentKey
        ? `${parentKey}[${encodeURIComponent(key)}]`
        : encodeURIComponent(key)

      if (data[key] != null && typeof data[key] === 'object' && !Array.isArray(data[key])) {
        return buildQueryString(data[key], nestedKey)
      } else if (data[key] == null) {
        return ''
      } else {
        return `${nestedKey}=${encodeURIComponent(data[key])}`
      }
    })
    .filter(Boolean)
    .join('&')
}

export default function BooksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  // Categories
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState<string>('')
  const [categoryFilterText, setCategoryFilterText] = useState<string>('')
  const [showMobileCategories, setShowMobileCategories] = useState<boolean>(false)

  // Search Filters
  const [titleSearch, setTitleSearch] = useState<string>('')
  const [authorSearch, setAuthorSearch] = useState<string>('')
  const [publisherSearch, setPublisherSearch] = useState<string>('')
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false)

  // Active applied filters
  const [appliedFilters, setAppliedFilters] = useState<{
    title: string
    author: string
    publisher: string
  }>({ title: '', author: '', publisher: '' })

  // Books & Pagination
  const [books, setBooks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalRecords, setTotalRecords] = useState<number>(0)

  const baseUrl = `${PHX_HTTP_PROTOCOL}${PHX_ENDPOINT}`

  // Load categories
  useEffect(() => {
    populateData({ model: 'BookCategory' })
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          const sorted = [...res.data].sort((a: any, b: any) =>
            (a.code || '').localeCompare(b.code || '')
          )
          setCategories(sorted)
        }
      })
      .catch((err) => console.error('Failed to load categories:', err))
  }, [])

  // Sync URL params (category_code & page_no)
  useEffect(() => {
    const currentCategoryCode = searchParams.get('category_code')
    const pageNoParam = searchParams.get('page_no')
    if (pageNoParam) {
      const parsed = parseInt(pageNoParam, 10)
      if (!isNaN(parsed) && parsed > 0) {
        setCurrentPage(parsed)
      }
    }

    if (currentCategoryCode && categories.length > 0) {
      const matched = categories.find((c) => c.code === currentCategoryCode)
      if (matched) {
        setSelectedCategoryId(String(matched.id))
        setSelectedCategoryTitle(`${matched.code} — ${matched.name || ''}`)
      }
    } else if (!currentCategoryCode) {
      setSelectedCategoryId('')
      setSelectedCategoryTitle('')
    }
  }, [categories, searchParams])

  // Fetch Books Inventory
  const fetchBooks = useCallback(async () => {
    setIsLoading(true)
    try {
      const queryMap: Record<string, string> = {}
      if (selectedCategoryId) {
        queryMap['a.book_category_id'] = String(selectedCategoryId)
      }
      if (appliedFilters.title.trim()) {
        queryMap['b.title'] = appliedFilters.title.trim()
      }
      if (appliedFilters.author.trim()) {
        queryMap['c.name'] = appliedFilters.author.trim()
      }
      if (appliedFilters.publisher.trim()) {
        queryMap['d.name'] = appliedFilters.publisher.trim()
      }

      const slist = Object.entries(queryMap)
        .filter(([_, v]) => v)
        .map(([k, v]) => `${k}=${v}`)

      const additionalSearchQueries =
        slist.length > 0
          ? slist.join('|')
          : `a.book_category_id=${selectedCategoryId || ''}|b.title|c.name|d.name`

      const dataColumns: Record<number, { data: string; name: string }> = {
        0: { data: 'id', name: 'id' },
        1: { data: 'id', name: 'id' },
        2: { data: 'id', name: 'id' },
        3: { data: 'id', name: 'id' },
        4: { data: 'code', name: 'Barcode' },
      }

      const apiData = {
        search: { regex: 'false', value: queryMap },
        additional_join_statements: JSON.stringify([
          { book: 'book' },
          { author: 'author' },
          { publisher: 'publisher' },
        ]),
        additional_search_queries: Object.keys(queryMap).length === 0 ? {} : additionalSearchQueries,
        additional_order_statements: JSON.stringify([]),
        draw: '1',
        length: ITEMS_PER_PAGE,
        model: 'BookInventory',
        columns: dataColumns,
        order: { 0: { column: 0, dir: 'desc' } },
        preloads: JSON.stringify([
          'book',
          'book_category',
          'author',
          'publisher',
          'organization',
          'book_images',
        ]),
        start: (currentPage - 1) * ITEMS_PER_PAGE,
      }

      const queryString = buildQueryString(apiData).replaceAll('&&', '&')
      const response = await fetch(`${baseUrl}/svt_api/BookInventory?${queryString}`, {
        headers: { 'content-type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }

      const dataList = await response.json()
      const records = dataList?.data?.data || dataList?.data || []
      const totalFiltered =
        dataList?.data?.recordsFiltered ?? dataList?.recordsFiltered ?? records.length

      setBooks(Array.isArray(records) ? records : [])
      setTotalRecords(totalFiltered)
      setTotalPages(Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE)))
    } catch (err) {
      console.error('Error fetching catalogue:', err)
      setBooks([])
    } finally {
      setIsLoading(false)
    }
  }, [baseUrl, selectedCategoryId, appliedFilters, currentPage])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const handleSelectCategory = (cat: any | null) => {
    const currentParams = new URLSearchParams(searchParams)
    if (!cat) {
      setSelectedCategoryId('')
      setSelectedCategoryTitle('')
      currentParams.delete('category_code')
    } else {
      setSelectedCategoryId(String(cat.id))
      setSelectedCategoryTitle(`${cat.code} — ${cat.name || ''}`)
      currentParams.set('category_code', cat.code)
    }
    currentParams.set('page_no', '1')
    setCurrentPage(1)
    setShowMobileCategories(false)
    router.push(`/books?${currentParams.toString()}`)
  }

  const handleApplySearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setAppliedFilters({
      title: titleSearch,
      author: authorSearch,
      publisher: publisherSearch,
    })
    setCurrentPage(1)
    const currentParams = new URLSearchParams(searchParams)
    currentParams.set('page_no', '1')
    router.push(`/books?${currentParams.toString()}`)
  }

  const handleClearSearch = () => {
    setTitleSearch('')
    setAuthorSearch('')
    setPublisherSearch('')
    setAppliedFilters({ title: '', author: '', publisher: '' })
    setCurrentPage(1)
  }

  const handlePageChange = (newPage: number) => {
    const target = Math.max(1, Math.min(totalPages, newPage))
    setCurrentPage(target)
    const currentParams = new URLSearchParams(searchParams)
    currentParams.set('page_no', String(target))
    router.push(`/books?${currentParams.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filteredCategories = categories.filter((c) => {
    if (!categoryFilterText.trim()) return true
    const q = categoryFilterText.toLowerCase()
    return (
      (c.code && c.code.toLowerCase().includes(q)) ||
      (c.name && c.name.toLowerCase().includes(q))
    )
  })

  const hasActiveSearch =
    Boolean(appliedFilters.title) ||
    Boolean(appliedFilters.author) ||
    Boolean(appliedFilters.publisher)

  const displayCategoryTitle =
    selectedCategoryTitle || t('全部馆藏丛书 (All Collections)', 'All Collections')

  return (
    <div className="min-h-screen pb-20">
      {/* Lively Blue-Red Catalogue Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-red-800 text-white py-10 sm:py-12 shadow-md">
        <div className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-red-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-extrabold uppercase tracking-widest text-red-200 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-red-300" />
                <span>{t('卫理公会宣道堂 • 线上阅读', 'PMC Community Book Collection')}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {t('教会图书馆检索', 'Explore Our Library Books')}
              </h1>
              <p className="text-sm sm:text-base text-blue-100 mt-1.5 font-medium">
                {t(
                  '一览教会丛书：按分类浏览，或输入书名、作者、出版社进行搜索！',
                  'Pick a category shelf or search by title, author, and publisher!'
                )}
              </p>
            </div>

            {/* Search Bar Form */}
            <form onSubmit={handleApplySearch} className="w-full md:max-w-xl">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
                  <div className="relative flex-grow">
                    <Search className="h-4 w-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder={t('输入书名搜索 (Search by book title)...', 'Search by book title...')}
                      value={titleSearch}
                      onChange={(e) => setTitleSearch(e.target.value)}
                      className="pl-10 h-11 bg-white text-slate-900 border-0 rounded-xl text-sm font-medium focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    className={`h-11 px-3.5 rounded-xl border-0 font-bold ${
                      showAdvancedSearch || authorSearch || publisherSearch
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-white/90 text-slate-700 hover:bg-white'
                    }`}
                    title={t('按作者或出版社筛选', 'Filter by Author or Publisher')}
                  >
                    <SlidersHorizontal className="h-4 w-4 sm:mr-1.5 text-blue-600" />
                    <span className="hidden sm:inline text-xs">{t('更多筛选', 'Filters')}</span>
                  </Button>
                  <Button
                    type="submit"
                    className="h-11 px-6 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold text-sm shadow-md"
                  >
                    {t('搜索', 'Search')}
                  </Button>
                </div>

                {/* Collapsible Author & Publisher filters */}
                {showAdvancedSearch && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 animate-in fade-in slide-in-from-top-1">
                    <div className="relative">
                      <User className="h-3.5 w-3.5 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder={t('按作者姓名筛选 (Author)...', 'Filter by author name...')}
                        value={authorSearch}
                        onChange={(e) => setAuthorSearch(e.target.value)}
                        className="pl-9 h-10 bg-white text-slate-900 border-0 rounded-xl text-xs font-medium shadow-sm"
                      />
                    </div>
                    <div className="relative">
                      <Building2 className="h-3.5 w-3.5 text-red-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder={t('按出版社筛选 (Publisher)...', 'Filter by publisher...')}
                        value={publisherSearch}
                        onChange={(e) => setPublisherSearch(e.target.value)}
                        className="pl-9 h-10 bg-white text-slate-900 border-0 rounded-xl text-xs font-medium shadow-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Mobile Category Toggle */}
        <div className="lg:hidden mb-6">
          <Button
            variant="outline"
            onClick={() => setShowMobileCategories(!showMobileCategories)}
            className="w-full justify-between bg-white border-2 border-blue-200 rounded-2xl h-12 text-blue-950 shadow-sm"
          >
            <span className="flex items-center gap-2 text-sm font-bold truncate">
              <Filter className="h-4 w-4 text-red-500 shrink-0" />
              <span>
                {t('分类', 'Category')}: {displayCategoryTitle}
              </span>
            </span>
            <span className="text-xs font-bold text-blue-600 ml-2 shrink-0 bg-blue-50 px-2.5 py-1 rounded-full">
              {showMobileCategories ? t('收起', 'Hide') : t('切换分类', 'Change')}
            </span>
          </Button>

          {showMobileCategories && (
            <div className="mt-2 bg-white border-2 border-blue-100 shadow-xl rounded-2xl p-4 max-h-80 overflow-y-auto space-y-1.5">
              <Input
                placeholder={t('快速查找分类...', 'Quick find category...')}
                value={categoryFilterText}
                onChange={(e) => setCategoryFilterText(e.target.value)}
                className="h-9 text-xs mb-2 bg-blue-50/50 border-blue-200 rounded-xl"
              />
              <button
                type="button"
                onClick={() => handleSelectCategory(null)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                  !selectedCategoryId
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-blue-50'
                }`}
              >
                {t('全部馆藏丛书 (All)', 'All Collections')}
              </button>
              {filteredCategories.map((cat) => {
                const active = String(cat.id) === String(selectedCategoryId)
                return (
                  <button
                    key={cat.id || cat.code}
                    type="button"
                    onClick={() => handleSelectCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition flex items-center gap-2 ${
                      active
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-sm'
                        : 'text-slate-700 hover:bg-blue-50 font-medium'
                    }`}
                  >
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                        active ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {cat.code}
                    </span>
                    <span className="truncate">{cat.name}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Sidebar: Categories */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-28">
            <div className="bg-white border-2 border-blue-100 rounded-3xl overflow-hidden shadow-lg shadow-blue-900/5">
              <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50/80 to-red-50/50">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display font-extrabold text-base text-blue-950 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-red-500" />
                    <span>{t('书籍分类 (Categories)', 'Book Categories')}</span>
                  </h2>
                  <span className="text-xs bg-white text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
                    {categories.length}
                  </span>
                </div>
                <div className="relative">
                  <Search className="h-3.5 w-3.5 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder={t('查找分类代码或名称...', 'Find a shelf...')}
                    value={categoryFilterText}
                    onChange={(e) => setCategoryFilterText(e.target.value)}
                    className="pl-8 h-9 text-xs bg-white border-blue-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-2.5 space-y-1">
                <button
                  type="button"
                  onClick={() => handleSelectCategory(null)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between ${
                    !selectedCategoryId
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-600/20'
                      : 'text-slate-700 hover:bg-blue-50/70 font-bold'
                  }`}
                >
                  <span>{t('全部馆藏丛书 (All)', 'All Collections')}</span>
                </button>

                {filteredCategories.map((item) => {
                  const isSelected = String(item.id) === String(selectedCategoryId)
                  return (
                    <button
                      key={item.id || item.code}
                      type="button"
                      onClick={() => handleSelectCategory(item)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-start gap-2.5 group ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-600/20'
                          : 'text-slate-700 hover:bg-blue-50/70 font-medium'
                      }`}
                    >
                      <span
                        className={`text-[11px] font-mono font-extrabold px-1.5 py-0.5 rounded-md mt-0.5 shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-50 text-blue-700 group-hover:bg-blue-100'
                        }`}
                      >
                        {item.code}
                      </span>
                      <span className="leading-snug line-clamp-2">{item.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Right Column: Book Grid */}
          <div className="flex-1 w-full min-w-0">
            {/* Active Shelf & Filter Summary Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-blue-100">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-red-500">
                  {t('当前浏览分类', 'Currently Browsing')}
                </div>
                <h2 className="font-display text-2xl font-extrabold text-blue-950 mt-0.5">
                  {displayCategoryTitle}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {hasActiveSearch && (
                  <>
                    {appliedFilters.title && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-200 gap-1 px-3 py-1 font-bold rounded-full">
                        {t('书名', 'Title')}: {appliedFilters.title}
                      </Badge>
                    )}
                    {appliedFilters.author && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-200 gap-1 px-3 py-1 font-bold rounded-full">
                        {t('作者', 'Author')}: {appliedFilters.author}
                      </Badge>
                    )}
                    {appliedFilters.publisher && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-200 gap-1 px-3 py-1 font-bold rounded-full">
                        {t('出版社', 'Publisher')}: {appliedFilters.publisher}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearSearch}
                      className="h-7 px-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      {t('清除筛选', 'Clear filters')}
                    </Button>
                  </>
                )}

                {!isLoading && totalRecords > 0 && (
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full">
                    {t(`第 ${currentPage} / ${totalPages} 页`, `Page ${currentPage} of ${totalPages}`)}
                  </span>
                )}
              </div>
            </div>

            {/* Loading Skeleton */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-5">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-2 border-blue-50 rounded-2xl p-3.5 space-y-3 animate-pulse"
                  >
                    <div className="aspect-[3/4] w-full rounded-xl bg-blue-100/60" />
                    <div className="h-3 w-1/2 rounded bg-blue-100" />
                    <div className="h-4 w-full rounded bg-blue-100" />
                    <div className="h-3 w-2/3 rounded bg-blue-100" />
                  </div>
                ))}
              </div>
            ) : books.length === 0 ? (
              /* Empty State */
              <div className="bg-white border-2 border-blue-100 rounded-3xl p-12 text-center my-4 shadow-sm">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-50 to-red-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-extrabold text-blue-950 mb-1">
                  {t('未找到符合条件的书籍', 'No books found on this shelf')}
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 font-medium">
                  {t(
                    '请尝试清除搜索筛选条件，或从左侧选择其他书籍分类！',
                    'Try clearing your search filters or picking another category from the left!'
                  )}
                </p>
                <div className="flex justify-center gap-3">
                  {hasActiveSearch && (
                    <Button variant="outline" onClick={handleClearSearch} className="rounded-full font-bold border-blue-200 text-blue-700">
                      {t('清除搜索条件', 'Clear Search Filters')}
                    </Button>
                  )}
                  {selectedCategoryId && (
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold"
                      onClick={() => handleSelectCategory(null)}
                    >
                      {t('查看全部馆藏', 'View All Collections')}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              /* Books Grid */
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
                  {books.map((item) => {
                    const coverImg = item.book_images?.[0]?.img_url
                    const bookTitle = item.book?.title || t('未命名书籍', 'Untitled Volume')
                    const authorName = item.author?.name || t('未知作者', 'Unknown Author')
                    const categoryName = item.book_category?.name
                    const barcode = item.code

                    return (
                      <Link
                        key={item.id}
                        href={`/books/${item.id}/detail`}
                        className="group bg-white border-2 border-blue-100/80 rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-600/10 hover:border-blue-300"
                      >
                        <div>
                          {/* Book Cover Container */}
                          <div className="relative aspect-[3/4] w-full rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50/40 to-red-50 overflow-hidden mb-3.5 flex items-center justify-center border border-blue-100">
                            {coverImg ? (
                              <Image
                                src={`${baseUrl}${coverImg.startsWith('/') ? '' : '/'}${coverImg}`}
                                alt={bookTitle}
                                width={220}
                                height={300}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center p-4 text-center">
                                <div className="h-12 w-12 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center mb-2 text-blue-600">
                                  <BookOpen className="h-6 w-6" />
                                </div>
                                <span className="font-display font-bold text-xs text-blue-950/70 line-clamp-2 px-2">
                                  {bookTitle}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Category Tag */}
                          {categoryName && (
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-red-500 truncate mb-1">
                              {categoryName}
                            </div>
                          )}

                          {/* Book Title */}
                          <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {bookTitle}
                          </h3>

                          {/* Author */}
                          <p className="text-xs font-medium text-slate-500 mt-1 truncate">
                            {authorName}
                          </p>
                        </div>

                        {/* Footer Call No / Barcode */}
                        {barcode && (
                          <div className="mt-3 pt-2.5 border-t border-blue-50 flex items-center justify-between text-[11px] text-blue-700 font-mono font-bold">
                            <span className="flex items-center gap-1 truncate bg-blue-50/80 px-2 py-0.5 rounded-md">
                              <Barcode className="h-3 w-3 shrink-0 text-blue-500" />
                              {barcode}
                            </span>
                          </div>
                        )}
                      </Link>
                    )
                  })}
                </div>

                {/* Pagination Bar */}
                {totalPages > 1 && (
                  <div className="mt-10 pt-6 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs sm:text-sm font-semibold text-slate-600">
                      {t('当前显示第 ', 'Showing page ')}
                      <span className="font-extrabold text-blue-700">{currentPage}</span>
                      {t(' 页，共 ', ' of ')}
                      <span className="font-extrabold text-blue-700">{totalPages}</span>
                      {t(' 页', '')}
                    </p>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="rounded-full border-blue-200 bg-white text-blue-700 font-bold hover:bg-blue-50"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        {t('上一页', 'Prev')}
                      </Button>

                      {/* Page Numbers */}
                      <div className="hidden sm:flex items-center gap-1 px-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (p) =>
                              p === 1 ||
                              p === totalPages ||
                              Math.abs(p - currentPage) <= 1
                          )
                          .reduce((acc: (number | string)[], p, idx, arr) => {
                            if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                              acc.push('...')
                            }
                            acc.push(p)
                            return acc
                          }, [])
                          .map((item, idx) =>
                            item === '...' ? (
                              <span key={`ellipsis-${idx}`} className="px-2 text-xs text-slate-400 font-bold">
                                …
                              </span>
                            ) : (
                              <Button
                                key={item}
                                variant={currentPage === item ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => handlePageChange(item as number)}
                                className={`h-9 w-9 p-0 rounded-full text-xs font-bold ${
                                  currentPage === item
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                                }`}
                              >
                                {item}
                              </Button>
                            )
                          )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="rounded-full border-blue-200 bg-white text-blue-700 font-bold hover:bg-blue-50"
                      >
                        {t('下一页', 'Next')}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
