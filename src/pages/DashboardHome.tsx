import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';
import { indexedDbService } from '../services/indexedDb';
import { learningService } from '../services/learningService';
import type { Prompt } from '../types';
import { Hand, Star, FolderClosed, Sparkles, Gamepad2, Trophy, Flame, Settings, Library, Grid } from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { PromptEditor } from '../components/PromptEditor';
import './DashboardHome.css';

/**
 * DashboardHome component - Redesigned with sidebar-main layout.
 * Based on Rinesk reference design with Prompt Library dark theme.
 */
export const DashboardHome = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    const { user } = useAuth();
    const [recentPrompts, setRecentPrompts] = useState<Prompt[]>([]);
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [stats, setStats] = useState({
        totalPrompts: 0,
        totalCollections: 0,
        favorites: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const displayName = user?.user_metadata?.display_name
        || user?.email?.split('@')[0]
        || 'User';

    // Extract first name only to prevent truncation
    const firstName = displayName.split(' ')[0];

    const avatarLetter = displayName.charAt(0).toUpperCase();

    /**
     * Format large numbers with k suffix.
     *
     * @param num - The number to format.
     * @returns Formatted string (e.g., "10.8k" or "42").
     */
    const formatMetric = (num: number): string => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return num.toString();
    };

    // Calculate Activity Data (Last 7 Days)
    const activityData = useMemo(() => {
        const days = 7;
        const data = new Array(days).fill(0).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (days - 1 - i));
            return {
                date: d.toLocaleDateString('en-US', { weekday: 'short' }),
                fullDate: d.toISOString().split('T')[0],
                count: 0,
                height: 0
            };
        });

        prompts.forEach(p => {
            const pDate = new Date(p.created_at).toISOString().split('T')[0];
            const dayStat = data.find(d => d.fullDate === pDate);
            if (dayStat) {
                dayStat.count++;
            }
        });

        // Normalize heights for graph (max height 100%)
        const maxCount = Math.max(...data.map(d => d.count), 1);
        data.forEach(d => {
            d.height = (d.count / maxCount) * 100;
        });

        return data;
    }, [prompts]);

    // Learning progress from service (real data)
    const [learningProgress, setLearningProgress] = useState({
        level: 1,
        levelName: 'Beginner',
        percentComplete: 0,
        highScore: 0,
        currentStreak: 0,
    });

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const allPrompts = await indexedDbService.getAll();
                setPrompts(allPrompts);

                setStats({
                    totalPrompts: allPrompts.length,
                    totalCollections: 0,
                    favorites: allPrompts.filter(p => p.favorite).length,
                });

                const sorted = [...allPrompts].sort(
                    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                );
                setRecentPrompts(sorted.slice(0, 4));

                // Load learning progress from service
                const learnStats = learningService.getDashboardStats();
                setLearningProgress(learnStats);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, [user?.id]);

    if (isLoading) {
        return (
            <div className="dashboard-home">
                <div className="dashboard-loading">
                    <div className="dashboard-loading__spinner" />
                    <span>Loading dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-home">
            {/* SIDEBAR */}
            <aside className="dashboard-sidebar">
                {/* User Profile Section */}
                <div className="sidebar-profile">
                    <div className="sidebar-avatar">{avatarLetter}</div>
                    <div className="sidebar-user-info">
                        <span className="sidebar-user-label">Welcome back</span>
                        <span className="sidebar-user-name">{firstName}</span>
                    </div>
                    <button className="sidebar-search-btn" title="Search">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>
                </div>

                {/* Divider */}
                <div className="sidebar-divider" />

                {/* Primary Metric */}
                <div className="sidebar-metric">

                    <div className="metric-label">All Prompts</div>
                    <div className="metric-sublabel">
                        Explore what's happening with your
                        <br />Prompt Library collection.
                        <br /><Link to="/library" className="metric-help-link">Need help?</Link>
                    </div>
                    <div className="metric-value">{formatMetric(stats.totalPrompts)}</div>
                    <div className="metric-breakdown">
                        <div className="metric-row">
                            <span className="metric-dot dot-cyan" />
                            <span>Active</span>
                            <span className="metric-count">{stats.totalPrompts} prompts</span>
                        </div>
                        <div className="metric-row">
                            <span className="metric-dot dot-orange" />
                            <span>Favorites</span>
                            <span className="metric-count">{stats.favorites} prompts</span>
                        </div>
                        <div className="metric-row">
                            <span className="metric-dot dot-muted" />
                            <span>Unused</span>
                            <span className="metric-count">0 prompts</span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="sidebar-divider" />

                {/* Navigation Links */}
                <nav className="sidebar-nav">
                    <Link to="/library" className={`sidebar-link ${isActive('/library') ? 'sidebar-link--active' : ''}`}>
                        <Library size={18} className="sidebar-icon icon-3d icon-3d-cyan" />
                        <span className="sidebar-label">Library</span>
                    </Link>
                    <Link to="/collections" className={`sidebar-link ${isActive('/collections') ? 'sidebar-link--active' : ''}`}>
                        <FolderClosed size={18} className="sidebar-icon icon-3d icon-3d-purple" />
                        <span className="sidebar-label">Collections</span>
                    </Link>
                    <Link to="/learn" className={`sidebar-link ${isActive('/learn') ? 'sidebar-link--active' : ''}`}>
                        <Gamepad2 size={18} className="sidebar-icon icon-3d icon-3d-pink" />
                        <span className="sidebar-label">Learn</span>
                    </Link>
                    <Link to="/settings" className={`sidebar-link ${isActive('/settings') ? 'sidebar-link--active' : ''}`}>
                        <Settings size={18} className="sidebar-icon icon-3d icon-3d-green" />
                        <span className="sidebar-label">Settings</span>
                    </Link>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="dashboard-main">
                {/* Greeting Banner */}
                <section className="greeting-banner">
                    <h1>Hey, {displayName}! <Hand className="icon-3d icon-3d-orange" style={{ display: 'inline', marginLeft: 8 }} /></h1>
                    <p className="greeting-subtitle">Explore your prompt collection and track your progress.</p>
                    <div className="greeting-actions">
                        <button
                            className="create-prompt-btn"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <Sparkles size={18} />
                            Create New Prompt
                        </button>
                        <button className="greeting-action" title="Refresh">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                                <path d="M21 3v5h-5" />
                            </svg>
                        </button>
                    </div>
                </section>

                {/* Timeline Graph */}
                <section className="timeline-section">
                    <div className="timeline-header">
                        <span className="timeline-period">Last 7 Days</span>
                        <div className="timeline-week-markers">
                            {activityData.map((d, i) => (
                                <span key={i} className="week-marker">{d.date}</span>
                            ))}
                        </div>
                    </div>
                    <div className="timeline-graph">
                        {activityData.map((d, i) => (
                            <div
                                key={i}
                                className="timeline-bar"
                                style={{ height: `${Math.max(d.height, 8)}%` }}
                                title={`${d.count} prompts on ${d.date}`}
                            >
                                <span className="timeline-bar-value">{d.count}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <nav className="dashboard-tabs">
                    <button
                        className={`tab-item ${activeTab === 'all' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        <Grid size={16} className="tab-icon" style={{ marginRight: 6 }} />
                        All Prompts
                    </button>
                    <button
                        className={`tab-item ${activeTab === 'favorites' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('favorites')}
                    >
                        <Star size={16} className="tab-icon" style={{ marginRight: 6 }} />
                        Favorites
                    </button>
                </nav>

                {/* Insight Cards Grid */}
                <section className="insight-grid">
                    {/* Recent Prompts Card */}
                    <div className="insight-card">
                        <div className="insight-card-header">
                            <h3>{activeTab === 'favorites' ? 'Favorite Prompts' : 'Recent Prompts'}</h3>
                            <Link to="/library" className="insight-link">View All →</Link>
                        </div>
                        <div className="insight-card-content">
                            {(() => {
                                const displayPrompts = activeTab === 'favorites'
                                    ? recentPrompts.filter(p => p.favorite)
                                    : recentPrompts;

                                return displayPrompts.length > 0 ? (
                                    <ul className="recent-list">
                                        {displayPrompts.slice(0, 4).map(p => (
                                            <li key={p.id} className="recent-item" onClick={() => navigate(`/library?id=${p.id}`)}>
                                                <span className="recent-title">{p.title}</span>
                                                {p.favorite && <span className="recent-fav"><Star size={12} fill="currentColor" /></span>}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="insight-empty-state">
                                        <p className="insight-empty">
                                            {activeTab === 'favorites' ? 'No favorite prompts yet' : 'No prompts yet'}
                                        </p>
                                        <button className="empty-cta" onClick={() => setIsCreateModalOpen(true)}>
                                            {activeTab === 'favorites' ? 'Browse prompts →' : 'Create your first prompt →'}
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Usage Stats Card */}
                    <div className="insight-card">
                        <div className="insight-card-header">
                            <h3>Usage Stats</h3>
                        </div>
                        <div className="insight-card-content stats-grid">
                            <div className="stat-mini">
                                <span className="stat-mini-value">{stats.totalPrompts || '—'}</span>
                                <span className="stat-mini-label">Total</span>
                            </div>
                            <div className="stat-mini">
                                <span className="stat-mini-value">{stats.favorites || '—'}</span>
                                <span className="stat-mini-label">Favorites</span>
                            </div>
                            <div className="stat-mini">
                                <span className="stat-mini-value">{stats.totalCollections || '—'}</span>
                                <span className="stat-mini-label">Collections</span>
                            </div>
                            <div className="stat-mini">
                                <span className="stat-mini-value">{activityData.reduce((sum, d) => sum + d.count, 0) || '—'}</span>
                                <span className="stat-mini-label">This Week</span>
                            </div>
                        </div>
                    </div>

                    {/* Learn Prompting Card */}
                    <div className="insight-card learn-card">
                        <div className="insight-card-header">
                            <h3><Gamepad2 size={20} className="icon-3d icon-3d-purple" style={{ marginRight: 8, verticalAlign: 'middle' }} /> Learn Prompting</h3>
                        </div>
                        <div className="insight-card-content">
                            <div className="learn-level">
                                Level {learningProgress.level} • {learningProgress.levelName}
                            </div>
                            <div className="learn-progress-bar">
                                <div
                                    className="learn-progress-fill"
                                    style={{ width: `${learningProgress.percentComplete}%` }}
                                />
                            </div>
                            <div className="learn-stats">
                                <div className="learn-stat">
                                    <Trophy size={18} className="learn-stat-icon icon-3d icon-3d-orange" />
                                    <span className="learn-stat-value">{learningProgress.highScore}</span>
                                    <span className="learn-stat-label">High Score</span>
                                </div>
                                <div className="learn-stat">
                                    <Flame size={18} className="learn-stat-icon icon-3d icon-3d-pink" />
                                    <span className="learn-stat-value">{learningProgress.currentStreak}</span>
                                    <span className="learn-stat-label">Day Streak</span>
                                </div>
                            </div>
                            <Link to="/learn" className="learn-cta">
                                Start Learning →
                            </Link>
                        </div>
                    </div>

                    {/* Trending Tags Card */}
                    <div className="insight-card">
                        <div className="insight-card-header">
                            <h3>Trending Tags</h3>
                        </div>
                        <div className="insight-card-content tags-cloud">
                            {(() => {
                                // Get tag counts
                                const tagCounts: Record<string, number> = {};
                                prompts.forEach(p => {
                                    p.tags.forEach(tag => {
                                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                                    });
                                });
                                const sortedTags = Object.entries(tagCounts)
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 6);

                                return sortedTags.length > 0 ? (
                                    <div className="tag-pills">
                                        {sortedTags.map(([tag, count]) => (
                                            <span key={tag} className="tag-pill" onClick={() => navigate(`/library?tag=${tag}`)}>
                                                #{tag} <span className="tag-count">({count})</span>
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="insight-empty">Add tags to your prompts to see trends</p>
                                );
                            })()}
                        </div>
                    </div>
                </section>
            </main>

            {/* Create Prompt Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Prompt"
                size="lg"
            >
                <PromptEditor
                    prompt={null}
                    onSave={async (data) => {
                        await indexedDbService.create(data);
                        setIsCreateModalOpen(false);
                        // Refresh prompts
                        const allPrompts = await indexedDbService.getAll();
                        setPrompts(allPrompts);
                        setRecentPrompts(allPrompts.slice(0, 5));
                    }}
                    onCancel={() => setIsCreateModalOpen(false)}
                    autoFocusTitle
                />
            </Modal>
        </div>
    );
};
