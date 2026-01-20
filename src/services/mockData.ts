import type { Prompt, CreatePromptInput, UpdatePromptInput } from '../types';
import { generateId, getCurrentTimestamp } from '../utils';

// Sample prompts for development
const samplePrompts: Prompt[] = [
    {
        id: '1',
        title: 'Code Review Request',
        content: 'Please review this code for best practices, potential bugs, and performance improvements. Focus on:\n1. Code readability\n2. Error handling\n3. Edge cases\n4. Performance optimizations',
        tags: ['code', 'review'],
        favorite: true,
        created_at: '2026-01-01T10:00:00.000Z',
        updated_at: '2026-01-01T10:00:00.000Z',
        user_id: 'guest',
        deleted_at: null,
    },
    {
        id: '2',
        title: 'Explain Like I\'m 5',
        content: 'Explain the following concept in simple terms that a 5-year-old could understand. Use analogies and avoid technical jargon.',
        tags: ['explain', 'simple'],
        favorite: false,
        created_at: '2026-01-02T10:00:00.000Z',
        updated_at: '2026-01-02T10:00:00.000Z',
        user_id: 'guest',
        deleted_at: null,
    },
    {
        id: '3',
        title: 'Debug Helper',
        content: 'I have an error in my code. Here is the error message and the relevant code. Please help me identify the issue and suggest a fix.',
        tags: ['debug', 'code', 'error'],
        favorite: true,
        created_at: '2026-01-03T10:00:00.000Z',
        updated_at: '2026-01-03T10:00:00.000Z',
        user_id: 'guest',
        deleted_at: null,
    },
    {
        id: '4',
        title: 'Writing Assistant',
        content: 'Help me improve this text. Make it more concise, clear, and professional while maintaining the original meaning.',
        tags: ['writing', 'edit'],
        favorite: false,
        created_at: '2026-01-04T10:00:00.000Z',
        updated_at: '2026-01-04T10:00:00.000Z',
        user_id: 'guest',
        deleted_at: null,
    },
    {
        id: '5',
        title: 'Summarize Article',
        content: 'Summarize the following article in 3-5 bullet points. Focus on the key takeaways and main arguments.',
        tags: ['summary', 'reading'],
        favorite: false,
        created_at: '2026-01-05T10:00:00.000Z',
        updated_at: '2026-01-05T10:00:00.000Z',
        user_id: 'guest',
        deleted_at: null,
    },
];

// In-memory store
let prompts: Prompt[] = [...samplePrompts];

export const mockDataService = {
    getAll: (): Prompt[] => {
        return [...prompts].sort((a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
    },

    getById: (id: string): Prompt | null => {
        return prompts.find(p => p.id === id) || null;
    },

    create: (input: CreatePromptInput): Prompt => {
        const now = getCurrentTimestamp();
        const newPrompt: Prompt = {
            ...input,
            id: generateId(),
            created_at: now,
            updated_at: now,
            user_id: 'guest',
            deleted_at: null,
        };
        prompts = [newPrompt, ...prompts];
        return newPrompt;
    },

    update: (id: string, input: UpdatePromptInput): Prompt | null => {
        const index = prompts.findIndex(p => p.id === id);
        if (index === -1) return null;

        const updated: Prompt = {
            ...prompts[index],
            ...input,
            updated_at: getCurrentTimestamp(),
        };
        prompts[index] = updated;
        return updated;
    },

    delete: (id: string): boolean => {
        const index = prompts.findIndex(p => p.id === id);
        if (index === -1) return false;
        prompts.splice(index, 1);
        return true;
    },

    search: (query: string): Prompt[] => {
        const q = query.toLowerCase().trim();
        if (!q) return mockDataService.getAll();

        return prompts.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q) ||
            p.tags.some(tag => tag.toLowerCase().includes(q))
        ).sort((a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
    },
};
