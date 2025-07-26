import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host') || ''
  
  // Skip middleware for static assets and API routes
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/favicon.ico') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  
  console.log('🚀 Middleware running - Host:', hostname, 'Path:', url.pathname)
  
  const mainDomain = 'flavorr.in'

  // Handle main domain requests
  if (hostname === mainDomain || hostname === `www.${mainDomain}`) {
    console.log('✅ Main domain request')
    return NextResponse.next()
  }

  // Extract subdomain
  const parts = hostname.split('.')
  if (parts.length < 3) {
    console.log('❌ No subdomain detected')
    return NextResponse.next()
  }

  const subdomain = parts[0]
  
  // Skip invalid subdomains
  if (!subdomain || subdomain === 'www' || subdomain.length < 2) {
    console.log('❌ Invalid subdomain')
    return NextResponse.next()
  }

  console.log('🔄 Valid subdomain detected:', subdomain)

  // Create rewrite URL
  if (url.pathname === '/') {
    url.pathname = `/${subdomain}`
  } else {
    url.pathname = `/${subdomain}${url.pathname}`
  }

  console.log('📍 Rewriting to:', url.pathname)

  // Create response with no-cache headers to prevent caching issues
  const response = NextResponse.rewrite(url)
  
  // Prevent caching of middleware responses
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  
  // Add debug header
  response.headers.set('x-middleware-rewrite', url.pathname)
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any file with an extension (like .png, .css, .js)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}