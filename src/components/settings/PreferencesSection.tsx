import { useTheme } from '../../hooks';
import { useState } from 'react';

type SyncFrequency = 'realtime' | '5min' | '15min' | 'manual';

export default function PreferencesSection() {
    const { isDarkMode, setTheme } = useTheme();
    const [syncFrequency, setSyncFrequency] = useState<SyncFrequency>('realtime');

    // Determine current theme mode for the selector
    const currentTheme = isDarkMode ? 'dark' : 'light';

    return (
        <div className="section-preferences">
            {/* Appearance */}
            <div className="settings-glass-card">
                <h3 className="settings-glass-card__title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                    Appearance
                </h3>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label className="settings-label">Theme</label>
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginTop: '0.5rem'
                    }}>
                        {(['light', 'dark', 'system'] as const).map((theme) => (
                            <button
                                key={theme}
                                onClick={() => setTheme(theme)}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem 1rem',
                                    background: currentTheme === theme || (theme === 'system')
                                        ? (theme === currentTheme ? 'var(--accent-primary)' : 'var(--color-surface)')
                                        : 'var(--color-surface)',
                                    border: currentTheme === theme
                                        ? '1px solid var(--accent-primary)'
                                        : '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: currentTheme === theme ? 'white' : 'var(--color-text)',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}
                            >
                                {theme === 'light' && (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                                        <circle cx="12" cy="12" r="5" />
                                        <line x1="12" y1="1" x2="12" y2="3" />
                                        <line x1="12" y1="21" x2="12" y2="23" />
                                    </svg>
                                )}
                                {theme === 'dark' && (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                    </svg>
                                )}
                                {theme === 'system' && (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" />
                                        <line x1="12" y1="17" x2="12" y2="21" />
                                    </svg>
                                )}
                                {theme.charAt(0).toUpperCase() + theme.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sync Settings */}
            <div className="settings-glass-card">
                <h3 className="settings-glass-card__title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 4 23 10 17 10" />
                        <polyline points="1 20 1 14 7 14" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                    Cloud Sync
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                    <label className="settings-label">Sync Frequency</label>
                    <select
                        className="settings-input settings-select"
                        value={syncFrequency}
                        onChange={(e) => setSyncFrequency(e.target.value as SyncFrequency)}
                        style={{ marginTop: '0.5rem' }}
                    >
                        <option value="realtime">Real-time (Instant)</option>
                        <option value="5min">Every 5 minutes</option>
                        <option value="15min">Every 15 minutes</option>
                        <option value="manual">Manual only</option>
                    </select>
                    <p className="settings-hint">
                        {syncFrequency === 'realtime' && 'Changes sync instantly when online.'}
                        {syncFrequency === '5min' && 'Battery-friendly option for mobile devices.'}
                        {syncFrequency === '15min' && 'Minimal bandwidth usage.'}
                        {syncFrequency === 'manual' && 'You control when to sync.'}
                    </p>
                </div>
            </div>

            {/* Editor */}
            <div className="settings-glass-card">
                <h3 className="settings-glass-card__title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Editor
                </h3>
                <p className="settings-hint">
                    More editor preferences coming soon: font size, auto-save interval, markdown preview.
                </p>
            </div>
        </div>
    );
}
