'use client'

import { useFormContext, useFieldArray } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DashboardPanel } from "./DashboardPanel"
import { Plus, Trash2, Briefcase } from "lucide-react"

export function ExperiencePanel() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "experience"
    });

    const addExperience = () => {
        append({
            company: "",
            position: "",
            period: "",
            location: "",
            description: "",
            achievements: [],
            technologies_used: []
        });
    };

    const removeExperience = (index: number) => {
        remove(index);
    };

    return (
        <DashboardPanel
            title="Work Experience"
            description="Add your professional work experience and achievements."
        >
            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-6 border border-gray-800 rounded-lg bg-gray-900/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Briefcase size={20} className="text-green-400" />
                                <h3 className="font-semibold text-white">Experience #{index + 1}</h3>
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeExperience(index)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name={`experience.${index}.company`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Company/Organization name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={control}
                                name={`experience.${index}.position`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Position</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Senior Developer" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={control}
                                name={`experience.${index}.period`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Period</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 2020 - Present" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={control}
                                name={`experience.${index}.location`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="City, State/Country or Remote" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <FormField
                            control={control}
                            name={`experience.${index}.description`}
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Brief description of your role and responsibilities..." 
                                            rows={3}
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <FormField
                                control={control}
                                name={`experience.${index}.achievements`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Achievements (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Key achievements, one per line..." 
                                                rows={3}
                                                {...field}
                                                onChange={(e) => {
                                                    const achievements = e.target.value.split('\n').map(a => a.trim()).filter(Boolean);
                                                    field.onChange(achievements);
                                                }}
                                                value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                                            />
                                        </FormControl>
                                        <FormDescription>Enter each achievement on a new line</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={control}
                                name={`experience.${index}.technologies_used`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Technologies Used (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Technologies, tools, frameworks, one per line..." 
                                                rows={3}
                                                {...field}
                                                onChange={(e) => {
                                                    const technologies = e.target.value.split('\n').map(t => t.trim()).filter(Boolean);
                                                    field.onChange(technologies);
                                                }}
                                                value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                                            />
                                        </FormControl>
                                        <FormDescription>Enter each technology on a new line</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                ))}
                
                <Button
                    type="button"
                    variant="outline"
                    onClick={addExperience}
                    className="w-full border-dashed border-gray-600 hover:border-gray-500 text-gray-400 hover:text-white"
                >
                    <Plus size={16} className="mr-2" />
                    Add Experience
                </Button>
            </div>
        </DashboardPanel>
    );
}
