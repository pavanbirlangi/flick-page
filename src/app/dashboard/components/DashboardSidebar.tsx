
'use client'

import Link from 'next/link'
import { User, Code, Star, Settings, Palette, GraduationCap, Briefcase, BarChart3, Settings2, Info } from 'lucide-react'

export function DashboardSidebar({ activePanel }: { activePanel: string }) {
    const navItems = [
        { id: 'profile', label: 'Profile', icon: <User size={18} /> },
        { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
        { id: 'education', label: 'Education', icon: <GraduationCap size={18} /> },
        { id: 'experience', label: 'Experience', icon: <Briefcase size={18} /> },
        { id: 'skills', label: 'Skills', icon: <Star size={18} /> },
        { id: 'services', label: 'Services', icon: <Settings2 size={18} /> },
        { id: 'about-stats', label: 'About Stats', icon: <BarChart3 size={18} /> },
        { id: 'additional-info', label: 'Additional Info', icon: <Info size={18} /> },
        { id: 'projects', label: 'Projects', icon: <Code size={18} /> },
    ];

    return (
        <div className="bg-black border-r border-gray-800/50 hidden lg:flex lg:flex-col">
            <div className="flex-1 p-4">
                <nav className="space-y-2">
                    {navItems.map(item => (
                        <Link
                            key={item.id}
                            href={`/dashboard?panel=${item.id}`}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                activePanel === item.id 
                                    ? 'bg-white text-black' 
                                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                            }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="p-4 border-t border-gray-800/50">
                <Link
                    href={`/dashboard?panel=settings`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activePanel === 'settings' 
                            ? 'bg-white text-black' 
                            : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                    }`}
                >
                    <Settings size={18} />
                    <span>Settings</span>
                </Link>
            </div>
        </div>
    )
}