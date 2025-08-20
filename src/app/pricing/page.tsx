'use client'

import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useCallback } from 'react'

const inter = Inter({ subsets: ['latin'] })

// Header Component (can be shared in a layout later)
function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm border-b border-gray-800/50">
            <div className="container mx-auto max-w-6xl flex justify-between items-center h-20 px-4">
                <Link href="/" className="text-xl font-bold tracking-tight">
                    Flick
                    <br/>
                    <div className='text-white text-[10px] -mt-[2px]'>
                    <label className=''>by Zintlabs</label>
                    </div>
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/pricing" className="text-sm font-medium text-white">Pricing</Link>
                    <Link href="https://app.apollo.io/#/meet/managed-meetings/ccodecapo/6ec-v3k-bms/30-min" target='_blank' className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
                        Contact us
                    </Link>
                </div>
            </div>
        </header>
    )
}

// Type definition for PricingCard props
interface PricingCardProps {
    name: string;
    price: number;
    description: string;
    features: string[];
    isFeatured?: boolean;
    onGetStarted: () => void;
    disabled?: boolean; // Add disabled prop
    loading?: boolean;  // Show button spinner
}

// Pricing Card Component
function PricingCard({ name, price, description, features, isFeatured = false, onGetStarted, disabled = false, loading = false }: PricingCardProps) {
    return (
        <div className={`bg-gray-950 p-8 rounded-2xl border ${isFeatured ? 'border-gray-600' : 'border-gray-800'} transition-all hover:border-gray-700 hover:-translate-y-2 relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isFeatured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                </div>
            )}
            <h3 className="text-2xl font-bold">{name}</h3>
            <p className="text-gray-400 mt-2">{description}</p>
            <div className="mt-8">
                <span className="text-5xl font-bold">₹{price}</span>
                <span className="text-gray-400">{price > 0 ? '/month' : ''}</span>
            </div>
            <button 
                onClick={onGetStarted}
                className={`w-full mt-8 inline-flex items-center justify-center gap-2 text-center py-3 rounded-lg font-semibold transition-colors ${isFeatured ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-800 hover:bg-gray-700'} ${disabled ? 'bg-gray-600 text-gray-400 cursor-not-allowed hover:bg-gray-600' : ''}`}
                disabled={disabled || loading}
            >
                {loading && <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                {disabled ? 'Coming Soon' : (price === 0 ? 'Start for Free' : (loading ? 'Processing…' : 'Get Started'))}
            </button>
            <ul className="space-y-4 mt-8 text-left">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <Check size={16} className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

// Main Pricing Page Component
export default function PricingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutReady, setCheckoutReady] = useState(false)
  const [processing, setProcessing] = useState<null | 'pro' | 'premium'>(null)
  const supabase = createClient()
  const [btnLoading, setBtnLoading] = useState<'basic'|'pro'|'premium'|null>(null)

  useEffect(() => {
    // Load Razorpay checkout script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setCheckoutReady(true)
    script.onerror = () => setCheckoutReady(false)
    document.body.appendChild(script)

    return () => { document.body.removeChild(script) }
  }, [])

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const pollSubscriptionActive = useCallback(async () => {
    console.log('🔄 Starting subscription status polling...')
    
    // Poll subscription status for up to ~30 seconds
    const maxTries = 15
    for (let i = 0; i < maxTries; i++) {
      try {
        console.log(`📡 Polling attempt ${i + 1}/${maxTries}`)
        const res = await fetch('/api/user/subscription', { cache: 'no-store' })
        const data = await res.json()
        
        console.log('📊 Current subscription status:', data)
        
        if (data?.status === 'active') {
          console.log('✅ Subscription is active - redirecting to dashboard')
          setProcessing(null)
          setBtnLoading(null)
          router.push('/dashboard?panel=appearance')
          return
        } else if (data?.status === 'past_due') {
          console.log('❌ Payment failed - showing error')
          setProcessing(null)
          setBtnLoading(null)
          alert('Payment failed. Please try again or contact support.')
          return
        } else if (data?.status === 'trialing') {
          console.log('⏳ Payment still processing...')
          // Continue polling
        } else {
          console.log('❓ Unknown status:', data?.status)
        }
      } catch (error) {
        console.error('❌ Polling error:', error)
      }
      
      // Wait 2 seconds between attempts
      await new Promise(r => setTimeout(r, 2000))
    }
    
    // After max attempts, check final status
    try {
      console.log('⏰ Max polling attempts reached - checking final status')
      const res = await fetch('/api/user/subscription', { cache: 'no-store' })
      const data = await res.json()
      
      if (data?.status === 'active') {
        console.log('✅ Final check: Subscription is active - redirecting')
        setProcessing(null)
        setBtnLoading(null)
        router.push('/dashboard?panel=appearance')
        return
      } else if (data?.status === 'trialing') {
        console.log('⏳ Final check: Still processing - showing info message')
        setProcessing(null)
        setBtnLoading(null)
        alert('Payment is being processed. You will receive access shortly. Please check your dashboard in a few minutes.')
      } else {
        console.log('❓ Final check: Unknown status - showing generic message')
        setProcessing(null)
        setBtnLoading(null)
        alert('Payment status unclear. Please check your dashboard or contact support.')
      }
    } catch (error) {
      console.error('❌ Final status check error:', error)
      setProcessing(null)
      setBtnLoading(null)
      alert('Unable to verify payment status. Please check your dashboard or contact support.')
    }
  }, [router])

  const startSubscription = useCallback(async (plan: 'pro' | 'premium') => {
    setProcessing(plan)
    setBtnLoading(plan)
    try {
      const resp = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      })
      const data = await resp.json()
      if (!resp.ok) {
        console.error('Subscribe error', data)
        setProcessing(null)
        setBtnLoading(null)
        return
      }

      const options: any = {
        key: data.razorpay_key_id,
        subscription_id: data.subscription_id,
        name: 'Flick',
        description: plan === 'pro' ? 'Pro Plan Subscription' : 'Premium Plan Subscription',
        theme: { color: '#111827' },
        handler: function () {
          // Payment authorized; wait for webhook to activate subscription
          pollSubscriptionActive()
        }
      }

      // @ts-ignore
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e) {
      console.error(e)
      setProcessing(null)
      setBtnLoading(null)
    }
  }, [pollSubscriptionActive])

  const handleGetStarted = (planName: string, price: number) => {
    if (!user) {
      const returnUrl = encodeURIComponent('/pricing')
      router.push(`/?returnUrl=${returnUrl}`)
      return
    }

    if (price === 0) {
      setBtnLoading('basic')
      router.push('/dashboard?panel=appearance')
      return
    }

    // Only proceed if checkout script loaded
    if (!checkoutReady) {
      console.warn('Checkout not ready yet')
      return
    }

    if (planName === 'Pro') {
      startSubscription('pro')
      return
    }

    if (planName === 'Premium') {
      // Currently disabled in UI, but future-proof path
      startSubscription('premium')
      return
    }
  }

  // Pass per-card buttons with inline spinner
  const renderButtonContent = (label: string, key: 'basic'|'pro'|'premium') => (
    <>
      {btnLoading === key && <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      <span>{label}</span>
    </>
  )

  if (loading) {
    return (
      <main className={`bg-black text-white overflow-x-hidden ${inter.className}`}>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={`bg-black text-white overflow-x-hidden ${inter.className}`}>
      <Header />
      
      {/* --- Hero Section --- */}
      <section className="relative text-center px-4 pt-40 pb-24">
        <div className="absolute inset-0 bg-grid-gray-800/20 [mask-image:linear-gradient(to_bottom,white_5%,transparent_70%)]"></div>
        <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                Simple, Fair Pricing.
            </h1>
            <p className="text-gray-400 mt-6 text-lg md:text-xl max-w-2xl mx-auto">
                Choose a plan that fits your needs. Start for free. No hidden fees, ever.
            </p>
            {processing && (
              <div className="text-center mt-3 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                <p className="text-sm text-blue-300 mb-2">
                  🔄 Payment Processing...
                </p>
                <p className="text-xs text-blue-400">
                  Please complete the payment in the popup. Your plan will unlock automatically once confirmed.
                </p>
              </div>
            )}
        </div>
      </section>

      {/* --- Pricing Grid --- */}
      <section className="px-4 pb-24">
          <div className="container mx-auto max-w-6xl">
              <div className="grid lg:grid-cols-3 gap-8">
                  <PricingCard
                    name="Basic"
                    price={0}
                    description="For personal use and getting started."
                    features={[
                        "Default Simple Template",
                        "Up to 5 Projects",
                        "flick.page Subdomain",
                        "Community Support"
                    ]}
                    onGetStarted={() => handleGetStarted('Basic', 0)}
                    loading={btnLoading==='basic'}
                  />
                  <PricingCard
                    name="Pro"
                    price={49}
                    description="More templates and visual customization."
                    features={[
                        "Everything in Basic, plus:",
                        "Access to Pro Templates",
                        "Up to 20 Projects",
                    ]}
                    isFeatured={true}
                    onGetStarted={() => handleGetStarted('Pro', 49)}
                    loading={btnLoading==='pro'}
                  />
                  <PricingCard
                    name="Premium"
                    price={99}
                    description="Advanced tools for full customization."
                    features={[
                        "Everything in Pro, plus:",
                        "Access to Premium Templates",
                        "Unlimited Projects",
                        "Custom Color Palettes",
                        "Remove 'flick.page' Branding",
                        "Connect Custom Domain",
                    ]}
                    onGetStarted={() => {}} // Disabled for now
                    disabled={true} // Add disabled prop
                    loading={btnLoading==='premium'}
                  />
              </div>
          </div>
      </section>

      {/* --- Feature Comparison Table --- */}
      <section className="px-4 pb-24">
          <div className="container mx-auto max-w-5xl">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold">Compare All Features</h2>
              </div>
              
              {/* Desktop Table View */}
              <div className="hidden lg:block bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                      <thead>
                          <tr className="border-b border-gray-800">
                              <th className="p-6">Feature</th>
                              <th className="p-6 text-center">Basic (Free)</th>
                              <th className="p-6 text-center">Pro (₹49)</th>
                              <th className="p-6 text-center">Premium (₹99)</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr className="border-b border-gray-800">
                              <td className="p-6 font-medium">Projects</td>
                              <td className="p-6 text-center text-gray-300">5 Projects</td>
                              <td className="p-6 text-center text-gray-300">20 Projects</td>
                              <td className="p-6 text-center text-gray-300">Unlimited</td>
                          </tr>
                          <tr className="border-b border-gray-800">
                              <td className="p-6 font-medium">Pro Templates</td>
                              <td className="p-6 text-center"><X className="mx-auto text-gray-600" /></td>
                              <td className="p-6 text-center"><Check className="mx-auto text-green-500" /></td>
                              <td className="p-6 text-center"><Check className="mx-auto text-green-500" /></td>
                          </tr>
                          <tr className="border-b border-gray-800">
                              <td className="p-6 font-medium">Premium Templates</td>
                              <td className="p-6 text-center"><X className="mx-auto text-gray-600" /></td>
                              <td className="p-6 text-center"><X className="mx-auto text-gray-600" /></td>
                              <td className="p-6 text-center"><Check className="mx-auto text-green-500" /></td>
                          </tr>
                          <tr className="border-b border-gray-800">
                              <td className="p-6 font-medium">Remove Branding</td>
                              <td className="p-6 text-center"><X className="mx-auto text-gray-600" /></td>
                              <td className="p-6 text-center"><X className="mx-auto text-gray-600" /></td>
                              <td className="p-6 text-center"><Check className="mx-auto text-green-500" /></td>
                          </tr>
                          <tr>
                              <td className="p-6 font-medium">Connect Custom Domain</td>
                              <td className="p-6 text-center"><X className="mx-auto text-gray-600" /></td>
                              <td className="p-6 text-center"><X className="mx-auto text-gray-600" /></td>
                              <td className="p-6 text-center"><Check className="mx-auto text-green-500" /></td>
                          </tr>
                      </tbody>
                  </table>
              </div>
              
              {/* Mobile Comparison Cards */}
              <div className="lg:hidden space-y-6">
                  {/* Basic Plan */}
                  <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
                      <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold text-white">Basic (Free)</h3>
                          <p className="text-gray-400 mt-2">Perfect for getting started</p>
                      </div>
                      <div className="space-y-4">
                          <div className="flex items-center justify-between py-3 border-b border-gray-800">
                              <span className="font-medium text-gray-300">Projects</span>
                              <span className="text-white">5 Projects</span>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-gray-800">
                              <span className="font-medium text-gray-300">Pro Templates</span>
                              <X className="text-gray-600" />
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-gray-800">
                              <span className="font-medium text-gray-300">Premium Templates</span>
                              <X className="text-gray-600" />
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-gray-800">
                              <span className="font-medium text-gray-300">Remove Branding</span>
                              <X className="text-gray-600" />
                          </div>
                          <div className="flex items-center justify-between py-3">
                              <span className="font-medium text-gray-300">Connect Custom Domain</span>
                              <X className="text-gray-600" />
                          </div>
                      </div>
                  </div>
                  
                  {/* Pro Plan */}
                  <div className="bg-gray-950 border border-gray-600 rounded-2xl p-6 relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                      </div>
                      <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold text-white">Pro (₹49)</h3>
                          <p className="text-gray-400 mt-2">For growing professionals</p>
                      </div>
                      <div className="space-y-4">
                          <div className="flex items-center justify-between py-3 border-b border-gray-800">
                              <span className="font-medium text-gray-300">Projects</span>
                              <span className="text-white">20 Projects</span>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-gray-800">
                              <span className="font-medium text-gray-300">Pro Templates</span>
                              <Check className="text-green-500" />
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-gray-800">
                              <span className="font-medium text-gray-300">Premium Templates</span>
                              <X className="text-gray-600" />
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-gray-800">
                              <span className="font-medium text-gray-300">Remove Branding</span>
                              <X className="text-gray-600" />
                          </div>
                          <div className="flex items-center justify-between py-3">
                              <span className="font-medium text-gray-300">Connect Custom Domain</span>
                              <X className="text-gray-600" />
                          </div>
                      </div>
                  </div>
                  
                  {/* Premium Plan */}
                  <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
                      <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold text-white">Premium (₹99)</h3>
                          <p className="text-gray-400 mt-2">For power users</p>
                      </div>
                      <div className="space-y-4">
                          <div className="flex items-center justify-between py-3 border-b border-gray-800">
                              <span className="font-medium text-gray-300">Projects</span>
                              <span className="text-white">Unlimited</span>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-gray-800">
                              <span className="font-medium text-gray-300">Pro Templates</span>
                              <Check className="text-green-500" />
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-gray-800">
                              <span className="font-medium text-gray-300">Premium Templates</span>
                              <Check className="text-green-500" />
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-gray-800">
                              <span className="font-medium text-gray-300">Remove Branding</span>
                              <Check className="text-green-500" />
                          </div>
                          <div className="flex items-center justify-between py-3">
                              <span className="font-medium text-gray-300">Connect Custom Domain</span>
                              <Check className="text-green-500" />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* --- Footer --- */}
      <footer className="text-center py-10 border-t border-gray-800/50">
          <p className="text-gray-500">© {new Date().getFullYear()} Flick by Zintlabs All rights reserved.</p>
      </footer>
    </main>
  )
}