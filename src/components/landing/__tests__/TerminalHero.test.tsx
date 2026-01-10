import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { TerminalHero } from '../TerminalHero';

describe('TerminalHero', () => {
    test('renders terminal window with prompt text', () => {
        render(<TerminalHero />);
        // Check for terminal prompt symbol
        expect(screen.getByText('$')).toBeInTheDocument();
        // Check for model badge
        expect(screen.getByText('GPT-4')).toBeInTheDocument();
    });

    test('renders navigation controls', () => {
        render(<TerminalHero />);
        expect(screen.getByLabelText('Previous example')).toBeInTheDocument();
        expect(screen.getByLabelText('Next example')).toBeInTheDocument();
    });

    test('renders category badge', () => {
        render(<TerminalHero />);
        expect(screen.getByText('Coding')).toBeInTheDocument();
    });
});
