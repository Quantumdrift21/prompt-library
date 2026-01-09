import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CollectionsSidebar } from '../components/collections/CollectionsSidebar';
import { PromptList, EmptyState } from '../components';
import { DarkLayout } from '../components/layout';
import { indexedDbService } from '../services/indexedDb';
import { useAuth, useCopy } from '../hooks';
import type { Prompt, Collection } from '../types';
import './Collections.css';

export const Collections = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { copiedId, copyPrompt } = useCopy();

    const currentView = searchParams.get('view') || 'all';
    const currentTag = searchParams.get('tag');
    const collectionId = searchParams.get('id');

    const userName = user?.email?.split('@')[0] || 'Guest';

    // Fetch Initial Data
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const [allPrompts, allCollections] = await Promise.all([
                indexedDbService.getAll(true), // Include deleted to filter for archive
                indexedDbService.getCollections()
            ]);

            setCollections(allCollections);

            // Filter Prompts based on View/Tag/Collection
            let filtered = allPrompts;

            if (currentView === 'archive') {
                filtered = filtered.filter(p => p.deleted_at !== null);
            } else {
                // Default: Exclude deleted
                filtered = filtered.filter(p => p.deleted_at === null);

                if (currentView === 'favorites') {
                    filtered = filtered.filter(p => p.favorite);
                } else if (currentView === 'drafts') {
                    filtered = filtered.filter(p => p.is_draft);
                } else if (currentView === 'recent') {
                    // Last 7 days
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
            setIsLoading(false);
        };

        loadData();
    }, [currentView, currentTag, collectionId, user]);

    // Derived Tags
    const allTags = Array.from(new Set(prompts.flatMap(p => p.tags))).sort();

    const handleCreateCollection = async () => {
        const name = prompt("Collection Name:");
        if (name) {
            await indexedDbService.createCollection({ name });
            // Refresh collections
            const cols = await indexedDbService.getCollections();
            setCollections(cols);
        }
    };

    // Dynamic page title
    const pageTitle = collectionId
        ? collections.find(c => c.id === collectionId)?.name || 'Collection'
        : currentTag
            ? `#${currentTag}`
            : currentView.charAt(0).toUpperCase() + currentView.slice(1);

    return (
        <DarkLayout title={pageTitle} userName={userName}>
            <div className="collections-layout">
                <CollectionsSidebar
                    collections={collections}
                    tags={allTags}
                    onCreateCollection={handleCreateCollection}
                />

                <main className="collections-main">
                    <header className="collections-header">
                        <span className="collections-count">{prompts.length} items</span>
                    </header>

                    <div className="collections-content">
                        {isLoading ? (
                            <div className="loading-spinner">Loading...</div>
                        ) : prompts.length === 0 ? (
                            <EmptyState type="no-prompts" />
                        ) : (
                            <PromptList
                                prompts={prompts}
                                onCopy={copyPrompt}
                                onEdit={() => { }} // TODO: Connect edit
                                onDelete={() => { }} // TODO: Connect delete
                                onToggleFavorite={async (id) => {
                                    // Basic toggle for now, needs refresh
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
