import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import crypto from 'crypto'

function verifySignature(body: string, signature: string, secret?: string) {
  if (!secret) return false
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  return expected === signature
}

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  const rawBody = await request.text()
  const signature = request.headers.get('x-razorpay-signature') || ''

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)

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

  try {
    switch (event.event) {
      case 'subscription.activated': {
        const sub = event.payload.subscription.entity
        // Find user by provider_subscription_id
        await supabase
          .from('user_subscriptions')
          .update({
            status: 'active',
            current_period_start: new Date(sub.current_start * 1000).toISOString(),
            current_period_end: new Date(sub.current_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('provider_subscription_id', sub.id)
        break
      }
      case 'subscription.charged':
      case 'invoice.paid':
      case 'payment.captured': {
        const ent = event.payload.payment?.entity || event.payload.invoice?.entity
        const userId = event.payload?.payment?.entity?.notes?.user_id || event.payload?.subscription?.entity?.notes?.user_id
        if (ent) {
          await supabase.from('subscription_payments').insert({
            user_id: userId || null,
            provider: 'razorpay',
            provider_invoice_id: ent.id,
            provider_payment_id: ent.id,
            amount_cents: ent.amount || 0,
            currency: ent.currency || 'INR',
            status: ent.status || 'paid',
            paid_at: ent.captured ? new Date().toISOString() : null
          })
        }
        break
      }
      case 'subscription.paused':
      case 'subscription.halted':
      case 'subscription.cancelled':
      case 'subscription.completed':
      case 'subscription.expired': {
        const sub = event.payload.subscription.entity
        await supabase
          .from('user_subscriptions')
          .update({ status: event.event.includes('expired') ? 'expired' : 'canceled', updated_at: new Date().toISOString() })
          .eq('provider_subscription_id', sub.id)
        break
      }
      default:
        break
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Webhook handling error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
