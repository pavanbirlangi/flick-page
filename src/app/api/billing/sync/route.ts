import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function POST() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 })
  }

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
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: sub } = await supabase
    .from('user_subscriptions')
    .select('id, plan, status, provider_subscription_id')
    .eq('user_id', user.id)
    .single()

  if (!sub?.provider_subscription_id) {
    return NextResponse.json({ message: 'No subscription to sync' })
  }

  // Fetch live status from Razorpay
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
  const resp = await fetch(`https://api.razorpay.com/v1/subscriptions/${sub.provider_subscription_id}`, {
    headers: { 'Authorization': `Basic ${auth}` }
  })

  if (!resp.ok) {
    let details: unknown = undefined
    try { details = await resp.json() } catch { details = await resp.text() }
    return NextResponse.json({ error: 'Razorpay fetch error', details }, { status: 502 })
  }

  const entity: { status: string, current_start?: number, current_end?: number } = await resp.json()
  // Map Razorpay status to our enum
  let newStatus: 'trialing'|'active'|'past_due'|'canceled'|'expired' = 'trialing'
  switch (entity.status) {
    case 'active': newStatus = 'active'; break
    case 'halted':
    case 'paused':
    case 'cancelled': newStatus = 'canceled'; break
    case 'completed':
    case 'expired': newStatus = 'expired'; break
    default: newStatus = 'trialing';
  }

  await supabase
    .from('user_subscriptions')
    .update({
      status: newStatus,
      current_period_start: entity.current_start ? new Date(entity.current_start * 1000).toISOString() : null,
      current_period_end: entity.current_end ? new Date(entity.current_end * 1000).toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq('id', sub.id)

  return NextResponse.json({ status: newStatus })
}
