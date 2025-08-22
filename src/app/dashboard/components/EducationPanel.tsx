'use client'

import { useFormContext, useFieldArray } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DashboardPanel } from "./DashboardPanel"
import { Plus, Trash2, GraduationCap } from "lucide-react"

export function EducationPanel() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "education"
    });

    const addEducation = () => {
        append({
            institution: "",
            degree: "",
            period: "",
            location: "",
            gpa: undefined,
            achievements: []
        });
    };

    const removeEducation = (index: number) => {
        remove(index);
    };

    return (
        <DashboardPanel
            title="Education"
            description="Add your educational background and achievements."
        >
            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-6 border border-gray-800 rounded-lg bg-gray-900/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <GraduationCap size={20} className="text-blue-400" />
                                <h3 className="font-semibold text-white">Education #{index + 1}</h3>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeEducation(index)}
                                className="bg-black text-red-400 hover:bg-red-900/50 hover:text-red-400"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name={`education.${index}.institution`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Institution</FormLabel>
                                        <FormControl>
                                            <Input placeholder="University/College name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={control}
                                name={`education.${index}.degree`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Degree</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., BS in Computer Science" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={control}
                                name={`education.${index}.period`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Period</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 2018 - 2022" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={control}
                                name={`education.${index}.location`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="City, State/Country" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={control}
                                name={`education.${index}.gpa`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>GPA (Optional)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                step="0.01" 
                                                min="0" 
                                                max="10" 
                                                placeholder="8.5" 
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                            />
                                        </FormControl>
                                        <FormDescription>Your GPA on a 10.0 scale</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <FormField
                            control={control}
                            name={`education.${index}.achievements`}
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>Achievements (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Dean's List, Honors, Awards, Scholarships... (one per line)" 
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
                    </div>
                ))}
                
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addEducation} 
                    className="flex items-center gap-2 bg-black"
                >
                    <Plus size={16} />
                    Add Education
                </Button>
            </div>
        </DashboardPanel>
    );
}
