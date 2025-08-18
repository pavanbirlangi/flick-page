'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { config } from '@/lib/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function MagicLinkLogin() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [returnUrl, setReturnUrl] = useState('')
  const supabase = createClient()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get returnUrl from URL parameters
    const returnUrlParam = searchParams.get('returnUrl')
    if (returnUrlParam) {
      setReturnUrl(decodeURIComponent(returnUrlParam))
    }
  }, [searchParams])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Use returnUrl if available, otherwise use default
    const redirectUrl = returnUrl 
      ? `${config.currentSiteUrl}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`
      : config.authRedirectUrl
    
    console.log('🔐 Auth redirect URL:', redirectUrl)
    console.log('🌍 Current origin:', config.currentSiteUrl)
    console.log('🏠 Is development:', config.isDevelopment)
    console.log('↩️ Return URL:', returnUrl)

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // This is where the user will be redirected after clicking the link
        emailRedirectTo: redirectUrl,
      },
    })

    if (error) {
      console.error('Error sending magic link:', error)
      setError('Failed to send magic link. Please try again.')
    } else {
      setSubmitted(true)
    }
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setGoogleLoading(true)
    
    // Use returnUrl if available, otherwise use default
    const redirectUrl = returnUrl 
      ? `${config.currentSiteUrl}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`
      : config.authRedirectUrl
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (error) {
        console.error('Google OAuth error:', error)
        setError('Google sign-in failed. Please try again.')
      }
    } catch (err) {
      console.error('Google OAuth exception:', err)
      setError('Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center p-4 bg-green-900/50 border border-green-700 rounded-2xl">
        <h2 className="font-bold text-xl text-white">Check your inbox!</h2>
        <p className="text-sm text-gray-400">A magic link has been sent to {email}.</p>
        {/* <p className="text-xs text-gray-400 mt-2">
          Make sure to check your Supabase project settings for correct redirect URLs
        </p> */}
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full gap-3">
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12 px-4 bg-gray-950/50 border-gray-800 rounded-lg focus:ring-2 focus:ring-gray-600"
        />
        <Button 
          type="submit"
          disabled={loading}
          className="h-12 rounded-lg font-semibold bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            'Send Sign-in Link'
          )}
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-2 text-gray-400">Or continue with</span>
        </div>
      </div>
      
      <Button 
        type="button" 
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        variant="outline"
        className="h-12 flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-gray-100 border-gray-300 rounded-lg"
      >
        {googleLoading ? (
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {googleLoading ? 'Signing in...' : 'Continue with Google'}
      </Button>
      
      {error && (
        <p className="text-sm text-red-400 text-center">
          {error}
        </p>
      )}
    </div>
  )
}