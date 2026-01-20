import { useState, useRef, useEffect } from 'react';
import { indexedDbService } from '../../services/indexedDb';
import './ProfilePictureUpload.css';

interface ProfilePictureUploadProps {
    userName: string;
    onPictureChange?: (pictureUrl: string | null) => void;
}

export const ProfilePictureUpload = ({ userName, onPictureChange }: ProfilePictureUploadProps) => {
    const [pictureUrl, setPictureUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Load saved profile picture on mount
    useEffect(() => {
        const loadPicture = async () => {
            const saved = await indexedDbService.getProfilePicture();
            if (saved) {
                setPictureUrl(saved);
                onPictureChange?.(saved);
            }
        };
        loadPicture();
    }, [onPictureChange]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Image must be smaller than 2MB');
            return;
        }

        setIsUploading(true);
        setShowMenu(false);

        try {
            // Create a canvas to resize the image
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (event) => {
                img.onload = async () => {
                    // Resize to 200x200 for efficiency
                    const canvas = document.createElement('canvas');
                    const size = 200;
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext('2d');

                    // Calculate crop to center
                    const minDim = Math.min(img.width, img.height);
                    const sx = (img.width - minDim) / 2;
                    const sy = (img.height - minDim) / 2;

                    ctx?.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

                    // Convert to base64
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

                    // Save to IndexedDB
                    await indexedDbService.saveProfilePicture(dataUrl);
                    setPictureUrl(dataUrl);
                    onPictureChange?.(dataUrl);
                    setIsUploading(false);
                };

                img.src = event.target?.result as string;
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Failed to upload profile picture:', error);
            setIsUploading(false);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemovePicture = async () => {
        await indexedDbService.deleteProfilePicture();
        setPictureUrl(null);
        onPictureChange?.(null);
        setShowMenu(false);
    };

    const initials = userName.charAt(0).toUpperCase();

    return (
        <div className="profile-picture-upload" ref={menuRef}>
            <button
                className="profile-picture-upload__avatar"
                onClick={() => setShowMenu(!showMenu)}
                disabled={isUploading}
            >
                {isUploading ? (
                    <div className="profile-picture-upload__spinner" />
                ) : pictureUrl ? (
                    <img src={pictureUrl} alt={userName} />
                ) : (
                    <span className="profile-picture-upload__initials">{initials}</span>
                )}
                <div className="profile-picture-upload__overlay">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                    </svg>
                </div>
            </button>

            {showMenu && (
                <div className="profile-picture-upload__menu">
                    <button
                        className="profile-picture-upload__menu-item"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Upload Photo
                    </button>
                    {pictureUrl && (
                        <button
                            className="profile-picture-upload__menu-item profile-picture-upload__menu-item--danger"
                            onClick={handleRemovePicture}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            Remove Photo
                        </button>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="profile-picture-upload__input"
                onChange={handleFileSelect}
            />
        </div>
    );
};
