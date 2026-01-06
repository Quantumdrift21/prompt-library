/**
 * Generate a unique ID for prompts.
 * Uses crypto.randomUUID() for browser compatibility.
 */
export const generateId = (): string => {
    return crypto.randomUUID();
};

/**
 * Get current ISO 8601 timestamp.
 */
export const getCurrentTimestamp = (): string => {
    return new Date().toISOString();
};

/**
 * Copy text to clipboard.
 * Returns true if successful, false otherwise.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
};
