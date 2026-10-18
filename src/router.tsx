import React, { Suspense } from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Link,
} from '@tanstack/react-router'
import { AuthProvider } from '@/lib/auth'
import { LanguageProvider, useLanguage } from '@/i18n'
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
  const { t } = useLanguage()
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
      <div className="h-9 w-9 animate-spin rounded-full border-3 border-slate-200 border-t-[#00bff2]" />
      <div className="text-sm font-medium text-slate-500">
        {t('正在加载图书馆目录...', 'Opening library catalogue...')}
      </div>
    </div>
  )
}

function NotFoundPage() {
  const { t } = useLanguage()
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-2xl bg-white p-10 shadow-sm border border-slate-200/80 max-w-md w-full">
        <div className="inline-block px-3 py-1 rounded-full bg-sky-50 text-xs font-semibold uppercase tracking-widest text-[#0097bf] mb-3">
          {t('找不到页面 • 404', 'Error 404')}
        </div>
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">
          {t('此页面不存在', 'Page Not Found')}
        </h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          {t(
            '抱歉，我们找不到您要浏览的书籍或页面。请返回主页或进入图书馆检索。',
            "We couldn't find the book shelf or page you were looking for. Let's get you back to the library."
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/books"
            className="px-6 py-2.5 bg-[#00bff2] hover:bg-[#0097bf] text-white text-sm font-semibold rounded-full transition shadow-sm"
          >
            {t('图书馆检索', 'Explore Books')}
          </Link>
          <Link
            to="/"
            className="px-6 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-full hover:bg-slate-200 transition"
          >
            {t('返回主页', 'Back Home')}
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
    <LanguageProvider>
      <AuthProvider>
        <div className="min-h-screen bg-[#fbfbfc] text-slate-800 flex flex-col">
          <Outlet />
          <Toaster />
        </div>
      </AuthProvider>
    </LanguageProvider>
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
