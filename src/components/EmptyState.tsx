import './EmptyState.css';

interface EmptyStateProps {
    type: 'no-prompts' | 'no-results';
    onAction?: () => void;
}

export const EmptyState = ({ type, onAction }: EmptyStateProps) => {
    if (type === 'no-prompts') {
        return (
            <div className="empty-state">
                <div className="empty-state__icon">📝</div>
                <h3 className="empty-state__title">No prompts yet</h3>
                <p className="empty-state__text">
                    Create your first prompt to get started
                </p>
                {onAction && (
                    <button className="empty-state__action" onClick={onAction}>
                        + Create Prompt
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="empty-state">
            <div className="empty-state__icon">🔍</div>
            <h3 className="empty-state__title">No results found</h3>
            <p className="empty-state__text">
                Try a different search term
            </p>
        </div>
    );
};
