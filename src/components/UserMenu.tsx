import { useState, useRef, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import './UserMenu.css';

interface UserMenuProps {
    user: User;
    onLogout: () => void;
    onProfile: () => void;
    onSettings: () => void;
}

export const UserMenu = ({ user, onLogout, onProfile, onSettings }: UserMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Handle Escape key
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    // Extract display name or email
    const getDisplayName = () => {
        const metaName = user.user_metadata?.full_name;
        if (metaName) return metaName;
        return user.email?.split('@')[0] || 'User';
    };

    const getInitials = () => {
        const name = getDisplayName();
        return name.slice(0, 2).toUpperCase();
    };

    const getAvatarUrl = () => {
        return user.user_metadata?.avatar_url || null;
    };

    return (
        <div className="user-menu" ref={menuRef}>
            <button
                className="user-menu__trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <div className="user-menu__avatar">
                    {getAvatarUrl() ? (
                        <img src={getAvatarUrl()!} alt={getDisplayName()} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                        getInitials()
                    )}
                </div>
                <span className="user-menu__name">{getDisplayName()}</span>
                <span className="user-menu__chevron">▼</span>
            </button>

            {isOpen && (
                <div className="user-menu__dropdown">
                    <button onClick={() => { setIsOpen(false); onProfile(); }} className="user-menu__item">
                        👤 Profile
                    </button>
                    <button onClick={() => { setIsOpen(false); onSettings(); }} className="user-menu__item">
                        ⚙️ Settings
                    </button>
                    <div className="user-menu__divider"></div>
                    <button
                        onClick={() => { setIsOpen(false); onLogout(); }}
                        className="user-menu__item user-menu__item--danger"
                    >
                        🚪 Logout
                    </button>
                </div>
            )}
        </div>
    );
};
