import { useState } from 'react';
import { useAuth, useSync } from '../hooks';
import { authService } from '../services/authService';
import { syncService } from '../services/syncService';
import { isSupabaseConfigured } from '../services/supabase';
import { AuthModal } from './AuthModal';
import { UserMenu } from './UserMenu';
import { UserProfile } from './UserProfile';
import { AppSettings } from './AppSettings';
import './AuthButton.css';

export const AuthButton = () => {
    const { user, isLoading } = useAuth();
    const { lastSyncAt, isSyncing } = useSync();

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    if (!isSupabaseConfigured()) {
        return null;
    }

    if (isLoading) {
        return <div className="auth-button auth-button--loading">...</div>;
    }

    if (user) {
        const handleLogout = async () => {
            await authService.signOut();
        };

        const handleSync = () => {
            syncService.sync();
        };

        const formatLastSync = () => {
            if (!lastSyncAt) return 'Never synced';
            const date = new Date(lastSyncAt);
            return `Synced ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        };

        return (
            <div className="auth-button">
                {/* Sync Status - Left of Menu */}
                <div className="auth-button__sync-status">
                    <span className="auth-button__status-text">
                        {isSyncing ? 'Syncing...' : formatLastSync()}
                    </span>
                    <button
                        className={`auth-button__sync-btn ${isSyncing ? 'auth-button__sync-btn--spinning' : ''}`}
                        onClick={handleSync}
                        disabled={isSyncing}
                        title="Sync now"
                        aria-label="Sync now"
                    >
                        ↻
                    </button>
                </div>

                {/* User Menu */}
                <UserMenu
                    user={user}
                    onLogout={handleLogout}
                    onProfile={() => setShowProfileModal(true)}
                    onSettings={() => setShowSettingsModal(true)}
                />

                {/* Modals */}
                {showProfileModal && <UserProfile user={user} onClose={() => setShowProfileModal(false)} />}
                {showSettingsModal && <AppSettings onClose={() => setShowSettingsModal(false)} />}
            </div>
        );
    }

    return (
        <>
            <button
                className="auth-button__login"
                onClick={() => setShowLoginModal(true)}
            >
                Login
            </button>
            {showLoginModal && (
                <AuthModal
                    onClose={() => {
                        setShowLoginModal(false);
                        if (authService.isAuthenticated()) {
                            syncService.startBackgroundSync();
                        }
                    }}
                />
            )}
        </>
    );
};
