'use client' // This top-level 'use client' is for the new component, but we'll place it logically.

import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Github, Linkedin, Twitter } from 'lucide-react'
import { useState } from 'react'

// Define types for better type safety
interface SocialLinks {
  github?: string
  linkedin?: string
  twitter?: string
}

interface Profile {
  id: string
  username: string
  full_name?: string
  headline?: string
  bio?: string
  email: string
  avatar_url?: string
  skills?: string[]
  social_links?: SocialLinks
}

// --- Client Component for the Image ---
function PortfolioImage({ src, alt, fallbackText }: { 
  src?: string
  alt: string
  fallbackText?: string 
}) {
  const [imgSrc, setImgSrc] = useState(src || '');
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const fallbackInitial = fallbackText ? fallbackText.charAt(0).toUpperCase() : '?';
      setImgSrc(`https://placehold.co/128x128/1e293b/94a3b8?text=${fallbackInitial}`);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 shadow-lg"
      onError={handleError}
    />
  );
}

// --- Server Component Logic ---
export const dynamic = 'force-dynamic'

async function getProfile(username: string): Promise<Profile> {
  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables');
    notFound();
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Database error:', error);
      notFound();
    }

    if (!profile) {
      notFound();
    }

    return profile as Profile;
  } catch (error) {
    console.error('Unexpected error:', error);
    notFound();
  }
}

export default async function UserProfilePage({ 
  params 
}: { 
  params: { username: string } 
}) {
  const { username } = params;
  const profile = await getProfile(username);

  // Safe check for social links
  const hasSocialLinks = profile.social_links && 
    (profile.social_links.linkedin || profile.social_links.github || profile.social_links.twitter);

  return (
    <main className="bg-black text-white font-sans">
      <div className="container mx-auto max-w-3xl px-4 py-16">

        {/* --- Hero Section --- */}
        <section className="flex flex-col items-center text-center">
          <PortfolioImage
            src={profile.avatar_url}
            alt={profile.full_name || 'User Avatar'}
            fallbackText={profile.full_name}
          />
          <h1 className="text-4xl font-bold mt-6">
            {profile.full_name || 'Your Name'}
          </h1>
          <p className="text-xl text-blue-400 mt-2">
            {profile.headline || 'Your Professional Headline'}
          </p>
          
          {hasSocialLinks && (
            <div className="flex justify-center gap-6 mt-6">
              {profile.social_links?.github && (
                <a 
                  href={profile.social_links.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github size={24} />
                </a>
              )}
              {profile.social_links?.linkedin && (
                <a 
                  href={profile.social_links.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={24} />
                </a>
              )}
              {profile.social_links?.twitter && (
                <a 
                  href={profile.social_links.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Twitter Profile"
                >
                  <Twitter size={24} />
                </a>
              )}
            </div>
          )}
        </section>

        {/* --- About Section --- */}
        {profile.bio && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-slate-300 mb-4">About</h2>
            <p className="text-slate-400 leading-relaxed">
              {profile.bio}
            </p>
          </section>
        )}

        {/* --- Skills Section --- */}
        {profile.skills && profile.skills.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-slate-300 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill: string, index: number) => (
                <span 
                  key={`${skill}-${index}`} 
                  className="bg-slate-800 text-blue-300 text-sm font-medium px-4 py-2 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* --- Contact Section --- */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-slate-300 mb-4">Get In Touch</h2>
          <p className="text-slate-400">
            You can reach me at{' '}
            <a 
              href={`mailto:${profile.email}`} 
              className="text-blue-400 hover:underline transition-colors"
            >
              {profile.email}
            </a>.
          </p>
        </section>

      </div>
    </main>
  )
}