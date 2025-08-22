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

  // Add comprehensive logging
  console.log('🔔 Webhook received:', {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
    bodyLength: rawBody.length,
    hasSignature: !!signature,
    hasSecret: !!secret
  })

  if (!verifySignature(rawBody, signature, secret)) {
    console.error('❌ Webhook signature verification failed')
    console.error('Expected signature:', signature)
    console.error('Secret configured:', !!secret)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  console.log('✅ Webhook signature verified successfully')

  const event = JSON.parse(rawBody)
  console.log('📦 Webhook event:', {
    event: event.event,
    eventId: event.id,
    timestamp: event.created_at,
    payload: JSON.stringify(event.payload, null, 2)
  })

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
        console.log('🔄 Processing subscription.activated event')
        const sub = event.payload.subscription.entity
        console.log('📋 Subscription details:', {
          id: sub.id,
          status: sub.status,
          planId: sub.plan_id,
          currentStart: sub.current_start,
          currentEnd: sub.current_end
        })
        // Only activate after payment is confirmed
        // This event is triggered when subscription is created, not when payment succeeds
        console.log('ℹ️ subscription.activated - no action taken (waiting for payment confirmation)')
        break
      }
      
      case 'subscription.charged': {
        console.log('💰 Processing subscription.charged event')
        const sub = event.payload.subscription.entity
        const payment = event.payload.payment?.entity
        
        // Extract user_id from subscription notes (this is the reliable source)
        const userId = sub.notes?.user_id
        
        console.log('💳 Subscription charged details:', {
          subscriptionId: sub.id,
          status: sub.status,
          planId: sub.plan_id,
          userId: userId,
          paymentId: payment?.id,
          paymentStatus: payment?.status
        })
        
        if (userId && sub.status === 'active') {
          console.log('✅ Subscription charged and active - updating status to active for user:', userId)
          
          // Update subscription status to active
          const { error: updateError } = await supabase
            .from('user_subscriptions')
            .update({
              status: 'active',
              current_period_start: new Date(sub.current_start * 1000).toISOString(),
              current_period_end: new Date(sub.current_end * 1000).toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)
          
          if (updateError) {
            console.error('❌ Failed to update subscription status to active:', updateError)
          } else {
            console.log('✅ Subscription status updated to active for user:', userId)
          }
          
          // Log successful payment if payment entity exists
          if (payment) {
            const { error: paymentError } = await supabase.from('subscription_payments').insert({
              user_id: userId,
              provider: 'razorpay',
              provider_invoice_id: payment.id,
              provider_payment_id: payment.id,
              amount_cents: payment.amount || 0,
              currency: payment.currency || 'INR',
              status: 'paid',
              paid_at: new Date().toISOString()
            })
            
            if (paymentError) {
              console.error('❌ Failed to log payment:', paymentError)
            } else {
              console.log('✅ Payment logged successfully')
            }
          }
        } else if (!userId) {
          console.error('❌ No user_id found in subscription.charged webhook payload')
        } else {
          console.log('⚠️ Subscription not active yet, status:', sub.status)
        }
        break
      }
      
      case 'invoice.payment_succeeded': {
        console.log('💰 Processing invoice.payment_succeeded event')
        const invoice = event.payload.invoice?.entity
        const payment = event.payload.payment?.entity
        
        // Extract subscription_id from invoice
        const subscriptionId = invoice?.subscription_id
        
        if (subscriptionId) {
          console.log('🔍 Looking up subscription for invoice:', subscriptionId)
          
          // Query our database to find the user_id for this subscription
          const { data: subscriptionData, error: subError } = await supabase
            .from('user_subscriptions')
            .select('user_id, status')
            .eq('provider_subscription_id', subscriptionId)
            .single()
          
          if (subscriptionData && !subError) {
            const userId = subscriptionData.user_id
            console.log('✅ Found user_id via subscription lookup:', userId)
            
            if (subscriptionData.status !== 'active') {
              console.log('✅ Invoice payment succeeded - updating subscription to active for user:', userId)
              
              // Update subscription status to active
              const { error: updateError } = await supabase
                .from('user_subscriptions')
                .update({
                  status: 'active',
                  current_period_start: new Date().toISOString(),
                  current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                  updated_at: new Date().toISOString()
                })
                .eq('user_id', userId)
              
              if (updateError) {
                console.error('❌ Failed to update subscription status:', updateError)
              } else {
                console.log('✅ Subscription status updated to active for user:', userId)
              }
            } else {
              console.log('ℹ️ Subscription already active for user:', userId)
            }
            
            // Log successful payment
            if (payment) {
              const { error: paymentError } = await supabase.from('subscription_payments').insert({
                user_id: userId,
                provider: 'razorpay',
                provider_invoice_id: invoice.id,
                provider_payment_id: payment.id,
                amount_cents: payment.amount || 0,
                currency: payment.currency || 'INR',
                status: 'paid',
                paid_at: new Date().toISOString()
              })
              
              if (paymentError) {
                console.error('❌ Failed to log payment:', paymentError)
              } else {
                console.log('✅ Payment logged successfully')
              }
            }
          } else {
            console.error('❌ Failed to lookup subscription:', subError)
          }
        } else {
          console.log('⚠️ No subscription_id found in invoice.payment_succeeded webhook')
        }
        break
      }
      
      case 'invoice.paid':
      case 'payment.captured': {
        console.log('💰 Processing payment success event:', event.event)
        const ent = event.payload.payment?.entity || event.payload.invoice?.entity
        
        // For these events, we need to find the user_id from the subscription
        // since the payment entity doesn't have user_id in notes
        let userId = null
        
        // Try to get user_id from subscription if available
        if (event.payload.subscription?.entity?.notes?.user_id) {
          userId = event.payload.subscription.entity.notes.user_id
          console.log('✅ Found user_id from subscription context:', userId)
        } else if (ent?.notes?.user_id) {
          userId = ent.notes.user_id
          console.log('✅ Found user_id from payment notes:', userId)
        } else {
          // Try to find user_id by looking up the subscription from the payment
          // This is a fallback for when subscription context is missing
          console.log('🔍 No user_id in context, attempting to find via subscription lookup')
          
          // Extract subscription_id from invoice or payment
          const subscriptionId = event.payload.invoice?.entity?.subscription_id || 
                               event.payload.payment?.entity?.subscription_id
          
          if (subscriptionId) {
            console.log('🔍 Looking up subscription:', subscriptionId)
            // Query our database to find the user_id for this subscription
            const { data: subscriptionData, error: subError } = await supabase
              .from('user_subscriptions')
              .select('user_id')
              .eq('provider_subscription_id', subscriptionId)
              .single()
            
            if (subscriptionData && !subError) {
              userId = subscriptionData.user_id
              console.log('✅ Found user_id via subscription lookup:', userId)
            } else {
              console.error('❌ Failed to lookup subscription:', subError)
            }
          }
        }
        
        console.log('💳 Payment entity:', {
          id: ent?.id,
          status: ent?.status,
          amount: ent?.amount,
          currency: ent?.currency,
          userId: userId,
          notes: ent?.notes,
          subscriptionId: event.payload.invoice?.entity?.subscription_id || event.payload.payment?.entity?.subscription_id
        })
        
        if (ent && ent.status === 'captured' && userId) {
          console.log('✅ Payment captured - updating subscription to active for user:', userId)
          
          // Update subscription status to active
          const { error: updateError } = await supabase
            .from('user_subscriptions')
            .update({
              status: 'active',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)
          
          if (updateError) {
            console.error('❌ Failed to update subscription status:', updateError)
          } else {
            console.log('✅ Subscription status updated to active for user:', userId)
          }
          
          // Log successful payment
          const { error: paymentError } = await supabase.from('subscription_payments').insert({
            user_id: userId,
            provider: 'razorpay',
            provider_invoice_id: ent.id,
            provider_payment_id: ent.id,
            amount_cents: ent.amount || 0,
            currency: ent.currency || 'INR',
            status: 'paid',
            paid_at: new Date().toISOString()
          })
          
          if (paymentError) {
            console.error('❌ Failed to log payment:', paymentError)
          } else {
            console.log('✅ Payment logged successfully')
          }
        } else if (!userId) {
          console.log('⚠️ No user_id found in payment webhook - skipping update')
        } else {
          console.log('⚠️ Payment not captured yet, status:', ent?.status)
        }
        break
      }
      
      case 'payment.failed':
      case 'invoice.payment_failed': {
        console.log('❌ Processing payment failure event:', event.event)
        const ent = event.payload.payment?.entity || event.payload.invoice?.entity
        // Fix user_id extraction - try multiple sources
        let userId = null
        
        if (event.payload.payment?.entity?.notes?.user_id) {
          userId = event.payload.payment.entity.notes.user_id
        } else if (event.payload.invoice?.entity?.notes?.user_id) {
          userId = event.payload.invoice.entity.notes.user_id
        } else if (event.payload.subscription?.entity?.notes?.user_id) {
          userId = event.payload.subscription.entity.notes.user_id
        } else if (ent?.notes?.user_id) {
          userId = ent.notes.user_id
        }
        
        console.log('💥 Failed payment entity:', {
          id: ent?.id,
          status: ent?.status,
          amount: ent?.amount,
          userId: userId
        })
        
        if (ent && userId) {
          console.log('🚫 Payment failed - revoking access for user:', userId)
          // Payment failed - revoke access immediately
          const { error: updateError } = await supabase
            .from('user_subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)
          
          if (updateError) {
            console.error('❌ Failed to update subscription status to past_due:', updateError)
          } else {
            console.log('✅ Subscription status updated to past_due for user:', userId)
          }
          
          // 🔄 AUTOMATIC TEMPLATE DOWNGRADE: Change template to basic when payment fails
          console.log('🔄 Payment failed - downgrading template to basic for user:', userId)
          const { error: templateError } = await supabase
            .from('profiles')
            .update({
              template: 'basic',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)
          
          if (templateError) {
            console.error('❌ Failed to downgrade template to basic:', templateError)
          } else {
            console.log('✅ Template downgraded to basic for user:', userId)
          }
          
          // Log failed payment
          const { error: paymentError } = await supabase.from('subscription_payments').insert({
            user_id: userId,
            provider: 'razorpay',
            provider_invoice_id: ent.id,
            provider_payment_id: ent.id,
            amount_cents: ent.amount || 0,
            currency: ent.currency || 'INR',
            status: 'failed',
            paid_at: null
          })
          
          if (paymentError) {
            console.error('❌ Failed to log failed payment:', paymentError)
          } else {
            console.log('✅ Failed payment logged successfully')
          }
        } else if (!userId) {
          console.error('❌ No user_id found in failed payment webhook payload')
        }
        break
      }
      
      case 'subscription.authenticated': {
        console.log('🔐 Processing subscription.authenticated event')
        const sub = event.payload.subscription.entity
        console.log('📋 Subscription authenticated details:', {
          id: sub.id,
          status: sub.status,
          planId: sub.plan_id,
          notes: sub.notes
        })
        
        // This event is redundant with subscription.charged
        // subscription.charged is more reliable and already handled above
        console.log('ℹ️ subscription.authenticated - no action taken (handled by subscription.charged)')
        break
      }
      
      case 'subscription.past_due': {
        console.log('⚠️ Processing subscription.past_due event')
        const sub = event.payload.subscription.entity
        console.log('📋 Subscription past_due details:', {
          id: sub.id,
          status: sub.status,
          planId: sub.plan_id,
          notes: sub.notes
        })
        
        // Extract user_id from subscription notes
        const userId = sub.notes?.user_id
        
        if (userId) {
          console.log('🔄 Subscription past_due - downgrading template to basic for user:', userId)
          
          // 🔄 AUTOMATIC TEMPLATE DOWNGRADE: Change template to basic when subscription is past_due
          const { error: templateError } = await supabase
            .from('profiles')
            .update({
              template: 'basic',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)
          
          if (templateError) {
            console.error('❌ Failed to downgrade template to basic:', templateError)
          } else {
            console.log('✅ Template downgraded to basic for user:', userId)
          }
        } else {
          console.error('❌ No user_id found in subscription.past_due webhook payload')
        }
        break
      }
      
      case 'subscription.trial_ended': {
        console.log('⏰ Processing subscription.trial_ended event')
        const sub = event.payload.subscription.entity
        console.log('📋 Subscription trial ended details:', {
          id: sub.id,
          status: sub.status,
          planId: sub.plan_id,
          notes: sub.notes
        })
        
        // Extract user_id from subscription notes
        const userId = sub.notes?.user_id
        
        if (userId) {
          console.log('🔄 Trial ended - downgrading template to basic for user:', userId)
          
          // 🔄 AUTOMATIC TEMPLATE DOWNGRADE: Change template to basic when trial ends
          const { error: templateError } = await supabase
            .from('profiles')
            .update({
              template: 'basic',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)
          
          if (templateError) {
            console.error('❌ Failed to downgrade template to basic:', templateError)
          } else {
            console.log('✅ Template downgraded to basic for user:', userId)
          }
        } else {
          console.error('❌ No user_id found in subscription.trial_ended webhook payload')
        }
        break
      }
      
      case 'subscription.incomplete': {
        console.log('❌ Processing subscription.incomplete event')
        const sub = event.payload.subscription.entity
        console.log('📋 Subscription incomplete details:', {
          id: sub.id,
          status: sub.status,
          planId: sub.plan_id,
          notes: sub.notes
        })
        
        // Extract user_id from subscription notes
        const userId = sub.notes?.user_id
        
        if (userId) {
          console.log('🔄 Subscription incomplete - downgrading template to basic for user:', userId)
          
          // 🔄 AUTOMATIC TEMPLATE DOWNGRADE: Change template to basic when subscription is incomplete
          const { error: templateError } = await supabase
            .from('profiles')
            .update({
              template: 'basic',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)
          
          if (templateError) {
            console.error('❌ Failed to downgrade template to basic:', templateError)
          } else {
            console.log('✅ Template downgraded to basic for user:', userId)
          }
        } else {
          console.error('❌ No user_id found in subscription.incomplete webhook payload')
        }
        break
      }
      
      case 'subscription.paused':
      case 'subscription.halted':
      case 'subscription.cancelled':
      case 'subscription.completed':
      case 'subscription.expired': {
        console.log('🔄 Processing subscription lifecycle event:', event.event)
        const sub = event.payload.subscription.entity
        console.log('📋 Subscription lifecycle details:', {
          id: sub.id,
          status: sub.status,
          event: event.event
        })
        
        const newStatus = event.event.includes('expired') ? 'expired' : 'canceled'
        console.log('🔄 Updating subscription status to:', newStatus)
        
        // Update subscription status
        const { error: updateError } = await supabase
          .from('user_subscriptions')
          .update({ 
            status: newStatus, 
            updated_at: new Date().toISOString() 
          })
          .eq('provider_subscription_id', sub.id)
        
        if (updateError) {
          console.error('❌ Failed to update subscription lifecycle status:', updateError)
        } else {
          console.log('✅ Subscription lifecycle status updated to:', newStatus)
        }
        
        // 🔄 AUTOMATIC TEMPLATE DOWNGRADE: Change template to basic for expired/cancelled/halted/paused/suspended/incomplete_expired subscriptions
        if (['expired', 'cancelled', 'completed', 'halted', 'paused', 'suspended', 'incomplete_expired'].includes(newStatus)) {
          console.log('🔄 Subscription', newStatus, '- downgrading template to basic for subscription:', sub.id)
          
          // Find the user_id for this subscription
          const { data: subscriptionData, error: subError } = await supabase
            .from('user_subscriptions')
            .select('user_id')
            .eq('provider_subscription_id', sub.id)
            .single()
          
          if (subscriptionData && !subError) {
            const userId = subscriptionData.user_id
            console.log('🔄 Downgrading template to basic for user:', userId)
            
            const { error: templateError } = await supabase
              .from('profiles')
              .update({
                template: 'basic',
                updated_at: new Date().toISOString()
              })
              .eq('id', userId)
            
            if (templateError) {
              console.error('❌ Failed to downgrade template to basic:', templateError)
            } else {
              console.log('✅ Template downgraded to basic for user:', userId)
            }
          } else {
            console.error('❌ Failed to find user_id for subscription:', sub.id, subError)
          }
        }
        break
      }
      
      default:
        console.log('❓ Unhandled webhook event:', event.event)
        break
    }
  } catch (e: any) {
    console.error('💥 Webhook processing error:', e)
    return NextResponse.json({ error: e?.message || 'Webhook handling error' }, { status: 500 })
  }

  console.log('✅ Webhook processed successfully')
  return NextResponse.json({ ok: true })
}
