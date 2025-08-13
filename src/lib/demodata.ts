import { Profile } from "./schema";

// Mock profile data that matches the database schema structure
// This represents what would be fetched from the database
export const mockProfile: Profile = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  username: "devcapo",
  plan: "pro",
  template: "eclipse", // Updated to use eclipse template
  full_name: "DevCapo",
  email: "dev@example.com",
  headline: "Frontend Developer",
  bio: "Passionate developer creating amazing digital experiences", // Short bio for hero section
  about_description: "I'm a dedicated developer with strong foundation in modern web technologies. Through academic projects and continuous learning, I've developed skills in frontend and backend development.", // Detailed about description
  avatar_url: "https://i.postimg.cc/3NgvPcZD/home-img.png",
  skills: [
    "HTML", "CSS", "JavaScript", "React", "TypeScript", "Node.js", 
    "Python", "Figma", "Sketch", "PhotoShop", "PHP", "MySQL", "Firebase"
  ],
  social_links: {
    linkedin: "https://linkedin.com/in/devcapo",
    github: "https://github.com/devcapo",
    twitter: "https://twitter.com/devcapo"
  },
  projects: [
    {
      title: "Web Design",
      description: "The services we provide for design. Two smartphones displaying a sleek, dark-themed dashboard interface.",
      imageUrl: "https://i.postimg.cc/43Th5VXJ/work-1.png",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/web-design",
      technologies: ["HTML", "CSS", "JavaScript"],
      startDate: "2025-04-22",
      status: "completed",
      highlights: ["Responsive design", "Modern UI/UX", "Cross-browser compatibility"],
      role: "Lead Developer" // NEW: Added role field
    },
    {
      title: "App Design",
      description: "Mobile App Landing Design & App Maintain. A stylish burger restaurant mobile app interface displayed on two smartphones.",
      imageUrl: "https://i.postimg.cc/sXLjnC5p/work-2.png",
      liveUrl: "https://example-app.com",
      githubUrl: "https://github.com/example/app-design",
      technologies: ["React Native", "Figma"],
      startDate: "2025-03-15",
      status: "completed",
      highlights: ["Mobile-first design", "User-friendly interface", "Performance optimized"],
      role: "UI/UX Designer" // NEW: Added role field
    }
  ],
  
  // NEW: JSON fields for additional data
  education: [
    {
      institution: "XYZ University (Sometown, NJ)",
      degree: "BFA in Graphic Design",
      period: "2011 - 2013",
      location: "Sometown, NJ",
      gpa: 3.8,
      achievements: ["Dean's List", "Best Design Award"]
    },
    {
      institution: "ABC University (Sometown, NJ)",
      degree: "Diploma in Web Design", 
      period: "2013 - 2015",
      location: "Sometown, NJ",
      gpa: 3.9,
      achievements: ["Valedictorian", "Web Design Excellence Award"]
    },
    {
      institution: "KLM University (Sometown, NJ)",
      degree: "BS in Web Development",
      period: "2015 - 2017",
      location: "Sometown, NJ",
      gpa: 3.7,
      achievements: ["Honors Program", "Research Grant Recipient"]
    }
  ],

  experience: [
    {
      company: "Copalopa Inc. (Sometown, NJ)",
      position: "Lead / Senior UX Designer",
      period: "2018 - Present",
      location: "Sometown, NJ",
      description: "Leading design team for web applications and mobile apps",
      achievements: ["Improved user engagement by 40%", "Led 5 successful projects", "Mentored 3 junior designers"],
      technologies_used: ["Figma", "Sketch", "Adobe Creative Suite", "InVision"]
    },
    {
      company: "Gabogle Inc. (Sometown, NJ)",
      position: "Web site / UX Designer",
      period: "2015 - 2018", 
      location: "Sometown, NJ",
      description: "Designed and developed responsive websites for clients",
      achievements: ["Completed 20+ client projects", "Achieved 95% client satisfaction", "Reduced page load time by 30%"],
      technologies_used: ["HTML", "CSS", "JavaScript", "WordPress", "Photoshop"]
    },
    {
      company: "Copalopa Inc. (Sometown, NJ)",
      position: "Junior UX Designer",
      period: "2013 - 2015",
      location: "Sometown, NJ",
      description: "Assisted senior designers with UI/UX projects",
      achievements: ["Contributed to 10+ projects", "Learned advanced design tools", "Received 'Rising Star' award"],
      technologies_used: ["Sketch", "Photoshop", "Illustrator", "Balsamiq"]
    }
  ],

  skills_categories: [
    {
      category: "Frontend",
      icon: "uil-brackets-curly",
      title: "Frontend Developer",
      subtitle: "More than 4 years",
      skills: [
        { name: "HTML", percentage: 90 },
        { name: "CSS", percentage: 90 },
        { name: "JavaScript", percentage: 80 },
        { name: "React", percentage: 85 },
        { name: "TypeScript", percentage: 75 },
        { name: "Vue.js", percentage: 70 }
      ]
    },
    {
      category: "Design",
      icon: "uil-swatchbook", 
      title: "UI / UX Design",
      subtitle: "More than 5 years",
      skills: [
        { name: "Figma", percentage: 90 },
        { name: "Sketch", percentage: 80 },
        { name: "PhotoShop", percentage: 70 },
        { name: "Illustrator", percentage: 75 },
        { name: "InVision", percentage: 85 }
      ]
    },
    {
      category: "Backend",
      icon: "uil-server-network",
      title: "Backend Developer", 
      subtitle: "More than 2 years",
      skills: [
        { name: "PHP", percentage: 80 },
        { name: "Python", percentage: 80 },
        { name: "MySQL", percentage: 70 },
        { name: "Firebase", percentage: 75 },
        { name: "Node.js", percentage: 65 },
        { name: "MongoDB", percentage: 60 }
      ]
    }
  ],

  about_stats: [
    {
      icon: "uil-graduation-cap",
      title: "Education", 
      subtitle: "BS in Web Development"
    },
    {
      icon: "uil-trophy",
      title: "Projects",
      subtitle: "25+ Completed"
    },
    {
      icon: "uil-rocket", 
      title: "Experience",
      subtitle: "5+ Years"
    },
    {
      icon: "uil-users",
      title: "Clients",
      subtitle: "15+ Satisfied"
    }
  ],

  services: [
    {
      icon: "uil-web-grid",
      title: "Web Designer",
      description: "User Interface Development, Web Page Development, Responsive Design, Performance Optimization, SEO Optimization, Cross-browser Compatibility"
    },
    {
      icon: "uil-arrow",
      title: "UI/UX Designer", 
      description: "Usability Testing, User Research, Wireframing & Prototyping, Design Systems, User Journey Mapping, Accessibility Design"
    },
    {
      icon: "uil-monitor",
      title: "Mobile Developer",
      description: "React Native Development, iOS & Android Apps, Cross-Platform Development, App Store Deployment, Performance Optimization, Native Module Integration"
    },
    {
      icon: "uil-palette",
      title: "Brand Designer",
      description: "Logo Design, Brand Identity, Visual Guidelines, Marketing Materials, Social Media Graphics, Print Design"
    }
  ],

  additional_info: {
    location: "Sometown, NJ",
    availability: "Available for hire",
    years_of_experience: 5,
    languages: ["English", "Spanish"],
    certifications: ["AWS Certified Developer", "Google Cloud Professional", "Adobe Certified Expert"]
  }
};

// Extended profile data for more detailed sections (keeping for backward compatibility)
export const extendedProfileData = {
  // Skills categorized for the skills section
  skillsCategories: [
    {
      category: "Frontend",
      icon: "uil-brackets-curly",
      title: "Frontend Developer",
      subtitle: "More than 4 years",
      skills: [
        { name: "HTML", percentage: 90 },
        { name: "CSS", percentage: 90 },
        { name: "Javascript", percentage: 20 },
        { name: "React", percentage: 85 }
      ]
    },
    {
      category: "Design",
      icon: "uil-swatchbook", 
      title: "UI / UX Design",
      subtitle: "More than 5 years",
      skills: [
        { name: "Figma", percentage: 90 },
        { name: "Sketch", percentage: 80 },
        { name: "PhotoShop", percentage: 70 }
      ]
    },
    {
      category: "Backend",
      icon: "uil-server-network",
      title: "Backend Developer", 
      subtitle: "More than 2 years",
      skills: [
        { name: "PHP", percentage: 80 },
        { name: "Python", percentage: 80 },
        { name: "MySQL", percentage: 70 },
        { name: "Firebase", percentage: 75 }
      ]
    }
  ],

  // Education timeline
  education: [
    {
      institution: "XYZ University (Sometown, NJ)",
      degree: "BFA in Graphic Design",
      period: "2011 - 2013"
    },
    {
      institution: "ABC University (Sometown. NJ)",
      degree: "Diploma in Web Design", 
      period: "2013 - 2015"
    },
    {
      institution: "KLM University (Sometown, NJ)",
      degree: "BS in Web Development",
      period: "2015 - 2017"
    }
  ],

  // Experience timeline
  experience: [
    {
      company: "Copalopa Inc. (Sometown, NJ)",
      position: "Lead / Senior UX Designer",
      period: "2018 - Present"
    },
    {
      company: "Gabogle Inc. (Somwtown, NJ)",
      position: "Web site / UX Designer",
      period: "2015 - 2018" 
    },
    {
      company: "Copalopa Inc. (Sometown, NJ)",
      position: "Junior UX Designer",
      period: "2013 - 2015"
    }
  ],

  // About section stats
  aboutStats: [
    {
      icon: "uil-graduation-cap",
      title: "Education", 
      subtitle: "BTech Graduate"
    },
    {
      icon: "uil-trophy",
      title: "Projects",
      subtitle: "15+ Completed"
    },
    {
      icon: "uil-rocket", 
      title: "Passion",
      subtitle: "Always Learning"
    }
  ],

  // Services offered
  services: [
    {
      icon: "uil-web-grid",
      title: "Web Designer",
      description: "User Interface Development, Web Page Development, Responsive Design, Performance Optimization"
    },
    {
      icon: "uil-arrow",
      title: "UI/UX Designer", 
      description: "Usability Testing, User Research, Wireframing & Prototyping, Design Systems"
    },
    {
      icon: "uil-monitor",
      title: "Mobile Developer",
      description: "React Native Development, iOS & Android Apps, Cross-Platform Development, App Store Deployment"
    }
  ],

  // Contact information
  contactInfo: {
    email: "user@gmail.com",
    location: "Sometown, NJ",
    availability: "Available for hire"
  }
};

// Function that would fetch profile data from database
// This is where you'd make your API call
export async function getProfileData(username: string): Promise<Profile | null> {
  // TODO: Replace with actual database call
  // const response = await fetch(`/api/profiles/${username}`);
  // const profile = await response.json();
  // return profile;
  
  // For now, return mock data
  if (username === "devcapo") {
    return mockProfile;
  }
  return null;
}

// Function to get profile by ID (for authenticated users)
export async function getProfileById(id: string): Promise<Profile | null> {
  // TODO: Replace with actual database call
  // const response = await fetch(`/api/profiles/by-id/${id}`);
  // const profile = await response.json();
  // return profile;
  
  // For now, return mock data
  return mockProfile;
}
