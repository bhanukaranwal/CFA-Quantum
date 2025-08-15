import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    console.log(`Middleware: ${pathname}, Token: ${!!token}`)

    // Public routes that don't require authentication
    const publicRoutes = [
      '/',
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/about',
      '/contact',
      '/privacy',
      '/terms',
      '/help',
      '/api/auth',
      '/api/health',
      '/api/test',
    ]

    // API routes that don't require authentication
    const publicApiRoutes = [
      '/api/auth',
      '/api/health',
      '/api/test',
    ]

    // Check if the route is public
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(route + '/')
    )

    const isPublicApiRoute = publicApiRoutes.some(route =>
      pathname.startsWith(route)
    )

    // Allow public routes and public API routes
    if (isPublicRoute || isPublicApiRoute) {
      return NextResponse.next()
    }

    // Protect dashboard and authenticated routes
    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        const url = new URL('/login', req.url)
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
      }

      // Admin only routes
      const adminRoutes = ['/dashboard/admin']
      const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
      
      if (isAdminRoute && token.role !== 'ADMIN' && token.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // Protect API routes (except public ones)
    if (pathname.startsWith('/api/') && !isPublicApiRoute) {
      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      // Admin API routes
      const adminApiRoutes = ['/api/admin']
      const isAdminApiRoute = adminApiRoutes.some(route => pathname.startsWith(route))
      
      if (isAdminApiRoute && token.role !== 'ADMIN' && token.role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Always allow access to public routes and API auth routes
        if (
          pathname.startsWith('/api/auth') ||
          pathname === '/' ||
          pathname === '/login' ||
          pathname === '/register' ||
          pathname === '/forgot-password' ||
          pathname === '/reset-password' ||
          pathname.startsWith('/api/health') ||
          pathname.startsWith('/api/test')
        ) {
          return true
        }

        // For protected routes, require a valid token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - robots.txt, sitemap.xml, manifest.json, sw.js
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|robots.txt|sitemap.xml|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}
