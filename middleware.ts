import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host')
  const mainDomain = 'flick.page' // Make sure this matches your actual domain

  // Prevent security issues
  if (!hostname) {
    return new Response(null, { status: 400, statusText: 'No hostname found' })
  }

  // Check if the hostname is the main domain or a subdomain
  if (hostname === mainDomain || hostname.startsWith('www.')) {
    // It's the main site, let it pass through
    return NextResponse.next()
  }

  // It's a subdomain, so rewrite to the dynamic route
  const subdomain = hostname.replace(`.${mainDomain}`, '')
  url.pathname = `/${subdomain}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}