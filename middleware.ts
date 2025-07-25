import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host')
  
  const mainDomain = 'flavorr.in' // TODO: Change back to flick.page for production

  if (!hostname) {
    return new Response(null, { status: 400, statusText: 'No hostname found' })
  }

  // Get the subdomain from the hostname
  const subdomain = hostname.split('.')[0]

  // If it's the root domain or 'www', let it pass
  if (hostname.toLowerCase() === mainDomain || hostname.toLowerCase() === `www.${mainDomain}`) {
    url.pathname = `/`
    return NextResponse.rewrite(url)
  }
  
  // It's a valid subdomain, so rewrite to the dynamic user page
  url.pathname = `/${subdomain}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}