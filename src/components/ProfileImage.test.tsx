import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProfileImage } from './ProfileImage';

describe('ProfileImage', () => {
    it('renders guest placeholder when not logged in', () => {
        render(<ProfileImage isLoggedIn={false} />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', '/assets/images/guest_placeholder.png');
    });

    it('renders default user when logged in but no image', () => {
        render(<ProfileImage isLoggedIn={true} profileImageUrl={null} />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', '/assets/images/default_user.png');
    });

    it('renders custom image when logged in and has image', () => {
        const customUrl = 'https://example.com/me.png';
        render(<ProfileImage isLoggedIn={true} profileImageUrl={customUrl} />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', customUrl);
    });
});
