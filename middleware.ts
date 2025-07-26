import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host')!
  const mainDomain = 'flavorr.in'

  const subdomain = hostname.replace(`.${mainDomain}`, '')

  // Prevent rewrite for the main domain
  if (hostname === mainDomain) {
    return NextResponse.next()
  }

  url.pathname = `/${subdomain}`
  return NextResponse.rewrite(url)
}

export const config = {
  // A simpler matcher to ensure it runs
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}