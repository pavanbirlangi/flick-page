import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

// This ensures the page is always dynamically rendered and not cached
export const dynamic = 'force-dynamic'

async function getProfile(username: string) {
  // Create a special admin client that bypasses all RLS policies
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY! // Use the secret service_role key
  )
  
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  // If the query fails or no profile is found, render a 404 page
  if (error || !profile) {
    notFound()
  }

  return profile
}

// Correctly type the props for the page component
export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const { username } = params
  const profile = await getProfile(username)

  return (
    <main className="bg-slate-900 min-h-screen text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            {/* Placeholder for an image, using the first letter of the full name */}
            <span className="text-3xl font-bold text-slate-500">
              {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold">{profile.full_name || 'No name set'}</h1>
          <p className="text-blue-400 text-lg mt-1">{profile.headline || 'No headline set'}</p>
          <p className="text-slate-300 mt-4 text-center">
            {profile.bio || 'No bio set.'}
          p>
        </div>
        
        {/* This section can be expanded later to show user links */}
        <div className="mt-8 text-center">
          <a href="#" className="text-blue-400 hover:underline">LinkedIn</a>
        </div>
      </div>
    </main>
  )
}