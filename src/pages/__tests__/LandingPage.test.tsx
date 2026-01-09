import { render, screen } from '@testing-library/react';
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
        expect(screen.getByText(/Discover/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign Up Free/i)).toBeInTheDocument();
    });
});
