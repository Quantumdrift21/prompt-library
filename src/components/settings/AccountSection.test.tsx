import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccountSection from './AccountSection';

// Mock dependencies
const mockUser = {
    id: '123',
    email: 'test@example.com',
    user_metadata: {
        display_name: 'Test User',
        full_name: 'Test Full Name',
        bio: 'A test bio',
        avatar_url: null
    }
};

vi.mock('../../hooks', () => ({
    useAuth: () => ({
        user: mockUser,
        session: {},
        isLoading: false
    })
}));

vi.mock('../../services/profileService', () => ({
    uploadAvatar: vi.fn().mockResolvedValue('https://example.com/avatar.png')
}));

const mockUpdateProfile = vi.fn().mockResolvedValue({ error: null });
const mockUpdateEmail = vi.fn().mockResolvedValue({ error: null });

vi.mock('../../services/authService', () => ({
    authService: {
        updateProfile: (...args: any[]) => mockUpdateProfile(...args),
        updateEmail: (...args: any[]) => mockUpdateEmail(...args),
        deleteAccount: vi.fn()
    }
}));

vi.mock('../ProfileImage', () => ({
    ProfileImage: () => <div data-testid="profile-image">Avatar</div>
}));

describe('AccountSection', () => {
    it('renders profile information fields with correct initial values', () => {
        render(<AccountSection />);

        const displayInput = screen.getByLabelText(/^Display Name/i) as HTMLInputElement;
        const fullInput = screen.getByLabelText(/^Full Name/i) as HTMLInputElement;
        const bioInput = screen.getByLabelText(/^Bio/i) as HTMLTextAreaElement;

        expect(displayInput.value).toBe('Test User');
        expect(fullInput.value).toBe('Test Full Name');
        expect(bioInput.value).toBe('A test bio');
    });

    it('disables save button initially', () => {
        render(<AccountSection />);
        const saveButton = screen.getByText(/^Save Changes/i);
        expect(saveButton).toBeDisabled();
    });

    it('enables save button when changes are made', () => {
        render(<AccountSection />);
        const displayInput = screen.getByLabelText(/^Display Name/i);

        fireEvent.change(displayInput, { target: { value: 'New Name' } });

        const saveButton = screen.getByText(/^Save Changes/i);
        expect(saveButton).toBeEnabled();
    });

    it('saves changes when button is clicked', async () => {
        render(<AccountSection />);

        // Change input
        const displayInput = screen.getByLabelText(/^Display Name/i);
        fireEvent.change(displayInput, { target: { value: 'New Name' } });

        // Click save
        const saveButton = screen.getByText(/^Save Changes/i);
        fireEvent.click(saveButton);

        // Verify loading state
        expect(screen.getByText(/Saving.../i)).toBeInTheDocument();

        // Verify API call
        await waitFor(() => {
            expect(mockUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({
                display_name: 'New Name',
                // other fields should be present with current values
                bio: 'A test bio'
            }));
        });

        // Verify success message
        expect(screen.getByText(/Profile updated successfully/i)).toBeInTheDocument();
    });

    it('shows email verification warning', () => {
        render(<AccountSection />);
        expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
        expect(screen.getByText(/Changing your/i)).toBeInTheDocument();
    });
});
