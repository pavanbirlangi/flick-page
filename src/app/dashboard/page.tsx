import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { LogOut, ArrowUpRight } from 'lucide-react'

import { DashboardSidebar } from './components/DashboardSidebar'
import { DashboardFormWrapper } from './components/DashboardFormWrapper'

import { Profile } from '@/lib/schema'

const inter = Inter({ subsets: ['latin'] })

function LogoutButton() {
    return (
        <form action="/auth/signout" method="post">
            <button 
                type="submit" 
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
            >
                <LogOut size={16} />
                <span>Logout</span>
            </button>
        </form>
    )
}

function DashboardHeader({ username, full_name }: { username?: string, full_name?: string }) {
    return (
        <header className="bg-black border-b border-gray-800/50 z-50">
            <div className="container mx-auto max-w-7xl flex justify-between items-center h-20 px-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-xl font-bold tracking-tight">
                        Flick
                    </Link>
                </div>
                <div className="flex items-center gap-6">
                    <a 
                        href={`http://${username}.flavorr.in`} // Replace with flick.page for production
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        <span>View Page</span>
                        <ArrowUpRight size={16} />
                    </a>
                    <LogoutButton />
                </div>
            </div>
        </header>
    )
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ panel?: string }> }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  let { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  
  if (!profile) {
    const { data: newUserProfile } = await supabase.from('profiles').insert({ id: user.id, username: `user_${user.id.substring(0, 8)}` }).select().single();
    profile = newUserProfile;
  }

  const resolvedSearchParams = await searchParams;
  const activePanel = resolvedSearchParams?.panel || 'profile';

  return (
    <div className={`min-h-screen bg-black text-white ${inter.className}`}>
        <div className=" min-h-screen">
            {/* Full-height Sidebar */}
            
            <DashboardHeader username={profile?.username} full_name={profile?.full_name} />
            {/* Main Content Area */}
            <div className="flex">
                <DashboardSidebar activePanel={activePanel} />
                <main className="flex-1 p-4 sm:p-8 lg:ml-0">
                    <div className="py-1">
                        {/* Mobile Panel Indicator */}
                        <div className="lg:hidden mb-6">
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                                <h2 className="text-lg font-semibold text-white capitalize">
                                    {activePanel === 'about-stats' ? 'About Stats' : 
                                     activePanel === 'additional-info' ? 'Additional Info' : 
                                     activePanel.replace('-', ' ')}
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Use the menu button to navigate between panels
                                </p>
                            </div>
                        </div>
                        
                        <div className="mb-12 px-4 hidden">
                            <h1 className="text-4xl font-bold">Dashboard</h1>
                            <p className="text-gray-400 mt-2">This is your control panel. Update your information and see it live instantly.</p>
                        </div>
                        <DashboardFormWrapper activePanel={activePanel} profile={profile as Profile} />
                    </div>
                </main>
            </div>
        </div>
    </div>
  )
}
