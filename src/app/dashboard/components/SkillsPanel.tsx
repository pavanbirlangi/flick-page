'use client'

import { useFormContext, useFieldArray } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DashboardPanel } from "./DashboardPanel"
import { Plus, Trash2, Star, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Common icon options for skills categories
const iconOptions = [
    { value: "uil-brackets-curly", label: "{} Brackets", description: "Frontend Development" },
    { value: "uil-server-network", label: "🖥️ Server", description: "Backend Development" },
    { value: "uil-swatchbook", label: "🎨 Swatchbook", description: "Design & UI/UX" },
    { value: "uil-mobile-android", label: "📱 Mobile", description: "Mobile Development" },
    { value: "uil-database", label: "🗄️ Database", description: "Database & Data" },
    { value: "uil-cloud", label: "☁️ Cloud", description: "Cloud & DevOps" },
    { value: "uil-code-branch", label: "🔗 Code Branch", description: "Version Control" },
    { value: "uil-cog", label: "⚙️ Cog", description: "Tools & Utilities" },
    { value: "uil-chart-line", label: "📈 Chart", description: "Analytics & Data" },
    { value: "uil-shield-check", label: "🛡️ Shield", description: "Security" },
    { value: "uil-rocket", label: "🚀 Rocket", description: "Performance & Optimization" },
    { value: "uil-lightbulb", label: "💡 Lightbulb", description: "Innovation & Ideas" },
];

export function SkillsPanel() {
    const { control, setValue, watch } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "skills_categories"
    });

    const addSkillCategory = () => {
        append({
            category: "",
            icon: "",
            title: "",
            subtitle: "",
            skills: []
        });
    };

    const removeSkillCategory = (index: number) => {
        remove(index);
    };

    const addSkill = (categoryIndex: number) => {
        const currentCategories = watch('skills_categories');
        const currentSkills = currentCategories[categoryIndex]?.skills || [];
        const newSkills = [...currentSkills, { name: "", percentage: 50 }];
        
        // Update the skills array for this category
        const updatedCategories = [...currentCategories];
        updatedCategories[categoryIndex] = {
            ...updatedCategories[categoryIndex],
            skills: newSkills
        };
        
        setValue('skills_categories', updatedCategories);
    };

    const removeSkill = (categoryIndex: number, skillIndex: number) => {
        const currentCategories = watch('skills_categories');
        const currentSkills = currentCategories[categoryIndex]?.skills || [];
        const newSkills = currentSkills.filter((_: any, index: number) => index !== skillIndex);
        
        // Update the skills array for this category
        const updatedCategories = [...currentCategories];
        updatedCategories[categoryIndex] = {
            ...updatedCategories[categoryIndex],
            skills: newSkills
        };
        
        setValue('skills_categories', updatedCategories);
    };

    return (
        <DashboardPanel
            title="Skills & Categories"
            description="Organize your skills into categories with proficiency levels."
        >
            <div className="space-y-6">
                {fields.map((field, categoryIndex) => (
                    <div key={field.id} className="p-6 border border-gray-800 rounded-lg bg-gray-900/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Star size={20} className="text-yellow-400" />
                                <h3 className="font-semibold text-white">Skill Category #{categoryIndex + 1}</h3>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeSkillCategory(categoryIndex)}
                                className="bg-black text-red-400 hover:bg-red-900/50 hover:text-red-400"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <FormField
                                control={control}
                                name={`skills_categories.${categoryIndex}.category`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Frontend, Backend, Design" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={control}
                                name={`skills_categories.${categoryIndex}.icon`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Icon</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose an icon" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {iconOptions.map((icon) => (
                                                    <SelectItem key={icon.value} value={icon.value}>
                                                        <div className="flex items-center gap-2">
                                                            <span>{icon.label}</span>
                                                            <span className="text-xs text-gray-500">({icon.description})</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Choose an icon that represents this skill category</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={control}
                                name={`skills_categories.${categoryIndex}.title`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Frontend Developer" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={control}
                                name={`skills_categories.${categoryIndex}.subtitle`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subtitle</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., More than 4 years" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <div className="border-t border-gray-700 pt-4">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium text-white">Skills in this category</h4>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addSkill(categoryIndex)}
                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Add Skill
                                </Button>
                            </div>
                            
                            <div className="space-y-3">
                                {(watch(`skills_categories.${categoryIndex}.skills`) || []).map((skill: any, skillIndex: number) => (
                                    <div key={skillIndex} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                                        <FormField
                                            control={control}
                                            name={`skills_categories.${categoryIndex}.skills.${skillIndex}.name`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input placeholder="Skill name" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        
                                        <FormField
                                            control={control}
                                            name={`skills_categories.${categoryIndex}.skills.${skillIndex}.percentage`}
                                            render={({ field }) => (
                                                <FormItem className="w-24">
                                                    <FormControl>
                                                        <Input 
                                                            type="number" 
                                                            min="0" 
                                                            max="100" 
                                                            placeholder="%" 
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSkill(categoryIndex, skillIndex)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1"
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addSkillCategory} 
                    className="flex items-center gap-2 bg-black"
                >
                    <Plus size={16} />
                    Add Skill Category
                </Button>
            </div>
        </DashboardPanel>
    );
}
