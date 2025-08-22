
'use client'

import Link from 'next/link'
import { User, Code, Star, Settings, Palette, GraduationCap, Briefcase, BarChart3, Settings2, Info, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function DashboardSidebar({ activePanel }: { activePanel: string }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Menu Button - Always visible on mobile (above header) */}
            <div className="lg:hidden fixed top-20 left-4 z-[60]">
                <button
                    onClick={toggleMobileMenu}
                    className="bg-gray-900 border border-gray-700 text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
                    aria-label="Toggle navigation menu"
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Navigation Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[50] bg-black/50" onClick={closeMobileMenu} />
            )}

            {/* Mobile Navigation Menu (above header) */}
            <div className={`lg:hidden fixed top-20 left-4 z-[60] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}>
                <div className="p-2 max-h-[calc(100vh-8rem)] overflow-y-auto">
                    <nav className="space-y-1">
                        {navItems.map(item => (
                            <Link
                                key={item.id}
                                href={`/dashboard?panel=${item.id}`}
                                onClick={closeMobileMenu}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors min-w-[200px] ${
                                    activePanel === item.id 
                                        ? 'bg-white text-black' 
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                        
                        {/* Settings - Separated with border */}
                        <div className="border-t border-gray-700 mt-2 pt-2">
                            <Link
                                href={`/dashboard?panel=settings`}
                                onClick={closeMobileMenu}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors min-w-[200px] ${
                                    activePanel === 'settings' 
                                        ? 'bg-white text-black' 
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <Settings size={18} />
                                <span>Settings</span>
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Desktop Sidebar - Fixed position, doesn't scroll */}
            <div className="bg-black border-r border-gray-800/50 hidden lg:block lg:w-64 lg:fixed lg:top-20 lg:left-0 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto">
                <div className="p-4">
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
        </>
    )
}