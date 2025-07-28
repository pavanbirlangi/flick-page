// Enhanced Dashboard following Core Design Principles
// Replace the entire content of `src/app/dashboard/page.tsx` with this file.

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProfileForm } from './ProfileForm'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { 
  LogOut, ArrowUpRight, Check, Circle, Trophy, Target, 
  Zap, TrendingUp, Eye, Users, Share2, 
  Star, ArrowRight, Sparkles, Medal, Plus
} from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

function LogoutButton() {
    return (
        <form action="/auth/signout" method="post">
            <button 
                type="submit" 
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
                <LogOut size={16} />
                <span>Logout</span>
            </button>
        </form>
    )
}

function DashboardHeader({ username }: { username: string | undefined }) {
    return (
        <header className="bg-black/80 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50">
            <div className="container mx-auto max-w-7xl flex justify-between items-center h-20 px-6">
                <Link href="/" className="text-xl font-bold tracking-tight text-white">
                    flick.page
                </Link>
                <div className="flex items-center gap-6">
                    <a 
                        href={`http://${username}.flavorr.in`}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-2xl text-sm font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                        <span>View Your Page</span>
                        <ArrowUpRight size={16} />
                    </a>
                    <LogoutButton />
                </div>
            </div>
        </header>
    )
}

// Achievement System - Muted Design
function AchievementBadge({ title, description, isUnlocked }: { title: string, description: string, isUnlocked: boolean }) {
    return (
        <div className={`p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
            isUnlocked 
                ? 'bg-gray-900/50 border-gray-700/80 shadow-md' 
                : 'bg-gray-950/50 border-gray-800'
        }`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isUnlocked ? 'bg-white text-black' : 'bg-gray-800 text-gray-500'}`}>
                    {isUnlocked ? <Trophy size={16} /> : <Medal size={16} />}
                </div>
                <div>
                    <h4 className={`font-semibold text-sm ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                        {title}
                    </h4>
                    <p className="text-xs text-gray-400">{description}</p>
                </div>
            </div>
        </div>
    )
}

function Achievements({ profile }) {
    const achievements = [
        { 
            id: 'first_project', 
            title: 'First Project', 
            description: 'Added your first project',
            isUnlocked: (profile?.projects?.length || 0) >= 1 
        },
        { 
            id: 'skill_master', 
            title: 'Skill Master', 
            description: 'Added 5+ skills',
            isUnlocked: (profile?.skills?.length || 0) >= 5 
        },
        { 
            id: 'profile_complete', 
            title: 'Profile Complete', 
            description: 'Completed all sections',
            isUnlocked: !!profile?.avatar_url && !!profile?.bio && (profile?.skills?.length || 0) >= 3 && (profile?.projects?.length || 0) >= 1
        }
    ];

    const unlockedCount = achievements.filter(a => a.isUnlocked).length;

    return (
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-black/50 hover:shadow-3xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Achievements</h3>
                <div className="flex items-center gap-2 text-sm">
                    <Trophy size={16} className="text-gray-400" />
                    <span className="text-white font-semibold">{unlockedCount}/{achievements.length}</span>
                </div>
            </div>
            <div className="space-y-3">
                {achievements.map(achievement => (
                    <AchievementBadge 
                        key={achievement.id}
                        title={achievement.title}
                        description={achievement.description}
                        isUnlocked={achievement.isUnlocked}
                    />
                ))}
            </div>
        </div>
    )
}

// Profile Completeness - Clean & Minimal
function ProfileCompleteness({ profile }) {
    const completenessTasks = [
        { id: 'avatar', text: 'Add profile picture', isComplete: !!profile?.avatar_url },
        { id: 'bio', text: 'Write compelling bio', isComplete: !!profile?.bio },
        { id: 'skills', text: 'Add 3+ skills', isComplete: (profile?.skills?.length || 0) >= 3 },
        { id: 'projects', text: 'Showcase project', isComplete: (profile?.projects?.length || 0) >= 1 },
    ];

    const completedCount = completenessTasks.filter(task => task.isComplete).length;
    const totalCount = completenessTasks.length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    return (
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-black/50 hover:shadow-3xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Profile Strength</h3>
                <div className="text-right">
                    <div className="font-bold text-white text-xl">{percentage}%</div>
                    <div className="text-xs text-gray-400">Complete</div>
                </div>
            </div>
            
            <div className="mb-6">
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                        className="bg-white h-2 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
            
            <ul className="space-y-3">
                {completenessTasks.map(task => (
                    <CompletenessItem key={task.id} task={task} />
                ))}
            </ul>
            
            {percentage === 100 && (
                <div className="mt-6 p-4 bg-gray-900 border border-gray-700 rounded-2xl">
                    <div className="flex items-center gap-3 text-white">
                        <div className="p-2 bg-white text-black rounded-xl">
                            <Trophy size={16} />
                        </div>
                        <span className="font-semibold">Profile Complete!</span>
                    </div>
                </div>
            )}
        </div>
    )
}

function CompletenessItem({ task }: { task: { text: string, isComplete: boolean } }) {
    return (
        <li className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 hover:bg-gray-900/50 ${
            task.isComplete ? 'bg-gray-900/30' : 'bg-gray-900/10'
        }`}>
            <div className={`p-1 rounded-full ${task.isComplete ? 'bg-white' : 'bg-gray-700'}`}>
                {task.isComplete ? (
                    <Check size={12} className="text-black" />
                ) : (
                    <Circle size={12} className="text-gray-500" />
                )}
            </div>
            <span className={`text-sm ${task.isComplete ? 'text-white' : 'text-gray-400'}`}>
                {task.text}
            </span>
        </li>
    )
}

// Analytics - Minimal & Clean
function Analytics({ profile }) {
    const stats = [
        { label: 'Profile Views', value: '1,247', icon: <Eye size={18} />, change: '+12%' },
        { label: 'Page Visits', value: '89', icon: <Users size={18} />, change: '+5%' },
        { label: 'Profile Shares', value: '23', icon: <Share2 size={18} />, change: '+8%' }
    ];

    return (
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-black/50 hover:shadow-3xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
                <TrendingUp size={20} className="text-gray-400" />
                <h3 className="text-lg font-bold text-white">Analytics</h3>
            </div>
            <div className="space-y-4">
                {stats.map((stat, index) => (
                    <div key={stat.label} className="flex items-center justify-between p-4 bg-gray-900/30 rounded-2xl hover:bg-gray-900/50 transition-colors duration-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gray-800 text-gray-400">
                                {stat.icon}
                            </div>
                            <div>
                                <div className="font-bold text-white">{stat.value}</div>
                                <div className="text-sm text-gray-400">{stat.label}</div>
                            </div>
                        </div>
                        <div className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-800 text-gray-300">
                            {stat.change}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Quick Actions - Sharp & Functional
function QuickActions() {
    const actions = [
        { label: 'Add New Project', icon: <Plus size={16} />, href: '#projects' },
        { label: 'Update Skills', icon: <Zap size={16} />, href: '#skills' },
        { label: 'Share Profile', icon: <Share2 size={16} />, href: '#share' }
    ];

    return (
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-black/50 hover:shadow-3xl transition-shadow duration-300">
            <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
            <div className="space-y-3">
                {actions.map(action => (
                    <button 
                        key={action.label}
                        className="w-full flex items-center justify-between p-4 bg-gray-900/30 border border-gray-800 rounded-2xl hover:bg-gray-900/50 hover:border-gray-700 transition-all duration-300 group hover:shadow-lg hover:scale-[1.02]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gray-800 text-gray-400 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                                {action.icon}
                            </div>
                            <span className="text-white font-medium">{action.label}</span>
                        </div>
                        <ArrowRight size={16} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
                    </button>
                ))}
            </div>
        </div>
    )
}

// Weekly Focus - Minimal Challenge
function WeeklyFocus() {
    return (
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl shadow-black/50 hover:shadow-3xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-800 rounded-xl">
                    <Target size={16} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Weekly Focus</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                Add a compelling project description that showcases your problem-solving approach.
            </p>
            <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">This week's goal</div>
                <button className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                    Start Now
                </button>
            </div>
        </div>
    )
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/')

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

  return (
    <div className={`min-h-screen bg-black text-white ${inter.className}`}>
        <DashboardHeader username={profile?.username} />
        <main className="container mx-auto max-w-7xl p-6">
            <div className="py-12">
                {/* Clean Header Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                        Monitor your profile performance and optimize your professional presence.
                    </p>
                </div>

                {/* Clean Grid Layout */}
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main Content - Profile Form */}
                    <div className="lg:col-span-8 bg-neutral-900 border border-black rounded-2xl p-8 shadow-2xl shadow-black/50 hover:shadow-3xl transition-shadow duration-300">
                        <ProfileForm profile={profile} />
                    </div>
                    
                    {/* Clean Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <ProfileCompleteness profile={profile} />
                        <Analytics profile={profile} />
                        <Achievements profile={profile} />
                        <QuickActions />
                        <WeeklyFocus />
                    </div>
                </div>
            </div>
        </main>
    </div>
  )
}