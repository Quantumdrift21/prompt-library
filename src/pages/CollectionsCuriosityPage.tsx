import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthModal } from '../components/AuthModal';
import './CollectionsCuriosityPage.css';

/**
 * CollectionsCuriosityPage - shown to guests when they click Collections.
 * Creates FOMO by showing what they're missing, prompts signup.
 * 
 * @returns The CollectionsCuriosityPage JSX element.
 */
export const CollectionsCuriosityPage = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <div className="curiosity-page">
            {/* Navigation */}
            <nav className="curiosity-nav">
                <Link to="/" className="nav-logo">Prompt Library</Link>
                <div className="nav-actions">
                    <button className="nav-link-login" onClick={() => setShowAuthModal(true)}>
                        Log In
                    </button>
                    <button className="btn-signup" onClick={() => setShowAuthModal(true)}>
                        Sign Up Free
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="curiosity-main">
                <div className="curiosity-content">
                    <span className="curiosity-badge">🔒 Members Only</span>
                    <h1 className="curiosity-title">
                        Your Personal <span className="gradient-text">Prompt Vault</span>
                    </h1>
                    <p className="curiosity-subtitle">
                        Save your favorite prompts, organize them into collections,
                        and access them from anywhere. Your prompts stay private and
                        sync across all your devices.
                    </p>

                    {/* Feature Grid */}
                    <div className="curiosity-features">
                        <div className="curiosity-feature">
                            <span className="feature-icon">📁</span>
                            <h3>Organize</h3>
                            <p>Create unlimited collections to group your prompts by project or topic.</p>
                        </div>
                        <div className="curiosity-feature">
                            <span className="feature-icon">⭐</span>
                            <h3>Favorites</h3>
                            <p>Star your best prompts for quick access anytime.</p>
                        </div>
                        <div className="curiosity-feature">
                            <span className="feature-icon">🔄</span>
                            <h3>Sync</h3>
                            <p>Offline-first storage with secure cloud sync when online.</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="curiosity-cta">
                        <button className="btn-signup btn-signup--large" onClick={() => setShowAuthModal(true)}>
                            Create Free Account
                        </button>
                        <p className="curiosity-hint">
                            Already have an account?{' '}
                            <button onClick={() => setShowAuthModal(true)}>Log in</button>
                        </p>
                    </div>
                </div>

                {/* Preview Mockup */}
                <div className="curiosity-preview">
                    <div className="preview-card">
                        <div className="preview-header">
                            <span>📚 My Collections</span>
                            <span className="preview-badge">3 collections</span>
                        </div>
                        <div className="preview-items">
                            <div className="preview-item preview-item--blur">
                                <span>📝</span> Coding Prompts
                            </div>
                            <div className="preview-item preview-item--blur">
                                <span>✍️</span> Writing Templates
                            </div>
                            <div className="preview-item preview-item--blur">
                                <span>💼</span> Business...
                            </div>
                        </div>
                        <div className="preview-overlay">
                            <span>🔐</span>
                            <p>Sign up to unlock</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Auth Modal */}
            {showAuthModal && (
                <AuthModal onClose={() => setShowAuthModal(false)} />
            )}
        </div>
    );
};
