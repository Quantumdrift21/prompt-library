import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { syncService } from '../services/syncService';
import './AuthModal.css'; // Reuse container styles

interface UserProfileProps {
    user: User;
    onClose: () => void;
}

export const UserProfile = ({ user, onClose }: UserProfileProps) => {
    const [lastSyncAt, setLastSyncAt] = useState<string | null>(
        syncService.getStatus().lastSyncAt
    );

    useEffect(() => {
        // Subscribe to sync status changes
        const unsubscribe = syncService.subscribe((status) => {
            setLastSyncAt(status.lastSyncAt);
        });

        // Initial fetch just in case
        setLastSyncAt(syncService.getStatus().lastSyncAt);

        return () => unsubscribe();
    }, []);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Unknown';
        return new Date(dateStr).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateStr?: string | null) => {
        if (!dateStr) return 'Never';
        return new Date(dateStr).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                <div className="auth-modal__header">
                    <h2>Profile</h2>
                    <button className="auth-modal__close" onClick={onClose}>&times;</button>
                </div>

                <div className="auth-modal__content" style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: user.user_metadata?.avatar_url ? 'transparent' : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                        color: 'white',
                        fontSize: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px auto',
                        fontWeight: 'bold',
                        overflow: 'hidden'
                    }}>
                        {user.user_metadata?.avatar_url ? (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            (user.user_metadata?.full_name || user.email || 'U').slice(0, 2).toUpperCase()
                        )}
                    </div>

                    <h3 style={{ margin: '0 0 5px 0' }}>{user.user_metadata?.full_name || 'User'}</h3>
                    <p style={{ color: 'var(--color-text-muted)', margin: '0 0 20px 0' }}>{user.email}</p>

                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '15px',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        textAlign: 'left'
                    }}>
                        <p style={{ margin: '5px 0' }}>It's great to have you here!</p>
                        <p style={{ margin: '5px 0', color: '#8b5cf6' }}>
                            Member since {formatDate(user.created_at)}
                        </p>
                        <p style={{ margin: '5px 0', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                            Last Synced: {formatTime(lastSyncAt)}
                        </p>
                    </div>
                </div>

                <div className="auth-modal__footer">
                    <button onClick={onClose} className="auth-modal__submit-btn">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

