import { useState } from 'react';

import type { Prompt } from '../types';
import { indexedDbService } from '../services/indexedDb';
import { PromptIcon } from './common/PromptIcon';
import { Tooltip } from './common/Tooltip';
import { PromptDetailModal } from './PromptDetailModal';
import { Copy, Heart, Check, Eye } from 'lucide-react';
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
    // navigate unused
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Assign color based on prompt id hash for consistency
    const colorIndex = prompt.id.charCodeAt(0) % colorVariants.length;
    const colorVariant = colorVariants[colorIndex];

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        onCopy(prompt);
        await indexedDbService.recordUsage(prompt.id, 'copy');
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // If selecting, don't open modal
        if (onToggleSelect && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            onToggleSelect(prompt.id);
            return;
        }

        // Default: Open Modal instead of navigating? 
        // User asked for "larger card", so Modal is perfect.
        setIsModalOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsModalOpen(true);
        }
    };

    // Get category from tags or infer from ID/Content if missing
    // For PromptIcon, we pass the first tag or 'General'
    const promptType = (prompt.tags && prompt.tags.length > 0) ? prompt.tags[0] : 'General';

    // Truncate content for preview
    const contentPreview = prompt.content.length > 150
        ? prompt.content.slice(0, 150) + '...'
        : prompt.content;

    return (
        <>
            <article
                className={`prompt-card prompt-card--${colorVariant} ${isSelected ? 'prompt-card--selected' : ''}`}
                onClick={handleCardClick}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="article"
                aria-label={`Prompt: ${prompt.title}`}
            >
                {/* Header with Icon */}
                <header className="prompt-card__header">
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <PromptIcon type={promptType} size="sm" />
                        <div className="prompt-card__categories">
                            {prompt.is_public && (
                                <span className="prompt-card__category prompt-card__category--public">
                                    PUBLIC
                                </span>
                            )}
                            {prompt.tags && prompt.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="prompt-card__category prompt-card__category--primary">
                                    {tag.toUpperCase()}
                                </span>
                            ))}
                        </div>
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
                        {/* View Button */}
                        <Tooltip content="View Details">
                            <button
                                className="prompt-card__action"
                                onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                            >
                                <Eye size={16} />
                            </button>
                        </Tooltip>

                        {/* Favorite Button */}
                        <Tooltip content={prompt.favorite ? "Unfavorite" : "Favorite"}>
                            <button
                                className={`prompt-card__action prompt-card__action--favorite ${prompt.favorite ? 'active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); onToggleFavorite(prompt.id); }}
                            >
                                <Heart size={16} fill={prompt.favorite ? "currentColor" : "none"} />
                            </button>
                        </Tooltip>

                        {/* Copy Button */}
                        <Tooltip content={isCopied ? "Copied!" : "Copy"}>
                            <button
                                className={`prompt-card__action prompt-card__action--copy ${isCopied ? 'success' : ''}`}
                                onClick={handleCopy}
                            >
                                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </Tooltip>
                    </div>
                </footer>
            </article>

            <PromptDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                prompt={{
                    ...prompt,
                    // Adapting Prompt (local) to PublicPrompt (modal expects)
                    // We add missing fields with defaults
                    type: promptType as any,
                    model: 'GPT', // Default for local
                    rating: 0,
                    rating_count: 0,
                    fork_count: 0,
                    tokens: prompt.content.split(' ').length,
                    preview: prompt.content.substring(0, 100),
                    author_name: 'You',
                    is_featured: false
                }}
            />
        </>
    );
};
