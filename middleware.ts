import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || ''
  
  console.log('🚀 MIDDLEWARE RUNNING!')
  console.log('Host:', hostname)
  console.log('URL:', req.url)
  console.log('Pathname:', req.nextUrl.pathname)
  
  // Handle both production and local development
  const isLocalhost = hostname.includes('localhost')
  const isProduction = hostname.includes('flavorr.in')
  
  if (!isLocalhost && !isProduction) {
    return NextResponse.next()
  }
  
  // Extract domain for comparison
  let mainDomain = ''
  if (isLocalhost) {
    mainDomain = 'localhost:3000'  // or just 'localhost' if port varies
  } else {
    mainDomain = 'flavorr.in'
  }
  
  // If it's the main domain, pass through
  if (hostname === mainDomain || hostname === `www.${mainDomain}`) {
    console.log('✅ Main domain - passing through')
    return NextResponse.next()
  }
  
  // Extract subdomain/username
  const username = hostname.split('.')[0]
  console.log('🔄 Username detected:', username)
  
  // Rewrite to [username] route
  const url = req.nextUrl.clone()
  url.pathname = `/${username}${url.pathname === '/' ? '' : url.pathname}`
  
  console.log('📍 Rewriting to:', url.pathname)
  
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}