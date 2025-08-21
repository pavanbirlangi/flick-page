'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { DashboardSidebar } from './components/DashboardSidebar'
import { DashboardFormWrapper } from './components/DashboardFormWrapper'
import SmartHeader from '@/components/SmartHeader'
import { Loader2 } from 'lucide-react'

function DashboardContent() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
  const [activePanel, setActivePanel] = useState('profile')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  // Handle URL parameter changes for panel switching
  useEffect(() => {
    const panelParam = searchParams.get('panel')
    if (panelParam) {
      setActivePanel(panelParam)
    }
  }, [searchParams])

  const checkUser = async () => {
    try {
      setAuthLoading(true)
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/')
        return
      }

      // Fetch profile data
      await fetchProfile(user.id)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/')
    } finally {
      setAuthLoading(false)
    }
  }

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-lg">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show loading state while fetching profile
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <SmartHeader
          showPricing={false}
          showViewSite={true}
          username={profile?.username}
          full_name={profile?.full_name}
          showSignOut={true}
          variant="dashboard"
        />
        <div className="flex">
          <DashboardSidebar 
            activePanel={activePanel}
          />
          <main className="flex-1 p-6 md:p-8 pt-24 md:pt-32">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-lg">Loading your dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SmartHeader
        showPricing={false}
        showViewSite={true}
        username={profile?.username}
        full_name={profile?.full_name}
        showSignOut={true}
        variant="dashboard"
      />
      
      <div className="flex">
        <DashboardSidebar 
          activePanel={activePanel}
        />
        
        <main className="flex-1 p-6 md:p-8 pt-24 md:pt-32">
          {/* Mobile Panel Indicator */}
          <div className="md:hidden mb-6 p-4 bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-400">Current Panel:</p>
            <p className="text-lg font-semibold capitalize">{activePanel.replace(/([A-Z])/g, ' $1').replace('-', ' ').trim()}</p>
          </div>
          
          {/* Panel Content using DashboardFormWrapper */}
          <DashboardFormWrapper activePanel={activePanel} profile={profile} />
        </main>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
