import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { PromptLibraryLogo } from '../common';
import './DarkLayout.css';

interface DarkLayoutProps {
    children: ReactNode;
    title?: string;
    userName?: string;
    onLogout?: () => void;
}

/**
 * DarkLayout component - provides consistent dark glassmorphism styling across all pages.
 *
 * Features:
 * - Unified dark navigation bar matching landing page style.
 * - Consistent glassmorphism background.
 * - Responsive layout container.
 *
 * @param children - Page content to render.
 * @param title - Optional page title for the header.
 * @param userName - Optional username for display.
 * @param onLogout - Optional callback for logout action.
 * @returns The DarkLayout wrapper JSX element.
 */
export const DarkLayout = ({ children, title, userName = 'Guest', onLogout }: DarkLayoutProps) => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="dark-layout">
            {/* Navigation */}
            <nav className="dark-nav">
                <Link to="/home" className="group">
                    <PromptLibraryLogo size="small" />
                </Link>
                <div className="dark-nav__links">
                    <Link
                        to="/home"
                        className={`dark-nav__link ${isActive('/home') ? 'dark-nav__link--active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/library"
                        className={`dark-nav__link ${isActive('/library') ? 'dark-nav__link--active' : ''}`}
                    >
                        Library
                    </Link>

                    <Link
                        to="/learn"
                        className={`dark-nav__link ${isActive('/learn') ? 'dark-nav__link--active' : ''}`}
                    >
                        Learn
                    </Link>
                    <Link
                        to="/settings"
                        className={`dark-nav__link ${isActive('/settings') ? 'dark-nav__link--active' : ''}`}
                    >
                        Settings
                    </Link>
                </div>
                <div className="dark-nav__actions">
                    <Link to="/settings" className="dark-nav__user">
                        <span className="dark-nav__avatar">{userName.charAt(0).toUpperCase()}</span>
                        <span className="dark-nav__username">{userName}</span>
                    </Link>
                    {onLogout && (
                        <button
                            className="dark-nav__logout"
                            onClick={onLogout}
                            aria-label="Logout"
                        >
                            <LogOut size={18} className="icon-3d icon-3d-orange" />
                        </button>
                    )}
                </div>
            </nav>

            {/* Page Header (optional) */}
            {title && (
                <header className="dark-layout__header">
                    <h1 className="dark-layout__title">{title}</h1>
                </header>
            )}

            {/* Main Content */}
            <main className="dark-layout__main">
                {children}
            </main>

            {/* Footer */}
            <footer className="dark-layout__footer">
                <div className="dark-layout__footer-links">
                    <Link to="/landing">Gallery</Link>
                    <span>|</span>
                    <Link to="/profile">Profile</Link>
                    <span>|</span>
                    <Link to="/settings">Settings</Link>
                </div>
                <p className="dark-layout__copyright">© 2026 Prompt Library. Local-first AI Tools.</p>
            </footer>
        </div>
    );
};

