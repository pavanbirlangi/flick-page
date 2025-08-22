import * as z from "zod";

export const profileFormSchema = z.object({
  template: z.enum(['basic', 'axis', 'eclipse']).optional(), // Added eclipse template
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(20, { message: "Username must be 20 characters or less." })
    .regex(/^[a-z0-9-]+$/, { message: "Username can only contain lowercase letters, numbers, and hyphens." })
    .refine(val => !['www', 'app', 'dashboard', 'settings', 'profile'].includes(val), { message: "This is a reserved username." }),
  full_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  headline: z.string().max(100).optional(),
  bio: z.string().max(150).optional(), // Short bio for hero section
  about_description: z.string().max(500).optional(), // Detailed about description
  avatar_url: z.string().url().optional().or(z.literal("")),
  skills: z.string().optional(),
  social_links: z.object({
    linkedin: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
  }),
  projects: z.array(
    z.object({
      title: z.string().min(1, { message: "Project title is required." }),
      description: z.string().min(1, { message: "Project description is required." }),
      imageUrl: z.string().url().optional().or(z.literal("")),
      liveUrl: z.string().url().optional().or(z.literal("")),
      githubUrl: z.string().url().optional().or(z.literal("")),
  technologies: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      teamSize: z.coerce.number().min(1).optional(),
      status: z.enum(["completed", "in-progress", "archived"]).optional(),
  highlights: z.string().optional(),
      role: z.string().optional(), // NEW: Role in the project
    })
  ).optional(),
  // NEW: JSON fields for additional data
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    period: z.string(),
    location: z.string().optional(),
    gpa: z.number().optional(),
    achievements: z.array(z.string()).optional(),
  })).optional(),
  experience: z.array(z.object({
    company: z.string(),
    position: z.string(),
    period: z.string(),
    location: z.string().optional(),
    description: z.string().optional(),
    achievements: z.array(z.string()).optional(),
    technologies_used: z.array(z.string()).optional(),
  })).optional(),
  skills_categories: z.array(z.object({
    category: z.string(),
    icon: z.string(),
    title: z.string(),
    subtitle: z.string(),
    skills: z.array(z.object({
      name: z.string(),
      percentage: z.number().min(0).max(100),
    })),
  })).optional(),
  about_stats: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    subtitle: z.string(),
  })).optional(),
  services: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string(),
  })).optional(),
  additional_info: z.object({
    location: z.string().optional(),
    availability: z.string().optional(),
    years_of_experience: z.number().optional(),
    languages: z.array(z.string()).optional(),
    certifications: z.array(z.string()).optional(),
  }).optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface Project {
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
  teamSize?: number;
  status?: "completed" | "in-progress" | "archived";
  highlights?: string[];
  role?: string; // NEW: Role in the project
}

// NEW: Interfaces for JSON fields
export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location?: string;
  gpa?: number;
  achievements?: string[];
}

export interface ExperienceItem {
  company: string;
  position: string;
  period: string;
  location?: string;
  description?: string;
  achievements?: string[];
  technologies_used?: string[];
}

export interface SkillCategory {
  category: string;
  icon: string;
  title: string;
  subtitle: string;
  skills: {
    name: string;
    percentage: number;
  }[];
}

export interface AboutStat {
  icon: string;
  title: string;
  subtitle: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface AdditionalInfo {
  location?: string;
  availability?: string;
  years_of_experience?: number;
  languages?: string[];
  certifications?: string[];
}

export interface Profile {
  id: string;
  username: string;
  plan?: 'basic' | 'pro' | 'premium';
  template?: 'basic' | 'axis' | 'eclipse'; // Added eclipse template
  full_name?: string;
  email?: string;
  headline?: string;
  bio?: string; // Short bio for hero section
  about_description?: string; // NEW: Detailed about description
  avatar_url?: string;
  skills?: string[];
  social_links?: SocialLinks;
  projects?: Project[];
  
  // NEW: JSON fields for additional data
  education?: EducationItem[];
  experience?: ExperienceItem[];
  skills_categories?: SkillCategory[];
  about_stats?: AboutStat[];
  services?: Service[];
  additional_info?: AdditionalInfo;
}