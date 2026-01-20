import { useState, useCallback } from 'react';
import type { Prompt } from '../types';
import { copyToClipboard } from '../utils';

interface UseCopyResult {
    copiedId: string | null;
    copyPrompt: (prompt: Prompt) => Promise<void>;
}

/**
 * Hook for copying prompt content with feedback state.
 * Returns the ID of the most recently copied prompt for UI feedback.
 */
export const useCopy = (): UseCopyResult => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyPrompt = useCallback(async (prompt: Prompt) => {
        const success = await copyToClipboard(prompt.content);
        if (success) {
            setCopiedId(prompt.id);
            // Clear after 2 seconds
            setTimeout(() => setCopiedId(null), 2000);
        }
    }, []);

    return { copiedId, copyPrompt };
};
