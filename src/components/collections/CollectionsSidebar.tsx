import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { Collection } from '../../types';
import './CollectionsSidebar.css';

interface CollectionsSidebarProps {
    collections: Collection[];
    tags: string[];
    onCreateCollection: () => void;
    isGuest?: boolean;
}

export const CollectionsSidebar = ({ collections, tags, onCreateCollection, isGuest = false }: CollectionsSidebarProps) => {
    const location = useLocation();
    const [isTagsExpanded, setIsTagsExpanded] = useState(true);

    return (
        <aside className="collections-sidebar">
            <div className="collections-sidebar__section">
                <h3 className="collections-sidebar__header">Collections</h3>
                <nav className="collections-sidebar__nav">
                    <NavLink to="/collections?view=discover" className={() => `collections-sidebar__item ${location.search.includes('discover') ? 'active' : ''}`}>
                        <span className="collections-sidebar__icon">🌐</span>
                        Discover
                    </NavLink>

                    {!isGuest && (
                        <>
                            <NavLink to="/collections?view=favorites" className={() => `collections-sidebar__item ${location.search.includes('favorites') ? 'active' : ''}`}>
                                <span className="collections-sidebar__icon">⭐</span>
                                Favorites
                            </NavLink>
                            <NavLink to="/collections?view=recent" className={() => `collections-sidebar__item ${location.search.includes('recent') ? 'active' : ''}`}>
                                <span className="collections-sidebar__icon">🕒</span>
                                Recent
                            </NavLink>

                            {/* User Collections */}
                            {collections.map(col => (
                                <NavLink key={col.id} to={`/collections?id=${col.id}`} className={() => `collections-sidebar__item ${location.search.includes(col.id) ? 'active' : ''}`}>
                                    <span className="collections-sidebar__icon">📁</span>
                                    {col.name}
                                </NavLink>
                            ))}

                            <button className="collections-sidebar__add-btn" onClick={onCreateCollection}>
                                + New Collection
                            </button>
                        </>
                    )}
                </nav>
            </div>

            {!isGuest && (
                <div className="collections-sidebar__section">
                    <h3 className="collections-sidebar__header">Smart Views</h3>
                    <nav className="collections-sidebar__nav">
                        <NavLink to="/collections?view=drafts" className="collections-sidebar__item">
                            <span className="collections-sidebar__icon">🧪</span>
                            Drafts
                        </NavLink>
                        <NavLink to="/collections?view=archive" className="collections-sidebar__item">
                            <span className="collections-sidebar__icon">🗑️</span>
                            Archive
                        </NavLink>
                    </nav>
                </div>
            )}

            <div className="collections-sidebar__section">
                <div className="collections-sidebar__header-row" onClick={() => setIsTagsExpanded(!isTagsExpanded)}>
                    <h3 className="collections-sidebar__header">Tags</h3>
                    <span className={`collections-sidebar__chevron ${isTagsExpanded ? 'expanded' : ''}`}>▼</span>
                </div>
                {isTagsExpanded && (
                    <div className="collections-sidebar__tags">
                        {tags.map(tag => (
                            <NavLink key={tag} to={`/collections?tag=${tag}`} className="collections-sidebar__tag">
                                #{tag}
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
};
