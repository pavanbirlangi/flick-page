import { Profile } from '@/lib/schema'
import { Github, Linkedin, Twitter } from 'lucide-react'
import { PortfolioImage } from '../PortfolioImage'
import { Footer } from './Footer'
import { InteractiveProjects } from './InteractiveProjects' // Import the new component

export function AxisTemplate({ profile }: { profile: Profile }) {
    const hasSocialLinks = profile.social_links && (profile.social_links.linkedin || profile.social_links.github || profile.social_links.twitter);

    return (
        <main className="bg-black text-white font-sans">
            <div className="container mx-auto max-w-5xl px-4 py-16">
                
                {/* --- Header Grid --- */}
                <header className="grid md:grid-cols-3 gap-8 mb-24">
                    <div className="md:col-span-1 flex justify-center md:justify-start">
                         <PortfolioImage
                            src={profile.avatar_url}
                            alt={profile.full_name || 'User Avatar'}
                            fallbackText={profile.full_name}
                        />
                    </div>
                    <div className="md:col-span-2 text-center md:text-left">
                        <h1 className="text-5xl font-bold text-white">{profile.full_name || 'Your Name'}</h1>
                        <p className="text-2xl text-gray-400 mt-2">{profile.headline || 'Your Professional Headline'}</p>
                        {hasSocialLinks && (
                            <div className="flex justify-center md:justify-start gap-6 mt-6">
                                {profile.social_links?.github && <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Github /></a>}
                                {profile.social_links?.linkedin && <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Linkedin /></a>}
                                {profile.social_links?.twitter && <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Twitter /></a>}
                            </div>
                        )}
                    </div>
                </header>

                {/* --- Main Content Grid --- */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: About, Skills, & Contact */}
                    <aside className="md:col-span-1 space-y-8">
                        {profile.bio && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-wider mb-4">About</h2>
                                <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
                            </div>
                        )}
                        {profile.skills && profile.skills.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-wider mb-4">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map(skill => (
                                        <span key={skill} className="bg-gray-900 text-gray-300 text-sm px-3 py-1 rounded-md">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {profile.email && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-wider mb-4">Contact</h2>
                                <a href={`mailto:${profile.email}`} className="text-white hover:underline break-all">{profile.email}</a>
                            </div>
                        )}
                    </aside>

                    {/* Right Column: Projects */}
                    <section className="md:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-wider mb-4">Projects</h2>
                        <InteractiveProjects projects={profile.projects} />
                    </section>
                </div>

            </div>
            <Footer profile={profile} />
        </main>
    );
}