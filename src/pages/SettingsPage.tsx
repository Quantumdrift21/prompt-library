import { useState } from 'react';

import { useAuth } from '../hooks';
import AccountSection from '../components/settings/AccountSection';
import PreferencesSection from '../components/settings/PreferencesSection';
import PrivacySection from '../components/settings/PrivacySection';
import SecuritySection from '../components/settings/SecuritySection';
import NotificationsSection from '../components/settings/NotificationsSection';
import { MaintenanceSection } from '../components/settings/MaintenanceSection';
import './SettingsPage.css';

type SettingsCategory = 'Account' | 'Preferences' | 'Privacy' | 'Security' | 'Notifications' | 'Advanced';

interface CategoryConfig {
    id: SettingsCategory;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
}

// SVG Icons for each category
const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const SlidersIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
);

const EyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const BellIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const ToolIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
);



const categories: CategoryConfig[] = [
    { id: 'Account', label: 'Account', sublabel: 'Profile & Email', icon: <UserIcon /> },
    { id: 'Preferences', label: 'Preferences', sublabel: 'Theme & Sync', icon: <SlidersIcon /> },
    { id: 'Privacy', label: 'Privacy', sublabel: 'Data & Visibility', icon: <EyeIcon /> },
    { id: 'Security', label: 'Security', sublabel: 'Authentication', icon: <ShieldIcon /> },
    { id: 'Notifications', label: 'Notifications', sublabel: 'Alerts & Updates', icon: <BellIcon /> },
    { id: 'Advanced', label: 'Advanced', sublabel: 'Maintenance & Data', icon: <ToolIcon /> },
];

/**
 * Advanced section includes Maintenance tools.
 */
const AdvancedSection = () => (
    <div>
        <p className="settings-hint" style={{ marginBottom: '24px' }}>
            Advanced settings for power users. Use with caution.
        </p>
        <MaintenanceSection />
    </div>
);

/**
 * SettingsPage component - user settings with dark glassmorphism theme.
 * 
 * Features:
 * - Account management
 * - Preferences
 * - Privacy settings
 * - Security options
 * - Notifications
 * - Advanced/Maintenance tools
 * 
 * @returns The SettingsPage JSX element.
 */
export default function SettingsPage() {
    const { user: _user } = useAuth();
    const [activeCategory, setActiveCategory] = useState<SettingsCategory>('Account');

    const renderContent = () => {
        switch (activeCategory) {
            case 'Account': return <AccountSection />;
            case 'Preferences': return <PreferencesSection />;
            case 'Privacy': return <PrivacySection />;
            case 'Security': return <SecuritySection />;
            case 'Notifications': return <NotificationsSection />;
            case 'Advanced': return <AdvancedSection />;
            default: return <AccountSection />;
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-container">
                <h1 className="settings-title">Settings</h1>

                <div className="settings-grid">
                    <aside className="settings-sidebar">
                        <nav className="settings-nav">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    className={`settings-nav-item ${activeCategory === category.id ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(category.id)}
                                >
                                    <span className="settings-nav-item__icon">
                                        {category.icon}
                                    </span>
                                    <span className="settings-nav-item__content">
                                        <span className="settings-nav-item__label">{category.label}</span>
                                        <span className="settings-nav-item__sublabel">{category.sublabel}</span>
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <section className="settings-panel">
                        <h2 className="settings-panel-title">{activeCategory}</h2>
                        {renderContent()}
                    </section>
                </div>
            </div>
        </div>
    );
}
