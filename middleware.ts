import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/appointment', '/medical-record']
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    // Check if JWT cookie exists
    const token = request.cookies.get('jwt')
    
    if (!token) {
      // Redirect to login if no token found
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Allow public routes and authenticated protected routes
  return NextResponse.next()
}

export const config = {
  // Match protected routes
  matcher: ['/dashboard/:path*', '/appointment/:path*', '/medical-record/:path*']
}
