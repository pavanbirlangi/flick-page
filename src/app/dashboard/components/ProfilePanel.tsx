'use client'

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DashboardPanel } from "./DashboardPanel"

export function ProfilePanel() {
    const { control } = useFormContext();
    return (
        <DashboardPanel
            title="Basic Information"
            description="Your core profile details that visitors will see first."
        >
            <div className="space-y-6">
                <FormField control={control} name="full_name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={control} name="headline" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Headline</FormLabel>
                        <FormControl><Input placeholder="e.g., Software Engineer | UX Designer" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={control} name="bio" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bio (Hero Section)</FormLabel>
                        <FormControl><Textarea placeholder="A short, punchy introduction for the hero section..." rows={3} {...field} /></FormControl>
                        <FormDescription>A brief bio that appears in the hero section (max 150 characters).</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={control} name="about_description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>About Description</FormLabel>
                        <FormControl><Textarea placeholder="A detailed description about yourself for the about section..." rows={4} {...field} /></FormControl>
                        <FormDescription>A longer, detailed description that appears in the about section (max 500 characters).</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={control} name="avatar_url" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Avatar URL</FormLabel>
                        <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                        <FormDescription>Link to your profile picture.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
        </DashboardPanel>
    );
}