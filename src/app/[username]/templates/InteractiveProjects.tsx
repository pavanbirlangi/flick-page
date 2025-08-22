'use client'

import { useState, useEffect } from 'react'
import { Project } from '@/lib/schema'
import { motion, AnimatePresence } from 'framer-motion' // npm install framer-motion
import { Code, Calendar, Users, X as CloseIcon } from 'lucide-react'
import Image from 'next/image'
import { marked } from 'marked'

// --- Helper Components for the Interactive Cards ---

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

function TechTags({ technologies }: { technologies?: string[] }) {
  if (!technologies || technologies.length === 0) return null
  
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {technologies.map(tech => (
        <span key={tech} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-md">{tech}</span>
      ))}
    </div>
  )
}

function ProjectMetadata({ project }: { project: Project }) {
  const formatDate = (dateString: string) => {
    try {
      if (dateString.match(/^\d{4}-\d{2}$/)) {
        const [year, month] = dateString.split('-')
        const date = new Date(parseInt(year), parseInt(month) - 1, 1)
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      }
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    } catch {
      return dateString
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
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
          <span>{project.teamSize} member{project.teamSize > 1 ? 's' : ''}</span>
        </div>
      )}
      <StatusBadge status={project.status} />
    </div>
  )
}

// Asynchronous component to handle markdown parsing
function MarkdownRenderer({ content }: { content: string }) {
    const [html, setHtml] = useState('');

    useEffect(() => {
        async function parseMarkdown() {
            if (content) {
                const parsedHtml = await marked.parse(content.replace(/\\`/g, '`').replace(/\\\\/g, '\\'));
                setHtml(parsedHtml);
            }
        }
        parseMarkdown();
    }, [content]);

    return <div className="text-gray-400 text-sm prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}


// --- Main Interactive Component ---

export function InteractiveProjects({ projects }: { projects?: Project[] }) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    if (!projects || projects.length === 0) {
        return <p className="text-gray-500">No projects to display yet.</p>;
    }

    const gridLayouts = [
        'col-span-2 row-span-2', // Large
        'col-span-1 row-span-1', // Small
        'col-span-1 row-span-1', // Small
        'col-span-2 row-span-1', // Wide
    ];

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        className={`group bg-gray-950 border border-gray-800 rounded-2xl flex flex-col overflow-hidden cursor-pointer ${gridLayouts[index % gridLayouts.length]}`}
                        onClick={() => setSelectedProject(project)}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    >
                        <div className="relative w-full aspect-video bg-gray-900">
                            {project.imageUrl ? (
                                <Image src={project.imageUrl} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Code size={32} className="text-gray-700" />
                                </div>
                            )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-white text-lg">{project.title}</h3>
                            <p className="text-gray-400 text-sm flex-1">{project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : ''}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="relative bg-gray-950 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                        >
                            <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                                <CloseIcon />
                            </button>
                            <h2 className="text-3xl font-bold text-white mb-4">{selectedProject.title}</h2>
                            <ProjectMetadata project={selectedProject} />
                            <MarkdownRenderer content={selectedProject.description || ''} />
                            <TechTags technologies={selectedProject.technologies} />
                            <div className="flex gap-4 mt-6">
                                {selectedProject.liveUrl && <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:underline">View Live</a>}
                                {selectedProject.githubUrl && <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:underline">Source Code</a>}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}