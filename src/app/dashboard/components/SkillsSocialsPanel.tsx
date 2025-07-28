'use client'

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DashboardPanel } from "./DashboardPanel"

export function SkillsSocialsPanel() {
    const { control } = useFormContext();
    return (
        <DashboardPanel
            title="Skills & Socials"
            description="Showcase your expertise and where people can find you."
        >
            <div className="space-y-8">
                <FormField control={control} name="skills" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <FormControl><Input placeholder="React, Figma, Copywriting" {...field} /></FormControl>
                        <FormDescription>Enter your skills, separated by commas.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="space-y-6">
                    <h3 className="text-lg font-medium">Social Links</h3>
                    <FormField control={control} name="social_links.linkedin" render={({ field }) => (
                        <FormItem>
                            <FormLabel>LinkedIn</FormLabel>
                            <FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={control} name="social_links.github" render={({ field }) => (
                        <FormItem>
                            <FormLabel>GitHub</FormLabel>
                            <FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={control} name="social_links.twitter" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Twitter / X</FormLabel>
                            <FormControl><Input placeholder="https://twitter.com/..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
            </div>
        </DashboardPanel>
    );
}