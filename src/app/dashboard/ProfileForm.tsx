'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

// Define types for better type safety
interface SocialLinks {
  linkedin?: string
  github?: string
  twitter?: string
}

interface Profile {
  id: string
  full_name?: string
  headline?: string
  bio?: string
  avatar_url?: string
  skills?: string[]
  social_links?: SocialLinks
}

interface ProfileFormProps {
  profile?: Profile | null
}

// Define a more detailed schema for our new fields
const profileFormSchema = z.object({
  full_name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  headline: z.string().max(100, { message: 'Headline must be 100 characters or less.' }).optional(),
  bio: z.string().max(280, { message: 'Bio must be 280 characters or less.' }).optional(),
  avatar_url: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  skills: z.string().optional(), // We'll handle this as a comma-separated string
  social_links: z.object({
    linkedin: z.string().url({ message: 'Please enter a valid LinkedIn URL.' }).optional().or(z.literal('')),
    github: z.string().url({ message: 'Please enter a valid GitHub URL.' }).optional().or(z.literal('')),
    twitter: z.string().url({ message: 'Please enter a valid Twitter URL.' }).optional().or(z.literal('')),
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm({ profile }: ProfileFormProps) {
  const supabase = createClient()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      headline: profile?.headline || '',
      bio: profile?.bio || '',
      avatar_url: profile?.avatar_url || '',
      // Convert the skills array back to a comma-separated string for the input
      skills: profile?.skills ? profile.skills.join(', ') : '',
      social_links: {
        linkedin: profile?.social_links?.linkedin || '',
        github: profile?.social_links?.github || '',
        twitter: profile?.social_links?.twitter || '',
      },
    },
    mode: 'onChange',
  })

  async function onSubmit(data: ProfileFormValues) {
    if (!profile?.id) {
      setError('Profile ID is missing. Cannot update profile.')
      return
    }

    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Prepare the data for Supabase
      const updateData = {
        full_name: data.full_name,
        headline: data.headline || null,
        bio: data.bio || null,
        avatar_url: data.avatar_url || null,
        // Convert the comma-separated string of skills into an array of strings
        skills: data.skills 
          ? data.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
          : [],
        social_links: {
          linkedin: data.social_links.linkedin || null,
          github: data.social_links.github || null,
          twitter: data.social_links.twitter || null,
        },
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id)
      
      if (updateError) {
        throw updateError
      }

      setSuccess(true)
      console.log('Profile updated successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
      
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">Profile updated successfully!</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          {/* Basic Info */}
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headline</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Software Engineer | UX Designer" {...field} />
                </FormControl>
                <FormDescription>
                  Max 100 characters. This appears under your name.
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
                <FormLabel>Short Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us a little bit about yourself" 
                    className="resize-none"
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Max 280 characters. Share what makes you unique.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/your-photo.jpg" {...field} />
                </FormControl>
                <FormDescription>
                  Paste a URL to your profile picture (optional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Skills */}
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills</FormLabel>
                <FormControl>
                  <Input placeholder="React, Figma, Copywriting" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your skills, separated by commas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Links</h3>
            <FormField
              control={form.control}
              name="social_links.linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/your-profile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="social_links.github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/your-username" {...field} />
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
                  <FormLabel>Twitter / X</FormLabel>
                  <FormControl>
                    <Input placeholder="https://twitter.com/your-username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </div>
  )
}