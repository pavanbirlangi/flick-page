'use client'

import { useEffect, useState } from 'react'
import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DashboardPanel } from "./DashboardPanel"
import { Check, ExternalLink, Lock } from "lucide-react"
import Link from 'next/link'

interface TemplateItem {
    id: number
    name: string
    slug: 'basic' | 'axis' | 'eclipse'
    description?: string
    thumbnail_url?: string
    preview_url?: string
    required_plan: 'basic' | 'pro' | 'premium'
}

export function AppearancePanel() {
    const { control } = useFormContext();
    const [templates, setTemplates] = useState<TemplateItem[]>([])
    const [plan, setPlan] = useState<'basic'|'pro'|'premium'>('basic')

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/templates/available', { cache: 'no-store' })
                const data = await res.json()
                setTemplates(data.templates || [])
                setPlan(data.plan || 'basic')
            } catch (e) {
                console.error('Failed to load templates', e)
            }
        })()
    }, [])

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
                                {templates.map(t => (
                                    <TemplateCard
                                        key={t.id}
                                        value={t.slug}
                                        title={t.name}
                                        description={t.description || ''}
                                        imageUrl={t.thumbnail_url || 'https://placehold.co/600x400/101010/404040?text=Template'}
                                        requiredPlan={t.required_plan}
                                        userPlan={plan}
                                        disabled={rank(t.required_plan) > rank(plan)}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
                            <p className="text-sm text-blue-300">
                                💡 <strong>Tip:</strong> Click &quot;Preview Template&quot; on any template card to see how it will look with sample content in a new tab.
                            </p>
                        </div>
                    </FormItem>
                )}
            />
        </DashboardPanel>
    );
}

function rank(plan?: 'basic'|'pro'|'premium') {
    if (plan === 'premium') return 3
    if (plan === 'pro') return 2
    return 1
}

function TemplateCard({ value, title, description, imageUrl, requiredPlan, userPlan, disabled }: {
    value: 'basic'|'axis'|'eclipse',
    title: string,
    description: string,
    imageUrl: string,
    requiredPlan: 'basic'|'pro'|'premium',
    userPlan: 'basic'|'pro'|'premium',
    disabled: boolean
}) {
    const { watch } = useFormContext();
    const isSelected = watch('template') === value;

    const handlePreview = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(`/preview/${value}`, '_blank');
    };

    return (
        <label
            htmlFor={value}
            className={`relative block border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                isSelected ? 'border-white' : 'border-gray-800 hover:border-gray-700'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <RadioGroupItem value={value} id={value} className="sr-only" disabled={disabled} />
            {isSelected && (
                <div className="absolute top-4 right-4 bg-white text-black w-6 h-6 rounded-full flex items-center justify-center z-20">
                    <Check size={16} />
                </div>
            )}
            {disabled && (
                <div className="absolute top-4 right-4 bg-gray-900/80 border border-gray-700 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 z-10">
                    <Lock size={12} /> Requires {requiredPlan}
                </div>
            )}
            <div className="p-4">
                <div className="relative group">
                    <div className="h-48 bg-cover bg-center rounded-lg mb-4" style={{ backgroundImage: `url(${imageUrl})` }}></div>
                    {disabled && (
                        <div className="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                            <div className="text-center space-y-2">
                                <p className="text-sm text-white/90">Upgrade now to try this template</p>
                                <Link
                                    href="/pricing"
                                    className="inline-flex items-center px-3 py-1.5 rounded-md bg-white text-black text-sm font-semibold hover:bg-gray-200"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Upgrade now
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
                <h3 className="font-bold text-white">{title}</h3>
                <p className="text-sm text-gray-400 mb-3">{description}</p>

                <button
                    type="button"
                    onClick={handlePreview}
                    className={`${disabled ? 'text-blue-300 underline animate-pulse hover:text-blue-200' : 'text-blue-400 hover:text-blue-300'} inline-flex items-center gap-2 text-sm font-medium transition-colors`}
                >
                    <ExternalLink size={14} />
                    Preview Template
                </button>
            </div>
        </label>
    )
}
