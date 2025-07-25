import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/')
  }

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    const { data: newUserProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({ 
        id: session.user.id, 
        username: `user_${session.user.id.substring(0, 8)}`,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating profile:", insertError);
      // You could redirect to an error page here
    }
    profile = newUserProfile;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
      <p className="text-slate-500 mt-2">
        Logged in as: {session.user.email}
      </p>
      <p className="mt-4">Your username is: <strong>{profile?.username}</strong></p>
      <p className="mt-8">The form to edit your page is coming soon!</p>
    </div>
  )
}