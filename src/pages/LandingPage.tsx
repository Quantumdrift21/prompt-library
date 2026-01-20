import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import { TerminalHero } from '../components/landing/TerminalHero';
import { PromptDiscoveryGrid } from '../components/landing/PromptDiscoveryGrid';
import { PromptLibraryLogo } from '../components/common';
import { AuthModal } from '../components/AuthModal';
import { publicPromptsService } from '../services/publicPromptsService';
import type { PublicPrompt } from '../types/publicPrompt';

/**
 * Available categories for filtering prompts.
 */
const CATEGORIES = [
    { label: 'All', tags: [] },
    { label: 'Development', tags: ['Development', 'Python', 'Debugging', 'Security', 'Review'] },
    { label: 'Writing', tags: ['Writing', 'SEO', 'Documentation', 'Creative', 'Technical'] },
    { label: 'Business', tags: ['Marketing', 'Business'] },
    { label: 'Data', tags: ['Data', 'JSON', 'Extraction'] },
];

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
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [prompts, setPrompts] = useState<PublicPrompt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    /**
     * Fetches prompts based on current search and category filters.
     */
    const fetchPrompts = useCallback(async (pageNum = 1) => {
        setIsLoading(true);
        const categoryTags = CATEGORIES.find(c => c.label === activeCategory)?.tags || [];
        const results = await publicPromptsService.search(
            searchQuery || undefined,
            categoryTags.length > 0 ? categoryTags : undefined,
            pageNum,
            9
        );

        if (pageNum === 1) {
            setPrompts(results);
        } else {
            setPrompts(prev => [...prev, ...results]);
        }

        setHasMore(results.length >= 9);
        setIsLoading(false);
    }, [searchQuery, activeCategory]);

    // Fetch on category change
    useEffect(() => {
        setPage(1);
        fetchPrompts(1);
    }, [activeCategory]);

    // Debounced search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchPrompts(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSignUp = () => {
        setShowAuthModal(true);
    };

    const handleFeatureCardClick = () => {
        setShowAuthModal(true);
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPrompts(nextPage);
    };

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <Link to="/landing" className="nav-brand">
                    <PromptLibraryLogo size="medium" />
                </Link>
                <div className="nav-links">
                    <a href="#discover" className="nav-link-item">Discover</a>
                    <a href="#features" className="nav-link-item">Features</a>
                    <Link to="/collections" className="nav-link-item">Collections</Link>
                </div>
                <div className="nav-actions">
                    <button className="nav-link-login" onClick={() => setShowAuthModal(true)}>Log In</button>
                    <button className="btn-signup" onClick={handleSignUp}>Sign Up Free</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="landing-hero">
                <div className="hero-content-wrapper hero-content-wrapper--centered">
                    <div className="hero-text-content hero-text-content--centered">
                        <h1>Master the Art of Context</h1>
                        <p className="hero-subtitle">
                            The definitive collection of optimized system prompts, chain-of-thought templates, and few-shot examples for GPT, Claude, and Llama.
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search public prompts"
                        id="discover-search"
                    />
                </div>
                <div className="category-pills">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.label}
                            className={`category-pill ${activeCategory === cat.label ? 'category-pill--active' : ''}`}
                            onClick={() => setActiveCategory(cat.label)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
                {/* Prompt Cards Grid */}
                <PromptDiscoveryGrid prompts={prompts} isLoading={isLoading} />

                {/* Load More Button */}
                {hasMore && !isLoading && prompts.length > 0 && (
                    <div className="discovery-load-more">
                        <button onClick={handleLoadMore}>Load More</button>
                    </div>
                )}
            </section>

            {/* Features Section - Clickable cards open login */}
            <section id="features" className="features-section">
                <div className="features-grid">
                    <button className="feature-card feature-card--clickable" onClick={handleFeatureCardClick}>
                        <h3>Centralized Vault</h3>
                        <p>Stop losing your best prompts. Save, tag, and organize in a searchable local-first vault.</p>
                    </button>
                    <button className="feature-card feature-card--clickable" onClick={handleFeatureCardClick}>
                        <h3>Prompt Engineering</h3>
                        <p>Version control for prompts. A/B test different phrasings and keep what works.</p>
                    </button>
                    <button className="feature-card feature-card--clickable" onClick={handleFeatureCardClick}>
                        <h3>Seamless Sync</h3>
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
