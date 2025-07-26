import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host')!
  const mainDomain = 'flavorr.in'

  console.log('Middleware running for:', hostname);

  // If it's the main domain or www, do nothing.
  if (hostname.toLowerCase() === mainDomain || hostname.toLowerCase() === `www.${mainDomain}`) {
    return NextResponse.next();
  }

  // For any other subdomain, we will temporarily REDIRECT to prove the logic works.
  const subdomain = hostname.split('.')[0]
  const redirectUrl = new URL(`/${subdomain}`, req.url) 

  console.log(`Redirecting to: ${redirectUrl.toString()}`);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}