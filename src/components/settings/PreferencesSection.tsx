import { useState } from 'react';

type SyncFrequency = 'realtime' | '5min' | '15min' | 'manual';

export default function PreferencesSection() {
    const [syncFrequency, setSyncFrequency] = useState<SyncFrequency>('realtime');

    return (
        <div className="section-preferences">


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
