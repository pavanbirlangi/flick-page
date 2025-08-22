"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Code,
  Calendar,
  Users,
  Star,
  ExternalLink,
} from "lucide-react";

// Enhanced interfaces
interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
}

interface Project {
  title: string;
  description: string; // Now supports markdown
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

interface Profile {
  id: string;
  full_name?: string;
  headline?: string;
  bio?: string;
  avatar_url?: string;
  skills?: string[];
  social_links?: SocialLinks;
  projects?: Project[];
}

interface ProfileFormProps {
  profile?: Profile | null;
}

// Enhanced schema with new project fields
const profileFormSchema = z.object({
  full_name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  headline: z
    .string()
    .max(100, { message: "Headline must be 100 characters or less." })
    .optional(),
  bio: z
    .string()
    .max(500, { message: "Bio must be 500 characters or less." })
    .optional(),
  avatar_url: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  skills: z.string().optional(),
  social_links: z.object({
    linkedin: z
      .string()
      .url({ message: "Please enter a valid LinkedIn URL." })
      .optional()
      .or(z.literal("")),
    github: z
      .string()
      .url({ message: "Please enter a valid GitHub URL." })
      .optional()
      .or(z.literal("")),
    twitter: z
      .string()
      .url({ message: "Please enter a valid Twitter URL." })
      .optional()
      .or(z.literal("")),
  }),
  projects: z
    .array(
      z.object({
        title: z.string().min(1, { message: "Project title is required." }),
        description: z
          .string()
          .min(1, { message: "Project description is required." }),
        imageUrl: z
          .string()
          .url({ message: "Please enter a valid image URL." })
          .optional()
          .or(z.literal("")),
        liveUrl: z
          .string()
          .url({ message: "Please enter a valid live URL." })
          .optional()
          .or(z.literal("")),
        githubUrl: z
          .string()
          .url({ message: "Please enter a valid GitHub URL." })
          .optional()
          .or(z.literal("")),
        technologies: z.string().optional(), // Comma-separated string
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        teamSize: z.coerce.number().min(1).max(50).optional(),
        status: z.enum(["completed", "in-progress", "archived"]).optional(),
        highlights: z.string().optional(), // Line-separated string
      })
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Simple markdown preview component
function MarkdownPreview({ content }: { content: string }) {
  if (!content)
    return <p className="text-gray-500 italic">No content to preview</p>;

  // Simple markdown rendering for preview
  const rendered = content
    .replace(
      /^### (.*$)/gim,
      '<h3 class="text-lg font-semibold text-gray-800 mb-2 mt-4">$1</h3>'
    )
    .replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-semibold text-gray-800 mb-3 mt-5">$1</h2>'
    )
    .replace(
      /^# (.*$)/gim,
      '<h1 class="text-2xl font-bold text-gray-800 mb-4 mt-6">$1</h1>'
    )
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(
      /`(.*?)`/g,
      '<code class="bg-slate-200 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
    )
    .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, "<br>");

  return (
    <div
      className="prose prose-slate max-w-none text-sm"
      dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${rendered}</p>` }}
    />
  );
}

export function ProfileForm({ profile }: ProfileFormProps) {
  console.log("ProfileForm received profile prop:", profile);
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState<{ [key: number]: boolean }>(
    {}
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      headline: profile?.headline || '',
      bio: profile?.bio || '',
      avatar_url: profile?.avatar_url || '',
      skills: profile?.skills ? profile.skills.join(', ') : '',
      social_links: {
        linkedin: profile?.social_links?.linkedin || '',
        github: profile?.social_links?.github || '',
        twitter: profile?.social_links?.twitter || '',
      },
      projects: profile?.projects?.map((project) => ({
        title: project.title || '',
        description: project.description || '',
        imageUrl: project.imageUrl || '',
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        technologies: project.technologies?.join(', ') || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        teamSize: project.teamSize || undefined,
        status: project.status || undefined,
        highlights: project.highlights?.join('\n') || '',
      })) || [],
    },
    mode: 'onChange',
  })

 
  

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const togglePreview = (index: number) => {
    setPreviewMode((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  async function onSubmit(data: ProfileFormValues) {
    if (!profile?.id) {
      setError("Profile ID is missing. Cannot update profile.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updateData = {
        full_name: data.full_name,
        headline: data.headline || null,
        bio: data.bio || null,
        avatar_url: data.avatar_url || null,
        skills: data.skills
          ? data.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill.length > 0)
          : [],
        social_links: {
          linkedin: data.social_links.linkedin || null,
          github: data.social_links.github || null,
          twitter: data.social_links.twitter || null,
        },
        projects:
          data.projects?.map((project) => ({
            title: project.title,
            description: project.description,
            imageUrl: project.imageUrl || "",
            liveUrl: project.liveUrl || "",
            githubUrl: project.githubUrl || undefined,
            technologies: project.technologies
              ? project.technologies
                  .split(",")
                  .map((tech) => tech.trim())
                  .filter((tech) => tech.length > 0)
              : undefined,
            startDate: project.startDate || undefined,
            endDate: project.endDate || undefined,
            teamSize: project.teamSize || undefined,
            status: project.status || undefined,
            highlights: project.highlights
              ? project.highlights
                  .split("\n")
                  .map((h) => h.trim())
                  .filter((h) => h.length > 0)
              : undefined,
          })) || [],
      };

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", profile.id);

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  const addNewProject = () => {
    append({
      title: "",
      description: "",
      imageUrl: "",
      liveUrl: "",
      githubUrl: "",
      technologies: "",
      startDate: "",
      endDate: "",
      teamSize: undefined,
      status: undefined,
      highlights: "",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error: {error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            ✅ Profile updated successfully!
          </p>
        </div>
      )}

      <div className="bg-black rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-400">
            Update your portfolio information and showcase your projects.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-10 w-full"
          >
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-semibold text-white">
                  Basic Information
                </h2>
                <p className="text-sm text-white mt-1">
                  Your core profile details
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">
                        Full Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avatar_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">
                        Avatar URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/your-photo.jpg"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to your profile picture (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">
                      Professional Headline
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full Stack Developer | React & Node.js Specialist"
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Brief description of your role (max 100 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">
                      Bio
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell visitors about yourself, your background, and what drives you as a professional..."
                        className="resize-none border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share your story (max 500 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">
                      Skills & Technologies
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="React, TypeScript, Node.js, PostgreSQL, Docker, AWS"
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List your technical skills, separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Social Links Section */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-semibold text-white">
                  Social Links
                </h2>
                <p className="text-sm text-white mt-1">
                  Connect your social profiles
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="social_links.github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium flex items-center gap-2">
                        <Code size={16} />
                        GitHub
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/yourusername"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="social_links.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">
                        LinkedIn
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/in/yourusername"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="social_links.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">
                        Twitter / X
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://twitter.com/yourusername"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Enhanced Projects Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Projects
                  </h2>
                  <p className="text-sm text-white mt-1">
                    Showcase your work with detailed project briefs
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewProject}
                  className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Plus size={16} />
                  Add Project
                </Button>
              </div>

              {fields.length === 0 && (
                <div className="text-center py-12 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                  <Code size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-white text-lg font-medium mb-2">
                    No projects added yet
                  </p>
                  <p className="text-gray-500 text-sm">
                    Click &quot;Add Project&quot; to showcase your work
                  </p>
                </div>
              )}

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-slate-200 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      Project {index + 1}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => togglePreview(index)}
                        className="flex items-center gap-2"
                      >
                        {previewMode[index] ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                        {previewMode[index] ? "Edit" : "Preview"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  {!previewMode[index] ? (
                    <div className="space-y-6">
                      {/* Basic Project Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`projects.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium">
                                Project Title *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="TaskForge - Task Management Platform"
                                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`projects.${index}.status`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium">
                                Status
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="completed">
                                    ✅ Completed
                                  </SelectItem>
                                  <SelectItem value="in-progress">
                                    🚧 In Progress
                                  </SelectItem>
                                  <SelectItem value="archived">
                                    📦 Archived
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Project Description with Markdown Support */}
                      <FormField
                        control={form.control}
                        name={`projects.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium">
                              Description (Markdown Supported) *
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={`## Overview
A comprehensive description of your project...

### Key Features
- Feature 1: Description of key feature
- Feature 2: Another important feature
- Feature 3: Third major feature

### Technical Implementation
Built with **React** and \`Node.js\`, utilizing modern development practices.

### Challenges & Solutions
Describe any challenges you faced and how you solved them.`}
                                className="resize-none font-mono text-sm border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                rows={10}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Use Markdown for rich formatting: **bold**,
                              *italic*, \`code\`, headers (# ## ###), lists (-
                              item)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Technologies */}
                      <FormField
                        control={form.control}
                        name={`projects.${index}.technologies`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium">
                              Technologies Used
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="React, TypeScript, Node.js, MongoDB, Docker, AWS"
                                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              List technologies separated by commas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Project Timeline and Team */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`projects.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium flex items-center gap-2">
                                <Calendar size={16} />
                                Start Date
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="month"
                                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`projects.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium">
                                End Date
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="month"
                                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Leave empty if ongoing
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`projects.${index}.teamSize`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium flex items-center gap-2">
                                <Users size={16} />
                                Team Size
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  max="50"
                                  placeholder="1"
                                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Project URLs */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`projects.${index}.imageUrl`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium">
                                Project Image
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://example.com/screenshot.jpg"
                                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Screenshot or preview
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`projects.${index}.liveUrl`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium flex items-center gap-2">
                                <ExternalLink size={16} />
                                Live Demo
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://myproject.com"
                                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`projects.${index}.githubUrl`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium flex items-center gap-2">
                                <Code size={16} />
                                Source Code
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://github.com/user/repo"
                                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Key Highlights */}
                      <FormField
                        control={form.control}
                        name={`projects.${index}.highlights`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium flex items-center gap-2">
                              <Star size={16} />
                              Key Achievements
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={`Increased user engagement by 40%
Reduced loading time from 3s to 800ms
Led a team of 4 developers
Implemented real-time chat functionality
Achieved 99.9% uptime in production`}
                                className="resize-none border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              List key achievements, one per line. These will be
                              prominently displayed.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    /* Preview Mode */
                    <div className="bg-white rounded-lg p-6 border border-slate-200 space-y-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {form.watch(`projects.${index}.title`) ||
                              "Project Title"}
                          </h3>

                          {/* Status and metadata preview */}
                          <div className="flex flex-wrap gap-3 mb-4">
                            {form.watch(`projects.${index}.status`) && (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  form.watch(`projects.${index}.status`) ===
                                  "completed"
                                    ? "bg-green-100 text-green-800"
                                    : form.watch(`projects.${index}.status`) ===
                                      "in-progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-slate-100 text-gray-800"
                                }`}
                              >
                                {form.watch(`projects.${index}.status`) ===
                                "completed"
                                  ? "✅ Completed"
                                  : form.watch(`projects.${index}.status`) ===
                                    "in-progress"
                                  ? "🚧 In Progress"
                                  : "📦 Archived"}
                              </span>
                            )}

                            {form.watch(`projects.${index}.teamSize`) && (
                              <span className="flex items-center gap-1 text-xs text-white">
                                <Users size={12} />
                                Team of{" "}
                                {form.watch(`projects.${index}.teamSize`)}
                              </span>
                            )}

                            {form.watch(`projects.${index}.startDate`) && (
                              <span className="flex items-center gap-1 text-xs text-white">
                                <Calendar size={12} />
                                {form.watch(`projects.${index}.startDate`)}
                                {form.watch(`projects.${index}.endDate`) &&
                                  ` - ${form.watch(
                                    `projects.${index}.endDate`
                                  )}`}
                              </span>
                            )}
                          </div>
                        </div>

                        {form.watch(`projects.${index}.imageUrl`) && (
                          <img
                            src={form.watch(`projects.${index}.imageUrl`)}
                            alt="Project preview"
                            className="w-24 h-24 object-cover rounded-lg border border-slate-200"
                          />
                        )}
                      </div>

                      {/* Technologies preview */}
                      {form.watch(`projects.${index}.technologies`) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {form
                            .watch(`projects.${index}.technologies`)
                            ?.split(",")
                            .map((tech) => tech.trim())
                            .filter((tech) => tech.length > 0)
                            .map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-slate-100 text-white text-xs rounded-md font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                        </div>
                      )}

                      {/* Description preview with markdown */}
                      <div className="mb-6">
                        <MarkdownPreview
                          content={
                            form.watch(`projects.${index}.description`) || ""
                          }
                        />
                      </div>

                      {/* Key highlights preview */}
                      {form.watch(`projects.${index}.highlights`) && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Star size={16} className="text-yellow-500" />
                            Key Achievements
                          </h4>
                          <div className="space-y-2">
                            {form
                              .watch(`projects.${index}.highlights`)
                              ?.split("\n")
                              .map((highlight) => highlight.trim())
                              .filter((highlight) => highlight.length > 0)
                              .map((highlight, highlightIndex) => (
                                <div
                                  key={highlightIndex}
                                  className="flex items-start gap-2 text-sm text-white"
                                >
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  {highlight}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Project links preview */}
                      <div className="flex flex-wrap gap-3">
                        {form.watch(`projects.${index}.liveUrl`) && (
                          <a
                            href={form.watch(`projects.${index}.liveUrl`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <ExternalLink size={14} />
                            View Live
                          </a>
                        )}

                        {form.watch(`projects.${index}.githubUrl`) && (
                          <a
                            href={form.watch(`projects.${index}.githubUrl`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-white text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <Code size={14} />
                            Source Code
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end pt-8 border-t border-slate-200">
              <Button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
