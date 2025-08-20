import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ plan: 'basic', status: 'expired' })

  const { data: sub } = await supabase
    .from('user_subscriptions')
    .select('plan, status, current_period_end')
    .eq('user_id', user.id)
    .single()

  if (!sub) return NextResponse.json({ plan: 'basic', status: 'expired' })

  return NextResponse.json({ plan: sub.plan, status: sub.status, current_period_end: sub.current_period_end })
}
