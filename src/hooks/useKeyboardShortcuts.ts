import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
    onFocusSearch?: () => void;
    onCreateNew?: () => void;
    onEscape?: () => void;
}

/**
 * Global keyboard shortcuts hook.
 * Ignores shortcuts when typing in input/textarea.
 */
export const useKeyboardShortcuts = ({
    onFocusSearch,
    onCreateNew,
    onEscape,
}: KeyboardShortcuts) => {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isTyping =
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable;

            // Escape always works
            if (e.key === 'Escape') {
                onEscape?.();
                return;
            }

            // Don't trigger shortcuts while typing
            if (isTyping) return;

            // "/" to focus search
            if (e.key === '/' && onFocusSearch) {
                e.preventDefault();
                onFocusSearch();
                return;
            }

            // Ctrl/Cmd + N to create new
            if ((e.ctrlKey || e.metaKey) && e.key === 'n' && onCreateNew) {
                e.preventDefault();
                onCreateNew();
                return;
            }
        },
        [onFocusSearch, onCreateNew, onEscape]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
};
