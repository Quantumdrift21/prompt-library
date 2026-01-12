import type { Prompt, PublicPrompt } from '../types';

/**
 * Maps a private/local Prompt to the PublicPrompt interface for unified display.
 * 
 * @param prompt - The local prompt to convert
 * @param authorName - Name to display as author (e.g. 'You' or 'Guest')
 * @returns PublicPrompt compatible object
 */
export const mapPrivateToPublic = (prompt: Prompt, authorName: string = 'You'): PublicPrompt => {
    return {
        id: prompt.id,
        title: prompt.title,
        content: prompt.content,
        // Since local prompts might not have these specific fields, we provide sensible defaults
        // or try to map relevant metadata if available
        // Note: 'preview' is not in Prompt, so we truncate content
        preview: prompt.content.slice(0, 150) + (prompt.content.length > 150 ? '...' : ''),
        type: 'Roleplay', // Default type, or could map from tags if a tag matches a known type
        model: 'Universal', // Default model
        tokens: 0, // Not calculated locally yet
        rating: 0, // Local prompts don't have community ratings
        rating_count: 0,
        fork_count: 0,
        tags: prompt.tags,
        author_name: authorName,
        is_featured: false,
        created_at: prompt.created_at,
        updated_at: prompt.updated_at
    };
};
