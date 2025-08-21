// This is the complete code for your new landing page.
// Replace the entire content of `src/app/page.tsx` with this file.

'use client' // This page now needs client-side interactivity for the form

import { CheckCircle, Zap, Palette, Smartphone, Server, Users } from 'lucide-react'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Suspense } from 'react'
import MagicLinkLogin from '@/components/MagicLinkLogin'
import SmartHeader from '@/components/SmartHeader'

// Apply the Inter font as per design-zint
const inter = Inter({ subsets: ['latin'] })

// Wrapper component for MagicLinkLogin with Suspense
function MagicLinkLoginWrapper() {
  return (
    <Suspense fallback={
      <div className="flex flex-col w-full gap-3">
        <div className="h-12 px-4 bg-gray-950/50 border-gray-800 rounded-lg animate-pulse"></div>
        <div className="h-12 bg-gray-800 rounded-lg animate-pulse"></div>
      </div>
    }>
      <MagicLinkLogin />
    </Suspense>
  )
}





// Main Landing Page Component
export default function Home() {
      return (
        <main className={`bg-black text-white overflow-x-hidden ${inter.className}`}>
            <SmartHeader />
      {/* --- Hero Section --- */}
      <section id="hero-section" className="relative flex items-center justify-center min-h-screen px-4 pt-20 pb-16">
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
                        <MagicLinkLoginWrapper />
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
      
      {/* --- Best Seller Theme Section --- */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            {/* <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              #1 Best Seller
            </div> */}
            <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-4">
              Most Popular Theme
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join 847+ professionals who chose this template. See why it's the top choice for portfolios.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image - Mobile First, Desktop Second */}
            <div className="relative group order-1 lg:order-2">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <img 
                  src="/bestSeller.png" 
                  alt="Eclipse Template Preview" 
                  className="w-full h-auto rounded-2xl border border-gray-700 shadow-2xl shadow-black/50 transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  Live Demo
                </div>
              </div>
            </div>
            
            {/* Content - Mobile Second, Desktop First */}
            <div className="space-y-6 order-2 lg:order-1">
              <div className="space-y-4">
                <h3 className="text-4xl font-bold text-white text-center md:text-left">The "Eclipse" Template</h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Our most-loved template featuring a stunning dark theme with smooth animations, 
                  perfect for developers, designers, and creative professionals.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <div className="text-2xl font-bold text-white text-center">847+</div>
                  <div className="text-sm text-gray-400 text-center">Active Users</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 text-center">
                  <div className="text-2xl font-bold text-white">4.9 ★</div>
                  <div className="text-sm text-gray-400">User Rating</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Responsive design for all devices</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Built-in animations and transitions</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>SEO optimized and fast loading</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a 
                  href="/preview/eclipse" 
                  target="_blank"
                  className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-transparent-900 to-transparent-600 hover:from-white-900 hover:to-white-900 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white-500/25"
                >
                  <span>Live Preview</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button 
                  onClick={() => {
                    document.getElementById('hero-section')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                  className="inline-flex items-center justify-center gap-3 bg-white-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-gray-700 hover:border-gray-600"
                >
                  <span>Get Started</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
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
            <MagicLinkLoginWrapper />
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
