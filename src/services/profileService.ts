import { supabase } from './supabase';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Validates the uploaded file for type and size constraints.
 * @param file - The file to validate.
 * @throws Error if validation fails.
 */
const validateFile = (file: File): void => {
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`);
    }
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }
};

/**
 * Uploads an avatar image to Supabase storage and updates user metadata.
 * @param file - The image file to upload.
 * @returns The public URL of the uploaded avatar, or null on failure.
 */
export const uploadAvatar = async (file: File): Promise<string | null> => {
    // 1. Validate file
    validateFile(file);

    // 2. Get authenticated user
    if (!supabase) {
        throw new Error('Supabase client not initialized');
    }
    const { data, error: authError } = await supabase.auth.getUser();
    const user = data?.user;

    if (authError || !user) {
        console.error('uploadAvatar: Auth error or no user', authError);
        throw new Error('User not authenticated');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    // 3. Upload to Storage
    console.log('uploadAvatar: Uploading to storage...', fileName);
    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

    if (uploadError) {
        console.error('uploadAvatar: Storage upload failed', uploadError);
        throw uploadError;
    }

    // 4. Get Public URL
    const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

    const publicUrl = urlData?.publicUrl;

    console.log('uploadAvatar: Got public URL', publicUrl);

    if (!publicUrl) {
        throw new Error('Failed to get public URL');
    }

    // 5. Update user metadata with avatar_url (not profiles table)
    const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
    });

    if (updateError) {
        console.error('uploadAvatar: Failed to update user metadata', updateError);
        throw updateError;
    }

    console.log('uploadAvatar: Successfully updated user metadata with avatar_url');
    return publicUrl;
};

