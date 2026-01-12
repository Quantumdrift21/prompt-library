import { render, screen } from '@testing-library/react';
import { describe, it, test, expect } from 'vitest';
import { PromptDiscoveryGrid } from '../PromptDiscoveryGrid';
import type { PublicPrompt } from '../../../types/publicPrompt';

/**
 * Sample prompts for testing
 */
const MOCK_PROMPTS: PublicPrompt[] = [
    {
        id: '1',
        title: 'Socratic Python Tutor',
        preview: 'Act as a senior Python engineer...',
        content: 'Full content here',
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
    {
        id: '2',
        title: 'SEO Blog Post Generator',
        preview: 'You are an expert SEO content writer...',
        content: 'Full content here',
        type: 'Chain-of-Thought',
        model: 'Claude',
        tokens: 380,
        rating: 4.7,
        rating_count: 89,
        fork_count: 62,
        tags: ['Marketing', 'SEO', 'Writing'],
        author_name: 'Community',
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

describe('PromptDiscoveryGrid', () => {
    it('renders prompt cards with titles', () => {
        render(<PromptDiscoveryGrid prompts={MOCK_PROMPTS} />);
        expect(screen.getByText('Socratic Python Tutor')).toBeInTheDocument();
        expect(screen.getByText('SEO Blog Post Generator')).toBeInTheDocument();
    });

    test('renders type badges', () => {
        render(<PromptDiscoveryGrid prompts={MOCK_PROMPTS} />);
        expect(screen.getAllByText('System Prompt').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Chain-of-Thought').length).toBeGreaterThan(0);
    });

    test('renders model badges', () => {
        render(<PromptDiscoveryGrid prompts={MOCK_PROMPTS} />);
        expect(screen.getAllByText('GPT').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Claude').length).toBeGreaterThan(0);
    });

    test('renders action buttons', () => {
        render(<PromptDiscoveryGrid prompts={MOCK_PROMPTS} />);
        const copyButtons = screen.getAllByText('Copy');
        const viewButtons = screen.getAllByText('View');
        expect(copyButtons.length).toBeGreaterThan(0);
        expect(viewButtons.length).toBeGreaterThan(0);
    });

    test('renders loading skeletons when isLoading is true', () => {
        render(<PromptDiscoveryGrid prompts={[]} isLoading={true} />);
        const skeletons = document.querySelectorAll('.prompt-card-skeleton');
        expect(skeletons.length).toBe(6);
    });

    test('renders empty state when no prompts', () => {
        render(<PromptDiscoveryGrid prompts={[]} isLoading={false} />);
        expect(screen.getByText('No prompts found. Try a different search term.')).toBeInTheDocument();
    });
});
