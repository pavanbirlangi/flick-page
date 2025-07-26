import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getProfile(username: string) {
  console.log('🔍 Starting profile lookup for username:', username)
  console.log('🔍 Username type:', typeof username)
  console.log('🔍 Username length:', username.length)
  console.log('🔍 Username trimmed:', username.trim())
  
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { get: (name: string) => cookieStore.get(name)?.value },
    }
  )

  console.log('🔍 Supabase client created')
  console.log('🔍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('🔍 Anon key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  // First, let's see all usernames in the database for debugging
  try {
    const { data: allProfiles, error: allError } = await supabase
      .from('profiles')
      .select('username')
      .limit(10)
    
    console.log('🔍 All usernames in database (first 10):', allProfiles)
    if (allError) console.log('🔍 Error fetching all profiles:', allError)
  } catch (debugError) {
    console.log('🔍 Error in debug query:', debugError)
  }

  // Now try the specific query
  console.log('🔍 Querying for specific username:', username)
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  console.log('🎯 Profile query completed')
  console.log('🎯 Profile data:', profile)
  console.log('🎯 Profile error:', error)
  console.log('🎯 Error code:', error?.code)
  console.log('🎯 Error message:', error?.message)
  console.log('🎯 Error details:', error?.details)

  if (error) {
    console.error(`❌ Error fetching profile for ${username}:`, {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    })
    
    // Don't call notFound() immediately, let's see what the error is
    if (error.code === 'PGRST116') {
      console.log('❌ No rows returned - user does not exist')
    }
    
    notFound()
  }
  
  if (!profile) {
    console.log('❌ Profile is null/undefined')
    notFound()
  }

  console.log('✅ Profile found successfully:', {
    username: profile.username,
    full_name: profile.full_name,
    id: profile.id
  })
  
  return profile
}

// Define the proper type for Next.js 15
interface PageProps {
  params: Promise<{ username: string }>
}

export default async function UserProfilePage({ params }: PageProps) {
  console.log('🚀 UserProfilePage component started')
  
  try {
    // Await the params promise in Next.js 15
    console.log('🔍 Awaiting params...')
    const resolvedParams = await params
    console.log('🔍 Resolved params:', resolvedParams)
    
    const { username } = resolvedParams
    console.log('🔍 Extracted username:', username)
    
    console.log('🔍 Calling getProfile...')
    const profile = await getProfile(username)
    console.log('✅ Profile retrieved successfully')

    return (
      <main className="bg-slate-900 min-h-screen text-white flex items-center justify-center p-4">
        {/* Debug info at the top */}
        <div className="fixed top-0 left-0 bg-green-500 text-black p-2 text-xs z-50">
          DEBUG: Username = {username} | Profile ID = {profile.id}
        </div>
        
        <div className="w-full max-w-md mx-auto bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-slate-500">
                {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
                     
            <h1 className="text-3xl font-bold">{profile.full_name || 'No name set'}</h1>
            <p className="text-blue-400 text-lg mt-1">{profile.headline || 'No headline set'}</p>
            <p className="text-slate-300 mt-4 text-center">
              {profile.bio || 'No bio set.'}
            </p>
            
            {/* Debug info */}
            <div className="mt-4 p-2 bg-blue-900 rounded text-xs">
              <p>Debug Info:</p>
              <p>Username: {username}</p>
              <p>Profile ID: {profile.id}</p>
              <p>Created: {profile.created_at}</p>
            </div>
          </div>
                 
          <div className="mt-8 text-center">
            <a href="#" className="text-blue-400 hover:underline">LinkedIn</a>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error('💥 Error in UserProfilePage:', error)
    
    return (
      <main className="bg-red-900 min-h-screen text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Error occurred</h1>
          <pre className="mt-4 text-sm bg-black p-4 rounded">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </main>
    )
  }
}