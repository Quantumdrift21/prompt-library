import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, Check } from 'lucide-react';
import './FilterBar.css';

export type SortOption = 'recent' | 'alphabetical' | 'usage';

interface FilterBarProps {
    sortOption: SortOption;
    onSortChange: (option: SortOption) => void;
    availableTags: string[];
    selectedTags: Set<string>;
    onToggleTag: (tag: string) => void;
    onClearFilters: () => void;
    totalCount: number;
    shownCount: number;
}

// Sort option labels
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'recent', label: 'Recent' },
    { value: 'alphabetical', label: 'A–Z' },
    { value: 'usage', label: 'Most Used' },
];

export const FilterBar = ({
    sortOption,
    onSortChange,
    availableTags,
    selectedTags,
    onToggleTag,
    onClearFilters,
    totalCount,
    shownCount,
}: FilterBarProps) => {
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);
    const [tagSearch, setTagSearch] = useState('');

    const sortRef = useRef<HTMLDivElement>(null);
    const tagsRef = useRef<HTMLDivElement>(null);

    const hasActiveFilters = selectedTags.size > 0 || sortOption !== 'recent';

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setSortDropdownOpen(false);
            }
            if (tagsRef.current && !tagsRef.current.contains(e.target as Node)) {
                setTagsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter tags by search
    const filteredTags = availableTags.filter(tag =>
        tag.toLowerCase().includes(tagSearch.toLowerCase())
    );

    // Get current sort label
    const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortOption)?.label || 'Recent';

    return (
        <div className="filter-bar">
            <div className="filter-bar__row">
                {/* Left: Dropdowns */}
                <div className="filter-bar__controls">
                    {/* Sort Dropdown */}
                    <div className="filter-bar__dropdown" ref={sortRef}>
                        <button
                            className={`filter-bar__dropdown-trigger ${sortDropdownOpen ? 'open' : ''}`}
                            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                            aria-haspopup="listbox"
                            aria-expanded={sortDropdownOpen}
                        >
                            <span className="filter-bar__dropdown-icon"><ArrowUpDown size={14} /></span>
                            <span>Sort: {currentSortLabel}</span>
                            <span className="filter-bar__dropdown-chevron">
                                {sortDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </span>
                        </button>
                        {sortDropdownOpen && (
                            <div className="filter-bar__dropdown-menu" role="listbox">
                                {SORT_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        className={`filter-bar__dropdown-item ${sortOption === opt.value ? 'active' : ''}`}
                                        onClick={() => {
                                            onSortChange(opt.value);
                                            setSortDropdownOpen(false);
                                        }}
                                        role="option"
                                        aria-selected={sortOption === opt.value}
                                    >
                                        {sortOption === opt.value && <span className="filter-bar__check"><Check size={14} /></span>}
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tags Dropdown (Multi-select, Searchable) */}
                    {availableTags.length > 0 && (
                        <div className="filter-bar__dropdown" ref={tagsRef}>
                            <button
                                className={`filter-bar__dropdown-trigger ${tagsDropdownOpen ? 'open' : ''} ${selectedTags.size > 0 ? 'has-selection' : ''}`}
                                onClick={() => setTagsDropdownOpen(!tagsDropdownOpen)}
                                aria-haspopup="listbox"
                                aria-expanded={tagsDropdownOpen}
                            >
                                <span className="filter-bar__dropdown-icon"><ArrowUpDown size={14} className="rotate-90" /></span>
                                <span>
                                    Tags
                                    {selectedTags.size > 0 && (
                                        <span className="filter-bar__badge">{selectedTags.size}</span>
                                    )}
                                </span>
                                <span className="filter-bar__dropdown-chevron">
                                    {tagsDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </span>
                            </button>
                            {tagsDropdownOpen && (
                                <div className="filter-bar__dropdown-menu filter-bar__dropdown-menu--tags" role="listbox">
                                    {/* Search Input */}
                                    <div className="filter-bar__search-wrapper">
                                        <input
                                            type="text"
                                            className="filter-bar__search"
                                            placeholder="Search tags..."
                                            value={tagSearch}
                                            onChange={(e) => setTagSearch(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    {/* Tag List */}
                                    <div className="filter-bar__tag-list">
                                        {filteredTags.length > 0 ? (
                                            filteredTags.map(tag => (
                                                <button
                                                    key={tag}
                                                    className={`filter-bar__dropdown-item ${selectedTags.has(tag) ? 'active' : ''}`}
                                                    onClick={() => onToggleTag(tag)}
                                                    role="option"
                                                    aria-selected={selectedTags.has(tag)}
                                                >
                                                    <span className={`filter-bar__checkbox ${selectedTags.has(tag) ? 'checked' : ''}`}>
                                                        {selectedTags.has(tag) && <Check size={12} strokeWidth={3} />}
                                                    </span>
                                                    #{tag}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="filter-bar__empty">No tags found</div>
                                        )}
                                    </div>
                                    {/* Quick Actions */}
                                    {selectedTags.size > 0 && (
                                        <div className="filter-bar__tag-actions">
                                            <button
                                                className="filter-bar__tag-clear"
                                                onClick={() => {
                                                    selectedTags.forEach(tag => onToggleTag(tag));
                                                }}
                                            >
                                                Clear all
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: Meta Info */}
                <div className="filter-bar__meta">
                    <span className="filter-bar__count">
                        {shownCount} of {totalCount} items
                    </span>
                    {hasActiveFilters && (
                        <button className="filter-bar__clear" onClick={onClearFilters}>
                            <span style={{ marginRight: 4, display: 'inline-flex' }}>✕</span> Clear filters
                        </button>
                    )}
                </div>
            </div>

            {/* Selected Tags Preview (Quick Access) */}
            {selectedTags.size > 0 && (
                <div className="filter-bar__selected-tags">
                    {Array.from(selectedTags).map(tag => (
                        <button
                            key={tag}
                            className="filter-bar__selected-tag"
                            onClick={() => onToggleTag(tag)}
                            aria-label={`Remove ${tag} filter`}
                        >
                            #{tag}
                            <span className="filter-bar__remove">✕</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
