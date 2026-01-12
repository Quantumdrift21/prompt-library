import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CollectionsSidebar } from '../components/collections/CollectionsSidebar';
import { PromptList, EmptyState } from '../components';
import { PromptDiscoveryGrid } from '../components/landing/PromptDiscoveryGrid';
import { DarkLayout } from '../components/layout';
import { indexedDbService } from '../services/indexedDb';
import { publicPromptsService } from '../services/publicPromptsService';
import { useAuth, useCopy } from '../hooks';
import { mapPrivateToPublic } from '../utils/promptMappers';
import type { Prompt, Collection, CreatePromptInput } from '../types';
import type { PublicPrompt } from '../types/publicPrompt';
import { Search, X, Loader2 } from 'lucide-react';
import './Collections.css';

export const Collections = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();

    // Core Data
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [publicPrompts, setPublicPrompts] = useState<PublicPrompt[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Filter State
    const [searchQuery, setSearchQuery] = useState(''); // Local input state
    const [debouncedQuery, setDebouncedQuery] = useState(''); // Actual search trigger
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const { copiedId, copyPrompt } = useCopy();

    const currentView = searchParams.get('view') || 'all';
    const currentTag = searchParams.get('tag');
    const collectionId = searchParams.get('id');

    const userName = user?.email?.split('@')[0] || 'Guest';
    const isGuest = !user;
    const isDiscoverMode = isGuest || currentView === 'discover';

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setPage(1); // Reset page on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Reset pagination when tags change
    useEffect(() => {
        setPage(1);
    }, [selectedTags]);

    // Fetch Tags on Mount
    useEffect(() => {
        if (isDiscoverMode) {
            publicPromptsService.getTags().then(setAvailableTags);
        }
    }, [isDiscoverMode]);

    // Main Data Fetcher
    useEffect(() => {
        const loadData = async () => {
            // If loading more (page > 1), don't show full loading spinner
            if (page === 1) setIsLoading(true);
            else setIsLoadingMore(true);

            if (isDiscoverMode) {
                try {
                    // Fetch Public Prompts
                    const limit = 12; // Grid friendly number (divisible by 2, 3, 4)
                    const publicData = await publicPromptsService.search(debouncedQuery, selectedTags, page, limit);

                    // Check if we reached the end
                    if (publicData.length < limit) setHasMore(false);
                    else setHasMore(true);

                    // Fetch Local Prompts (Only on first page to match filters)
                    let localMapped: PublicPrompt[] = [];
                    if (page === 1) {
                        const localData = await indexedDbService.search(debouncedQuery);
                        // Note: indexedDb.search currently ignores tags for filtering, 
                        // but returns scored results matching query. 
                        // We can manually filter by tags if needed.
                        const filteredLocal = selectedTags.length > 0
                            ? localData.filter(p => p.tags.some(t => selectedTags.includes(t)))
                            : localData;

                        localMapped = filteredLocal.map(p => mapPrivateToPublic(p, 'You'));
                    }

                    if (page === 1) {
                        setPublicPrompts([...localMapped, ...publicData]);
                    } else {
                        setPublicPrompts(prev => [...prev, ...publicData]);
                    }

                    // Load collections for sidebar if logged in
                    if (!isGuest) {
                        const cols = await indexedDbService.getCollections();
                        setCollections(cols);
                    } else {
                        setCollections([]);
                    }
                } catch (err) {
                    console.error("Failed to load discover data", err);
                }
            } else {
                // Private Views Logic
                const [allPrompts, allCollections] = await Promise.all([
                    indexedDbService.getAll(true),
                    indexedDbService.getCollections()
                ]);

                setCollections(allCollections);

                let filtered = allPrompts;

                if (currentView === 'archive') {
                    filtered = filtered.filter(p => p.deleted_at !== null);
                } else {
                    filtered = filtered.filter(p => p.deleted_at === null);

                    if (currentView === 'favorites') {
                        filtered = filtered.filter(p => p.favorite);
                    } else if (currentView === 'drafts') {
                        filtered = filtered.filter(p => p.is_draft);
                    } else if (currentView === 'recent') {
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                        filtered = filtered.filter(p => new Date(p.updated_at) > sevenDaysAgo);
                    } else if (currentTag) {
                        filtered = filtered.filter(p => p.tags.includes(currentTag));
                    } else if (collectionId) {
                        filtered = filtered.filter(p => p.collection_id === collectionId);
                    }
                }
                setPrompts(filtered);
            }

            setIsLoading(false);
            setIsLoadingMore(false);
        };

        loadData();
    }, [isDiscoverMode, currentView, currentTag, collectionId, debouncedQuery, selectedTags, page, isGuest]);

    const handleCreateCollection = async () => {
        if (isGuest) return;
        const name = prompt("Collection Name:");
        if (name) {
            await indexedDbService.createCollection({ name });
            const cols = await indexedDbService.getCollections();
            setCollections(cols);
        }
    };

    const handleCopyPublic = (content: string, id: string) => {
        copyPrompt({ id, content } as Prompt);
    };

    const handleSaveToLibrary = async (p: PublicPrompt) => {
        if (isGuest) {
            alert("Please log in to save prompts to your library.");
            return;
        }
        if (confirm(`Save "${p.title}" to your library?`)) {
            try {
                const input: CreatePromptInput = {
                    title: p.title,
                    content: p.content,
                    tags: [...p.tags, p.type, p.model].filter(Boolean),
                    favorite: false,
                    is_draft: false,
                };
                await indexedDbService.create(input);
            } catch (err) {
                console.error('Failed to save public prompt:', err);
                alert('Failed to save prompt.');
            }
        }
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    // Dynamic page title
    const pageTitle = isDiscoverMode ? 'Discover'
        : collectionId ? collections.find(c => c.id === collectionId)?.name || 'Collection'
            : currentTag ? `#${currentTag}`
                : currentView.charAt(0).toUpperCase() + currentView.slice(1);

    return (
        <DarkLayout title={pageTitle} userName={userName}>
            <div className="collections-layout">
                <CollectionsSidebar
                    collections={collections}
                    tags={Array.from(new Set(prompts.flatMap(p => p.tags))).sort()}
                    onCreateCollection={handleCreateCollection}
                    isGuest={isGuest}
                />

                <main className="collections-main">
                    {/* Header with Search & Filter */}
                    <div className="collections-header-wrapper">
                        <header className="collections-header">
                            <span className="collections-count">
                                {isDiscoverMode ? `${publicPrompts.length}+ community items` : `${prompts.length} items`}
                            </span>

                            {isDiscoverMode && (
                                <div className="discover-search-bar">
                                    <Search size={18} className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search prompts..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                    {searchQuery && (
                                        <button className="clear-search" onClick={() => setSearchQuery('')}>
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </header>

                        {isDiscoverMode && availableTags.length > 0 && (
                            <div className="discover-tags-scroll">
                                {availableTags.map(tag => (
                                    <button
                                        key={tag}
                                        className={`discover-tag-chip ${selectedTags.includes(tag) ? 'active' : ''}`}
                                        onClick={() => toggleTag(tag)}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="collections-content">
                        {isLoading ? (
                            <div className="loading-spinner">Loading...</div>
                        ) : isDiscoverMode ? (
                            <div className="discover-wrapper">
                                <PromptDiscoveryGrid
                                    prompts={publicPrompts}
                                    isLoading={false} // Handled by parent loading state mainly
                                    onCopyContent={handleCopyPublic}
                                    onSaveToLibrary={handleSaveToLibrary}
                                />

                                {hasMore && (
                                    <div className="load-more-container">
                                        <button
                                            className="load-more-btn"
                                            onClick={() => setPage(p => p + 1)}
                                            disabled={isLoadingMore}
                                        >
                                            {isLoadingMore ? (
                                                <><Loader2 className="animate-spin" size={16} /> Loading...</>
                                            ) : (
                                                "Load More"
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : prompts.length === 0 ? (
                            <EmptyState type="no-prompts" />
                        ) : (
                            <PromptList
                                prompts={prompts}
                                onCopy={copyPrompt}
                                onEdit={() => { }}
                                onDelete={() => { }}
                                onToggleFavorite={async (id) => {
                                    const p = prompts.find(p => p.id === id);
                                    if (p) await indexedDbService.update(id, { favorite: !p.favorite });
                                }}
                                copiedId={copiedId}
                                selectedIds={new Set()}
                                onToggleSelect={() => { }}
                            />
                        )}
                    </div>
                </main>
            </div>
        </DarkLayout>
    );
};
