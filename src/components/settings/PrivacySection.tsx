import { useState } from 'react';

interface ToggleProps {
    label: string;
    description: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}

const Toggle = ({ label, description, enabled, onChange }: ToggleProps) => (
    <div className="settings-toggle">
        <div className="settings-toggle__info">
            <div className="settings-toggle__label">{label}</div>
            <div className="settings-toggle__description">{description}</div>
        </div>
        <button
            className={`settings-toggle__switch ${enabled ? 'active' : ''}`}
            onClick={() => onChange(!enabled)}
            aria-pressed={enabled}
            aria-label={label}
        />
    </div>
);

export default function PrivacySection() {
    const [profileVisible, setProfileVisible] = useState(false);
    const [activityTracking, setActivityTracking] = useState(true);
    const [shareUsageData, setShareUsageData] = useState(false);

    return (
        <div className="section-privacy">
            <div className="settings-glass-card">
                <h3 className="settings-glass-card__title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    Visibility
                </h3>
                <Toggle
                    label="Public Profile"
                    description="Allow other users to see your profile and shared prompts"
                    enabled={profileVisible}
                    onChange={setProfileVisible}
                />
            </div>

            <div className="settings-glass-card">
                <h3 className="settings-glass-card__title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    Data Collection
                </h3>
                <Toggle
                    label="Activity Tracking"
                    description="Track prompt usage patterns for personalized suggestions (synced to cloud)"
                    enabled={activityTracking}
                    onChange={setActivityTracking}
                />
                <Toggle
                    label="Anonymous Usage Data"
                    description="Help improve Prompt Library by sharing anonymous usage statistics"
                    enabled={shareUsageData}
                    onChange={setShareUsageData}
                />
            </div>

            <p className="settings-hint" style={{ marginTop: '1rem' }}>
                Your data is stored locally first and synced securely when connected.
                We never sell your data to third parties.
            </p>
        </div>
    );
}
