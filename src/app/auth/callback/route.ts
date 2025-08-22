import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import { NextResponse } from 'next/server'

function getRequestOrigin(reqUrl: string, hdrs: Headers) {
  const url = new URL(reqUrl)
  const xfProto = hdrs.get('x-forwarded-proto')
  const xfHost = hdrs.get('x-forwarded-host')
  const proto = xfProto || url.protocol.replace(':','')
  const host = xfHost || url.host
  return `${proto}://${host}`
}

export async function GET(request: Request) {
  const hdrs = await headers()
  const search = new URL(request.url).searchParams
  const code = search.get('code')
  const returnUrl = search.get('returnUrl')
  const next = returnUrl || search.get('next') || '/dashboard'
  const origin = getRequestOrigin(request.url, hdrs)

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) }
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}