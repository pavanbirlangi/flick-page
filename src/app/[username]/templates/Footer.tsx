import { Profile } from '@/lib/schema'
import Link from 'next/link'

export function Footer({ profile }: { profile: Profile }) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="text-center py-10 border-t border-gray-800/50 mt-24">
            <div className="container mx-auto max-w-4xl px-4 text-sm text-gray-500 flex justify-center items-center gap-1">
                <p>© {currentYear} {profile.full_name || profile.username}</p>
                
                {/* Conditional Branding */}
                {profile.plan !== 'premium' && (
                    <p className="">
                        - Powered by <Link href="/" className="hover:text-white transition-colors">Flick</Link>
                    </p>
                )}
            </div>
        </footer>
    )
}