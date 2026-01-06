import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProfilePicture } from '../../hooks';
import './DashboardNav.css';

interface DashboardNavProps {
    userName?: string;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

export const DashboardNav = ({ userName = 'User', searchQuery = '', onSearchChange }: DashboardNavProps) => {
    // const [searchValue, setSearchValue] = useState(''); // Removed local state
    const location = useLocation();
    const { profilePicture } = useProfilePicture();

    return (
        <nav className="dashboard-nav">
            <div className="dashboard-nav__left">
                <Link to="/" className="dashboard-nav__logo">
                    <svg className="dashboard-nav__logo-icon" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="4" width="24" height="24" rx="6" fill="url(#logoGradient)" />
                        <path d="M10 12h12M10 16h8M10 20h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <defs>
                            <linearGradient id="logoGradient" x1="4" y1="4" x2="28" y2="28">
                                <stop stopColor="#8B5CF6" />
                                <stop offset="1" stopColor="#A78BFA" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="dashboard-nav__logo-text">Prompt Library</span>
                </Link>

                <div className="dashboard-nav__search">
                    <svg className="dashboard-nav__search-icon" viewBox="0 0 20 20" fill="none">
                        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                        <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        className="dashboard-nav__search-input"
                        placeholder="Search prompts, collections..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                    />
                </div>
            </div>

            <div className="dashboard-nav__right">
                <button className="dashboard-nav__icon-btn" aria-label="Notifications">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="dashboard-nav__notification-dot"></span>
                </button>

                <Link to="/" className="dashboard-nav__icon-btn dashboard-nav__icon-btn--primary" aria-label="New Prompt">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </Link>

                <Link to="/profile" className="dashboard-nav__user">
                    <div className="dashboard-nav__avatar">
                        {profilePicture ? (
                            <img src={profilePicture} alt={userName} />
                        ) : (
                            <span>{userName.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <span className="dashboard-nav__user-name">{userName}</span>
                </Link>
            </div>
        </nav>
    );
};
