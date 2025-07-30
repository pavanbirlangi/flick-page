// This is the complete code for your new landing page.
// Replace the entire content of `src/app/page.tsx` with this file.

'use client' // This page now needs client-side interactivity for the form

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Zap, Palette, Smartphone, Server, Users, Loader2, AlertTriangle } from 'lucide-react'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Input } from '@/components/ui/input' // Assuming you have this from Shadcn
import { Button } from '@/components/ui/button' // Assuming you have this from Shadcn

// Apply the Inter font as per design-zint
const inter = Inter({ subsets: ['latin'] })

// --- MagicLinkLogin Component Logic (Integrated) ---
function MagicLinkLogin() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setStatus('error')
      setMessage('Failed to send link. Please try again.')
      console.error('Error sending magic link:', error)
    } else {
      setStatus('success')
      setMessage(`A sign-in link has been sent to ${email}.`)
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center p-4 bg-green-900/50 border border-green-700 rounded-2xl">
        <CheckCircle className="mx-auto h-8 w-8 text-green-400 mb-2" />
        <h3 className="font-semibold text-white">Check your inbox!</h3>
        <p className="text-sm text-gray-400">{message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col w-full gap-3">
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
            disabled={status === 'loading'}
            className="h-12 rounded-lg font-semibold bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? (
            <Loader2 className="animate-spin" />
          ) : (
            'Send Sign-in Link'
          )}
        </Button>
        {status === 'error' && (
            <p className="text-sm text-red-400 flex items-center gap-2 mt-2">
                <AlertTriangle size={16} /> {message}
            </p>
        )}
    </form>
  )
}


// Header Component
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
                    <Link href="https://app.apollo.io/#/meet/managed-meetings/codecapo/6ec-v3k-bms/30-min" target='_blank' className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
                        Contact us
                    </Link>
                </div>
            </div>
        </header>
    )
}


// Main Landing Page Component
export default function Home() {
  return (
    <main className={`bg-black text-white overflow-x-hidden ${inter.className}`}>
      <Header />
      {/* --- Hero Section --- */}
      <section className="relative flex items-center justify-center min-h-screen px-4 pt-20 pb-16">
        <div className="absolute inset-0 bg-grid-gray-800/20 [mask-image:linear-gradient(to_bottom,white_5%,transparent_70%)]"></div>
        <div className="relative z-10 container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column: Headline & Features */}
                <div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-left bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                        Your Portfolio <br/> in one click
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 text-left">
                        <InfoCard title="Beautiful Templates" description="Professionally designed, ready to go." />
                        <InfoCard title="Blazing Fast" description="Globally distributed for instant loads." />
                    </div>
                     <div className="mt-12 w-full max-w-sm">
                        <MagicLinkLogin />
                        <p className="text-xs text-gray-500 mt-3 text-left">Get started for free. No credit card required.</p>
                    </div>
                </div>

                {/* Right Column: Status Card */}
                <div className="flex justify-center lg:justify-end">
                    <StatusCard />
                </div>
            </div>
        </div>
      </section>

      {/* --- ENHANCED Features Section --- */}
      <section className="py-24 px-4 bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Everything You Need. Nothing You Don't.</h2>
            <p className="text-gray-400 mt-4 text-lg">We focus on what matters: speed, simplicity, and a beautiful result.</p>
          </div>
          <div 
            className="grid md:grid-cols-2 gap-8" 
            style={{ perspective: '1000px' }}
          >
            <FeatureCard
              icon={<Palette size={28} className="text-gray-400" />}
              title="Stunning Templates"
              description="Choose from a curated library of professional templates designed for creatives and developers."
              rotation="transform rotate-y-3"
            />
            <FeatureCard
              icon={<Zap size={28} className="text-gray-400" />}
              title="Blazing Fast"
              description="Your page is globally distributed and optimized for speed, ensuring a great user experience."
              rotation="transform -rotate-y-3"
            />
            <FeatureCard
              icon={<Smartphone size={28} className="text-gray-400" />}
              title="Perfectly Responsive"
              description="Your portfolio looks incredible on any device, from desktops to smartphones."
              rotation="transform rotate-y-3"
            />
            <FeatureCard
              icon={<CheckCircle size={28} className="text-gray-400" />}
              title="Custom Username"
              description="Claim your unique username and get a professional URL: yourname.flick.page."
              rotation="transform -rotate-y-3"
            />
          </div>
        </div>
      </section>
      
      {/* --- Template Showcase Section --- */}
      <section className="py-24 px-4 bg-gray-950/70">
          <div className="container mx-auto max-w-5xl">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold">Designed for Professionals</h2>
                  <p className="text-gray-400 mt-4 text-lg">A template for every style, from minimalist developer to visual designer.</p>
              </div>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="p-8">
                      <h3 className="text-3xl font-bold mb-4">The "Developer"</h3>
                      <p className="text-gray-400 mb-6 leading-relaxed">A clean, text-focused layout perfect for showcasing your code, skills, and technical projects. Integrates seamlessly with your GitHub profile.</p>
                      <a href="#" className="text-gray-300 font-medium hover:underline">View Demo →</a>
                  </div>
                  <div className="h-80 bg-[url('https://placehold.co/600x400/101010/404040?text=Developer+Template')] bg-cover bg-center rounded-2xl border border-gray-800 shadow-2xl shadow-black/50"></div>
              </div>
              <div className="grid lg:grid-cols-2 gap-12 items-center mt-16">
                  <div className="h-80 bg-[url('https://placehold.co/600x400/101010/404040?text=Designer+Template')] bg-cover bg-center rounded-2xl border border-gray-800 shadow-2xl shadow-black/50 order-last lg:order-first"></div>
                  <div className="p-8 lg:text-right">
                      <h3 className="text-3xl font-bold mb-4">The "Designer"</h3>
                      <p className="text-gray-400 mb-6 leading-relaxed">A visual-first, grid-based layout that puts your images and case studies front and center. Perfect for UI/UX designers and photographers.</p>
                      <a href="#" className="text-gray-300 font-medium hover:underline">View Demo →</a>
                  </div>
              </div>
          </div>
      </section>

      {/* --- Final CTA Section --- */}
      <section className="py-24 px-4 bg-black">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold">Ready to Create Your Page?</h2>
          <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
            Join hundreds of professionals who have built their perfect portfolio in minutes.
          </p>
          <div className="mt-12 w-full max-w-sm mx-auto">
            <MagicLinkLogin />
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="text-center py-10 border-t border-gray-800/50">
          <p className="text-gray-500">© {new Date().getFullYear()} flick.page. All rights reserved.</p>
      </footer>
    </main>
  )
}

// Helper component for small info cards in the hero section
function InfoCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="bg-gray-950/50 p-6 rounded-2xl border border-gray-800">
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    )
}

// Helper component for the Status Card in the hero section
function StatusCard() {
    return (
        <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 w-full max-w-sm shadow-2xl shadow-black/60">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white">Flick systems</h3>
                <div className="flex items-center gap-2 text-xs text-green-400">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Operational
                </div>
            </div>
            <div className="space-y-4">
                <StatusItem icon={<Server size={16} />} label="Uptime" value="99.998%" detail="Last 30 days" />
                <StatusItem icon={<Users size={16} />} label="Active Pages" value="1,492" detail="+2.1% from yesterday" />
            </div>
            <p className="text-xs text-gray-600 mt-6 text-right">Realtime signals · Last updated 2m ago</p>
        </div>
    )
}

function StatusItem({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
    return (
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 text-gray-400">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            <div className="text-right">
                <p className="text-white font-medium">{value}</p>
                <p className="text-xs text-gray-500">{detail}</p>
            </div>
        </div>
    )
}

// Helper component for ENHANCED Feature Cards
function FeatureCard({ icon, title, description, rotation }: { icon: React.ReactNode; title: string; description: string; rotation: string }) {
  return (
    <div className={`group relative bg-black p-8 rounded-2xl border border-gray-900 transition-all duration-500 ${rotation} hover:!transform-none`}>
        <div className="absolute -inset-px bg-gradient-to-r from-black to-gray-900 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
            <div className="mb-4 inline-block bg-black p-3 rounded-lg border border-black">{icon}</div>
            <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    </div>
  )
}
