import type { Prompt } from '../types';
import { PromptCard } from './PromptCard';
import './PromptList.css';

interface PromptListProps {
    prompts: Prompt[];
    onCopy: (prompt: Prompt) => void;
    onEdit: (prompt: Prompt) => void;
    onDelete: (id: string) => void;
    onToggleFavorite: (id: string) => void;
    copiedId: string | null;
    selectedIds?: Set<string>;
    onToggleSelect?: (id: string) => void;
}

export const PromptList = ({
    prompts,
    onCopy,
    onEdit,
    onDelete,
    onToggleFavorite,
    copiedId,
    selectedIds = new Set(),
    onToggleSelect,
}: PromptListProps) => {
    const hasSelection = selectedIds.size > 0;

    return (
        <div className="prompt-list">
            {prompts.map(prompt => (
                <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onCopy={onCopy}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleFavorite={onToggleFavorite}
                    isCopied={copiedId === prompt.id}
                    isSelected={selectedIds.has(prompt.id)}
                    onToggleSelect={hasSelection || onToggleSelect ? onToggleSelect : undefined}
                />
            ))}
        </div>
    );
};
