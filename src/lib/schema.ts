import * as z from "zod";

export const profileFormSchema = z.object({
  template: z.enum(['basic', 'axis']).optional(), // New field for template selection
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(20, { message: "Username must be 20 characters or less." })
    .regex(/^[a-z0-9-]+$/, { message: "Username can only contain lowercase letters, numbers, and hyphens." })
    .refine(val => !['www', 'app', 'dashboard', 'settings', 'profile'].includes(val), { message: "This is a reserved username." }),
  full_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  headline: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
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
    })
  ).optional(),
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
}

export interface Profile {
  id: string;
  username: string;
  plan?: 'basic' | 'pro' | 'premium'; // Add this line
  template?: 'basic' | 'axis';
  full_name?: string;
  email? : string;
  headline?: string;
  bio?: string;
  avatar_url?: string;
  skills?: string[];
  social_links?: SocialLinks;
  projects?: Project[];
}