import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host')!
  const mainDomain = 'flavorr.in' // Change to flick.page for production

  // If the request is for the main domain OR the www subdomain, let it pass through.
  if (hostname.toLowerCase() === mainDomain || hostname.toLowerCase() === `www.${mainDomain}`) {
    return NextResponse.next();
  }

  // Otherwise, it's a user subdomain. Rewrite it to the dynamic user page.
  const subdomain = hostname.split('.')[0]
  url.pathname = `/${subdomain}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}