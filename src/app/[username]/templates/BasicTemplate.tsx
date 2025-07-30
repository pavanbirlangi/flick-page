import { Profile, Project } from '@/lib/schema'
import { Github, Linkedin, Twitter, ExternalLink, Code, Calendar, Users, Star } from 'lucide-react'
import { PortfolioImage } from '../PortfolioImage'
import Image from 'next/image'
import { marked } from 'marked'
import { Footer } from './Footer'

// --- Helper Components (No changes, they are already well-styled) ---

async function ProjectBrief({ project, index, totalProjects }: { project: Project; index: number; totalProjects: number }) {
  let renderedDescription = ''
  try {
    let description = project.description || ''
    if (description.trim()) {
      description = description.replace(/\\`/g, '`').replace(/\\\\/g, '\\')
      renderedDescription = await marked.parse(description)
    } else {
      renderedDescription = '<p class="mb-4 text-gray-400 leading-relaxed">No description available.</p>'
    }
  } catch (error) {
    console.error('Error parsing markdown:', error)
    const cleanDescription = (project.description || 'No description available.').replace(/\\`/g, '`').replace(/\\\\/g, '\\')
    renderedDescription = `<p class="mb-4 text-gray-400 leading-relaxed">${cleanDescription}</p>`
  }
  
  return (
    <article className="mb-16 last:mb-0">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-3xl font-bold text-white leading-tight">{project.title}</h3>
          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg group" aria-label="View source code">
                <Code size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium hover:scale-105 hover:shadow-lg">
                <span>View Live</span>
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>

      {project.imageUrl && (
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 group">
          <Image src={project.imageUrl} alt={`${project.title} preview`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
        </div>
      )}

      <div className="mb-8">
        {renderedDescription ? (
          <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: renderedDescription }} />
        ) : (
          <div className="text-gray-300 leading-relaxed">
            {project.description ? (
              <pre className="whitespace-pre-wrap font-sans">{project.description.replace(/\\`/g, '`').replace(/\\\\/g, '\\')}</pre>
            ) : (
              <p>No description available.</p>
            )}
          </div>
        )}
      </div>

      {project.highlights && Array.isArray(project.highlights) && project.highlights.length > 0 && (
        <div className="mt-8 p-6 bg-gray-950 border border-gray-800 rounded-2xl">
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

      {index < totalProjects - 1 && (
        <div className="mt-16 flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
          <div className="px-4"><div className="w-2 h-2 bg-gray-700 rounded-full" /></div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
        </div>
      )}
    </article>
  )
}

function EnhancedProjectsSection({ projects }: { projects?: Project[] }) {
  if (!projects || projects.length === 0) {
    return (
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-gray-200 mb-8">Projects</h2>
        <div className="text-center py-12 text-gray-500 bg-gray-950 rounded-2xl border border-gray-800">
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
        <p className="text-gray-400 text-lg">A showcase of my recent work and contributions</p>
      </div>
      <div className="space-y-0">
        {projects.map((project, index) => (
          <ProjectBrief key={`${project.title}-${index}`} project={project} index={index} totalProjects={projects.length} />
        ))}
      </div>
    </section>
  )
}


// --- Main Basic Template Component (UI Enhanced) ---
export function BasicTemplate({ profile }: { profile: Profile }) {
    const hasSocialLinks = profile.social_links && (profile.social_links.linkedin || profile.social_links.github || profile.social_links.twitter);

    return (
        <main className="bg-black text-white font-sans min-h-screen">
            <div className="container mx-auto max-w-4xl px-4 py-16">

                {/* --- Hero Section --- */}
                <section className="flex flex-col items-center text-center mb-24">
                    <PortfolioImage
                        src={profile.avatar_url}
                        alt={profile.full_name || 'User Avatar'}
                        fallbackText={profile.full_name}
                    />
                    <h1 className="text-4xl md:text-5xl font-bold mt-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {profile.full_name || 'Your Name'}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 mt-2 font-light">
                        {profile.headline || 'Your Professional Headline'}
                    </p>
                    
                    {hasSocialLinks && (
                        <div className="flex justify-center gap-6 mt-8">
                            {profile.social_links?.github && (
                                <a href={profile.social_links.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all hover:scale-110" aria-label="GitHub Profile">
                                    <Github size={28} />
                                </a>
                            )}
                            {profile.social_links?.linkedin && (
                                <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all hover:scale-110" aria-label="LinkedIn Profile">
                                    <Linkedin size={28} />
                                </a>
                            )}
                            {profile.social_links?.twitter && (
                                <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all hover:scale-110" aria-label="Twitter Profile">
                                    <Twitter size={28} />
                                </a>
                            )}
                        </div>
                    )}
                </section>

                {/* --- About & Skills Section (New 2-column layout) --- */}
                <section className="grid gap-12">
                    <div className="">
                        {profile.bio && (
                            <div>
                                <h2 className="text-3xl font-bold text-gray-200 mb-6">About Me</h2>
                                <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg">
                                    <p>{profile.bio}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="">
                        {profile.skills && profile.skills.length > 0 && (
                            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-gray-200 mb-4">Skills & Technologies</h3>
                                <div className="flex flex-wrap gap-3">
                                    {profile.skills.map((skill: string, index: number) => (
                                        <span key={`${skill}-${index}`} className="bg-gray-800 text-gray-300 text-sm font-medium px-4 py-2 rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* --- Projects Section --- */}
                <EnhancedProjectsSection projects={profile.projects} />

                {/* --- Contact Section --- */}
                <section className="mt-20 text-center">
                    <div className="bg-gray-950 border border-gray-800 rounded-2xl p-8">
                        <h2 className="text-3xl font-bold text-white mb-4">Let's Connect</h2>
                        <p className="text-gray-400 mb-6 text-lg">
                            Interested in collaborating or just want to say hello?
                        </p>
                        <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg transition-all hover:bg-gray-200 font-medium">
                            Send me an email
                        </a>
                    </div>
                </section>

            </div>
            <Footer profile={profile} />
        </main>
    )
}
