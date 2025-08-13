'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { config } from '@/lib/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function MagicLinkLogin() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const supabase = createClient()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    const redirectUrl = config.authRedirectUrl
    
    console.log('🔐 Auth redirect URL:', redirectUrl)
    console.log('🌍 Current origin:', config.currentSiteUrl)
    console.log('🏠 Is development:', config.isDevelopment)

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // This is where the user will be redirected after clicking the link
        emailRedirectTo: redirectUrl,
      },
    })

    if (error) {
      console.error('Error sending magic link:', error)
      // You might want to show an error message to the user
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="text-center">
        <h2 className="font-bold text-xl">Check your inbox!</h2>
        <p className="text-slate-500">A magic link has been sent to {email}.</p>
        <p className="text-xs text-slate-400 mt-2">
          Make sure to check your Supabase project settings for correct redirect URLs
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col w-full max-w-sm gap-4">
        <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        <Button type="submit">Send Magic Link</Button>
    </form>
  )
}