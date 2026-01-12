import { useState } from 'react';
import type { PublicPrompt } from '../../types/publicPrompt';
import { PromptIcon } from '../common/PromptIcon';
import { Tooltip } from '../common/Tooltip';
import { StarRating } from '../common/StarRating';
import { PromptDetailModal } from '../PromptDetailModal';
import { Eye, Bookmark, Search } from 'lucide-react';
import './PromptDiscoveryGrid.css';

interface PromptDiscoveryGridProps {
    prompts: PublicPrompt[];
    isLoading?: boolean;
    onCopyContent?: (content: string, id: string) => void;
    onSaveToLibrary?: (prompt: PublicPrompt) => void;
}

const getTypeBadgeClass = (type: string): string => {
    const typeMap: Record<string, string> = {
        'System Prompt': 'system',
        'Chain-of-Thought': 'cot',
        'Few-Shot': 'fewshot',
        'Roleplay': 'roleplay',
    };
    return typeMap[type] || 'default';
};

export const PromptDiscoveryGrid = ({ prompts, isLoading, onCopyContent, onSaveToLibrary }: PromptDiscoveryGridProps) => {
    const [selectedPrompt, setSelectedPrompt] = useState<PublicPrompt | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (content: string, id: string) => {
        if (onCopyContent) {
            onCopyContent(content, id);
        } else {
            navigator.clipboard.writeText(content);
        }
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (isLoading) {
        return (
            <div className="discovery-grid discovery-grid--loading">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="prompt-card-skeleton" />
                ))}
            </div>
        );
    }

    if (prompts.length === 0) {
        return (
            <div className="discovery-empty">
                <Search size={48} className="discovery-empty__icon icon-3d icon-3d-cyan" />
                <p>No prompts found. Try a different search term.</p>
            </div>
        );
    }

    return (
        <>
            <div className="discovery-grid">
                {prompts.map((prompt) => (
                    <article key={prompt.id} className="prompt-card-detail">
                        {/* Header with Icon */}
                        <div className="card-header-row">
                            <PromptIcon type={prompt.type} tags={prompt.tags} size="md" />
                            <div className="card-header-content">
                                <h3 className="card-title">{prompt.title}</h3>
                                <div className="card-badges">
                                    <span className={`card-type-badge card-type-badge--${getTypeBadgeClass(prompt.type)}`}>
                                        {prompt.type}
                                    </span>
                                    <span className="card-model-badge">{prompt.model}</span>
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <p className="card-preview">{prompt.preview}</p>

                        {/* Tags */}
                        <div className="card-tags">
                            {prompt.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="card-tag">#{tag}</span>
                            ))}
                            {prompt.tags.length > 3 && (
                                <span className="card-tag">+{prompt.tags.length - 3}</span>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="card-stats">
                            <Tooltip content="Community Rating">
                                <div className="card-stat card-stat--rating">
                                    <StarRating rating={prompt.rating} size={14} readonly={true} />
                                    <span style={{ marginLeft: 6 }}>{prompt.rating}</span>
                                </div>
                            </Tooltip>
                            <Tooltip content="Estimated Token Count">
                                <span className="card-stat card-stat--tokens">
                                    ~{prompt.tokens} tok
                                </span>
                            </Tooltip>
                        </div>

                        {/* Actions */}
                        <footer className="card-actions">
                            <Tooltip content={copiedId === prompt.id ? "Copied!" : "Copy Content"}>
                                <button
                                    className={`card-action card-action--primary ${copiedId === prompt.id ? 'success' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(prompt.content, prompt.id);
                                    }}
                                >
                                    {copiedId === prompt.id ? 'Copied' : 'Copy'}
                                </button>
                            </Tooltip>

                            <Tooltip content="View Full Prompt">
                                <button
                                    className="card-action card-action--secondary"
                                    onClick={() => setSelectedPrompt(prompt)}
                                >
                                    <Eye size={16} style={{ marginRight: 6 }} />
                                    View
                                </button>
                            </Tooltip>

                            <Tooltip content="Save to Library (Login)">
                                <button
                                    className="card-action card-action--icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSaveToLibrary?.(prompt);
                                    }}
                                >
                                    <Bookmark size={16} />
                                </button>
                            </Tooltip>
                        </footer>
                    </article>
                ))}
            </div>

            {/* Detailed Modal */}
            <PromptDetailModal
                isOpen={!!selectedPrompt}
                onClose={() => setSelectedPrompt(null)}
                prompt={selectedPrompt}
            />
        </>
    );
};
