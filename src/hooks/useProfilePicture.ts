import { useState, useEffect, useCallback } from 'react';
import { indexedDbService } from '../services/indexedDb';

/**
 * Custom hook for managing profile picture state.
 * Provides the current profile picture and a method to update it.
 */
export const useProfilePicture = () => {
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load profile picture on mount
    useEffect(() => {
        const loadPicture = async () => {
            setIsLoading(true);
            try {
                const saved = await indexedDbService.getProfilePicture();
                setProfilePicture(saved);
            } catch (error) {
                console.error('Failed to load profile picture:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadPicture();
    }, []);

    const updateProfilePicture = useCallback((newPicture: string | null) => {
        setProfilePicture(newPicture);
    }, []);

    const savePicture = useCallback(async (dataUrl: string) => {
        await indexedDbService.saveProfilePicture(dataUrl);
        setProfilePicture(dataUrl);
    }, []);

    const removePicture = useCallback(async () => {
        await indexedDbService.deleteProfilePicture();
        setProfilePicture(null);
    }, []);

    return {
        profilePicture,
        isLoading,
        updateProfilePicture,
        savePicture,
        removePicture
    };
};
