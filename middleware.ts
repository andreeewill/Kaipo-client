import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if development mode is enabled via cookie
  const devModeCookie = request.cookies.get('dev_mode')
  console.log("🚀 ~ middleware ~ devModeCookie:", devModeCookie)
  console.log("🚀 ~ middleware ~ pathname:", pathname)
  const isDevMode = devModeCookie?.value === 'true'
  console.log("🚀 ~ middleware ~ isDevMode:", isDevMode)
  
  // Skip authentication check in development mode
  if (isDevMode) {
    console.log("🚀 ~ middleware ~ Dev mode enabled, allowing access")
    return NextResponse.next()
  }

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/appointment', '/medical-record']
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  console.log("🚀 ~ middleware ~ isProtectedRoute:", isProtectedRoute)
  
  if (isProtectedRoute) {
    // Check if JWT cookie exists
    const token = request.cookies.get('jwt')
    console.log("🚀 ~ middleware ~ token exists:", !!token)
    
    if (!token) {
      console.log("🚀 ~ middleware ~ No token found, redirecting to login")
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
