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
    <div className="flex h-64 items-center justify-center">
      <div className="text-sm text-gray-500 animate-pulse">Loading...</div>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold text-blue-900 mb-2">404</h1>
      <p className="text-lg text-gray-600 mb-6">Page not found</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Go back home
      </Link>
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
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-red-100">
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
