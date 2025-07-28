// Complete integration example showing how to use the enhanced components
// Updated to match your actual API response structure

import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Github, Linkedin, Twitter, ExternalLink, Code, Calendar, Users, Star } from 'lucide-react'
import { PortfolioImage } from './PortfolioImage'
import Image from 'next/image'
import { marked } from 'marked' // npm install marked @types/marked

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

    console.log(profile);

    return profile as Profile;
  } catch (error) {
    console.error('Unexpected error:', error);
    notFound();
  }
}

// Updated interfaces to match your API response
interface SocialLinks {
  github?: string
  linkedin?: string
  twitter?: string
}

interface Project {
  title: string
  description: string // Now supports markdown
  imageUrl: string
  liveUrl: string
  githubUrl?: string
  technologies?: string[]
  startDate?: string
  endDate?: string
  teamSize?: number
  status?: 'completed' | 'in-progress' | 'archived'
  highlights?: string[] // Back to string array since your data shows strings
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
  social_links?: SocialLinks // This matches your response
  links?: any // Additional field from your response
  projects?: Project[]
  updated_at?: string // Additional field from your response
}

// Simple markdown-to-HTML converter (no external library needed)
function parseSimpleMarkdown(text: string): string {
  return text
    // Fix escaped characters first
    .replace(/\\`/g, '`')
    .replace(/\\\\/g, '\\')
    // Convert headers
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium text-gray-200 mb-2 mt-4 first:mt-0">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-white mb-3 mt-5 first:mt-0">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mb-4 mt-6 first:mt-0">$1</h1>')
    // Convert bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    // Convert inline code
    .replace(/`([^`]+)`/g, '<code class="bg-black text-blue-300 px-2 py-1 rounded text-sm font-mono">$1</code>')
    // Convert bullet lists
    .replace(/^- (.+)$/gm, '<li class="text-gray-300">$1</li>')
    // Wrap consecutive list items in ul tags
    .replace(/(<li class="text-gray-300">.*<\/li>)/s, '<ul class="list-disc list-inside space-y-1 mb-4 text-gray-300 ml-4">$1</ul>')
    // Convert line breaks to paragraphs
    .split('\n\n')
    .map(paragraph => {
      paragraph = paragraph.trim()
      if (!paragraph) return ''
      if (paragraph.startsWith('<h') || paragraph.startsWith('<ul')) return paragraph
      return `<p class="mb-4 text-gray-300 leading-relaxed">${paragraph.replace(/\n/g, '<br>')}</p>`
    })
    .filter(Boolean)
    .join('')
}

// Status badge component
function StatusBadge({ status }: { status?: string }) {
  if (!status) return null
  
  const statusConfig = {
    completed: { color: 'bg-green-900 text-green-300 border-green-700', label: 'Completed' },
    'in-progress': { color: 'bg-blue-900 text-blue-300 border-blue-700', label: 'In Progress' },
    archived: { color: 'bg-gray-700 text-white border-gray-600', label: 'Archived' }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig]
  if (!config) return null
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  )
}

// Technology tags component
function TechTags({ technologies }: { technologies?: string[] }) {
  if (!technologies || !Array.isArray(technologies) || technologies.length === 0) {
    return null
  }
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {technologies.map((tech, index) => (
        <span 
          key={`${tech}-${index}`}
          className="bg-black text-blue-300 text-xs font-medium px-3 py-1 rounded-full border border-gray-700 hover:bg-gray-700 transition-colors"
        >
          {tech}
        </span>
      ))}
    </div>
  )
}

// Project metadata component
function ProjectMetadata({ project }: { project: Project }) {
  const hasMetadata = project.startDate || project.teamSize || project.status
  
  if (!hasMetadata) return null

  // Helper function to format date from YYYY-MM format
  const formatDate = (dateString: string) => {
    try {
      // Handle YYYY-MM format
      if (dateString.match(/^\d{4}-\d{2}$/)) {
        const [year, month] = dateString.split('-')
        const date = new Date(parseInt(year), parseInt(month) - 1, 1)
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      }
      // Handle full date
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    } catch {
      return dateString
    }
  }
  
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-white">
      {project.startDate && (
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>
            {formatDate(project.startDate)}
            {project.endDate && project.endDate !== project.startDate && 
              ` - ${formatDate(project.endDate)}`}
          </span>
        </div>
      )}
      {project.teamSize && (
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span>{project.teamSize} team member{project.teamSize > 1 ? 's' : ''}</span>
        </div>
      )}
      <StatusBadge status={project.status} />
    </div>
  )
}


// Main Project Brief Component
function ProjectBrief({ project, index, totalProjects }: { project: Project; index: number; totalProjects: number }) {
  // Handle markdown parsing safely using the existing parseSimpleMarkdown function
  let renderedDescription = ''
  try {
    let description = project.description || ''
    if (description.trim()) {
      // Use the existing parseSimpleMarkdown function
      renderedDescription = parseSimpleMarkdown(description)
    } else {
      renderedDescription = '<p class="mb-4 text-gray-300 leading-relaxed">No description available.</p>'
    }
  } catch (error) {
    console.error('Error parsing markdown:', error)
    const cleanDescription = (project.description || 'No description available.').replace(/\\`/g, '`').replace(/\\\\/g, '\\')
    renderedDescription = `<p class="mb-4 text-gray-300 leading-relaxed">${cleanDescription}</p>`
  }
  
  return (
    <article className="mb-16 last:mb-0">
      {/* Project Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-3xl font-bold text-white leading-tight">{project.title}</h3>
          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white transition-colors p-2 hover:bg-black rounded-lg group"
                aria-label="View source code"
              >
                <Code size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium hover:scale-105 hover:shadow-lg"
              >
                <span>View Live</span>
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
        
        <ProjectMetadata project={project} />
        <TechTags technologies={project.technologies} />
      </div>

      {/* Project Image */}
      {project.imageUrl && (
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-xl overflow-hidden bg-black border border-gray-700 group">
          <Image
            src={project.imageUrl}
            alt={`${project.title} preview`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 hidden"/>
        </div>
      )}

      {/* Project Description */}
      <div className="mb-8">
        {renderedDescription ? (
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderedDescription }}
          />
        ) : (
          <div className="text-gray-300 leading-relaxed">
            {project.description ? (
              <pre className="whitespace-pre-wrap font-sans">
                {project.description.replace(/\\`/g, '`').replace(/\\\\/g, '\\')}
              </pre>
            ) : (
              <p>No description available.</p>
            )}
          </div>
        )}
      </div>

      {/* Key Highlights */}
      {project.highlights && Array.isArray(project.highlights) && project.highlights.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
          <h4 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
            <Star size={20} className="text-yellow-400" />
            Key Achievements
          </h4>
          <ul className="space-y-3">
            {project.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-300">
                <span className="text-blue-400 mt-1 text-lg">•</span>
                <span className="leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Separator */}
      {index < totalProjects - 1 && (
        <div className="mt-16 flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          <div className="px-4">
            <div className="w-2 h-2 bg-gray-600 rounded-full" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        </div>
      )}
    </article>
  )
}

// Enhanced Projects Section
function EnhancedProjectsSection({ projects }: { projects?: Project[] }) {
  if (!projects || projects.length === 0) {
    return (
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-gray-200 mb-8">Projects</h2>
        <div className="text-center py-12 text-white">
          <Code size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No projects to showcase yet.</p>
          <p className="text-sm mt-2">Check back soon for updates!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Featured Projects</h2>
        <p className="text-white text-lg">A showcase of my recent work and contributions</p>
      </div>
      <div className="space-y-0">
        {projects.map((project, index) => (
          <ProjectBrief 
            key={`${project.title}-${index}`} 
            project={project} 
            index={index} 
            totalProjects={projects.length}
          />
        ))}
      </div>
    </section>
  )
}

// Updated main component (replace the existing Projects Section)
export default async function UserProfilePage({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}) {
  const { username } = await params;
  const profile = await getProfile(username);

  // Check for social links in the social_links object
  const hasSocialLinks = profile.social_links && 
    (profile.social_links.linkedin || profile.social_links.github || profile.social_links.twitter);

  return (
    <main className="bg-black text-white font-sans min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-16">

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center">
          <PortfolioImage
            src={profile.avatar_url}
            alt={profile.full_name || 'User Avatar'}
            fallbackText={profile.full_name}
          />
          <h1 className="text-4xl md:text-5xl font-bold mt-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {profile.full_name || 'Your Name'}
          </h1>
          <p className="text-xl md:text-2xl text-blue-400 mt-2 font-light">
            {profile.headline || 'Your Professional Headline'}
          </p>
          
          {hasSocialLinks && (
            <div className="flex justify-center gap-6 mt-8">
              {profile.social_links?.github && (
                <a 
                  href={profile.social_links.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-white transition-all hover:scale-110"
                  aria-label="GitHub Profile"
                >
                  <Github size={28} />
                </a>
              )}
              {profile.social_links?.linkedin && (
                <a 
                  href={profile.social_links.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-white transition-all hover:scale-110"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={28} />
                </a>
              )}
              {profile.social_links?.twitter && (
                <a 
                  href={profile.social_links.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-white transition-all hover:scale-110"
                  aria-label="Twitter Profile"
                >
                  <Twitter size={28} />
                </a>
              )}
            </div>
          )}
        </section>

        {/* About Section */}
        {profile.bio && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-gray-200 mb-6">About Me</h2>
            <div className="bg-gray-900 border border-black rounded-xl p-8">
              <p className="text-gray-300 leading-relaxed text-lg">
                {profile.bio}
              </p>
            </div>
          </section>
        )}

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-gray-200 mb-6">Skills & Technologies</h2>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill: string, index: number) => (
                <span 
                  key={`${skill}-${index}`} 
                  className="bg-black text-blue-300 text-sm font-medium px-4 py-2 rounded-full border border-gray-700 hover:bg-gray-700 hover:scale-105 transition-all cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Enhanced Projects Section */}
        <EnhancedProjectsSection projects={profile.projects} />

        {/* Contact Section */}
        <section className="mt-20 text-center">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Let's Connect</h2>
            <p className="text-gray-300 mb-6 text-lg">
              Interested in collaborating or just want to say hello?
            </p>
            <a 
              href={`mailto:${profile.email}`} 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg font-medium"
            >
              Send me an email
            </a>
          </div>
        </section>

      </div>
    </main>
  )
}