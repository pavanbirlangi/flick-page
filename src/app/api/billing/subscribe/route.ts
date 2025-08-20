import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

function getPlanId(plan: 'pro' | 'premium') {
  if (plan === 'pro') return process.env.RAZORPAY_PLAN_ID_PRO
  if (plan === 'premium') return process.env.RAZORPAY_PLAN_ID_PREMIUM
  return undefined
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { plan } = body as { plan?: 'pro' | 'premium' }
    if (!plan || (plan !== 'pro' && plan !== 'premium')) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const planId = getPlanId(plan)
    if (!planId) {
      return NextResponse.json({ error: 'Razorpay plan id not configured' }, { status: 500 })
    }

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
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create subscription in Razorpay (test/live based on keys)
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
    const payload = {
      plan_id: planId,
      total_count: 12,        // number of billing cycles (12 months). 0 is invalid.
      customer_notify: 1,
      notes: { user_id: user.id }
    }

    const res = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      let details: any = undefined
      try { details = await res.json() } catch { details = await res.text() }
      return NextResponse.json({ error: 'Razorpay error', details, sent: payload }, { status: 502 })
    }

    const subscription = await res.json() as any

    // Upsert subscription row in DB with trialing status
    await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: user.id,
        plan: plan,
        status: 'trialing',
        payment_provider: 'razorpay',
        provider_subscription_id: subscription.id,
        provider_plan_id: planId,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    return NextResponse.json({
      subscription_id: subscription.id,
      razorpay_key_id: keyId,
      status: 'created'
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
