import React from 'react';

interface ProfileImageProps {
    isLoggedIn: boolean;
    profileImageUrl?: string | null;
    className?: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({ isLoggedIn, profileImageUrl, className = '' }) => {
    if (!isLoggedIn) {
        return <img src="/assets/images/guest_placeholder.png" alt="Guest" className={className} />;
    }
    if (!profileImageUrl) {
        return <img src="/default-avatar.png" alt="Default User" className={className} />;
    }
    return <img src={profileImageUrl} alt="Profile" className={className} />;
};
