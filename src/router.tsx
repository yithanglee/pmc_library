import React, { Suspense } from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Link,
  useNavigate,
} from '@tanstack/react-router'
import { AuthProvider } from '@/lib/auth'
import { Toaster } from '@/components/ui/toaster'
import AuthenticatedLayout from '@/app/(authenticated)/layout'
import PublicLayout from '@/app/(public)/layout'

// Lazy load pages
const LandingPage = React.lazy(() => import('@/app/page'))
const SignInPage = React.lazy(() => import('@/app/signIn/page'))
const SignUpPage = React.lazy(() => import('@/app/signUp/page'))
const ForgotPasswordPage = React.lazy(() => import('@/app/forgotPassword/page'))
const BooksPage = React.lazy(() => import('@/app/(public)/books/page'))
const BookDetailPage = React.lazy(() => import('@/app/(public)/books/[id]/detail/page'))
const ProfilePage = React.lazy(() => import('@/app/(authenticated)/profile/page'))
const EditProfilePage = React.lazy(() => import('@/app/(authenticated)/profile/edit/page'))

function PageFallback() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-rose-900" />
      <div className="text-sm font-medium text-stone-500">Opening library catalogue...</div>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-2xl bg-white p-10 shadow-sm border border-stone-200/80 max-w-md w-full">
        <div className="text-xs font-semibold uppercase tracking-widest text-rose-800 mb-2">Error 404</div>
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-3">Page Not Found</h1>
        <p className="text-sm text-stone-600 mb-8 leading-relaxed">
          We couldn't find the shelf or page you were looking for. It may have been moved or archived.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/books"
            className="px-5 py-2.5 bg-rose-900 text-white text-sm font-medium rounded-lg hover:bg-rose-800 transition shadow-sm"
          >
            Browse Books
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 bg-stone-100 text-stone-800 text-sm font-medium rounded-lg hover:bg-stone-200 transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}

function withSuspense(Component: React.ComponentType<any>, extraProps: Record<string, any> = {}) {
  return function SuspenseWrapper() {
    return (
      <Suspense fallback={<PageFallback />}>
        <Component {...extraProps} />
      </Suspense>
    )
  }
}

// Root Route
const rootRoute = createRootRoute({
  component: () => (
    <AuthProvider>
      <div className="min-h-screen bg-[#FDFBF7] text-stone-900 flex flex-col">
        <Outlet />
        <Toaster />
      </div>
    </AuthProvider>
  ),
  notFoundComponent: NotFoundPage,
})

// Public Standalone Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: withSuspense(LandingPage),
})

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signIn',
  component: withSuspense(SignInPage),
})

const signInLowercaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signin',
  component: withSuspense(SignInPage),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: withSuspense(SignInPage),
})

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signUp',
  component: withSuspense(SignUpPage),
})

const signUpLowercaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: withSuspense(SignUpPage),
})

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgotPassword',
  component: withSuspense(ForgotPasswordPage),
})

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/404',
  component: NotFoundPage,
})

// Public Layout Route
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: () => (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  ),
})

const booksRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/books',
  component: withSuspense(BooksPage),
})

const bookDetailRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/books/$id/detail',
  component: () => {
    const params = bookDetailRoute.useParams()
    return (
      <Suspense fallback={<PageFallback />}>
        <BookDetailPage params={{ id: params.id }} />
      </Suspense>
    )
  },
})

// Authenticated Layout Route
const authenticatedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  component: () => (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  ),
})

const profileRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/profile',
  component: withSuspense(ProfilePage),
})

const profileEditRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: '/profile/edit',
  component: withSuspense(EditProfilePage),
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  signInRoute,
  signInLowercaseRoute,
  loginRoute,
  signUpRoute,
  signUpLowercaseRoute,
  forgotPasswordRoute,
  notFoundRoute,
  publicLayoutRoute.addChildren([
    booksRoute,
    bookDetailRoute,
  ]),
  authenticatedLayoutRoute.addChildren([
    profileRoute,
    profileEditRoute,
  ]),
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
