import type { RefObject } from 'react';
import './SearchBar.css';

interface SearchBarProps {
    value: string;
    onChange: (query: string) => void;
    inputRef?: RefObject<HTMLInputElement | null>;
}

export const SearchBar = ({ value, onChange, inputRef }: SearchBarProps) => {
    return (
        <div className="search-bar">
            <span className="search-bar__icon" aria-hidden="true">🔍</span>
            <input
                ref={inputRef}
                type="search"
                className="search-bar__input"
                placeholder="Search prompts... (Press /)"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label="Search prompts"
            />
            {value && (
                <button
                    className="search-bar__clear"
                    onClick={() => onChange('')}
                    aria-label="Clear search"
                >
                    ✕
                </button>
            )}
        </div>
    );
};
