'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { DashboardSidebar } from './components/DashboardSidebar'
import { DashboardFormWrapper } from './components/DashboardFormWrapper'
import type { Profile } from '@/lib/schema'
import SmartHeader from '@/components/SmartHeader'
import { Loader2 } from 'lucide-react'

function DashboardContent() {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activePanel, setActivePanel] = useState('profile')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setError(null)
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/')
        return
      }

      // Fetch profile data
      await fetchProfile(user.id)
    } catch (error) {
      console.error('Error checking user:', error)
      setError('Failed to authenticate user')
    } finally {
      setAuthLoading(false)
    }
  }

  const fetchProfile = async (userId: string) => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // If profile doesn't exist, create one for the new user
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating new profile for user:', userId)
          await createNewProfile(userId)
          // Fetch the newly created profile
          const { data: newProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()
          
          if (fetchError) {
            console.error('Error fetching newly created profile:', fetchError)
            setError('Failed to create user profile')
            return
          }
          
          setProfile(newProfile)
        } else {
          console.error('Error fetching profile:', error)
          setError('Failed to load user profile')
          return
        }
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
      setError('Failed to load or create user profile')
    } finally {
      setLoading(false)
    }
  }

  // Generate a unique, valid username
  const generateUsername = (userId: string, fullName?: string): string => {
    try {
      // Try to create username from full name first
      if (fullName && fullName.trim()) {
        const nameBasedUsername = fullName
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s]/g, '') // Remove special characters, keep only letters, numbers, spaces
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
          .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
        
        // Ensure it meets schema requirements (3-20 characters)
        if (nameBasedUsername.length >= 3 && nameBasedUsername.length <= 20) {
          // Check if it's not a reserved word
          const reservedWords = ['www', 'app', 'dashboard', 'settings', 'profile']
          if (!reservedWords.includes(nameBasedUsername)) {
            return nameBasedUsername
          }
        }
      }
      
      // Fallback 1: generate from userId with timestamp (ensure 3-20 characters)
      const userIdPart = userId.substring(0, 6) // Reduced from 8 to 6
      const timestamp = Date.now().toString(36).substring(0, 3) // Reduced from 4 to 3
      
      let generatedUsername = `u${userIdPart}${timestamp}`
      
      // Ensure it's between 3-20 characters (schema requirement)
      if (generatedUsername.length > 20) {
        generatedUsername = generatedUsername.substring(0, 20)
      }
      
      // Ensure it starts with a letter
      if (!/^[a-z]/.test(generatedUsername)) {
        generatedUsername = `u${generatedUsername}`
      }
      
      // Final validation: ensure it matches schema regex
      if (/^[a-z0-9-]+$/.test(generatedUsername) && generatedUsername.length >= 3 && generatedUsername.length <= 20) {
        return generatedUsername
      }
      
      // If still invalid, use ultra-safe fallback
      throw new Error('Generated username failed validation')
      
    } catch (error) {
      console.error('Error in generateUsername:', error)
      
      // Fallback 2: ultra-safe username generation (guaranteed to work)
      const safeId = userId.replace(/[^a-f0-9]/g, '').substring(0, 4)
      const safeTimestamp = Date.now().toString(36).substring(0, 2)
      const safeUsername = `u${safeId}${safeTimestamp}`
      
      // Ensure it meets all requirements
      if (safeUsername.length >= 3 && safeUsername.length <= 20 && /^[a-z0-9-]+$/.test(safeUsername)) {
        return safeUsername
      }
      
      // Last resort: simple but guaranteed valid username
      return `user${Date.now().toString(36).substring(0, 2)}`
    }
  }

  const createNewProfile = async (userId: string) => {
    try {
      // Get user info from auth
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.error('No user found in auth')
        throw new Error('No user found in auth')
      }

      // Generate username
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
      let username = generateUsername(userId, fullName)
      
      // Check if username already exists and generate a new one if needed
      let usernameExists = true
      let attempts = 0
      const maxUsernameAttempts = 5
      
      while (usernameExists && attempts < maxUsernameAttempts) {
        attempts++
        
        if (attempts > 1) {
          username = generateUsername(userId, '') // Generate without name to get different username
        }
        
        // Check if username exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .single()
        
        usernameExists = !!existingProfile
        
        if (usernameExists) {
          console.log(`Username ${username} already exists, generating new one...`)
        }
      }
      
      if (usernameExists) {
        console.error('Failed to generate unique username after', maxUsernameAttempts, 'attempts')
        throw new Error('Failed to generate unique username')
      }
      
      console.log('Generated unique username:', username, 'for user:', userId, 'after', attempts, 'attempts')
      console.log('Username validation:', {
        length: username.length,
        format: /^[a-z0-9-]+$/.test(username),
        notReserved: !['www', 'app', 'dashboard', 'settings', 'profile'].includes(username)
      })

      // Create default profile data
      const defaultProfile = {
        id: userId,
        username: username,
        full_name: fullName,
        email: user.email || '',
        template: 'basic',
        avatar_url: '',
        headline: '',
        bio: '',
        about_description: '',
        skills: [],
        social_links: {
          linkedin: '',
          github: '',
          twitter: ''
        },
        projects: [],
        education: [],
        experience: [],
        skills_categories: [],
        about_stats: [],
        services: [],
        additional_info: {}
      }

      // Validate username before insertion (schema requirements)
      if (!username || username.length < 3 || username.length > 20) {
        console.error('Invalid username length:', username, 'Length:', username?.length)
        throw new Error('Failed to generate valid username length')
      }
      
      // Validate username format (schema regex)
      if (!/^[a-z0-9-]+$/.test(username)) {
        console.error('Invalid username format:', username)
        throw new Error('Failed to generate valid username format')
      }
      
      // Check for reserved words
      const reservedWords = ['www', 'app', 'dashboard', 'settings', 'profile']
      if (reservedWords.includes(username)) {
        console.error('Username is reserved word:', username)
        throw new Error('Generated username is a reserved word')
      }

      console.log('Attempting to create profile with username:', username)

      // Try to insert profile, with retry logic for username conflicts
      let insertError = null
      let insertAttempts = 0
      const maxInsertAttempts = 3
      let currentUsername = username

      while (insertAttempts < maxInsertAttempts) {
        insertAttempts++
        
        if (insertAttempts > 1) {
          // Generate a new username for retry attempts
          const retryUsername = generateUsername(userId, '')
          
          // Validate the retry username
          if (retryUsername && retryUsername.length >= 3 && retryUsername.length <= 20 && 
              /^[a-z0-9-]+$/.test(retryUsername) && 
              !['www', 'app', 'dashboard', 'settings', 'profile'].includes(retryUsername)) {
            currentUsername = retryUsername
            defaultProfile.username = retryUsername
            console.log(`Retry attempt ${insertAttempts}: using username ${retryUsername}`)
          } else {
            console.error('Retry username validation failed:', retryUsername)
            throw new Error('Failed to generate valid retry username')
          }
        }

        const { error } = await supabase
          .from('profiles')
          .insert(defaultProfile)

        if (!error) {
          insertError = null
          break
        }

        insertError = error
        
        // If it's a unique constraint violation, try again
        if (error.code === '23505' && insertAttempts < maxInsertAttempts) {
          console.log(`Username conflict detected, retrying with new username...`)
          continue
        }
        
        // For other errors, break immediately
        break
      }

      if (insertError) {
        console.error('Error creating new profile after', attempts, 'attempts:', insertError)
        console.error('Profile data that failed:', defaultProfile)
        throw insertError
      }

      console.log('New profile created successfully for user:', userId, 'with username:', currentUsername, 'after', insertAttempts, 'attempts')
    } catch (error) {
      console.error('Error in createNewProfile:', error)
      throw error
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

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
                </div>
          <h2 className="text-xl font-semibold mb-2">Profile Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
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
          username={profile?.username as string | undefined}
          full_name={profile?.full_name as string | undefined}
          showSignOut={true}
          variant="dashboard"
        />
        {/* Spacer to offset fixed header height */}
        <div className="h-20" />
        <div className="flex">
          <DashboardSidebar 
            activePanel={activePanel}
          />
          <main className="flex-1 p-6 md:p-8 pt-6 lg:ml-64">
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
        username={profile?.username as string | undefined}
        full_name={profile?.full_name as string | undefined}
        showSignOut={true}
        variant="dashboard"
      />
      {/* Spacer to offset fixed header height */}
      <div className="h-20" />
      
            <div className="flex">
        <DashboardSidebar 
          activePanel={activePanel}
        />
        
        <main className="flex-1 p-6 md:p-8 pt-6 lg:ml-64">
          {/* Mobile Panel Indicator */}
          <div className="md:hidden mb-6 p-4 bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-400">Current Panel:</p>
            <p className="text-lg font-semibold capitalize">{activePanel.replace(/([A-Z])/g, ' $1').replace('-', ' ').trim()}</p>
                        </div>
          
          {/* Panel Content using DashboardFormWrapper */}
          <DashboardFormWrapper activePanel={activePanel} profile={profile as Profile | null} />
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
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
