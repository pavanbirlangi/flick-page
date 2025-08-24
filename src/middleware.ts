import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host')!
  const mainDomain = 'prfl.live'

  console.log('🔍 Hostname:', hostname)
  console.log('🔍 Original path:', url.pathname)
  // before subdomain rewrite
if (hostname.endsWith('ngrok-free.app') || hostname.endsWith('trycloudflare.com')) {
  return NextResponse.next();
}

  // Handle localhost development environment with subdomain support
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // Check if it's a local subdomain test (e.g., username.localhost:3000)
    const hostParts = hostname.split('.')
    
    if (hostParts.length > 1 && hostParts[1] === 'localhost') {
      // This is a local subdomain test (e.g., username.localhost:3000)
      const subdomain = hostParts[0]
      console.log('🖥️ Local subdomain detected:', subdomain)
      
      url.pathname = `/${subdomain}`
      console.log('📍 Local rewriting to:', url.pathname)
      
      const response = NextResponse.rewrite(url)
      response.headers.set('x-middleware-ran', 'true')
      response.headers.set('x-rewrite-to', url.pathname)
      response.headers.set('x-subdomain', subdomain)
      response.headers.set('x-local-dev', 'true')
      
      return response
    } else {
      // Regular localhost (e.g., localhost:3000)
      console.log('🖥️ Localhost detected - passing through')
      return NextResponse.next()
    }
  }

  // If the request is for the main domain OR the www subdomain, let it pass through.
  if (hostname.toLowerCase() === mainDomain || hostname.toLowerCase() === `www.${mainDomain}`) {
    console.log('✅ Main domain detected')
    return NextResponse.next()
  }

  // Otherwise, it's a user subdomain. Rewrite it to the dynamic user page.
  const subdomain = hostname.split('.')[0]
  console.log('🔄 Subdomain detected:', subdomain)
  
  url.pathname = `/${subdomain}`
  console.log('📍 Rewriting to:', url.pathname)

  const response = NextResponse.rewrite(url)
  
  // Add debug headers
  response.headers.set('x-middleware-ran', 'true')
  response.headers.set('x-rewrite-to', url.pathname)
  response.headers.set('x-subdomain', subdomain)
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}