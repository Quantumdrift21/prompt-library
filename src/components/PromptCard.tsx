// import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Prompt } from '../types';
import { indexedDbService } from '../services/indexedDb';
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

// Color variants for cards
const colorVariants = ['orange', 'teal', 'green', 'purple', 'pink'] as const;

export const PromptCard = ({
    prompt,
    onCopy,
    onToggleFavorite,
    isCopied,
    isSelected = false,
    onToggleSelect,
}: PromptCardProps) => {
    const navigate = useNavigate();
    // Stats state removed as unused
    // const [stats, setStats] = useState<UsageStats>(...);

    // Assign color based on prompt id hash for consistency
    const colorIndex = prompt.id.charCodeAt(0) % colorVariants.length;
    const colorVariant = colorVariants[colorIndex];

    /*
    useEffect(() => {
        const loadStats = async () => {
            const data = await indexedDbService.getUsageStats(prompt.id);
            setStats(data);
        };
        loadStats();
    }, [prompt.id, isCopied]);
    */

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        onCopy(prompt);
        await indexedDbService.recordUsage(prompt.id, 'copy');
        // const newStats = await indexedDbService.getUsageStats(prompt.id);
        // setStats(newStats);
    };

    const handleCardClick = (e: React.MouseEvent) => {
        if ((e.ctrlKey || e.metaKey) && onToggleSelect) {
            e.preventDefault();
            onToggleSelect(prompt.id);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate(`/prompt/${prompt.id}`);
        }
        if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            onCopy(prompt);
        }
    };

    // Get category from tags
    const primaryCategory = Array.isArray(prompt.tags) && prompt.tags.length > 0
        ? prompt.tags[0]
        : 'GENERAL';
    const secondaryCategory = Array.isArray(prompt.tags) && prompt.tags.length > 1
        ? prompt.tags[1]
        : null;

    // Truncate content for preview
    const contentPreview = prompt.content.length > 150
        ? prompt.content.slice(0, 150) + '...'
        : prompt.content;

    return (
        <article
            className={`prompt-card prompt-card--${colorVariant} ${isSelected ? 'prompt-card--selected' : ''}`}
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="article"
            aria-label={`Prompt: ${prompt.title}`}
        >
            {/* Header with Category Pills */}
            <header className="prompt-card__header">
                <div className="prompt-card__categories">
                    <span className="prompt-card__category prompt-card__category--primary">
                        {primaryCategory.toUpperCase()}
                    </span>
                    {secondaryCategory && (
                        <span className="prompt-card__category prompt-card__category--secondary">
                            {secondaryCategory.toUpperCase()}
                        </span>
                    )}
                </div>
            </header>

            {/* Title */}
            <h3 className="prompt-card__title">{prompt.title}</h3>

            {/* Preview Text */}
            <div className="prompt-card__preview">
                <p className="prompt-card__preview-text">{contentPreview}</p>
            </div>

            {/* Footer with Actions */}
            <footer className="prompt-card__footer">
                <div className="prompt-card__actions">
                    {/* Favorite / Heart Button */}
                    <button
                        className={`prompt-card__action prompt-card__action--favorite ${prompt.favorite ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(prompt.id); }}
                        aria-label={prompt.favorite ? 'Remove from favorites' : 'Add to favorites'}
                        title="Toggle Favorite"
                    >
                        <svg viewBox="0 0 24 24" fill={prompt.favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </button>

                    {/* Copy Button */}
                    <button
                        className={`prompt-card__action prompt-card__action--copy ${isCopied ? 'success' : ''}`}
                        onClick={handleCopy}
                        aria-label={isCopied ? 'Copied!' : 'Copy prompt'}
                        title="Copy to Clipboard"
                    >
                        {isCopied ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        )}
                    </button>
                </div>
            </footer>
        </article>
    );
};
