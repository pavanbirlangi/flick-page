'use client'

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DashboardPanel } from "./DashboardPanel"

export function SocialLinksPanel() {
    const { control } = useFormContext();
    return (
        <DashboardPanel
            title="Social Links"
            description="Connect your social media profiles so people can find you online."
        >
            <div className="space-y-6">
                <FormField control={control} name="social_links.linkedin" render={({ field }) => (
                    <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl>
                        <FormDescription>Your LinkedIn profile URL</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={control} name="social_links.github" render={({ field }) => (
                    <FormItem>
                        <FormLabel>GitHub</FormLabel>
                        <FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl>
                        <FormDescription>Your GitHub profile URL</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={control} name="social_links.twitter" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Twitter / X</FormLabel>
                        <FormControl><Input placeholder="https://twitter.com/..." {...field} /></FormControl>
                        <FormDescription>Your Twitter/X profile URL</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
        </DashboardPanel>
    );
}