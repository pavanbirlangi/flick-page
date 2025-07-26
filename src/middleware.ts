import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  try {
    const url = req.nextUrl.clone()
    const hostname = req.headers.get('host')
    
    console.log('🚀 Middleware running - Host:', hostname, 'Path:', url.pathname)
    
    // Return early for static assets and API routes
    if (
      url.pathname.startsWith('/_next/') ||
      url.pathname.startsWith('/api/') ||
      url.pathname.startsWith('/favicon.ico') ||
      url.pathname.includes('.')
    ) {
      return NextResponse.next()
    }
    
    if (!hostname) {
      console.log('❌ No hostname found')
      return NextResponse.next()
    }
    
    const mainDomain = 'flavorr.in'

    // Handle main domain requests
    if (hostname === mainDomain || hostname === `www.${mainDomain}`) {
      console.log('✅ Main domain request')
      return NextResponse.next()
    }

    // Extract subdomain
    const parts = hostname.split('.')
    if (parts.length < 3) {
      console.log('❌ No subdomain detected, parts:', parts)
      return NextResponse.next()
    }

    const subdomain = parts[0]
    
    // Validate subdomain
    if (!subdomain || subdomain === 'www' || subdomain.length < 2) {
      console.log('❌ Invalid subdomain:', subdomain)
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

    // Create response
    const response = NextResponse.rewrite(url)
    
    // Add debug headers
    response.headers.set('x-middleware-ran', 'true')
    response.headers.set('x-middleware-subdomain', subdomain)
    response.headers.set('x-middleware-rewrite', url.pathname)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    
    return response
    
  } catch (error) {
    console.error('💥 Middleware error:', error)
    // Return next() instead of throwing to prevent 500 errors
    return NextResponse.next()
  }
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