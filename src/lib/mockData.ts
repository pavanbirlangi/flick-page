import { Profile } from './schema';

export const mockProfile: Profile = {
  id: 'preview-user',
  username: 'ameliahart',
  plan: 'pro',
  template: 'basic',
  full_name: 'Amelia Hart',
  email: 'amelia.hart@example.com',
  headline: 'Full Stack Developer & UI/UX Designer',
  bio: 'Passionate developer with 5+ years of experience building modern web applications. I love creating intuitive user experiences and scalable backend solutions.',
  about_description: 'I\'m a dedicated developer with strong foundation in modern web technologies. Through academic projects and continuous learning, I\'ve developed skills in frontend and backend development. I enjoy solving complex problems and turning ideas into reality through code.',
  avatar_url: 'https://i.postimg.cc/3NgvPcZD/home-img.png',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL'],
  social_links: {
    linkedin: 'https://linkedin.com/in/ameliahart',
    github: 'https://github.com/ameliahart',
    twitter: 'https://twitter.com/ameliahart'
  },
  projects: [
    {
      title: 'E-commerce Platform',
      description: 'A modern e-commerce solution built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, and payment integration with Stripe.',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      liveUrl: 'https://ecommerce-demo.com',
      githubUrl: 'https://github.com/johndoe/ecommerce-platform',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      startDate: '2024-01',
      endDate: '2024-03',
      teamSize: 3,
      status: 'completed',
      highlights: [
        'Implemented secure payment processing with Stripe',
        'Built responsive design for mobile and desktop',
        'Integrated real-time inventory management',
        'Achieved 99.9% uptime during launch'
      ],
      role: 'Lead Developer'
    },
    {
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, team collaboration, and progress tracking. Built with React, TypeScript, and Firebase.',
      imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
      liveUrl: 'https://taskmanager-demo.com',
      githubUrl: 'https://github.com/johndoe/task-manager',
      technologies: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS'],
      startDate: '2024-02',
      endDate: '2024-04',
      teamSize: 2,
      status: 'completed',
      highlights: [
        'Real-time collaboration with WebSocket integration',
        'Drag-and-drop task management interface',
        'Advanced filtering and search capabilities',
        'Mobile-first responsive design'
      ],
      role: 'Full Stack Developer'
    },
    {
      title: 'AI Chat Application',
      description: 'An intelligent chat application powered by OpenAI GPT-3. Features include conversation history, multiple AI personalities, and context-aware responses.',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
      liveUrl: 'https://aichat-demo.com',
      githubUrl: 'https://github.com/johndoe/ai-chat',
      technologies: ['Next.js', 'OpenAI API', 'PostgreSQL', 'Vercel'],
      startDate: '2024-03',
      endDate: '2024-05',
      teamSize: 1,
      status: 'in-progress',
      highlights: [
        'Integration with OpenAI GPT-3 API',
        'Conversation persistence and history',
        'Multiple AI personality modes',
        'Real-time streaming responses'
      ],
      role: 'Solo Developer'
    }
  ],
  education: [
    {
      institution: 'Stanford University',
      degree: 'Master of Science in Computer Science',
      period: '2020 - 2022',
      location: 'Stanford, CA',
      gpa: 3.9,
      achievements: ['Dean\'s List', 'Graduate Research Assistant', 'Best Thesis Award']
    },
    {
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science in Computer Science',
      period: '2016 - 2020',
      location: 'Berkeley, CA',
      gpa: 3.8,
      achievements: ['Magna Cum Laude', 'Computer Science Honor Society', 'Undergraduate Research']
    }
  ],
  experience: [
    {
      company: 'TechCorp Inc.',
      position: 'Senior Full Stack Developer',
      period: '2022 - Present',
      location: 'San Francisco, CA',
      description: 'Leading development of enterprise web applications and mentoring junior developers.',
      achievements: [
        'Led team of 5 developers on major client project',
        'Improved application performance by 40%',
        'Implemented CI/CD pipeline reducing deployment time by 60%'
      ],
      technologies_used: ['React', 'Node.js', 'AWS', 'Docker', 'Kubernetes']
    },
    {
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      period: '2020 - 2022',
      location: 'San Francisco, CA',
      description: 'Built and maintained multiple web applications for early-stage startup.',
      achievements: [
        'Developed MVP that secured $2M in funding',
        'Built scalable backend infrastructure',
        'Implemented automated testing suite'
      ],
      technologies_used: ['React', 'Python', 'PostgreSQL', 'Redis', 'AWS']
    }
  ],
  skills_categories: [
    {
      category: 'Frontend Development',
      icon: 'uil-brackets-curly',
      title: 'Frontend Developer',
      subtitle: 'More than 4 years',
      skills: [
        { name: 'React', percentage: 95 },
        { name: 'TypeScript', percentage: 90 },
        { name: 'Next.js', percentage: 85 },
        { name: 'Tailwind CSS', percentage: 90 },
        { name: 'HTML/CSS', percentage: 95 }
      ]
    },
    {
      category: 'Backend Development',
      icon: 'uil-server-network',
      title: 'Backend Developer',
      subtitle: 'More than 3 years',
      skills: [
        { name: 'Node.js', percentage: 90 },
        { name: 'Python', percentage: 85 },
        { name: 'Express.js', percentage: 88 },
        { name: 'FastAPI', percentage: 80 },
        { name: 'REST APIs', percentage: 92 }
      ]
    },
    {
      category: 'Database & Cloud',
      icon: 'uil-database',
      title: 'DevOps Engineer',
      subtitle: 'More than 2 years',
      skills: [
        { name: 'MongoDB', percentage: 85 },
        { name: 'PostgreSQL', percentage: 80 },
        { name: 'AWS', percentage: 75 },
        { name: 'Docker', percentage: 70 },
        { name: 'CI/CD', percentage: 80 }
      ]
    }
  ],
  about_stats: [
    {
      icon: 'uil-graduation-cap',
      title: 'Education',
      subtitle: 'Computer Science'
    },
    {
      icon: 'uil-briefcase',
      title: 'Experience',
      subtitle: '5+ Years'
    },
    // {
    //   icon: 'uil-users',
    //   title: 'Projects',
    //   subtitle: '20+ Completed'
    // },
    {
      icon: 'uil-trophy',
      title: 'Awards',
      subtitle: '3 Received'
    }
  ],
  services: [
    {
      icon: 'uil-web-grid',
      title: 'Web Development',
      description: 'Full-stack web applications with modern technologies and best practices.'
    },
    {
      icon: 'uil-mobile-android',
      title: 'Mobile Development',
      description: 'Cross-platform mobile apps using React Native and Flutter.'
    },
    {
      icon: 'uil-palette',
      title: 'UI/UX Design',
      description: 'User-centered design with focus on usability and accessibility.'
    },
    // {
    //   icon: 'uil-server-network',
    //   title: 'Backend Services',
    //   description: 'Scalable backend APIs and microservices architecture.'
    // }
  ],
  additional_info: {
    location: 'San Francisco, CA',
    availability: 'Available for hire, Open to opportunities',
    years_of_experience: 5,
    languages: ['English', 'Spanish'],
    certifications: ['AWS Certified Developer', 'Google Cloud Professional']
  }
};
