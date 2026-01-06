import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { Prompt, CreatePromptInput } from './types';
import { SearchBar, PromptList, PromptEditor, AuthButton, EmptyState, FilterBar, ErrorBoundary } from './components';
import { type SortOption } from './components/FilterBar';
import { DashboardNav, IconSidebar } from './components/dashboard';
import { ProfileDashboard } from './pages/ProfileDashboard';
import { indexedDbService } from './services/indexedDb';
import { syncService } from './services/syncService';
import { useCopy, useDebounce, useKeyboardShortcuts, useAuth } from './hooks';
import './App.css';

function PromptLibrary() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 150);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Sorting & Filtering State
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const searchInputRef = useRef<HTMLInputElement>(null);
  const { copiedId, copyPrompt } = useCopy();

  const userName = user?.email?.split('@')[0] || 'Guest';

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onFocusSearch: () => searchInputRef.current?.focus(),
    onCreateNew: () => setIsCreating(true),
    onEscape: () => {
      setEditingPrompt(null);
      setIsCreating(false);
      setSelectedIds(new Set());
      searchInputRef.current?.blur();
    },
  });

  // Handle Tag Selection
  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedTags(new Set());
    setSortOption('recent');
    setSearchQuery(''); // Optional: clear search too? Maybe just filters.
  }, []);

  const refreshPrompts = useCallback(async () => {
    const data = await indexedDbService.getAll();
    setPrompts(data);
  }, []);

  // Initialize and load prompts from IndexedDB on mount and when user changes
  useEffect(() => {
    const loadPrompts = async () => {
      setIsLoading(true);
      const data = await indexedDbService.getAll();
      setPrompts(data);
      setIsLoading(false);
    };
    loadPrompts();
  }, [user?.id]);

  // Subscribe to background sync updates to refresh UI
  useEffect(() => {
    // track last sync time to avoid redundant refreshes
    let lastSyncTime = syncService.getStatus().lastSyncAt;

    const unsubscribe = syncService.subscribe((status) => {
      if (status.lastSyncAt && status.lastSyncAt !== lastSyncTime) {
        lastSyncTime = status.lastSyncAt;
        refreshPrompts();
      }
    });

    return unsubscribe;
  }, [refreshPrompts]);

  // Filter prompts based on debounced search query
  useEffect(() => {
    const doSearch = async () => {
      if (debouncedQuery) {
        const results = await indexedDbService.search(debouncedQuery);
        setPrompts(results);
      } else {
        const all = await indexedDbService.getAll();
        setPrompts(all);
      }
    };
    doSearch();
  }, [debouncedQuery]);

  // Calculate available tags from all prompts
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    prompts.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [prompts]);

  // Filter & Sort Prompts
  const sortedPrompts = useMemo(() => {
    let result = [...prompts];

    // 1. Filter by Tags
    if (selectedTags.size > 0) {
      result = result.filter(p => (p.tags || []).some(t => selectedTags.has(t)));
    }

    // 2. Sort
    return result.sort((a, b) => {
      // Always keep favorites on top (preserving existing behavior)
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;

      switch (sortOption) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'usage':
          // Placeholder for usage count sort, fallback to recent
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'recent':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
  }, [prompts, selectedTags, sortOption]);

  const handleCreate = useCallback(async (data: CreatePromptInput) => {
    await indexedDbService.create(data);
    await refreshPrompts();
    setIsCreating(false);
  }, [refreshPrompts]);

  const handleUpdate = useCallback(async (data: CreatePromptInput) => {
    if (editingPrompt) {
      await indexedDbService.update(editingPrompt.id, data);
      await refreshPrompts();
      setEditingPrompt(null);
    }
  }, [editingPrompt, refreshPrompts]);

  const handleDelete = useCallback(async (id: string) => {
    await indexedDbService.delete(id);
    await refreshPrompts();
  }, [refreshPrompts]);

  const handleToggleFavorite = useCallback(async (id: string) => {
    const prompt = await indexedDbService.getById(id);
    if (prompt) {
      await indexedDbService.update(id, { favorite: !prompt.favorite });
      await refreshPrompts();
    }
  }, [refreshPrompts]);

  const handleCancelEdit = useCallback(() => {
    setEditingPrompt(null);
    setIsCreating(false);
  }, []);

  // Bulk selection handlers
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleBulkCopy = useCallback(async () => {
    const selected = prompts.filter(p => selectedIds.has(p.id));
    const text = selected.map(p => `## ${p.title}\n\n${p.content}`).join('\n\n---\n\n');
    await navigator.clipboard.writeText(text);
    setSelectedIds(new Set());
  }, [prompts, selectedIds]);

  const handleBulkDelete = useCallback(async () => {
    for (const id of selectedIds) {
      await indexedDbService.delete(id);
    }
    await refreshPrompts();
    setSelectedIds(new Set());
  }, [selectedIds, refreshPrompts]);

  const showEditor = isCreating || editingPrompt !== null;
  const hasSelection = selectedIds.size > 0;

  if (isLoading) {
    return (
      <div className="prompt-library">
        <DashboardNav
          userName={userName}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="prompt-library__loading">
          <div className="prompt-library__spinner"></div>
          <span>Loading prompts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="prompt-library">
      <DashboardNav
        userName={userName}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="prompt-library__layout">
        <IconSidebar />

        <main className="prompt-library__main">
          <div className="prompt-library__header">
            <div className="prompt-library__title-row">
              <h1 className="prompt-library__title">My Prompts</h1>
              <span className="prompt-library__count">{prompts.length} prompts</span>
            </div>
            {/* SearchBar removed - moved to DashboardNav */}
          </div>

          <FilterBar
            sortOption={sortOption}
            onSortChange={setSortOption}
            availableTags={availableTags}
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
            onClearFilters={handleClearFilters}
            totalCount={prompts.length}
            shownCount={sortedPrompts.length}
          />

          {hasSelection && (
            <div className="prompt-library__bulk-actions">
              <span className="prompt-library__bulk-count">{selectedIds.size} selected</span>
              <button className="prompt-library__bulk-btn" onClick={handleBulkCopy}>
                Copy All
              </button>
              <button className="prompt-library__bulk-btn prompt-library__bulk-btn--danger" onClick={handleBulkDelete}>
                Delete
              </button>
              <button className="prompt-library__bulk-btn" onClick={() => setSelectedIds(new Set())}>
                Cancel
              </button>
            </div>
          )}

          {showEditor && (
            <div className="prompt-library__editor">
              <PromptEditor
                prompt={editingPrompt}
                onSave={editingPrompt ? handleUpdate : handleCreate}
                onCancel={handleCancelEdit}
                autoFocusTitle={isCreating}
              />
            </div>
          )}

          <div className="prompt-library__list">
            {sortedPrompts.length === 0 ? (
              <EmptyState
                type={debouncedQuery ? 'no-results' : 'no-prompts'}
                onAction={debouncedQuery ? undefined : () => setIsCreating(true)}
              />
            ) : (
              <PromptList
                prompts={sortedPrompts}
                onCopy={copyPrompt}
                onEdit={setEditingPrompt}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                copiedId={copiedId}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
              />
            )}
          </div>
        </main>
      </div>
    </div >
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <ErrorBoundary>
          <PromptLibrary />
        </ErrorBoundary>
      } />
      <Route path="/profile" element={<ProfileDashboard />} />
    </Routes>
  );
}

export default App;
