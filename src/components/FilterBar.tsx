import { useMemo } from 'react';
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
    const hasActiveFilters = selectedTags.size > 0 || sortOption !== 'recent';

    return (
        <div className="filter-bar">
            <div className="filter-bar__row">
                {/* Sort Options */}
                <div className="filter-bar__group">
                    <span className="filter-bar__label">Sort by:</span>
                    <button
                        className={`filter-bar__chip ${sortOption === 'recent' ? 'active' : ''}`}
                        onClick={() => onSortChange('recent')}
                    >
                        Recent
                    </button>
                    <button
                        className={`filter-bar__chip ${sortOption === 'alphabetical' ? 'active' : ''}`}
                        onClick={() => onSortChange('alphabetical')}
                    >
                        A-Z
                    </button>
                    {/* Placeholder for 'Usage' if not strictly tracking it yet, but good to add */}
                    {/* <button
                        className={`filter-bar__chip ${sortOption === 'usage' ? 'active' : ''}`}
                        onClick={() => onSortChange('usage')}
                    >
                        Most Used
                    </button> */}
                </div>

                {/* Counts / Clear */}
                <div className="filter-bar__meta">
                    <span className="filter-bar__count">
                        {shownCount} of {totalCount} items
                    </span>
                    {hasActiveFilters && (
                        <button className="filter-bar__clear" onClick={onClearFilters}>
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {/* Tag Cloud (Collapsible or Horizontal Scroll) */}
            {availableTags.length > 0 && (
                <div className="filter-bar__tags">
                    {availableTags.map(tag => (
                        <button
                            key={tag}
                            className={`filter-bar__tag ${selectedTags.has(tag) ? 'active' : ''}`}
                            onClick={() => onToggleTag(tag)}
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
