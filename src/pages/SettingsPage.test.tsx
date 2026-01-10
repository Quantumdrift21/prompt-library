import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SettingsPage from './SettingsPage';

// Mock child components to isolate validation logic
vi.mock('../components/settings/AccountSection', () => ({
    default: () => <div data-testid="section-account">Account Settings</div>
}));
vi.mock('../components/settings/PreferencesSection', () => ({
    default: () => <div data-testid="section-preferences">Preferences Settings</div>
}));
vi.mock('../components/settings/PrivacySection', () => ({
    default: () => <div data-testid="section-privacy">Privacy Settings</div>
}));
vi.mock('../components/settings/SecuritySection', () => ({
    default: () => <div data-testid="section-security">Security Settings</div>
}));
vi.mock('../components/settings/NotificationsSection', () => ({
    default: () => <div data-testid="section-notifications">Notifications Settings</div>
}));
vi.mock('../components/settings/MaintenanceSection', () => ({
    MaintenanceSection: () => <div data-testid="section-maintenance">Maintenance</div>
}));

// Mock hooks
vi.mock('../hooks', () => ({
    useAuth: () => ({
        user: { email: 'test@example.com' },
        session: {},
        isLoading: false
    }),
    useTheme: () => ({
        isDarkMode: true,
        setTheme: vi.fn(),
        toggleTheme: vi.fn()
    })
}));

vi.mock('../components/dashboard', () => ({
    DashboardNav: () => <div data-testid="dashboard-nav">Nav</div>,
    IconSidebar: () => <div data-testid="icon-sidebar">Sidebar</div>
}));

describe('SettingsPage Navigation', () => {
    it('renders the sidebar with all categories', () => {
        render(
            <MemoryRouter>
                <SettingsPage />
            </MemoryRouter>
        );
        // Query by the navigation label class to avoid panel title conflicts
        const navItems = screen.getAllByRole('button');
        const navLabels = navItems.map(btn => btn.textContent);

        expect(navLabels.some(label => label?.includes('Account'))).toBe(true);
        expect(navLabels.some(label => label?.includes('Preferences'))).toBe(true);
        expect(navLabels.some(label => label?.includes('Privacy'))).toBe(true);
        expect(navLabels.some(label => label?.includes('Security'))).toBe(true);
        expect(navLabels.some(label => label?.includes('Notifications'))).toBe(true);
        expect(navLabels.some(label => label?.includes('Advanced'))).toBe(true);
    });

    it('defaults to Account section', () => {
        render(
            <MemoryRouter>
                <SettingsPage />
            </MemoryRouter>
        );
        expect(screen.getByTestId('section-account')).toBeInTheDocument();
    });

    it('switches content when navigation item is clicked', async () => {
        render(
            <MemoryRouter>
                <SettingsPage />
            </MemoryRouter>
        );

        // Find and click 'Preferences' label  
        const prefLabel = screen.getByText('Preferences');
        const prefBtn = prefLabel.closest('button');
        expect(prefBtn).not.toBeNull();
        fireEvent.click(prefBtn!);

        await waitFor(() => {
            expect(screen.getByTestId('section-preferences')).toBeInTheDocument();
        });
    });

    it('shows sublabels for navigation items', () => {
        render(
            <MemoryRouter>
                <SettingsPage />
            </MemoryRouter>
        );
        expect(screen.getByText('Profile & Email')).toBeInTheDocument();
        expect(screen.getByText('Theme & Sync')).toBeInTheDocument();
        expect(screen.getByText('Data & Visibility')).toBeInTheDocument();
    });
});
