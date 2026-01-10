import { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import { TerminalHero } from '../components/landing/TerminalHero';
import { PromptDiscoveryGrid } from '../components/landing/PromptDiscoveryGrid';
import { LogoAnimation } from '../components/common';
import { AuthModal } from '../components/AuthModal';

/**
 * LandingPage component - the primary public-facing page for unauthenticated users.
 *
 * This page showcases:
 * - A trending prompts carousel (Hero).
 * - A search bar and category filters.
 * - An "How it works" education section.
 * - Signup/Login calls to action.
 *
 * @returns The LandingPage JSX element.
 */
export const LandingPage = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleSignUp = () => {
        setShowAuthModal(true);
    };

    const handleFeatureCardClick = () => {
        setShowAuthModal(true);
    };

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <Link to="/landing" className="nav-logo">Prompt Library</Link>
                <div className="nav-links">
                    <a href="#discover">Discover</a>
                    <a href="#features">Features</a>
                    <Link to="/collections">Collections</Link>
                </div>
                <div className="nav-actions">
                    <button className="nav-link-login" onClick={() => setShowAuthModal(true)}>Log In</button>
                    <button className="btn-signup" onClick={handleSignUp}>Sign Up Free</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="landing-hero">
                <div className="hero-content-wrapper">
                    <div className="hero-video-container">
                        <LogoAnimation size="large" />
                    </div>
                    <div className="hero-text-content">
                        <h1>Master the Art of Context</h1>
                        <p className="hero-subtitle">
                            The definitive collection of optimized system prompts, chain-of-thought templates, and few-shot examples for GPT-4, Claude 3, and Llama.
                        </p>
                    </div>
                </div>
                {/* Terminal with Typewriter Animation */}
                <TerminalHero />
            </header>

            {/* Discovery Section */}
            <section id="discover" className="discovery-section">
                <h2 className="section-title">Explore Prompts</h2>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search for 'Python Debugging', 'SEO Blog Post'..."
                        className="search-input"
                    />
                </div>
                <div className="category-pills">
                    <button className="category-pill">Software Development</button>
                    <button className="category-pill">Creative Writing</button>
                    <button className="category-pill">Business &amp; Marketing</button>
                    <button className="category-pill">Academic Research</button>
                </div>
                {/* Prompt Cards Grid */}
                <PromptDiscoveryGrid />
            </section>

            {/* Features Section - Clickable cards open login */}
            <section id="features" className="features-section">
                <h2 className="section-title">How It Works</h2>
                <div className="features-grid">
                    <button className="feature-card feature-card--clickable" onClick={handleFeatureCardClick}>
                        <h3>Organize</h3>
                        <p>Stop losing your best prompts. Save, tag, and organize in a searchable local-first vault.</p>
                    </button>
                    <button className="feature-card feature-card--clickable" onClick={handleFeatureCardClick}>
                        <h3>Optimize</h3>
                        <p>Version control for prompts. A/B test different phrasings and keep what works.</p>
                    </button>
                    <button className="feature-card feature-card--clickable" onClick={handleFeatureCardClick}>
                        <h3>Sync</h3>
                        <p>Offline-first architecture. Instant access on desktop, syncing securely when online.</p>
                    </button>
                </div>
            </section>

            {/* Footer CTA */}
            <footer className="landing-footer">
                <p>Ready to build better prompts?</p>
                <button className="btn-signup btn-signup--large" onClick={handleSignUp}>Get Started Free</button>
                <div className="footer-links">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <span>|</span>
                    <a href="#features">Features</a>
                    <span>|</span>
                    <a href="#discover">Discover</a>
                </div>
                <p className="footer-copyright">© 2026 Prompt Library. Local-first AI Tools.</p>
            </footer>

            {/* Auth Modal */}
            {showAuthModal && (
                <AuthModal onClose={() => setShowAuthModal(false)} />
            )}
        </div>
    );
};
