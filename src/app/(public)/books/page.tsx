"use client"

import { populateData } from '@/components/data/populateData'
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from '@/lib/constants'
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

  // Categories
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState<string>('All Collections')
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
      setSelectedCategoryTitle('All Collections')
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
      setSelectedCategoryTitle('All Collections')
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

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-20">
      {/* Catalogue Header Banner */}
      <div className="bg-[#FAF6EE] border-b border-stone-200/80 py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-rose-800 mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Community Library Collection</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                Book Catalogue
              </h1>
              <p className="text-sm sm:text-base text-stone-600 mt-1">
                Browse by category or search across titles, authors, and publishers.
              </p>
            </div>

            {/* Search Bar Form */}
            <form onSubmit={handleApplySearch} className="w-full md:max-w-xl">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="relative flex-grow">
                    <Search className="h-4 w-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Search by book title..."
                      value={titleSearch}
                      onChange={(e) => setTitleSearch(e.target.value)}
                      className="pl-10 h-11 bg-white border-stone-300 rounded-xl text-sm focus-visible:ring-rose-800"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    className={`h-11 px-3.5 rounded-xl border-stone-300 bg-white text-stone-700 hover:bg-stone-100 ${
                      showAdvancedSearch || authorSearch || publisherSearch
                        ? 'border-rose-800 text-rose-900 bg-rose-50/50'
                        : ''
                    }`}
                    title="Filter by Author or Publisher"
                  >
                    <SlidersHorizontal className="h-4 w-4 sm:mr-1.5" />
                    <span className="hidden sm:inline text-xs font-medium">More Filters</span>
                  </Button>
                  <Button
                    type="submit"
                    className="h-11 px-5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-medium text-sm shadow-sm"
                  >
                    Search
                  </Button>
                </div>

                {/* Collapsible Author & Publisher filters */}
                {showAdvancedSearch && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 animate-in fade-in slide-in-from-top-1">
                    <div className="relative">
                      <User className="h-3.5 w-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder="Filter by author name..."
                        value={authorSearch}
                        onChange={(e) => setAuthorSearch(e.target.value)}
                        className="pl-9 h-9 bg-white border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="relative">
                      <Building2 className="h-3.5 w-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder="Filter by publisher..."
                        value={publisherSearch}
                        onChange={(e) => setPublisherSearch(e.target.value)}
                        className="pl-9 h-9 bg-white border-stone-300 rounded-lg text-xs"
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
            className="w-full justify-between bg-white border-stone-300 rounded-xl h-11 text-stone-800"
          >
            <span className="flex items-center gap-2 text-sm font-medium truncate">
              <Filter className="h-4 w-4 text-rose-800 shrink-0" />
              <span>Category: {selectedCategoryTitle}</span>
            </span>
            <span className="text-xs text-stone-500 ml-2 shrink-0">
              {showMobileCategories ? 'Hide' : 'Change'}
            </span>
          </Button>

          {showMobileCategories && (
            <div className="mt-2 paper-card rounded-2xl p-4 max-h-80 overflow-y-auto space-y-1.5">
              <Input
                placeholder="Filter categories..."
                value={categoryFilterText}
                onChange={(e) => setCategoryFilterText(e.target.value)}
                className="h-9 text-xs mb-2 bg-stone-50"
              />
              <button
                type="button"
                onClick={() => handleSelectCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                  !selectedCategoryId
                    ? 'bg-rose-900 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                All Collections
              </button>
              {filteredCategories.map((cat) => {
                const active = String(cat.id) === String(selectedCategoryId)
                return (
                  <button
                    key={cat.id || cat.code}
                    type="button"
                    onClick={() => handleSelectCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${
                      active
                        ? 'bg-rose-900 text-white font-medium'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span
                      className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                        active ? 'bg-rose-800 text-rose-100' : 'bg-stone-100 text-stone-600'
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
            <div className="paper-card rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-stone-200/80 bg-[#FAF7F2]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-rose-800" />
                    <span>Categories</span>
                  </h2>
                  <span className="text-xs text-stone-500 font-medium">
                    {categories.length} shelves
                  </span>
                </div>
                <div className="relative">
                  <Search className="h-3.5 w-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder="Find category..."
                    value={categoryFilterText}
                    onChange={(e) => setCategoryFilterText(e.target.value)}
                    className="pl-8 h-8 text-xs bg-white border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-2 space-y-0.5">
                <button
                  type="button"
                  onClick={() => handleSelectCategory(null)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors flex items-center justify-between ${
                    !selectedCategoryId
                      ? 'bg-rose-900 text-white font-semibold shadow-sm'
                      : 'text-stone-700 hover:bg-stone-100 font-medium'
                  }`}
                >
                  <span>All Collections</span>
                </button>

                {filteredCategories.map((item) => {
                  const isSelected = String(item.id) === String(selectedCategoryId)
                  return (
                    <button
                      key={item.id || item.code}
                      type="button"
                      onClick={() => handleSelectCategory(item)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-start gap-2.5 group ${
                        isSelected
                          ? 'bg-rose-900 text-white font-medium shadow-sm'
                          : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span
                        className={`text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded mt-0.5 shrink-0 ${
                          isSelected
                            ? 'bg-rose-800 text-rose-100'
                            : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
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
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200/80">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  Currently Browsing
                </div>
                <h2 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                  {selectedCategoryTitle}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {hasActiveSearch && (
                  <>
                    {appliedFilters.title && (
                      <Badge variant="secondary" className="bg-rose-900/10 text-rose-900 border-rose-200 gap-1 px-2.5 py-1">
                        Title: {appliedFilters.title}
                      </Badge>
                    )}
                    {appliedFilters.author && (
                      <Badge variant="secondary" className="bg-rose-900/10 text-rose-900 border-rose-200 gap-1 px-2.5 py-1">
                        Author: {appliedFilters.author}
                      </Badge>
                    )}
                    {appliedFilters.publisher && (
                      <Badge variant="secondary" className="bg-rose-900/10 text-rose-900 border-rose-200 gap-1 px-2.5 py-1">
                        Publisher: {appliedFilters.publisher}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearSearch}
                      className="h-7 px-2 text-xs text-stone-500 hover:text-rose-900"
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Clear filters
                    </Button>
                  </>
                )}

                {!isLoading && totalRecords > 0 && (
                  <span className="text-xs font-medium text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full">
                    Showing page {currentPage} of {totalPages}
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
                    className="paper-card rounded-2xl p-3.5 space-y-3 animate-pulse"
                  >
                    <div className="aspect-[3/4] w-full rounded-xl bg-stone-200/70" />
                    <div className="h-3 w-1/2 rounded bg-stone-200" />
                    <div className="h-4 w-full rounded bg-stone-200" />
                    <div className="h-3 w-2/3 rounded bg-stone-200" />
                  </div>
                ))}
              </div>
            ) : books.length === 0 ? (
              /* Empty State */
              <div className="paper-card rounded-2xl p-12 text-center my-4">
                <div className="h-14 w-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">
                  No books found matching your criteria
                </h3>
                <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
                  Try clearing your search filters or selecting another category shelf from the sidebar.
                </p>
                <div className="flex justify-center gap-3">
                  {hasActiveSearch && (
                    <Button variant="outline" onClick={handleClearSearch}>
                      Clear Search Filters
                    </Button>
                  )}
                  {selectedCategoryId && (
                    <Button
                      className="bg-rose-900 hover:bg-rose-800 text-white"
                      onClick={() => handleSelectCategory(null)}
                    >
                      View All Collections
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
                    const bookTitle = item.book?.title || 'Untitled Volume'
                    const authorName = item.author?.name || 'Unknown Author'
                    const categoryName = item.book_category?.name
                    const barcode = item.code

                    return (
                      <Link
                        key={item.id}
                        href={`/books/${item.id}/detail`}
                        className="group paper-card rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-stone-300"
                      >
                        <div>
                          {/* Book Cover Container */}
                          <div className="relative aspect-[3/4] w-full rounded-xl bg-[#F5F0E6] overflow-hidden mb-3.5 flex items-center justify-center border border-stone-200/60">
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
                                <BookOpen className="h-10 w-10 text-stone-400/80 mb-2 stroke-[1.5]" />
                                <span className="font-serif text-xs text-stone-500 line-clamp-2 px-2">
                                  {bookTitle}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Category Tag */}
                          {categoryName && (
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-800/90 truncate mb-1">
                              {categoryName}
                            </div>
                          )}

                          {/* Book Title */}
                          <h3 className="font-serif font-bold text-stone-900 text-base leading-snug line-clamp-2 group-hover:text-rose-900 transition-colors">
                            {bookTitle}
                          </h3>

                          {/* Author */}
                          <p className="text-xs text-stone-500 mt-1 truncate">
                            {authorName}
                          </p>
                        </div>

                        {/* Footer Call No / Barcode */}
                        {barcode && (
                          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                            <span className="flex items-center gap-1 truncate">
                              <Barcode className="h-3 w-3 shrink-0" />
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
                  <div className="mt-10 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs sm:text-sm text-stone-500">
                      Page <span className="font-semibold text-stone-900">{currentPage}</span> of{' '}
                      <span className="font-semibold text-stone-900">{totalPages}</span>
                    </p>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="rounded-lg border-stone-300 bg-white text-stone-700"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
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
                              <span key={`ellipsis-${idx}`} className="px-2 text-xs text-stone-400">
                                …
                              </span>
                            ) : (
                              <Button
                                key={item}
                                variant={currentPage === item ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => handlePageChange(item as number)}
                                className={`h-8 w-8 p-0 rounded-lg text-xs font-medium ${
                                  currentPage === item
                                    ? 'bg-rose-900 text-white hover:bg-rose-800'
                                    : 'text-stone-600 hover:bg-stone-200/60'
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
                        className="rounded-lg border-stone-300 bg-white text-stone-700"
                      >
                        Next
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
