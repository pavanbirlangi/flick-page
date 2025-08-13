'use client'

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DashboardPanel } from "./DashboardPanel"
import { Check } from "lucide-react"

export function AppearancePanel() {
    const { control } = useFormContext();

    return (
        <DashboardPanel
            title="Appearance"
            description="Choose a template to define the look and feel of your public portfolio."
        >
            <FormField
                control={control}
                name="template"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="text-lg font-semibold text-white">Select a Template</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4"
                            >
                                <TemplateCard
                                    value="basic"
                                    title="Basic"
                                    description="A clean, simple, and text-focused layout."
                                    imageUrl="https://placehold.co/600x400/101010/404040?text=Basic+Template"
                                />
                                <TemplateCard
                                    value="axis"
                                    title="Axis (Pro)"
                                    description="A structured, precise layout with a strong grid."
                                    imageUrl="https://placehold.co/600x400/101010/404040?text=Axis+Template"
                                />
                                <TemplateCard
                                    value="eclipse"
                                    title="Eclipse (Pro)"
                                    description="A modern, animated portfolio with rich sections and interactive elements."
                                    imageUrl="https://placehold.co/600x400/101010/404040?text=Eclipse+Template"
                                />
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </DashboardPanel>
    );
}

function TemplateCard({ value, title, description, imageUrl }: { value: string, title: string, description: string, imageUrl: string }) {
    const { watch, setValue } = useFormContext();
    const isSelected = watch('template') === value;

    return (
        <label
            htmlFor={value}
            className={`relative block border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                isSelected ? 'border-white' : 'border-gray-800 hover:border-gray-700'
            }`}
        >
            <RadioGroupItem value={value} id={value} className="sr-only" />
            {isSelected && (
                <div className="absolute top-4 right-4 bg-white text-black w-6 h-6 rounded-full flex items-center justify-center">
                    <Check size={16} />
                </div>
            )}
            <div className="p-4">
                <div className="h-48 bg-cover bg-center rounded-lg mb-4" style={{ backgroundImage: `url(${imageUrl})` }}></div>
                <h3 className="font-bold text-white">{title}</h3>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
        </label>
    )
}
