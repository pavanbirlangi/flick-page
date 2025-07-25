import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProfileForm } from './ProfileForm' // We are importing the form component

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { get: (name: string) => cookieStore.get(name)?.value },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/')

  // This logic to fetch or create a profile remains the same
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()
  
  if (!profile) {
    const { data: newUserProfile } = await supabase
      .from('profiles')
      .insert({ id: session.user.id, username: `user_${session.user.id.substring(0, 8)}` })
      .select().single()
    profile = newUserProfile
  }

  // The return statement is what we are updating for the new UI
  return (
    <div className="min-h-screen bg-slate-900 text-white flex justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400">
            This is your control panel. Your public page is live at: 
            <a href={`http://${profile?.username}.flavorr.in`} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-400 hover:underline ml-1">
              {profile?.username}.flavorr.in
            </a>
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 sm:p-8">
            <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  )
}