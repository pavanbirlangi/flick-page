'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowUpRight, Crown, Zap, Star, Menu, X, Loader2 } from 'lucide-react'

interface SmartHeaderProps {
  showPricing?: boolean
  showViewSite?: boolean
  username?: string
  full_name?: string
  showSignOut?: boolean
  variant?: 'landing' | 'dashboard'
}

export default function SmartHeader({ 
  showPricing = true, 
  showViewSite = false, 
  username, 
  full_name,
  showSignOut = false,
  variant = 'landing'
}: SmartHeaderProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userSubscription, setUserSubscription] = useState<{plan: string, status: string} | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      // If user is logged in, fetch their subscription
      if (user) {
        await fetchUserSubscription()
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserSubscription = async () => {
    try {
      const res = await fetch('/api/user/subscription', { cache: 'no-store' })
      const data = await res.json()
      setUserSubscription(data)
    } catch (error) {
      console.error('Error fetching user subscription:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Determine where the logo should link based on user authentication
  const logoHref = loading ? '/' : (user ? '/dashboard' : '/')

  const headerClassName = variant === 'dashboard' 
    ? "bg-black border-b border-gray-800/50 z-50"
    : "fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm border-b border-gray-800/50"

  // Get plan icon and color
  const getPlanInfo = (plan: string) => {
    switch (plan) {
      case 'basic':
        return { icon: <Star size={16} />, color: 'text-gray-400', bgColor: 'bg-gray-800' }
      case 'pro':
        return { icon: <Zap size={16} />, color: 'text-blue-400', bgColor: 'bg-blue-900/30' }
      case 'premium':
        return { icon: <Crown size={16} />, color: 'text-yellow-400', bgColor: 'bg-yellow-900/30' }
      default:
        return { icon: <Star size={16} />, color: 'text-gray-400', bgColor: 'bg-gray-800' }
    }
  }

  // Show loading skeleton while checking authentication
  if (loading) {
    return (
      <header className={headerClassName}>
        <div className="container mx-auto max-w-6xl flex justify-between items-center h-20 px-4">
          {/* Logo - Always visible */}
          <Link href="/" className="text-xl font-bold tracking-tight">
            Flick
            <br/>
            <div className='text-white text-[10px] -mt-[2px]'>
              <label className=''>by Zintlabs</label>
            </div>
          </Link>
          
          {/* Loading skeleton for navigation */}
          <div className="flex items-center gap-4">
            <div className="w-24 h-8 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="w-20 h-8 bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className={headerClassName}>
      <div className="container mx-auto max-w-6xl flex justify-between items-center h-20 px-4">
        {/* Logo - Always visible */}
        <Link href={logoHref} className="text-xl font-bold tracking-tight">
          Flick
          <br/>
          <div className='text-white text-[10px] -mt-[2px]'>
            <label className=''>by Zintlabs</label>
          </div>
        </Link>
        
        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          {/* Current Plan Display for Logged-in Users */}
          {user && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getPlanInfo(userSubscription?.status === 'active' ? userSubscription.plan : 'basic').bgColor} border border-gray-700`}>
              {getPlanInfo(userSubscription?.status === 'active' ? userSubscription.plan : 'basic').icon}
              <span className={`text-sm font-medium ${getPlanInfo(userSubscription?.status === 'active' ? userSubscription.plan : 'basic').color}`}>
                {userSubscription?.status === 'active' ? userSubscription.plan.charAt(0).toUpperCase() + userSubscription.plan.slice(1) : 'Basic'} Plan
              </span>
            </div>
          )}
          
          {/* Upgrade Button for Basic Plan Users (including no subscription) */}
          {user && (!userSubscription || userSubscription.status !== 'active' || userSubscription.plan === 'basic') && (
            <Link 
              href="/pricing" 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Zap size={16} />
              Upgrade
            </Link>
          )}
          
          {/* Upgrade Button for Pro Plan Users */}
          {user && userSubscription && userSubscription.status === 'active' && userSubscription.plan === 'pro' && (
            <Link 
              href="/pricing" 
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all"
            >
              <Crown size={16} />
              Upgrade to Premium
            </Link>
          )}
          
          {showPricing && (
            <Link href="/pricing" className="text-sm font-medium text-white">
              Pricing
            </Link>
          )}
          
          {showViewSite && username && (
            <a 
              href={`http://${username}.flavorr.in`} // Replace with flick.page for production
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <span>View Page</span>
              <ArrowUpRight size={16} />
            </a>
          )}
          
          {showSignOut && user ? (
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-gray-300 hover:text-white"
            >
              Sign Out
            </button>
          ) : (
            <Link 
              href="https://app.apollo.io/#/meet/managed-meetings/ccodecapo/6ec-v3k-bms/30-min" 
              target='_blank' 
              className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Contact us
            </Link>
          )}
        </div>

        {/* Mobile Menu Button - Only visible on mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-black border-b border-gray-800/50">
          <div className="px-4 py-6 space-y-4">
            {/* Current Plan Display for Mobile */}
            {user && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getPlanInfo(userSubscription?.status === 'active' ? userSubscription.plan : 'basic').bgColor} border border-gray-700`}>
                {getPlanInfo(userSubscription?.status === 'active' ? userSubscription.plan : 'basic').icon}
                <span className={`text-sm font-medium ${getPlanInfo(userSubscription?.status === 'active' ? userSubscription.plan : 'basic').color}`}>
                  {userSubscription?.status === 'active' ? userSubscription.plan.slice(0, 1).toUpperCase() + userSubscription.plan.slice(1) : 'Basic'} Plan
                </span>
              </div>
            )}
            
            {/* Upgrade Button for Mobile */}
            {user && (!userSubscription || userSubscription.status !== 'active' || userSubscription.plan === 'basic') && (
              <Link 
                href="/pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Zap size={16} />
                Upgrade
              </Link>
            )}
            
            {user && userSubscription && userSubscription.status === 'active' && userSubscription.plan === 'pro' && (
              <Link 
                href="/pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all"
              >
                <Crown size={16} />
                Upgrade to Premium
              </Link>
            )}
            
            {/* Mobile Navigation Links */}
            {showPricing && (
              <Link 
                href="/pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-white hover:text-gray-300"
              >
                Pricing
              </Link>
            )}
            
            {showViewSite && username && (
              <a 
                href={`http://${username}.flavorr.in`}
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <span>View Page</span>
                <ArrowUpRight size={16} />
              </a>
            )}
            
            {showSignOut && user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleSignOut()
                }}
                className="block w-full text-left text-sm font-medium text-gray-300 hover:text-white"
              >
                Sign Out
              </button>
            ) : (
              <Link 
                href="https://app.apollo.io/#/meet/managed-meetings/ccodecapo/6ec-v3k-bms/30-min" 
                target='_blank' 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-white hover:text-gray-300"
              >
                Contact us
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
