'use client'

import { useFormContext, useFieldArray } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Calendar, Users, Star, ExternalLink, Code } from "lucide-react"
import { DashboardPanel } from "./DashboardPanel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProjectsPanel() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "projects",
    });

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
          status: "in-progress",
          highlights: "",
        });
    };

    return (
        <DashboardPanel
            title="Projects"
            description="Showcase your work with detailed project briefs."
        >
            <div className="space-y-8">
                {fields.map((field, index) => (
                    <div key={field.id} className="border border-gray-800 rounded-xl p-6 relative">
                        <div className="flex justify-between items-center mb-6">
                             <h3 className="text-lg font-semibold text-white">Project {index + 1}</h3>
                             <Button className="bg-black text-red-400 hover:bg-red-900/50 hover:text-red-400" type="button" variant="outline" size="sm" onClick={() => remove(index)}>
                                <Trash2 size={16} />
                            </Button>
                        </div>
                        <div className="space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={control} name={`projects.${index}.title`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Title</FormLabel>
                                        <FormControl><Input placeholder="TaskForge - Task Management Platform" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={control} name={`projects.${index}.status`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="in-progress">In Progress</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                             </div>
                            <FormField control={control} name={`projects.${index}.description`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl><Textarea rows={8} placeholder="## Overview..." {...field} /></FormControl>
                                    <FormDescription>Markdown is supported for rich text formatting.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={control} name={`projects.${index}.technologies`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Technologies Used</FormLabel>
                                    <FormControl><Input placeholder="React, TypeScript, Node.js" {...field} /></FormControl>
                                    <FormDescription>List technologies separated by commas.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField control={control} name={`projects.${index}.startDate`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2"><Calendar size={16} /> Start Date</FormLabel>
                                        <FormControl><Input type="month" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={control} name={`projects.${index}.endDate`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date</FormLabel>
                                        <FormControl><Input type="month" {...field} /></FormControl>
                                        <FormDescription>Leave empty if ongoing.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={control} name={`projects.${index}.teamSize`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2"><Users size={16} /> Team Size</FormLabel>
                                        <FormControl><Input type="number" min="1" placeholder="1" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField control={control} name={`projects.${index}.imageUrl`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Image URL</FormLabel>
                                        <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={control} name={`projects.${index}.liveUrl`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2"><ExternalLink size={16} /> Live Demo URL</FormLabel>
                                        <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={control} name={`projects.${index}.githubUrl`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2"><Code size={16} /> Source Code URL</FormLabel>
                                        <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                             <FormField control={control} name={`projects.${index}.highlights`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Star size={16} /> Key Achievements</FormLabel>
                                    <FormControl><Textarea rows={4} placeholder="Increased user engagement by 40%..." {...field} /></FormControl>
                                    <FormDescription>List key achievements, one per line.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addNewProject} className="flex items-center gap-2 bg-black">
                    <Plus size={16} />
                    Add Project
                </Button>
            </div>
        </DashboardPanel>
    );
}