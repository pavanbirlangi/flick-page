'use client'

import { useFormContext, useFieldArray } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DashboardPanel } from "./DashboardPanel"
import { Plus, Trash2, BarChart3 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Common icon options for about stats
const iconOptions = [
    { value: "uil-graduation-cap", label: "🎓 Graduation Cap", description: "Education" },
    { value: "uil-trophy", label: "🏆 Trophy", description: "Achievements & Awards" },
    { value: "uil-rocket", label: "🚀 Rocket", description: "Innovation & Growth" },
    { value: "uil-users", label: "👥 Users", description: "Team & Collaboration" },
    { value: "uil-calendar-alt", label: "📅 Calendar", description: "Experience & Time" },
    { value: "uil-star", label: "⭐ Star", description: "Excellence & Quality" },
    { value: "uil-heart", label: "❤️ Heart", description: "Passion & Dedication" },
    { value: "uil-lightbulb", label: "💡 Lightbulb", description: "Ideas & Creativity" },
    { value: "uil-target", label: "🎯 Target", description: "Goals & Focus" },
    { value: "uil-award", label: "🏅 Award", description: "Recognition & Honors" },
    { value: "uil-briefcase", label: "💼 Briefcase", description: "Professional Work" },
    { value: "uil-code-branch", label: "🔗 Code Branch", description: "Technical Skills" },
];

export function AboutStatsPanel() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "about_stats"
    });

    const addStat = () => {
        append({
            icon: "",
            title: "",
            subtitle: ""
        });
    };

    const removeStat = (index: number) => {
        remove(index);
    };

    return (
        <DashboardPanel
            title="About Section Stats"
            description="Add key statistics and achievements to display in your about section."
        >
            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-6 border border-gray-800 rounded-lg bg-gray-900/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <BarChart3 size={20} className="text-cyan-400" />
                                <h3 className="font-semibold text-white">Stat #{index + 1}</h3>
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeStat(index)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={control}
                                name={`about_stats.${index}.icon`}
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
                                        <FormDescription>Choose an icon that represents this stat</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={control}
                                name={`about_stats.${index}.title`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Education" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={control}
                                name={`about_stats.${index}.subtitle`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subtitle</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., BTech Graduate" {...field} />
                                        </FormControl>
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
                    onClick={addStat}
                    className="w-full border-dashed border-gray-600 hover:border-gray-500 text-gray-400 hover:text-white"
                >
                    <Plus size={16} className="mr-2" />
                    Add Statistic
                </Button>
            </div>
        </DashboardPanel>
    );
}
