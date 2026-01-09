import { useState, useCallback, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { Prompt, CreatePromptInput } from './types';
import { PromptList, PromptEditor, EmptyState, ErrorBoundary } from './components';
import { HeroSection } from './components/HeroSection';
import { DashboardNav } from './components/dashboard';
import { ProfileDashboard } from './pages/ProfileDashboard';
import { Collections } from './pages/Collections';
import { Analytics } from './pages/Analytics';
import SettingsPage from './pages/SettingsPage';
import { LandingPage } from './pages/LandingPage';
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

  const userName = user?.email?.split('@')[0] || 'Guest';
  const { copiedId, copyPrompt } = useCopy();

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onFocusSearch: () => { },
    onCreateNew: () => setIsCreating(true),
    onEscape: () => {
      setEditingPrompt(null);
      setIsCreating(false);
      setSelectedIds(new Set());
    },
  });

  const refreshPrompts = useCallback(async () => {
    const data = await indexedDbService.getAll();
    setPrompts(data);
  }, []);

  useEffect(() => {
    const loadPrompts = async () => {
      setIsLoading(true);
      const data = await indexedDbService.getAll();
      setPrompts(data);
      setIsLoading(false);
    };
    loadPrompts();
  }, [user?.id]);

  useEffect(() => {
    let lastSyncTime = syncService.getStatus().lastSyncAt;
    const unsubscribe = syncService.subscribe((status) => {
      if (status.lastSyncAt && status.lastSyncAt !== lastSyncTime) {
        lastSyncTime = status.lastSyncAt;
        refreshPrompts();
      }
    });
    return unsubscribe;
  }, [refreshPrompts]);

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

  const sortedPrompts = useMemo(() => {
    return [...prompts].sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [prompts]);

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

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
      <div className="app-container">
        <DashboardNav userName={userName} />
        <div className="prompt-library__loading">
          <div className="prompt-library__spinner"></div>
          <span>Loading prompts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <DashboardNav userName={userName} />

      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="main-content">
        <section className="category-section">
          <h2 className="section-title">CATEGORY</h2>

          {hasSelection && (
            <div className="bulk-actions">
              <span className="bulk-actions__count">{selectedIds.size} selected</span>
              <button className="btn-secondary" onClick={handleBulkCopy}>Copy All</button>
              <button className="btn-secondary btn-secondary--danger" onClick={handleBulkDelete}>Delete</button>
              <button className="btn-secondary" onClick={() => setSelectedIds(new Set())}>Cancel</button>
            </div>
          )}

          {showEditor && (
            <div className="editor-container">
              <PromptEditor
                prompt={editingPrompt}
                onSave={editingPrompt ? handleUpdate : handleCreate}
                onCancel={handleCancelEdit}
                autoFocusTitle={isCreating}
              />
            </div>
          )}

          <div className="prompts-grid">
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
        </section>

        {/* Submit Your Prompt Section */}
        <section className="submit-section">
          <div className="submit-section__content">
            <h2 className="section-title">SUBMIT YOUR PROMPT</h2>
            <button className="btn-primary" onClick={() => setIsCreating(true)}>
              SHARE YOUR IDEA
            </button>
          </div>
        </section>
      </main>
    </div>
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
      <Route path="/collections" element={<Collections />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default App;
