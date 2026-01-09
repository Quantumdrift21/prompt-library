import { render, screen } from '@testing-library/react';
import { PromptDiscoveryGrid } from '../PromptDiscoveryGrid';

describe('PromptDiscoveryGrid', () => {
    test('renders prompt cards with titles', () => {
        render(<PromptDiscoveryGrid />);
        expect(screen.getByText('Socratic Python Tutor')).toBeInTheDocument();
        expect(screen.getByText('SEO Blog Post Generator')).toBeInTheDocument();
    });

    test('renders type badges', () => {
        render(<PromptDiscoveryGrid />);
        expect(screen.getAllByText('System Prompt').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Chain-of-Thought').length).toBeGreaterThan(0);
    });

    test('renders model badges', () => {
        render(<PromptDiscoveryGrid />);
        expect(screen.getAllByText('GPT-4').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Claude 3.5').length).toBeGreaterThan(0);
    });

    test('renders action buttons', () => {
        render(<PromptDiscoveryGrid />);
        const copyButtons = screen.getAllByText('Copy');
        const viewButtons = screen.getAllByText('View');
        expect(copyButtons.length).toBeGreaterThan(0);
        expect(viewButtons.length).toBeGreaterThan(0);
    });
});
