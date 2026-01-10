import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LogoAnimation } from '../LogoAnimation';

describe('LogoAnimation', () => {
    it('renders PROMPT and LIBRARY text', () => {
        const { container } = render(<LogoAnimation />);
        // Check for PROMPT section
        const promptSection = container.querySelector('.logo-animation__text--prompt');
        expect(promptSection).toBeInTheDocument();
        expect(promptSection?.textContent).toBe('PROMPT');
        // Check for LIBRARY section
        const librarySection = container.querySelector('.logo-animation__text--library');
        expect(librarySection).toBeInTheDocument();
        expect(librarySection?.textContent).toBe('LIBRARY');
    });

    it('applies size variant class', () => {
        const { container } = render(<LogoAnimation size="small" />);
        expect(container.querySelector('.logo-animation--small')).toBeInTheDocument();
    });

    it('calls onComplete after animation', async () => {
        const onComplete = vi.fn();
        render(<LogoAnimation onComplete={onComplete} />);

        await waitFor(() => {
            expect(onComplete).toHaveBeenCalled();
        }, { timeout: 3000 });
    });
});
