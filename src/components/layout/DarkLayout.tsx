import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './DarkLayout.css';

interface DarkLayoutProps {
    children: ReactNode;
    title?: string;
    userName?: string;
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
 * @returns The DarkLayout wrapper JSX element.
 */
export const DarkLayout = ({ children, title, userName = 'Guest' }: DarkLayoutProps) => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="dark-layout">
            {/* Navigation */}
            <nav className="dark-nav">
                <Link to="/landing" className="dark-nav__logo">Prompt Library</Link>
                <div className="dark-nav__links">
                    <Link
                        to="/"
                        className={`dark-nav__link ${isActive('/') ? 'dark-nav__link--active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/landing"
                        className={`dark-nav__link ${isActive('/landing') ? 'dark-nav__link--active' : ''}`}
                    >
                        Gallery
                    </Link>
                    <Link
                        to="/collections"
                        className={`dark-nav__link ${isActive('/collections') ? 'dark-nav__link--active' : ''}`}
                    >
                        Collections
                    </Link>
                    <Link
                        to="/analytics"
                        className={`dark-nav__link ${isActive('/analytics') ? 'dark-nav__link--active' : ''}`}
                    >
                        Analytics
                    </Link>
                </div>
                <div className="dark-nav__actions">
                    <Link to="/profile" className="dark-nav__user">
                        <span className="dark-nav__avatar">{userName.charAt(0).toUpperCase()}</span>
                        <span className="dark-nav__username">{userName}</span>
                    </Link>
                    <Link to="/settings" className="dark-nav__settings" title="Settings">
                        ⚙️
                    </Link>
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
