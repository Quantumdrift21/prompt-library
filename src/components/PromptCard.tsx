import { useState, useEffect } from 'react';
import type { Prompt } from '../types';
import { indexedDbService, type UsageStats } from '../services/indexedDb';
import { UsageSparkline } from './UsageSparkline';
import './PromptCard.css';

interface PromptCardProps {
    prompt: Prompt;
    onCopy: (prompt: Prompt) => void;
    onEdit: (prompt: Prompt) => void;
    onDelete: (id: string) => void;
    onToggleFavorite: (id: string) => void;
    isCopied: boolean;
    isSelected?: boolean;
    onToggleSelect?: (id: string) => void;
}

export const PromptCard = ({
    prompt,
    onCopy,
    onEdit,
    onDelete,
    onToggleFavorite,
    isCopied,
    isSelected = false,
    onToggleSelect,
}: PromptCardProps) => {
    const [stats, setStats] = useState<UsageStats>({
        usageCount: 0,
        lastUsedAt: null,
        timelineData: [],
    });
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const loadStats = async () => {
            const data = await indexedDbService.getUsageStats(prompt.id);
            setStats(data);
        };
        loadStats();
    }, [prompt.id, isCopied]);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        onCopy(prompt);
        await indexedDbService.recordUsage(prompt.id, 'copy');
        const newStats = await indexedDbService.getUsageStats(prompt.id);
        setStats(newStats);
    };

    const handleCardClick = (e: React.MouseEvent) => {
        if ((e.ctrlKey || e.metaKey) && onToggleSelect) {
            e.preventDefault();
            onToggleSelect(prompt.id);
        }
    };

    const formatDate = (isoString?: string | null) => {
        if (!isoString) return 'Never';
        const date = new Date(isoString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Derived State


    // Insight Logic
    const getInsight = () => {
        if (stats.usageCount === 0) return "Not used yet";
        if (stats.lastUsedAt && new Date(stats.lastUsedAt).toDateString() === new Date().toDateString()) {
            return "Used today";
        }
        return `Used ${stats.usageCount} times total`;
    };

    return (
        <article
            className={`prompt-card ${isSelected ? 'prompt-card--selected' : ''}`}
            onClick={handleCardClick}
        >
            <div className="prompt-card__glow-border"></div>

            {/* Header */}
            <header className="prompt-card__header">
                <div className="prompt-card__icon">⏳</div>
                <div className="prompt-card__title-group">
                    <h3 className="prompt-card__title">{prompt.title}</h3>
                    <div className="prompt-card__tags">
                        {Array.isArray(prompt.tags) && prompt.tags.length > 0 ? (
                            prompt.tags.map((tag) => (
                                <span key={String(tag)} className="prompt-card__badge">{String(tag)}</span>
                            ))
                        ) : (
                            <span className="prompt-card__badge">Draft</span>
                        )}
                    </div>
                </div>
                <div className="prompt-card__header-actions">
                    <button
                        className={`prompt-card__favorite ${prompt.favorite ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(prompt.id); }}
                    >
                        {prompt.favorite ? '★' : '☆'}
                    </button>
                    <button
                        className="prompt-card__menu-trigger"
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                    >
                        ⋮
                    </button>
                    {showMenu && (
                        <div className="prompt-card__menu">
                            <button onClick={(e) => { e.stopPropagation(); onDelete(prompt.id); }}>Delete</button>
                        </div>
                    )}
                </div>
            </header>

            {/* Description */}
            <p className="prompt-card__description">
                {prompt.content}
            </p>

            {/* Meta Row */}
            <div className="prompt-card__meta-row">
                <div className="prompt-card__meta-item">
                    <span className="prompt-card__meta-icon">🕒</span>
                    Last used: <span className="prompt-card__meta-value">{formatDate(stats.lastUsedAt)}</span>
                </div>
                <div className="prompt-card__meta-item">
                    <span className="prompt-card__meta-icon">📝</span>
                    Created: <span className="prompt-card__meta-value">{formatDate(prompt.created_at)}</span>
                </div>
                <div className="prompt-card__meta-item">
                    <span className="prompt-card__meta-icon">📊</span>
                    Uses: <span className="prompt-card__meta-value">{stats.usageCount}</span>
                </div>
            </div>

            {/* Timeline & Activity */}
            <div className="prompt-card__analytics">
                <div className="prompt-card__timeline-section">
                    <h4 className="prompt-card__section-title">Usage Timeline</h4>
                    <div className="prompt-card__sparkline-container">
                        <UsageSparkline data={stats.timelineData} days={7} />
                    </div>
                </div>
            </div>

            {/* Insight Panel */}
            <div className="prompt-card__insight-panel">
                <span className="prompt-card__insight-icon">✨</span>
                <span className="prompt-card__insight-text">{getInsight()}</span>
            </div>

            {/* Actions */}
            <footer className="prompt-card__action-row">
                <button
                    className={`prompt-card__btn-primary ${isCopied ? 'success' : ''}`}
                    onClick={handleCopy}
                >
                    {isCopied ? (
                        <><span>✓</span> Copied</>
                    ) : (
                        <><span>📋</span> Copy</>
                    )}
                </button>
                <div className="prompt-card__secondary-actions">
                    <button className="prompt-card__btn-secondary" onClick={(e) => { e.stopPropagation(); onEdit(prompt); }}>
                        ✎ Edit
                    </button>
                    <button className="prompt-card__btn-secondary" onClick={(e) => { e.stopPropagation(); onDelete(prompt.id); }}>
                        🗑️ Delete
                    </button>
                </div>
            </footer>
        </article>
    );
};
