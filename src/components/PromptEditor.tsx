import { useState, useEffect, useRef } from 'react';
import type { Prompt, CreatePromptInput } from '../types';
import './PromptEditor.css';

interface PromptEditorProps {
    prompt: Prompt | null; // null = create mode
    onSave: (data: CreatePromptInput) => void;
    onCancel: () => void;
    autoFocusTitle?: boolean;
}

export const PromptEditor = ({ prompt, onSave, onCancel, autoFocusTitle }: PromptEditorProps) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [favorite, setFavorite] = useState(false);
    const titleInputRef = useRef<HTMLInputElement>(null);

    // Populate fields when editing
    useEffect(() => {
        if (prompt) {
            setTitle(prompt.title);
            setContent(prompt.content);
            setTagsInput(prompt.tags.join(', '));
            setFavorite(prompt.favorite);
        } else {
            setTitle('');
            setContent('');
            setTagsInput('');
            setFavorite(false);
        }
    }, [prompt]);

    // Auto-focus title on create
    useEffect(() => {
        if (autoFocusTitle && !prompt) {
            titleInputRef.current?.focus();
        }
    }, [autoFocusTitle, prompt]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const tags = tagsInput
            .split(',')
            .map(t => t.trim().toLowerCase())
            .filter(t => t.length > 0);

        onSave({
            title: title.trim(),
            content: content.trim(),
            tags,
            favorite,
        });
    };

    const isValid = title.trim().length > 0 && content.trim().length > 0;

    return (
        <form className="prompt-editor" onSubmit={handleSubmit}>
            <header className="prompt-editor__header">
                <h2>{prompt ? 'Edit Prompt' : 'New Prompt'}</h2>
                <button
                    type="button"
                    className="prompt-editor__close"
                    onClick={onCancel}
                    aria-label="Close editor"
                >
                    ✕
                </button>
            </header>

            <div className="prompt-editor__field">
                <label htmlFor="prompt-title">Title</label>
                <input
                    ref={titleInputRef}
                    id="prompt-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your prompt a name..."
                />
            </div>

            <div className="prompt-editor__field">
                <label htmlFor="prompt-content">Content</label>
                <textarea
                    id="prompt-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter your prompt text..."
                    rows={6}
                />
            </div>

            <div className="prompt-editor__field">
                <label htmlFor="prompt-tags">Tags (comma separated)</label>
                <input
                    id="prompt-tags"
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="code, review, debug..."
                />
            </div>

            <label className="prompt-editor__favorite">
                <input
                    type="checkbox"
                    checked={favorite}
                    onChange={(e) => setFavorite(e.target.checked)}
                />
                <span>Mark as favorite</span>
            </label>

            <footer className="prompt-editor__actions">
                <button
                    type="button"
                    className="prompt-editor__cancel"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="prompt-editor__save"
                    disabled={!isValid}
                >
                    {prompt ? 'Save Changes' : 'Create Prompt'}
                </button>
            </footer>
        </form>
    );
};
