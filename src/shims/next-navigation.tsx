import { useRouter as useTanstackRouter, useLocation } from '@tanstack/react-router'
import { useMemo } from 'react'

export function useRouter() {
  const router = useTanstackRouter()

  return useMemo(() => ({
    push: (href: string) => {
      // Tanstack router accepts a string path or { to: string }
      // If href contains query or hash, handle it properly
      if (typeof href === 'string') {
        const [pathname, searchWithHash] = href.split('?')
        let search = ''
        let hash = ''
        if (searchWithHash) {
          const [s, h] = searchWithHash.split('#')
          search = s || ''
          hash = h || ''
        }
        const searchObj: Record<string, string> = {}
        if (search) {
          const sp = new URLSearchParams(search)
          sp.forEach((val, key) => {
            searchObj[key] = val
          })
        }
        router.navigate({
          to: pathname || '/',
          search: searchObj,
          hash: hash ? `#${hash}` : undefined,
        })
      } else {
        router.navigate(href as any)
      }
    },
    replace: (href: string) => {
      if (typeof href === 'string') {
        const [pathname, searchWithHash] = href.split('?')
        let search = ''
        let hash = ''
        if (searchWithHash) {
          const [s, h] = searchWithHash.split('#')
          search = s || ''
          hash = h || ''
        }
        const searchObj: Record<string, string> = {}
        if (search) {
          const sp = new URLSearchParams(search)
          sp.forEach((val, key) => {
            searchObj[key] = val
          })
        }
        router.navigate({
          to: pathname || '/',
          search: searchObj,
          hash: hash ? `#${hash}` : undefined,
          replace: true,
        })
      } else {
        router.navigate({ ...(href as any), replace: true })
      }
    },
    back: () => {
      router.history.back()
    },
    forward: () => {
      router.history.forward()
    },
    refresh: () => {
      router.invalidate()
    },
    prefetch: () => {},
  }), [router])
}

export function usePathname(): string {
  const location = useLocation()
  return location.pathname
}

export function useSearchParams(): URLSearchParams {
  const location = useLocation()
  return useMemo(() => {
    // If location has search object, serialize it; or fall back to window.location.search
    if (typeof location.search === 'object' && location.search !== null && Object.keys(location.search).length > 0) {
      const sp = new URLSearchParams()
      for (const [k, v] of Object.entries(location.search)) {
        if (v !== undefined && v !== null) {
          sp.set(k, String(v))
        }
      }
      return sp
    }
    return new URLSearchParams(window.location.search)
  }, [location.search])
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  const router = useTanstackRouter()
  const currentMatch = router.state.matches[router.state.matches.length - 1]
  return (currentMatch?.params || {}) as T
}

export function notFound() {
  throw new Error('NEXT_NOT_FOUND')
}

export function redirect(url: string) {
  window.location.href = url
}
