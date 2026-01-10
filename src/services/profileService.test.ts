import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadAvatar } from './profileService';
import { supabase } from './supabase';

vi.mock('./supabase', () => ({
    supabase: {
        storage: {
            from: vi.fn(),
        },
        auth: {
            getUser: vi.fn(),
            updateUser: vi.fn(),
        }
    },
}));

describe('uploadAvatar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('uploads file and updates user metadata', async () => {
        const mockFile = new File(['(⌐■_■)'], 'avatar.png', { type: 'image/png' });
        const mockUser = { id: 'user-123' };
        const mockPublicUrl = 'https://supa.co/avatar.png';

        // Mock Auth - getUser
        (supabase!.auth.getUser as any).mockResolvedValue({ data: { user: mockUser }, error: null });

        // Mock Auth - updateUser
        (supabase!.auth.updateUser as any).mockResolvedValue({ data: { user: mockUser }, error: null });

        // Mock Storage
        const uploadMock = vi.fn().mockResolvedValue({ data: { path: 'avatar.png' }, error: null });
        const getPublicUrlMock = vi.fn().mockReturnValue({ data: { publicUrl: mockPublicUrl } });
        (supabase!.storage.from as any).mockReturnValue({
            upload: uploadMock,
            getPublicUrl: getPublicUrlMock
        });

        const result = await uploadAvatar(mockFile);

        expect(supabase!.storage.from).toHaveBeenCalledWith('avatars');
        expect(uploadMock).toHaveBeenCalled();
        expect(supabase!.auth.updateUser).toHaveBeenCalledWith({
            data: { avatar_url: mockPublicUrl }
        });
        expect(result).toBe(mockPublicUrl);
    });

    it('throws error for invalid file type', async () => {
        const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });

        await expect(uploadAvatar(mockFile)).rejects.toThrow('Invalid file type');
    });

    it('throws error for file too large', async () => {
        // Create a file larger than 2MB
        const largeContent = new Array(3 * 1024 * 1024).fill('a').join('');
        const mockFile = new File([largeContent], 'large.png', { type: 'image/png' });

        await expect(uploadAvatar(mockFile)).rejects.toThrow('File too large');
    });
});

