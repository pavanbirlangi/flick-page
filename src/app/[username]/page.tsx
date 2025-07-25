import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

async function getProfile(username: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { get: (name: string) => cookieStore.get(name)?.value },
    }
  )

  // Adding more robust error logging
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (error) {
    console.error(`Error fetching profile for ${username}:`, error)
    notFound()
  }
  if (!profile) {
    notFound()
  }

  return profile
}

// Define the proper type for Next.js 15
interface PageProps {
  params: Promise<{ username: string }>
}

export default async function UserProfilePage({ params }: PageProps) {
  // Await the params promise in Next.js 15
  const { username } = await params
  const profile = await getProfile(username)

  return (
    <main className="bg-slate-900 min-h-screen text-white flex items-center justify-center p-4">
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
        </div>
        
        <div className="mt-8 text-center">
          <a href="#" className="text-blue-400 hover:underline">LinkedIn</a>
        </div>
      </div>
    </main>
  )
}