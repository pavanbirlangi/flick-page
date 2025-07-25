'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const profileFormSchema = z.object({
  full_name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  headline: z.string().max(100, { message: 'Headline must not be longer than 100 characters.' }),
  bio: z.string().max(280, { message: 'Bio must not be longer than 280 characters.' }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// The component needs the initial profile data
export function ProfileForm({ profile }) {
  const supabase = createClient()
  const [isSaving, setIsSaving] = useState(false)
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      headline: profile?.headline || '',
      bio: profile?.bio || '',
    },
    mode: 'onChange',
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsSaving(true)
    const { error } = await supabase.from('profiles').update(data).eq('id', profile.id)
    if (error) {
      console.error('Error updating profile:', error)
      // Add toast notification for error
    } else {
      // Add toast notification for success
      console.log('Profile updated!')
    }
    setIsSaving(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
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
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  )
}