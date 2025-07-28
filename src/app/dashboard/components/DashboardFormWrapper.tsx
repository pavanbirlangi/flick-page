'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { profileFormSchema, ProfileFormValues, Profile } from '@/lib/schema'
import { createClient } from '@/lib/supabase/client'
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"

import { ProfilePanel } from './ProfilePanel'
import { SkillsSocialsPanel } from './SkillsSocialsPanel'
import { ProjectsPanel } from './ProjectsPanel'
import { SettingsPanel } from './SettingsPanel' // Import the new panel

export function DashboardFormWrapper({ activePanel, profile }: { activePanel: string, profile: Profile | null }) {
    const supabase = createClient();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            username: profile?.username || '',
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
            projects: profile?.projects?.map(p => ({
                ...p,
                technologies: p.technologies?.join(', ') || '',
                highlights: p.highlights?.join('\n') || '',
            })) || [],
        },
        mode: 'onChange',
    });

    async function onSubmit(data: ProfileFormValues) {
        if (!profile?.id) {
            setError("Profile ID is missing.");
            return;
        }

        setIsSaving(true);
        setError(null);
        setSuccess(false);

        try {
            // Check for username uniqueness if it has changed
            if (data.username && data.username !== profile.username) {
                const { data: existingProfile, error: checkError } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('username', data.username)
                    .single();

                if (checkError && checkError.code !== 'PGRST116') throw checkError; // Ignore 'not found' error
                if (existingProfile) {
                    form.setError("username", { type: "manual", message: "This username is already taken." });
                    throw new Error("Username is already taken.");
                }
            }

            const updateData = {
                username: data.username,
                full_name: data.full_name,
                headline: data.headline || null,
                bio: data.bio || null,
                avatar_url: data.avatar_url || null,
                skills: data.skills ? data.skills.split(",").map((skill) => skill.trim()).filter(Boolean) : [],
                social_links: {
                    linkedin: data.social_links.linkedin || null,
                    github: data.social_links.github || null,
                    twitter: data.social_links.twitter || null,
                },
                projects: data.projects?.map((project) => ({
                    ...project,
                    technologies: project.technologies ? project.technologies.split(",").map((tech) => tech.trim()).filter(Boolean) : [],
                    highlights: project.highlights ? project.highlights.split("\n").map((h) => h.trim()).filter(Boolean) : [],
                })) || [],
            };
            
            const { error: updateError } = await supabase.from("profiles").update(updateData).eq("id", profile.id);
            if (updateError) throw updateError;
            
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                {activePanel === 'profile' && <ProfilePanel />}
                {activePanel === 'skills' && <SkillsSocialsPanel />}
                {activePanel === 'projects' && <ProjectsPanel />}
                {activePanel === 'settings' && <SettingsPanel />}
                
                <div className="flex justify-end pt-8 border-t border-gray-800">
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}