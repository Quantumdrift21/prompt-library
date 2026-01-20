/**
 * PublicPrompt - represents a prompt visible to all users (no auth required).
 * These prompts are stored in the public_prompts Supabase table.
 */
export interface PublicPrompt {
    /** Unique identifier */
    id: string;

    /** Brief title describing the prompt */
    title: string;

    /** Short preview of the prompt content */
    preview: string;

    /** Full prompt content */
    content: string;

    /** Type of prompt template */
    type: 'System Prompt' | 'Chain-of-Thought' | 'Few-Shot' | 'Roleplay' | 'Zero-Shot';

    /** Target AI model */
    model: string;

    /** Estimated token count */
    tokens: number;

    /** Average rating (0-5) */
    rating: number;

    /** Number of ratings */
    rating_count: number;

    /** Number of times forked/copied */
    fork_count: number;

    /** Categorization tags */
    tags: string[];

    /** Display name of the author */
    author_name: string;

    /** Whether this is a featured/highlighted prompt */
    is_featured: boolean;

    /** ISO 8601 creation timestamp */
    created_at: string;

    /** ISO 8601 last update timestamp */
    updated_at: string;
}
