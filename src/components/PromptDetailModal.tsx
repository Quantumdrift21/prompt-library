import React from 'react';
import { Modal } from './common/Modal'; // Adjust import path
import { PromptIcon } from './common/PromptIcon';
import { Tooltip } from './common/Tooltip';
import { Copy, Bookmark, Check } from 'lucide-react';
import type { PublicPrompt } from '../types'; // Adjust
import './PromptDetailModal.css';
import { useCopy } from '../hooks/useCopy';

interface PromptDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    prompt: PublicPrompt | null;
}

export const PromptDetailModal: React.FC<PromptDetailModalProps> = ({ isOpen, onClose, prompt }) => {
    const { copyPrompt, copiedId } = useCopy();

    if (!prompt) return null;

    const isCopied = copiedId === prompt.id || copiedId === 'detail-modal'; // Simplification? Prompt ID might not match if PublicPrompt ID is different format? 
    // Wait, useCopy accepts Prompt (local). PublicPrompt is different.
    // useCopy internally calls copyToClipboard(prompt.content) and sets copiedId = prompt.id.
    // So if I pass a mock prompt with ID from public prompt, it works.

    const handleCopy = () => {
        // useCopy expects { id, content }.
        copyPrompt({ id: prompt.id, content: prompt.content } as any);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            title={prompt.title}
        >
            <div className="prompt-detail-container">

                {/* Header Metadata */}
                <div className="detail-header">
                    <PromptIcon type={prompt.type} size="lg" />
                    <div className="detail-meta">
                        <div className="detail-badges">
                            <span className={`detail-badge badge-${prompt.type?.toLowerCase().replace(/\s/g, '')}`}>{prompt.type}</span>
                            <span className="detail-badge badge-model">{prompt.model}</span>
                        </div>
                        <div className="detail-stats">
                            <span>⭐ {prompt.rating}</span>
                            <span>• {Math.round(prompt.tokens / 100) * 100}+ tokens</span>
                            <span>• {prompt.rating_count} reviews</span>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="detail-actions">
                    <Tooltip content={isCopied ? "Copied!" : "Copy to Clipboard"}>
                        <button
                            className={`action-btn primary ${isCopied ? 'success' : ''}`}
                            onClick={handleCopy}
                        >
                            {isCopied ? <Check size={18} /> : <Copy size={18} />}
                            {isCopied ? 'Copied' : 'Copy Prompt'}
                        </button>
                    </Tooltip>

                    <Tooltip content="Sign in to Save (Coming Soon)">
                        <button className="action-btn secondary">
                            <Bookmark size={18} />
                            Save to Library
                        </button>
                    </Tooltip>
                </div>

                {/* Content Area */}
                <div className="detail-content-area">
                    <label className="detail-label">PROMPT</label>
                    <div className="detail-prompt-box">
                        {prompt.content}
                    </div>
                </div>

                {/* Tags */}
                {prompt.tags && prompt.tags.length > 0 && (
                    <div className="detail-tags">
                        {prompt.tags.map(tag => (
                            <span key={tag} className="detail-tag">#{tag}</span>
                        ))}
                    </div>
                )}

            </div>
        </Modal>
    );
};
