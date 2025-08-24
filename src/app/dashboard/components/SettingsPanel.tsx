'use client'

import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DashboardPanel } from "./DashboardPanel"
import { useState, useEffect, useCallback } from "react"
import { Check, X, Loader2 } from "lucide-react"
import { createClient } from '@/lib/supabase/client'

export function SettingsPanel() {
    const { control, watch, setError, clearErrors, formState: { errors }, setValue } = useFormContext();
    const username = watch('username');
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [lastCheckedUsername, setLastCheckedUsername] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCurrentUsername, setIsCurrentUsername] = useState(false);
    const supabase = createClient();

    // Debounced username availability check
    const checkUsernameAvailability = useCallback(async (usernameToCheck: string) => {
        if (!usernameToCheck || usernameToCheck.length < 3) {
            setIsAvailable(null);
            return;
        }

        // Clear previous errors
        clearErrors('username');

        // Validate format first
        const usernameRegex = /^[a-z0-9-]+$/;
        if (!usernameRegex.test(usernameToCheck)) {
            setError('username', { 
                type: 'manual', 
                message: 'Username can only contain lowercase letters, numbers, and hyphens.' 
            });
            setIsAvailable(false);
            return;
        }

        // Check reserved usernames
        const reservedUsernames = ['www', 'app', 'dashboard', 'settings', 'profile', 'admin', 'api', 'blog', 'help', 'support'];
        if (reservedUsernames.includes(usernameToCheck)) {
            setError('username', { 
                type: 'manual', 
                message: 'This username is reserved and cannot be used.' 
            });
            setIsAvailable(false);
            return;
        }

        // Check length
        if (usernameToCheck.length > 30) {
            setError('username', { 
                type: 'manual', 
                message: 'Username must be 30 characters or less.' 
            });
            setIsAvailable(false);
            return;
        }

        setIsChecking(true);
        setLastCheckedUsername(usernameToCheck);

        try {
            // Get current user to check if this is their own username
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setIsAvailable(null);
                return;
            }

            const { data: existingProfile, error } = await supabase
                .from('profiles')
                .select('username, id')
                .eq('username', usernameToCheck)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error checking username:', error);
                setIsAvailable(null);
                return;
            }

            // Check if username exists and if it belongs to current user
            let available = true;
            let message = '';
            let isCurrent = false;

            if (existingProfile) {
                if (existingProfile.id === user.id) {
                    // This is the user's own username - it's available to them
                    available = true;
                    message = 'This is your current username';
                    isCurrent = true;
                } else {
                    // Username is taken by another user
                    available = false;
                    message = 'This username is already taken by another user. Please choose another one.';
                    isCurrent = false;
                }
            }

            setIsAvailable(available);
            setIsCurrentUsername(isCurrent);

            if (!available) {
                setError('username', { 
                    type: 'manual', 
                    message: message
                });
            } else {
                clearErrors('username');
            }
        } catch (error) {
            console.error('Error checking username availability:', error);
            setIsAvailable(null);
        } finally {
            setIsChecking(false);
        }
    }, [setError, clearErrors, supabase]);

    // Debounced effect for username checking
    useEffect(() => {
        if (!username || username === lastCheckedUsername) return;

        const timeoutId = setTimeout(() => {
            checkUsernameAvailability(username);
        }, 500); // 500ms delay

        return () => clearTimeout(timeoutId);
    }, [username, lastCheckedUsername, checkUsernameAvailability]);

    const getUsernameStatus = () => {
        if (!username || username.length < 3) return null;
        
        if (isChecking) {
            return (
                <div className="flex items-center gap-2 text-blue-400">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">Checking availability...</span>
                </div>
            );
        }

        if (isAvailable === null) return null;

        if (isAvailable) {
            if (isCurrentUsername) {
                return (
                    <div className="flex items-center gap-2 text-blue-400">
                        <Check size={16} />
                        <span className="text-sm">This is your current username</span>
                    </div>
                );
            }
            
            return (
                <div className="flex items-center gap-2 text-green-400">
                    <Check size={16} />
                    <span className="text-sm">Username is available!</span>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2 text-red-400">
                <X size={16} />
                <span className="text-sm">Username is not available</span>
            </div>
            );
    };

    const getInputBorderColor = () => {
        if (!username || username.length < 3) return 'border-gray-700';
        if (isChecking) return 'border-blue-500';
        if (isAvailable === true) {
            if (isCurrentUsername) return 'border-blue-500';
            return 'border-green-500';
        }
        if (isAvailable === false) return 'border-red-500';
        return 'border-gray-700';
    };

    const generateSuggestedUsername = async () => {
        setIsGenerating(true);
        try {
            // Get current user info
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
            const userId = user.id;
            
            // Generate username similar to the logic in dashboard
            let suggestedUsername = '';
            
            if (fullName && fullName.trim()) {
                suggestedUsername = fullName
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
                
                if (suggestedUsername.length >= 3 && suggestedUsername.length <= 30) {
                    // Check if it's available
                    const { data: existingProfile } = await supabase
                        .from('profiles')
                        .select('username')
                        .eq('username', suggestedUsername)
                        .single();
                    
                    if (!existingProfile) {
                        setValue('username', suggestedUsername);
                        return;
                    }
                }
            }
            
            // Fallback: generate from userId + timestamp
            const userIdPart = userId.substring(0, 6);
            const timestamp = Date.now().toString(36).substring(0, 4);
            suggestedUsername = `user-${userIdPart}-${timestamp}`;
            
            // Ensure it's unique
            let attempts = 0;
            const maxAttempts = 5;
            
            while (attempts < maxAttempts) {
                attempts++;
                
                if (attempts > 1) {
                    const newTimestamp = Date.now().toString(36).substring(0, 4);
                    suggestedUsername = `user-${userIdPart}-${newTimestamp}`;
                }
                
                const { data: existingProfile } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('username', suggestedUsername)
                    .single();
                
                if (!existingProfile) {
                    setValue('username', suggestedUsername);
                    return;
                }
            }
            
            // If all else fails, use a very unique one
            const finalUsername = `user-${userIdPart}-${Date.now().toString(36)}`;
            setValue('username', finalUsername);
            
        } catch (error) {
            console.error('Error generating suggested username:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <DashboardPanel
            title="Settings"
            description="Manage your unique username and other account settings."
        >
            <div className="space-y-6">
                {/* Current Username Info */}
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Current Username</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-mono text-blue-400">
                            {username || 'Not set'}
                        </span>
                        {username && (
                            <span className="text-sm text-gray-400">
                                → <a 
                                    href={`https://${username}.prfl.live`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline"
                                >
                                    {username}.prfl.live
                                </a>
                            </span>
                        )}
                    </div>
                    {username && (
                        <p className="text-xs text-gray-500 mt-2">
                            Your portfolio is currently accessible at this URL
                        </p>
                    )}
                </div>

                <FormField control={control} name="username" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center flex-1">
                                        <Input 
                                            className={`rounded-r-none transition-colors ${getInputBorderColor()}`}
                                            placeholder="your-username"
                                            {...field} 
                                        />
                                        <span className="px-4 py-2 bg-gray-800 border border-gray-700 border-l-0 rounded-r-lg text-gray-400 text-sm">
                                            .prfl.live
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generateSuggestedUsername}
                                        disabled={isGenerating}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <span>💡</span>
                                                Generate
                                            </>
                                        )}
                                    </button>
                                </div>
                                
                                {/* Username status indicator */}
                                {getUsernameStatus()}
                                
                                {/* Username requirements */}
                                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                                    <h4 className="text-sm font-medium text-gray-300 mb-2">Username Requirements:</h4>
                                    <ul className="text-xs text-gray-400 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${username && username.length >= 3 ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                                            3-30 characters long
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${username && /^[a-z0-9-]+$/.test(username) ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                                            Lowercase letters, numbers, and hyphens only
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${username && !['www', 'app', 'dashboard', 'settings', 'profile', 'admin', 'api', 'blog', 'help', 'support'].includes(username) ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                                            Not a reserved word
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${isAvailable === true ? (isCurrentUsername ? 'bg-blue-400' : 'bg-green-400') : isAvailable === false ? 'bg-red-400' : 'bg-gray-500'}`}></span>
                                            {isCurrentUsername ? 'Your current username' : 'Available and unique'}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </FormControl>
                        <FormDescription>
                            This will be your public URL. Choose a username that represents you professionally.
                            {isCurrentUsername && (
                                <span className="block mt-1 text-blue-400">
                                    💡 You can keep your current username if you&apos;re happy with it.
                                </span>
                            )}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
        </DashboardPanel>
    );
}
