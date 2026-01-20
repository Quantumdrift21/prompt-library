import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { indexedDbService } from '../services/indexedDb';
import defaultAvatar from '../assets/default-avatar.png';

/**
 * Custom hook for managing profile picture state.
 * Prioritizes local IndexedDB storage, falls back to Supabase auth metadata.
 */
export const useProfilePicture = () => {
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadProfilePicture = useCallback(async () => {
        // 1. Try local IndexedDB first
        const localPic = await indexedDbService.getProfilePicture();
        if (localPic) {
            setProfilePicture(localPic);
            setIsLoading(false);
            return;
        }

        // 2. Fallback to Auth Metadata
        const state = authService.getState();
        const avatarUrl = state.user?.user_metadata?.avatar_url;
        setProfilePicture(avatarUrl || defaultAvatar);
        setIsLoading(false);
    }, []);

    // Initial load and Auth subscription
    useEffect(() => {
        loadProfilePicture();

        // If auth changes, user ID changes, so we must reload from IDB (which is scoped by user_id)
        const unsubscribe = authService.subscribe(() => {
            // giving a slight delay to allow IDB service to update its internal user ID if needed
            // though normally we setUserID manually. 
            // Ideally we just reload.
            loadProfilePicture();
        });

        return () => unsubscribe();
    }, [loadProfilePicture]);

    const updateProfilePicture = useCallback((newPicture: string | null) => {
        setProfilePicture(newPicture || defaultAvatar);
    }, []);

    return {
        profilePicture,
        isLoading,
        updateProfilePicture
    };
};

