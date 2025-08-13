'use client'

import { useFormContext, useFieldArray } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DashboardPanel } from "./DashboardPanel"
import { Plus, Trash2, Settings } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Common icon options for services
const iconOptions = [
    { value: "uil-web-grid", label: "🌐 Web Grid", description: "Web Design & Development" },
    { value: "uil-arrow", label: "➡️ Arrow", description: "UI/UX Design" },
    { value: "uil-monitor", label: "💻 Monitor", description: "Mobile Development" },
    { value: "uil-palette", label: "🎨 Palette", description: "Brand Design" },
    { value: "uil-code-branch", label: "🔗 Code Branch", description: "Development" },
    { value: "uil-server-network", label: "🖥️ Server", description: "Backend Services" },
    { value: "uil-database", label: "🗄️ Database", description: "Data Services" },
    { value: "uil-cloud", label: "☁️ Cloud", description: "Cloud Services" },
    { value: "uil-shield-check", label: "🛡️ Shield", description: "Security Services" },
    { value: "uil-chart-line", label: "📈 Chart", description: "Analytics Services" },
    { value: "uil-users", label: "👥 Users", description: "Team Services" },
    { value: "uil-rocket", label: "🚀 Rocket", description: "Innovation Services" },
];

export function ServicesPanel() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "services"
    });

    const addService = () => {
        append({
            icon: "",
            title: "",
            description: ""
        });
    };

    const removeService = (index: number) => {
        remove(index);
    };

    return (
        <DashboardPanel
            title="Services Offered"
            description="List the services you provide to clients or employers."
        >
            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-6 border border-gray-800 rounded-lg bg-gray-900/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Settings size={20} className="text-purple-400" />
                                <h3 className="font-semibold text-white">Service #{index + 1}</h3>
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeService(index)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <FormField
                                control={control}
                                name={`services.${index}.icon`}
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
                                        <FormDescription>Choose an icon that represents your service</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={control}
                                name={`services.${index}.title`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Service Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Web Designer" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <FormField
                            control={control}
                            name={`services.${index}.description`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service Description</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Describe what this service includes (one feature per line works best)" 
                                            rows={3}
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormDescription>List key features or deliverables, one per line</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                ))}
                
                <Button
                    type="button"
                    variant="outline"
                    onClick={addService}
                    className="w-full border-dashed border-gray-600 hover:border-gray-500 text-gray-400 hover:text-white"
                >
                    <Plus size={16} className="mr-2" />
                    Add Service
                </Button>
            </div>
        </DashboardPanel>
    );
}
