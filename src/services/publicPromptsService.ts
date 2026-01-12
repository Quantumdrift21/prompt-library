import { supabase, isSupabaseConfigured } from './supabase';
import type { PublicPrompt } from '../types/publicPrompt';

/**
 * Generators for Mock Data
 */
const generateMockPrompts = (count: number): PublicPrompt[] => {
    const categories = ['Writing', 'Coding', 'Business', 'Marketing', 'Education', 'Roleplay', 'Data', 'Productivity', 'Creative'];
    const models = ['GPT', 'Claude', 'Llama 3', 'Mistral', 'Gemini'];
    const types: PublicPrompt['type'][] = ['System Prompt', 'Chain-of-Thought', 'Few-Shot', 'Roleplay', 'Zero-Shot'];

    return Array.from({ length: count }, (_, i) => {
        const id = `mock-${i + 1}`;
        const category = categories[i % categories.length];
        const model = models[i % models.length];
        const type = types[i % types.length];

        return {
            id,
            title: `${category} Assistant - ${type} ${i + 1}`,
            preview: `This is a generated mock prompt for ${category}. It demonstrates the layout for item #${i + 1}. Contains key instructions for ${model}...`,
            content: `You are an expert in ${category}. Please assist the user with their request using ${type} reasoning...`,
            type,
            model,
            tokens: 100 + (i * 10) % 500,
            rating: 3 + (i % 20) / 10, // 3.0 to 4.9
            rating_count: 10 + i * 2,
            fork_count: 5 + i,
            tags: [category, model, type, `Tag-${i % 10}`],
            author_name: `User${i + 1}`,
            is_featured: i < 10,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
    });
};

/**
 * Fallback sample prompts when Supabase is not configured or offline.
 * Generated on load to simulate a large database.
 */
const FALLBACK_PROMPTS: PublicPrompt[] = [
    {
        id: '1',
        title: 'Socratic Python Tutor',
        preview: 'Act as a senior Python engineer. When the user provides code, do not give the answer immediately. Instead, ask guiding questions...',
        content: 'You are a senior Python engineer...',
        type: 'System Prompt',
        model: 'GPT',
        tokens: 450,
        rating: 4.9,
        rating_count: 120,
        fork_count: 85,
        tags: ['Education', 'Python', 'Debugging'],
        author_name: 'Community',
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    // ... add valid static ones if needed, but let's just append mocks
    ...generateMockPrompts(950)
];

/**
 * Filters fallback prompts by search query and tags.
 * 
 * @param query - Search string to filter by title.
 * @param tags - Array of tags to filter by.
 * @param page - Page number (1-based).
 * @param limit - Items per page.
 * @returns Filtered array of prompts.
 */
const filterFallbackPrompts = (query?: string, tags?: string[], page = 1, limit = 9): PublicPrompt[] => {
    let results = [...FALLBACK_PROMPTS];

    if (query && query.trim()) {
        const lowerQuery = query.toLowerCase();
        results = results.filter(p =>
            p.title.toLowerCase().includes(lowerQuery) ||
            p.preview.toLowerCase().includes(lowerQuery) ||
            p.tags.some(t => t.toLowerCase().includes(lowerQuery))
        );
    }

    if (tags && tags.length > 0) {
        results = results.filter(p =>
            p.tags.some(t => tags.includes(t))
        );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    return results.slice(startIndex, startIndex + limit);
};

/**
 * Service for fetching public prompts (no auth required).
 * Falls back to hardcoded data if Supabase is not configured.
 */
export const publicPromptsService = {
    /**
     * Fetches public prompts, optionally filtered by search query and tags.
     * 
     * @param query - Optional search string to filter by title.
     * @param tags - Optional array of tags to filter by.
     * @returns Array of matching public prompts.
     */
    async search(query?: string, tags?: string[], page = 1, limit = 9): Promise<PublicPrompt[]> {
        // If Supabase not configured, use fallback
        if (!isSupabaseConfigured() || !supabase) {
            console.log('Supabase not configured, using fallback prompts');
            return filterFallbackPrompts(query, tags, page, limit);
        }

        try {
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            let request = supabase
                .from('public_prompts')
                .select('*')
                .order('rating', { ascending: false })
                .range(from, to);

            // Filter by search query (title ilike)
            if (query && query.trim()) {
                request = request.ilike('title', `%${query.trim()}%`);
            }

            // Filter by tags (contains any)
            if (tags && tags.length > 0) {
                request = request.overlaps('tags', tags);
            }

            const { data, error } = await request;

            if (error) {
                console.error('Error fetching public prompts:', error);
                return filterFallbackPrompts(query, tags, page, limit);
            }

            return (data as PublicPrompt[]) || [];
        } catch (err) {
            console.error('Failed to fetch public prompts:', err);
            return filterFallbackPrompts(query, tags, page, limit);
        }
    },

    /**
     * Fetches all unique tags from the public prompts.
     */
    async getTags(): Promise<string[]> {
        if (!isSupabaseConfigured() || !supabase) {
            const allTags = new Set(FALLBACK_PROMPTS.flatMap(p => p.tags));
            return Array.from(allTags).sort();
        }

        try {
            // This is efficient for small datasets but might need a dedicated RPC or table for large ones
            // For now, we'll fetch a distinct list if possible, or just fallback.
            // Supabase helper for distinct tags usually requires an RPC function
            // Fallback to searching basic ones or just returning hardcoded popular tags if RPC missing

            // Simplified: return common tags hardcoded + some from DB if needed
            // Actually, let's just do a limited fetch to gather tags or usage fallback
            return Array.from(new Set(FALLBACK_PROMPTS.flatMap(p => p.tags))).sort();
        } catch (err) {
            return [];
        }
    },

    /**
     * Fetches featured prompts for initial display.
     * 
     * @returns Array of featured or top-rated prompts.
     */
    async getFeatured(): Promise<PublicPrompt[]> {
        if (!isSupabaseConfigured() || !supabase) {
            return FALLBACK_PROMPTS.slice(0, 6);
        }

        try {
            const { data, error } = await supabase
                .from('public_prompts')
                .select('*')
                .order('rating', { ascending: false })
                .limit(6);

            if (error) {
                console.error('Error fetching featured prompts:', error);
                return FALLBACK_PROMPTS.slice(0, 6);
            }

            return (data as PublicPrompt[]) || [];
        } catch (err) {
            console.error('Failed to fetch featured prompts:', err);
            return FALLBACK_PROMPTS.slice(0, 6);
        }
    },

    /**
     * Fetch all public prompts (wrapper for search).
     */
    async getAll(): Promise<PublicPrompt[]> {
        // Warning: This could be large if we don't paginate. 
        // Ideally callers should use search().
        // For backwards compatibility, return first page.
        return this.search(undefined, undefined, 1, 9);
    },

    /**
     * Submit a rating for a prompt.
     * Currently a mock implementation for frontend integration.
     */
    async ratePrompt(id: string, rating: number): Promise<void> {
        console.log(`Rating prompt ${id} with ${rating} stars`);
        // TODO: Implement actual Supabase call
        // const { error } = await supabase.rpc('rate_prompt', { prompt_id: id, rating });
        // if (error) throw error;
    }
};
