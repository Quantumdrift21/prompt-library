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

export default function NotificationsSection() {
    const [browserPush, setBrowserPush] = useState(false);
    const [emailSync, setEmailSync] = useState(true);
    const [emailSecurity, setEmailSecurity] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(false);

    const handleEnablePush = async () => {
        if (!('Notification' in window)) {
            alert('This browser does not support push notifications.');
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            setBrowserPush(true);
        } else {
            alert('Push notifications were denied. You can enable them in browser settings.');
        }
    };

    return (
        <div className="section-notifications">
            {/* Browser Notifications */}
            <div className="settings-glass-card">
                <h3 className="settings-glass-card__title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    Browser Notifications
                </h3>
                <Toggle
                    label="Push Notifications"
                    description="Receive instant alerts for sync events and updates"
                    enabled={browserPush}
                    onChange={(enabled) => {
                        if (enabled) {
                            handleEnablePush();
                        } else {
                            setBrowserPush(false);
                        }
                    }}
                />
                <p className="settings-hint" style={{ marginTop: '0.5rem', paddingLeft: '0' }}>
                    {browserPush
                        ? '✓ Push notifications are enabled'
                        : 'Enable to receive real-time updates'}
                </p>
            </div>

            {/* Email Notifications */}
            <div className="settings-glass-card">
                <h3 className="settings-glass-card__title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Email Notifications
                </h3>
                <Toggle
                    label="Sync Alerts"
                    description="Get notified when sync conflicts occur or fail"
                    enabled={emailSync}
                    onChange={setEmailSync}
                />
                <Toggle
                    label="Security Alerts"
                    description="Important security updates and login notifications"
                    enabled={emailSecurity}
                    onChange={setEmailSecurity}
                />
                <Toggle
                    label="Weekly Digest"
                    description="Summary of your prompt activity and usage trends"
                    enabled={weeklyDigest}
                    onChange={setWeeklyDigest}
                />
            </div>
        </div>
    );
}
