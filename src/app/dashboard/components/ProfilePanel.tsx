'use client'

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DashboardPanel } from "./DashboardPanel"
import S3Uploader from "@/components/ui/s3Uploader"

export function ProfilePanel() {
    const { control, setValue, watch, trigger } = useFormContext();
    const avatarUrl = watch('avatar_url');

    const handleAvatarUpload = async (imageUrl: string) => {
        console.log('Avatar upload completed:', imageUrl);
        
        // Update the form value
        setValue('avatar_url', imageUrl);
        
        // Trigger validation for the avatar_url field
        await trigger('avatar_url');
        
        // Log the current form state to verify
        console.log('Form state after avatar update:', { avatar_url: imageUrl });
    };

    return (
        <DashboardPanel
            title="Basic Information"
            description="Your core profile details that visitors will see first."
        >
            <div className="space-y-6">
                <FormField control={control} name="full_name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={control} name="headline" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Headline</FormLabel>
                        <FormControl><Input placeholder="e.g., Software Engineer | UX Designer" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={control} name="bio" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bio (Hero Section)</FormLabel>
                        <FormControl><Textarea placeholder="A short, punchy introduction for the hero section..." rows={3} {...field} /></FormControl>
                        <FormDescription>A brief bio that appears in the hero section (max 150 characters).</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={control} name="about_description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>About Description</FormLabel>
                        <FormControl><Textarea placeholder="A detailed description about yourself for the about section..." rows={4} {...field} /></FormControl>
                        <FormDescription>A longer, detailed description that appears in the about section (max 500 characters).</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                
                {/* Avatar Upload Section */}
                <div className="space-y-4">
                    <FormLabel>Profile Picture</FormLabel>
                    <S3Uploader
                        onUploadComplete={handleAvatarUpload}
                        label="Upload Profile Picture"
                        description="Upload a profile picture (JPEG, PNG, or WebP)"
                        prefix="avatars"
                        accept="image/jpeg, image/png, image/webp"
                        showPreview={true}
                        initialValue={avatarUrl || ''}
                        className="max-w-md"
                    />
                    <FormDescription>Your profile picture will be displayed in the hero section.</FormDescription>
                    
                    {/* Debug info - remove in production */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="text-xs text-gray-500 bg-gray-800 p-2 rounded">
                            <p>Debug: Current avatar_url value: {avatarUrl || 'none'}</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardPanel>
    );
}