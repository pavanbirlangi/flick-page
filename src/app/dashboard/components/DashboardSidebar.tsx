
'use client'

import Link from 'next/link'
import { User, Code, Star, Settings } from 'lucide-react'

export function DashboardSidebar({ activePanel }: { activePanel: string }) {
    const navItems = [
        { id: 'profile', label: 'Profile', icon: <User size={18} /> },
        { id: 'skills', label: 'Skills & Socials', icon: <Star size={18} /> },
        { id: 'projects', label: 'Projects', icon: <Code size={18} /> },
    ];

    return (
        <div className="bg-black border-r border-gray-800/50 hidden lg:flex lg:flex-col">
            <div className="flex-1">
                <nav className="space-y-2">
                    {navItems.map(item => (
                        <Link
                            key={item.id}
                            href={`/dashboard?panel=${item.id}`}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
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
                <div className="">
                <Link
                    href={`/dashboard?panel=settings`}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
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
            
        </div>
    )
}
