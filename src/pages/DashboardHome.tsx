import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { indexedDbService } from '../services/indexedDb';
import type { Prompt } from '../types';
import './DashboardHome.css';

/**
 * DashboardHome component - personalized home page for authenticated users.
 * 
 * Displays:
 * - Welcome greeting with user's name
 * - Quick stats (prompts count, collections, etc.)
 * - Recent prompts
 * - Quick actions
 * 
 * @returns The DashboardHome JSX element.
 */
export const DashboardHome = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [recentPrompts, setRecentPrompts] = useState<Prompt[]>([]);
    const [stats, setStats] = useState({
        totalPrompts: 0,
        totalCollections: 0,
        promptsThisWeek: 0,
        copiesThisWeek: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    // Get display name from user metadata or email
    const displayName = user?.user_metadata?.display_name
        || user?.email?.split('@')[0]
        || 'User';

    // Get first letter for avatar
    const avatarLetter = displayName.charAt(0).toUpperCase();

    /**
     * Load dashboard data on mount.
     */
    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                // Get all prompts
                const prompts = await indexedDbService.getAll();

                // Calculate stats
                const now = new Date();
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                const promptsThisWeek = prompts.filter(
                    p => new Date(p.created_at) >= weekAgo
                ).length;

                setStats({
                    totalPrompts: prompts.length,
                    totalCollections: 0, // TODO: Implement collections count
                    promptsThisWeek,
                    copiesThisWeek: 0 // TODO: Implement copy tracking
                });

                // Get recent prompts (last 6)
                const sorted = [...prompts].sort(
                    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                );
                setRecentPrompts(sorted.slice(0, 6));
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, [user?.id]);



    /**
     * Handle creating a new prompt.
     */
    const handleCreatePrompt = () => {
        navigate('/library?create=true');
    };

    if (isLoading) {
        return (
            <div className="dashboard-home">
                <div className="dashboard-loading">
                    <div className="dashboard-loading__spinner" />
                    <span>Loading your dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-home">
            {/* Navigation */}
            <nav className="dashboard-nav">
                <Link to="/home" className="dashboard-nav__logo">Prompt Library</Link>
                <div className="dashboard-nav__links">
                    <Link to="/home" className="dashboard-nav__link dashboard-nav__link--active">Home</Link>
                    <Link to="/library" className="dashboard-nav__link">Library</Link>
                    <Link to="/collections" className="dashboard-nav__link">Collections</Link>
                    <Link to="/settings" className="dashboard-nav__link">Settings</Link>
                </div>
                <div className="dashboard-nav__actions">
                    <div className="dashboard-nav__user">
                        <div className="dashboard-nav__avatar">{avatarLetter}</div>
                        <span className="dashboard-nav__username">{displayName}</span>
                    </div>
                </div>
            </nav>

            {/* Hero Welcome */}
            <header className="dashboard-hero">
                <h1 className="dashboard-hero__greeting">
                    Welcome back, {displayName}!
                </h1>
                <p className="dashboard-hero__message">
                    Here's what's happening with your prompts today.
                </p>
                <div className="dashboard-quick-actions">
                    <button
                        className="dashboard-quick-action dashboard-quick-action--primary"
                        onClick={handleCreatePrompt}
                    >
                        ✨ Create New Prompt
                    </button>
                    <Link to="/library" className="dashboard-quick-action">
                        🔍 Search Prompts
                    </Link>
                    <Link to="/collections" className="dashboard-quick-action">
                        📁 View Collections
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="dashboard-stats">
                <div className="dashboard-stat-card">
                    <div className="dashboard-stat-card__icon">📝</div>
                    <div className="dashboard-stat-card__value">{stats.totalPrompts}</div>
                    <div className="dashboard-stat-card__label">Total Prompts</div>
                </div>
                <div className="dashboard-stat-card">
                    <div className="dashboard-stat-card__icon">📁</div>
                    <div className="dashboard-stat-card__value">{stats.totalCollections}</div>
                    <div className="dashboard-stat-card__label">Collections</div>
                </div>
                <div className="dashboard-stat-card">
                    <div className="dashboard-stat-card__icon">🚀</div>
                    <div className="dashboard-stat-card__value">{stats.promptsThisWeek}</div>
                    <div className="dashboard-stat-card__label">Created This Week</div>
                </div>
                <div className="dashboard-stat-card">
                    <div className="dashboard-stat-card__icon">📋</div>
                    <div className="dashboard-stat-card__value">{stats.copiesThisWeek}</div>
                    <div className="dashboard-stat-card__label">Copies This Week</div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="dashboard-content">
                {/* Recent Prompts */}
                <section className="dashboard-section">
                    <div className="dashboard-section__header">
                        <h2 className="dashboard-section__title">Recent Prompts</h2>
                        <Link to="/library" className="dashboard-section__action">
                            View All →
                        </Link>
                    </div>

                    {recentPrompts.length > 0 ? (
                        <div className="dashboard-prompts-grid">
                            {recentPrompts.map((prompt) => (
                                <div
                                    key={prompt.id}
                                    className="dashboard-prompt-card"
                                    onClick={() => navigate('/library')}
                                >
                                    <h3 className="dashboard-prompt-card__title">{prompt.title}</h3>
                                    <p className="dashboard-prompt-card__preview">{prompt.content}</p>
                                    {prompt.tags && prompt.tags.length > 0 && (
                                        <div className="dashboard-prompt-card__tags">
                                            {prompt.tags.slice(0, 3).map((tag) => (
                                                <span key={tag} className="dashboard-prompt-card__tag">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="dashboard-empty">
                            <div className="dashboard-empty__icon">📝</div>
                            <h3 className="dashboard-empty__title">No prompts yet</h3>
                            <p className="dashboard-empty__desc">
                                Create your first prompt to get started!
                            </p>
                            <button
                                className="dashboard-empty__btn"
                                onClick={handleCreatePrompt}
                            >
                                Create Your First Prompt
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};
