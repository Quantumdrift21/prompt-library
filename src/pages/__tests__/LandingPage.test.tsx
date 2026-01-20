import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';

describe('LandingPage', () => {
    test('renders landing page on /landing route', () => {
        render(
            <MemoryRouter initialEntries={['/landing']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText(/Master the Art of Context/i)).toBeInTheDocument();
    });

    test('renders navigation with key links', () => {
        render(
            <MemoryRouter initialEntries={['/landing']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getAllByText(/Discover/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/Sign Up Free/i)).toBeInTheDocument();
    });
    test('renders hero section with logo animation and headline', () => {
        render(
            <MemoryRouter initialEntries={['/landing']}>
                <App />
            </MemoryRouter>
        );

        // Check for the headline
        expect(screen.getByText(/Master the Art of Context/i)).toBeInTheDocument();

        // Check for the LogoAnimation component (replaced video)
        const logoAnimation = document.querySelector('.logo-animation');
        expect(logoAnimation).toBeInTheDocument();
        // Check PROMPT text is rendered
        const promptText = document.querySelector('.logo-animation__text--prompt');
        expect(promptText).toBeInTheDocument();
    });
});
