import { useState, useEffect, useMemo } from 'react';
import { uploadAvatar } from '../../services/profileService';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks';
import { ProfileImage } from '../ProfileImage';

export default function AccountSection() {
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Initial Values (for dirty checking)
    const [initialState, setInitialState] = useState({
        displayName: '',
        fullName: '',
        bio: '',
        avatarUrl: null as string | null
    });

    // Form State
    const [displayName, setDisplayName] = useState('');
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showEmailChange, setShowEmailChange] = useState(false);
    const [newEmail, setNewEmail] = useState('');

    // Load initial data
    useEffect(() => {
        if (user) {
            const data = {
                displayName: user.user_metadata?.display_name || '',
                fullName: user.user_metadata?.full_name || '',
                bio: user.user_metadata?.bio || '',
                avatarUrl: user.user_metadata?.avatar_url || null
            };
            setInitialState(data);

            setDisplayName(data.displayName);
            setFullName(data.fullName);
            setBio(data.bio);
            setAvatarUrl(data.avatarUrl);
        }
    }, [user]);

    // Check for unsaved changes
    const hasUnsavedChanges = useMemo(() => {
        return displayName !== initialState.displayName ||
            fullName !== initialState.fullName ||
            bio !== initialState.bio ||
            avatarUrl !== initialState.avatarUrl;
    }, [displayName, fullName, bio, avatarUrl, initialState]);

    // Warn on navigation with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            setUploading(true);
            setStatusMsg(null);
            const file = e.target.files[0];
            const url = await uploadAvatar(file);

            // Update local state immediately with the new URL
            setAvatarUrl(url);

            // Also update initial state since upload already saved to metadata
            setInitialState(prev => ({ ...prev, avatarUrl: url }));

            setStatusMsg({ type: 'success', text: 'Profile picture updated!' });
        } catch (error: any) {
            console.error('handleFileUpload error:', error);
            setStatusMsg({ type: 'error', text: error.message || 'Error uploading image' });
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setStatusMsg(null);
        try {
            // Save all profile fields including avatar_url in a single call
            const { error } = await authService.updateProfile({
                display_name: displayName,
                full_name: fullName,
                bio,
                avatar_url: avatarUrl || undefined
            });

            if (error) throw error;

            // Update initial state to new successful state
            setInitialState({ displayName, fullName, bio, avatarUrl });

            setStatusMsg({ type: 'success', text: 'Profile updated successfully' });
        } catch (err: any) {
            console.error('handleSaveProfile error:', err);
            setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateEmail = async () => {
        if (!newEmail) return;
        setSaving(true);
        setStatusMsg(null);
        try {
            const { error } = await authService.updateEmail(newEmail);
            if (error) throw error;
            setStatusMsg({ type: 'success', text: 'Confirmation email sent. Please verify to complete the change.' });
            setShowEmailChange(false);
            setNewEmail('');
        } catch (err: any) {
            setStatusMsg({ type: 'error', text: err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleExportData = () => {
        const data = {
            user_id: user?.id,
            profile: { displayName, fullName, bio, email: user?.email },
            metadata: user?.user_metadata
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user_data_${user?.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            const { error } = await authService.deleteAccount();
            if (error) {
                alert(error.message);
            } else {
                alert('Account deletion request processed.');
            }
        }
    };

    const isEmailVerified = user?.email_confirmed_at || user?.identities?.some(i => i.identity_data?.email_verified);

    return (
        <div className="section-account" style={{ maxWidth: '800px' }}>
            {/* Header */}
            <h2 style={{
                fontSize: '1.5rem',
                marginBottom: '2rem',
                color: 'var(--color-text)',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '1rem'
            }}>
                Account Settings
            </h2>

            {/* Profile Picture - Small & Functional */}
            <div className="setting-group" style={{ marginBottom: '2.5rem' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '1rem',
                    color: 'var(--color-text)',
                    fontWeight: 600,
                    fontSize: '1rem'
                }}>
                    Profile Picture
                </label>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)'
                    }}>
                        <ProfileImage
                            isLoggedIn={!!user}
                            profileImageUrl={avatarUrl}
                            className="settings-avatar"
                        />
                    </div>
                    <div>
                        <input
                            type="file"
                            id="avatar-upload"
                            hidden
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                        <label
                            htmlFor="avatar-upload"
                            style={{
                                display: 'inline-block',
                                padding: '0.5rem 1rem',
                                border: '1px solid var(--color-border)',
                                borderRadius: '6px',
                                background: 'transparent',
                                color: 'var(--color-text)',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                marginBottom: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-surface-hover)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            {uploading ? 'Uploading...' : 'Upload New Picture'}
                        </label>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0 }}>
                            JPG, GIF or PNG. Max size 2MB. 500x500px recommended.
                        </p>
                    </div>
                </div>
            </div>

            {/* Profile Info Form */}
            <div className="setting-group" style={{ marginBottom: '2.5rem' }}>
                <h3 style={{
                    fontSize: '1rem',
                    marginBottom: '1.5rem',
                    color: 'var(--color-text)',
                    fontWeight: 600
                }}>
                    Personal Information
                </h3>

                <div className="form-grid" style={{ display: 'grid', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label htmlFor="full-name" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text)', fontSize: '0.9rem', fontWeight: 500 }}>
                            Full Name
                        </label>
                        <input
                            id="full-name"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Alexander Chen"
                            style={{
                                width: '100%',
                                padding: '0.6rem 0.8rem',
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '6px',
                                color: 'var(--color-text)',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="display-name" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text)', fontSize: '0.9rem', fontWeight: 500 }}>
                            Display Name
                        </label>
                        <input
                            id="display-name"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="e.g. Alex"
                            style={{
                                width: '100%',
                                padding: '0.6rem 0.8rem',
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '6px',
                                color: 'var(--color-text)',
                                fontSize: '0.95rem'
                            }}
                        />
                        <p style={{ marginTop: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                            visible to other users on shared prompts.
                        </p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text)', fontSize: '0.9rem', fontWeight: 500 }}>
                            Bio <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(Max 200 chars)</span>
                        </label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            maxLength={200}
                            placeholder="Tell us a little about yourself..."
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '0.6rem 0.8rem',
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '6px',
                                color: 'var(--color-text)',
                                fontSize: '0.95rem',
                                resize: 'vertical',
                                minHeight: '100px'
                            }}
                        />
                        <p style={{ marginTop: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', textAlign: 'right' }}>
                            {bio.length}/200
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                        <button
                            onClick={handleSaveProfile}
                            disabled={!hasUnsavedChanges || saving}
                            style={{
                                padding: '0.6rem 1.2rem',
                                background: hasUnsavedChanges ? 'var(--color-primary)' : 'var(--color-surface)',
                                color: hasUnsavedChanges ? 'white' : 'var(--color-text-muted)',
                                border: hasUnsavedChanges ? 'none' : '1px solid var(--color-border)',
                                borderRadius: '6px',
                                cursor: hasUnsavedChanges && !saving ? 'pointer' : 'not-allowed',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                minWidth: '120px',
                                opacity: saving ? 0.7 : 1
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>

                        {statusMsg && (
                            <span style={{
                                color: statusMsg.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
                                fontSize: '0.9rem',
                                fontWeight: 500
                            }}>
                                {statusMsg.text}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Email & Security */}
            <div className="setting-group" style={{ marginBottom: '2.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '2.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--color-text)', fontWeight: 600 }}>
                    Email & Security
                </h3>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text)', fontSize: '0.9rem', fontWeight: 500 }}>
                        Email Address
                    </label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={user?.email || ''}
                            disabled
                            style={{
                                flex: 1,
                                padding: '0.6rem 0.8rem',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '6px',
                                color: 'var(--color-text-muted)',
                                fontSize: '0.95rem'
                            }}
                        />
                        {isEmailVerified && (
                            <span style={{
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#10b981',
                                fontSize: '0.8rem',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontWeight: 500,
                                border: '1px solid rgba(16, 185, 129, 0.2)'
                            }}>
                                Verified
                            </span>
                        )}
                        <button
                            onClick={() => setShowEmailChange(!showEmailChange)}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text)',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            Change
                        </button>
                    </div>
                    <p style={{ marginTop: '0.5rem', color: 'var(--color-warning)', fontSize: '0.8rem' }}>
                        Changing your email address will require re-verification and may temporarily affect account access.
                    </p>
                </div>

                {showEmailChange && (
                    <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: 'var(--color-text)' }}>Update Email Address</h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="email"
                                placeholder="New email address"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '0.6rem',
                                    borderRadius: '6px',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-bg)',
                                    color: 'var(--color-text)'
                                }}
                            />
                            <button
                                onClick={handleUpdateEmail}
                                disabled={saving || !newEmail}
                                style={{
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0 1rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                Send Confirmation
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Danger Zone */}
            <div className="setting-group" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--color-text)', fontWeight: 600 }}>
                    Account Actions
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handleExportData}
                        style={{
                            padding: '0.6rem 1rem',
                            background: 'transparent',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        Export Personal Data
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        style={{
                            padding: '0.6rem 1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid var(--color-danger)',
                            color: 'var(--color-danger)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
