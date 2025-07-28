'use client'

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DashboardPanel } from "./DashboardPanel"

export function SettingsPanel() {
    const { control, watch } = useFormContext();
    const username = watch('username');

    return (
        <DashboardPanel
            title="Settings"
            description="Manage your unique username and other account settings."
        >
            <div className="space-y-6">
                <FormField control={control} name="username" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <div className="flex items-center">
                                <Input className="rounded-r-none" {...field} />
                                <span className="px-4 py-2 bg-gray-800 border border-gray-700 border-l-0 rounded-r-lg text-gray-400 text-sm">
                                    .flick.page
                                </span>
                            </div>
                        </FormControl>
                        <FormDescription>This will be your public URL. Use lowercase letters, numbers, and hyphens.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
        </DashboardPanel>
    );
}
