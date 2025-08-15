import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                      req.nextUrl.pathname.startsWith('/register') ||
                      req.nextUrl.pathname.startsWith('/forgot-password')
    const isProtectedPage = req.nextUrl.pathname.startsWith('/dashboard') ||
                           req.nextUrl.pathname.startsWith('/exam') ||
                           req.nextUrl.pathname.startsWith('/battle')
    const isApiRoute = req.nextUrl.pathname.startsWith('/api')

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect unauthenticated users to login for protected pages
    if (isProtectedPage && !isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    // Handle API routes
    if (isApiRoute && !isAuth && !req.nextUrl.pathname.startsWith('/api/auth')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Allow access to admin routes only for admins
    if (req.nextUrl.pathname.startsWith('/dashboard/admin')) {
      if (!token?.role || !['ADMIN', 'SUPER_ADMIN'].includes(token.role as string)) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public pages
        const publicPaths = ['/', '/about', '/features', '/pricing', '/contact']
        if (publicPaths.includes(req.nextUrl.pathname)) {
          return true
        }
        
        // For auth pages and API auth routes, always allow
        if (req.nextUrl.pathname.startsWith('/api/auth') || 
            req.nextUrl.pathname.startsWith('/login') ||
            req.nextUrl.pathname.startsWith('/register') ||
            req.nextUrl.pathname.startsWith('/forgot-password')) {
          return true
        }

        // For protected routes, require token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    "/((?!_next/static|_next/image|favicon.ico|public|manifest.json|robots.txt).*)",
  ],
}