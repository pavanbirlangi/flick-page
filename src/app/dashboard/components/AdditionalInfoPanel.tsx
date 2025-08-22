'use client'

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DashboardPanel } from "./DashboardPanel"
import { MapPin, Clock, Calendar, Languages, Award } from "lucide-react"

export function AdditionalInfoPanel() {
    const { control } = useFormContext();

    return (
        <DashboardPanel
            title="Additional Information"
            description="Extra details about your profile and availability."
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={control}
                        name="additional_info.location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    Location
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., San Francisco, CA" {...field} />
                                </FormControl>
                                <FormDescription>Your current location or preferred work location</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={control}
                        name="additional_info.availability"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Clock size={16} />
                                    Availability
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Available for hire, Open to opportunities" {...field} />
                                </FormControl>
                                <FormDescription>Your current availability status</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={control}
                        name="additional_info.years_of_experience"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    Years of Experience
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number" 
                                        min="0" 
                                        placeholder="5" 
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                    />
                                </FormControl>
                                <FormDescription>Total years of professional experience</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <FormField
                    control={control}
                    name="additional_info.languages"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Languages size={16} />
                                Languages
                            </FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="English, Spanish, French (comma separated)" 
                                    {...field}
                                    onChange={(e) => {
                                        const languages = e.target.value.split(',').map(l => l.trim()).filter(Boolean);
                                        field.onChange(languages);
                                    }}
                                    value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                />
                            </FormControl>
                            <FormDescription>Languages you speak, separated by commas</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={control}
                    name="additional_info.certifications"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Award size={16} />
                                Certifications
                            </FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="AWS Certified Developer, Google Cloud Professional (comma separated)" 
                                    {...field}
                                    onChange={(e) => {
                                        const certifications = e.target.value.split(',').map(c => c.trim()).filter(Boolean);
                                        field.onChange(certifications);
                                    }}
                                    value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                />
                            </FormControl>
                            <FormDescription>Professional certifications, separated by commas</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </DashboardPanel>
    );
}
