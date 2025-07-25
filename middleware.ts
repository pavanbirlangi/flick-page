import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host')
  
  console.log('🔍 Middleware Debug:')
  console.log('Hostname:', hostname)
  console.log('Original pathname:', url.pathname)
  
  const mainDomain = 'flavorr.in'

  if (!hostname) {
    return new Response(null, { status: 400, statusText: 'No hostname found' });
  }

  // If the request is for the main domain or www, let it pass through unchanged.
  if (hostname.toLowerCase() === mainDomain || hostname.toLowerCase() === `www.${mainDomain}`) {
    console.log('✅ Main domain - passing through')
    return NextResponse.next();
  }

  // Extract subdomain (username)
  const username = hostname.toLowerCase().split('.')[0]
  console.log('🔄 Username detected:', username)
  
  // Rewrite to your [username] dynamic route
  // If the pathname is already "/", rewrite to "/username"
  // If it's "/something", rewrite to "/username/something"
  if (url.pathname === '/') {
    url.pathname = `/${username}`
  } else {
    url.pathname = `/${username}${url.pathname}`
  }
  
  console.log('📍 Rewriting to:', url.pathname)
  
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}