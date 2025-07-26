import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host')!
  const mainDomain = 'flavorr.in'

  console.log('🔍 Hostname:', hostname)
  console.log('🔍 Original path:', url.pathname)

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