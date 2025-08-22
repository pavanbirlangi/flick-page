import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// rank helper not used in API; client computes accessibility

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

  // default to basic if not logged in
  let userPlan: 'basic'|'pro'|'premium' = 'basic'

  if (user) {
    const { data: sub } = await supabase
      .from('user_subscriptions')
      .select('plan, status, current_period_end')
      .eq('user_id', user.id)
      .single()

    // Only grant access if subscription is ACTIVE (payment confirmed)
    // trialing status means payment is pending/processing
    if (sub?.plan && sub?.status === 'active') {
      userPlan = sub.plan as 'basic'|'pro'|'premium'
    }
  }

  const { data: templates, error } = await supabase
    .from('templates')
    .select('*')
    .eq('is_active', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Return ALL active templates; client will compute lock state
  return NextResponse.json({ plan: userPlan, templates: templates || [] })
}
