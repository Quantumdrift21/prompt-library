import { useState } from 'react';
// import { useAuth } from '../../hooks';

export default function SecuritySection() {
    // const { user } = useAuth();
    const [showSetupMFA, setShowSetupMFA] = useState(false);

    // Mock session data - in real app, fetch from Supabase
    const activeSessions = [
        {
            id: '1',
            device: 'Windows PC',
            browser: 'Chrome',
            location: 'Current Session',
            lastActive: 'Now',
            isCurrent: true
        }
    ];

    const handleSignOutAllDevices = async () => {
        if (window.confirm('This will sign you out from all devices except this one. Continue?')) {
            // In real implementation: await authService.signOutOtherSessions();
            alert('Signed out from all other devices.');
        }
    };

    return (
        <div className="section-security">
            {/* MFA Section */}
            <div className="settings-glass-card">
                <h3 className="settings-glass-card__title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Two-Factor Authentication
                </h3>
                <p className="settings-hint" style={{ marginBottom: '1rem' }}>
                    Add an extra layer of security to your account with passkey or authenticator app.
                </p>

                {!showSetupMFA ? (
                    <button
                        className="settings-btn settings-btn--secondary"
                        onClick={() => setShowSetupMFA(true)}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Set Up MFA
                    </button>
                ) : (
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                        <p style={{ color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                            MFA setup requires Supabase Auth integration.
                        </p>
                        <p className="settings-hint">
                            Contact support for enterprise MFA options.
                        </p>
                        <button
                            className="settings-btn settings-btn--secondary"
                            onClick={() => setShowSetupMFA(false)}
                            style={{ marginTop: '0.75rem' }}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* Active Sessions */}
            <div className="settings-glass-card">
                <h3 className="settings-glass-card__title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    Active Sessions
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {activeSessions.map(session => (
                        <div
                            key={session.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.75rem 1rem',
                                background: session.isCurrent ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                                borderRadius: 'var(--radius-sm)',
                                border: session.isCurrent ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--color-border)'
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>
                                    {session.device} - {session.browser}
                                </div>
                                <div className="settings-hint">
                                    {session.location} • {session.lastActive}
                                </div>
                            </div>
                            {session.isCurrent && (
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '4px 8px',
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    color: 'var(--color-success)',
                                    borderRadius: '4px',
                                    fontWeight: 500
                                }}>
                                    Current
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="settings-glass-card" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                <h3 className="settings-glass-card__title" style={{ color: 'var(--color-danger)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Session Management
                </h3>
                <button
                    className="settings-btn settings-btn--danger"
                    onClick={handleSignOutAllDevices}
                >
                    Sign Out All Devices
                </button>
            </div>
        </div>
    );
}
