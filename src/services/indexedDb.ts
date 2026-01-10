import type { Prompt, CreatePromptInput, UpdatePromptInput, Collection, CreateCollectionInput, UpdateCollectionInput } from '../types';
import { generateId, getCurrentTimestamp } from '../utils';

const DB_NAME = 'prompt-library';
const DB_VERSION = 5; // Incremented for collections store
const STORE_PROMPTS = 'prompts';
const STORE_USAGE = 'usage_logs';
const STORE_SETTINGS = 'user_settings';
const STORE_COLLECTIONS = 'collections';

export interface UsageLog {
    id: string;
    promptId: string;
    timestamp: string;
    action: 'copy' | 'duplicate' | 'use';
}

export interface UsageStats {
    usageCount: number;
    lastUsedAt: string | null;
    timelineData: { date: string; count: number }[]; // Last 30 days
}

class IndexedDBStorageService {
    private db: IDBDatabase | null = null;
    private initPromise: Promise<void> | null = null;
    private currentUserId: string = 'guest'; // Default to guest

    /**
     * Set the active user ID for scoping data.
     * Call this on login/logout.
     */
    setUserId(userId: string | null) {
        this.currentUserId = userId || 'guest';
        // We don't need to re-init DB, just change scope for queries
    }

    async init(): Promise<void> {
        if (this.db) return;
        if (this.initPromise) return this.initPromise;

        const initLogic = new Promise<void>((resolve) => {
            if (!window.indexedDB) {
                console.warn('IndexedDB not available');
                resolve();
                return;
            }

            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('Failed to open IndexedDB:', request.error);
                resolve();
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onblocked = () => {
                console.warn('IndexedDB blocked. Needs reload or closing other tabs.');
                // Don't hang forever on blocked
                setTimeout(() => resolve(), 2000);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const transaction = (event.target as IDBOpenDBRequest).transaction;

                // Create prompts store if needed
                if (!db.objectStoreNames.contains(STORE_PROMPTS)) {
                    const store = db.createObjectStore(STORE_PROMPTS, { keyPath: 'id' });
                    store.createIndex('updated_at', 'updated_at', { unique: false });
                    store.createIndex('favorite', 'favorite', { unique: false });
                    store.createIndex('user_id', 'user_id', { unique: false });
                    store.createIndex('collection_id', 'collection_id', { unique: false }); // New V5
                    store.createIndex('is_draft', 'is_draft', { unique: false }); // New V5
                } else {
                    // Upgrade existing store
                    const store = transaction!.objectStore(STORE_PROMPTS);
                    if (!store.indexNames.contains('user_id')) {
                        store.createIndex('user_id', 'user_id', { unique: false });
                        // Migrate existing data to 'guest'
                        store.openCursor().onsuccess = (e) => {
                            const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
                            if (cursor) {
                                const prompt = cursor.value;
                                if (!prompt.user_id) {
                                    prompt.user_id = 'guest';
                                    cursor.update(prompt);
                                }
                                cursor.continue();
                            }
                        };
                    }
                    // V5 Upgrades: Add indices for collections and drafts
                    if (!store.indexNames.contains('collection_id')) {
                        store.createIndex('collection_id', 'collection_id', { unique: false });
                    }
                    if (!store.indexNames.contains('is_draft')) {
                        store.createIndex('is_draft', 'is_draft', { unique: false });
                    }
                }

                // Create usage logs store if needed
                if (!db.objectStoreNames.contains(STORE_USAGE)) {
                    const store = db.createObjectStore(STORE_USAGE, { keyPath: 'id' });
                    store.createIndex('promptId', 'promptId', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // Create user settings store if needed
                if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
                    db.createObjectStore(STORE_SETTINGS, { keyPath: 'user_id' });
                }

                // Create collections store if needed (V5)
                if (!db.objectStoreNames.contains(STORE_COLLECTIONS)) {
                    const store = db.createObjectStore(STORE_COLLECTIONS, { keyPath: 'id' });
                    store.createIndex('user_id', 'user_id', { unique: false });
                    store.createIndex('parent_id', 'parent_id', { unique: false });
                }
            };
        });

        // 5-second timeout race to prevent infinite hanging
        const timeout = new Promise<void>((resolve) => {
            setTimeout(() => {
                console.warn('IndexedDB init timed out (5000ms). Proceeding without DB.');
                resolve();
            }, 5000);
        });

        this.initPromise = Promise.race([initLogic, timeout]);
        return this.initPromise;
    }

    async getAll(includeDeleted = false): Promise<Prompt[]> {
        await this.init();
        if (!this.db) return [];

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(STORE_PROMPTS, 'readonly');
            const store = transaction.objectStore(STORE_PROMPTS);

            // Use index to filter by user_id
            const index = store.index('user_id');
            const request = index.getAll(this.currentUserId);

            request.onsuccess = () => {
                let prompts = request.result as Prompt[];

                // Filter deleted unless requested
                if (!includeDeleted) {
                    prompts = prompts.filter(p => !p.deleted_at);
                }

                // Sort in memory as indexedDB can only sort by keyPath or index
                prompts.sort((a, b) =>
                    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                );
                resolve(prompts);
            };

            request.onerror = () => resolve([]);
        });
    }

    async getById(id: string): Promise<Prompt | null> {
        await this.init();
        if (!this.db) return null;

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(STORE_PROMPTS, 'readonly');
            const store = transaction.objectStore(STORE_PROMPTS);
            const request = store.get(id);

            request.onsuccess = () => {
                const prompt = request.result as Prompt;
                // Strict check: only return if matches current user and NOT deleted
                if (prompt && (prompt.user_id === this.currentUserId) && !prompt.deleted_at) {
                    resolve(prompt);
                } else {
                    resolve(null);
                }
            };
            request.onerror = () => resolve(null);
        });
    }

    async create(input: CreatePromptInput): Promise<Prompt> {
        await this.init();
        const now = getCurrentTimestamp();
        const prompt: Prompt = {
            ...input,
            id: generateId(),
            created_at: now,
            updated_at: now,
            deleted_at: null, // Initialize as active
            user_id: this.currentUserId, // Enforce current user
        };

        if (!this.db) return prompt;

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(STORE_PROMPTS, 'readwrite');
            const store = transaction.objectStore(STORE_PROMPTS);
            const request = store.add(prompt);
            request.onsuccess = () => resolve(prompt);
            request.onerror = () => resolve(prompt);
        });
    }

    async update(id: string, input: UpdatePromptInput): Promise<Prompt | null> {
        await this.init();
        if (!this.db) return null;

        const existing = await this.getById(id);
        if (!existing) return null; // Logic in getById handles user check

        const updated: Prompt = {
            ...existing,
            ...input,
            updated_at: getCurrentTimestamp(),
            user_id: this.currentUserId // Ensure user_id doesn't change
        };

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(STORE_PROMPTS, 'readwrite');
            const store = transaction.objectStore(STORE_PROMPTS);
            const request = store.put(updated);
            request.onsuccess = () => resolve(updated);
            request.onerror = () => resolve(null);
        });
    }

    async delete(id: string): Promise<boolean> {
        await this.init();
        if (!this.db) return false;

        const existing = await this.getById(id);
        if (!existing) return false; // Prevents deleting other user's prompts or already deleted ones

        // SOFT DELETE: Update deleted_at instead of removing
        const deletedPrompt: Prompt = {
            ...existing,
            deleted_at: getCurrentTimestamp(),
            updated_at: getCurrentTimestamp()
        };

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(STORE_PROMPTS, 'readwrite');
            const store = transaction.objectStore(STORE_PROMPTS);
            const request = store.put(deletedPrompt);
            request.onsuccess = () => resolve(true);
            request.onerror = () => resolve(false);
        });
    }

    async search(query: string): Promise<Prompt[]> {
        // getAll already filters by user and defaults to excluding deleted
        const prompts = await this.getAll();
        const q = query.toLowerCase().trim().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
        if (!q) return prompts;

        const scored = prompts.map(p => {
            let score = 0;
            const titleNorm = p.title.toLowerCase();
            const contentNorm = p.content.toLowerCase();
            if (titleNorm.includes(q)) score += 3;
            for (const tag of p.tags) {
                if (tag.toLowerCase().includes(q)) {
                    score += 2;
                    break;
                }
            }
            if (contentNorm.includes(q)) score += 1;
            return { prompt: p, score };
        });

        return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.prompt);
    }

    async recordUsage(promptId: string, action: 'copy' | 'duplicate' | 'use'): Promise<void> {
        await this.init();
        if (!this.db) return;

        // Verify ownership before recording? 
        // Usage is local, maybe less strict, but good practice.
        const existing = await this.getById(promptId);
        if (!existing) return;

        const log: UsageLog = {
            id: generateId(),
            promptId,
            timestamp: getCurrentTimestamp(),
            action,
        };

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(STORE_USAGE, 'readwrite');
            const store = transaction.objectStore(STORE_USAGE);
            store.add(log);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => resolve();
        });
    }

    async getUsageStats(promptId: string): Promise<UsageStats> {
        await this.init();
        if (!this.db) return { usageCount: 0, lastUsedAt: null, timelineData: [] };

        // Don't leak usage stats for other user's prompts
        const existing = await this.getById(promptId);
        if (!existing) return { usageCount: 0, lastUsedAt: null, timelineData: [] };

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(STORE_USAGE, 'readonly');
            const store = transaction.objectStore(STORE_USAGE);
            const index = store.index('promptId');
            const request = index.getAll(promptId);

            request.onsuccess = () => {
                const logs = request.result as UsageLog[];
                logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                const usageCount = logs.length;
                const lastUsedAt = logs.length > 0 ? logs[0].timestamp : null;
                const timelineData = this.calculateTimeline(logs, 30);
                resolve({ usageCount, lastUsedAt, timelineData });
            };

            request.onerror = () => resolve({ usageCount: 0, lastUsedAt: null, timelineData: [] });
        });
    }

    async getDb(): Promise<IDBDatabase | null> {
        await this.init();
        return this.db;
    }

    async deleteEverything(): Promise<void> {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(DB_NAME);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
            request.onblocked = () => resolve(); // Attempted, might need reload
        });
    }

    private calculateTimeline(logs: UsageLog[], days: number): { date: string; count: number }[] {
        const result: { date: string; count: number }[] = [];
        const today = new Date();
        const logsByDate = new Map<string, number>();
        for (const log of logs) {
            const date = log.timestamp.split('T')[0];
            logsByDate.set(date, (logsByDate.get(date) || 0) + 1);
        }
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            result.push({ date: dateStr, count: logsByDate.get(dateStr) || 0 });
        }
        return result;
    }

    // =========================================
    // Profile Picture Methods
    // =========================================

    async saveProfilePicture(dataUrl: string): Promise<void> {
        await this.init();
        if (!this.db) return;

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(STORE_SETTINGS, 'readwrite');
            const store = transaction.objectStore(STORE_SETTINGS);

            store.put({
                user_id: this.currentUserId,
                profile_picture: dataUrl,
                updated_at: getCurrentTimestamp()
            });

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => resolve();
        });
    }

    async getProfilePicture(): Promise<string | null> {
        await this.init();
        if (!this.db) return null;

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(STORE_SETTINGS, 'readonly');
            const store = transaction.objectStore(STORE_SETTINGS);
            const request = store.get(this.currentUserId);

            request.onsuccess = () => {
                const settings = request.result;
                resolve(settings?.profile_picture || null);
            };
            request.onerror = () => resolve(null);
        });
    }

    async deleteProfilePicture(): Promise<void> {
        await this.init();
        if (!this.db) return;

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(STORE_SETTINGS, 'readwrite');
            const store = transaction.objectStore(STORE_SETTINGS);
            const request = store.get(this.currentUserId);

            request.onsuccess = () => {
                const settings = request.result;
                if (settings) {
                    delete settings.profile_picture;
                    store.put(settings);
                }
            };

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => resolve();
        });
    }

    // =========================================
    // Collections Methods
    // =========================================

    async getCollections(): Promise<Collection[]> {
        await this.init();
        if (!this.db) return [];

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(STORE_COLLECTIONS, 'readonly');
            const store = transaction.objectStore(STORE_COLLECTIONS);
            const index = store.index('user_id');
            const request = index.getAll(this.currentUserId);

            request.onsuccess = () => {
                resolve(request.result as Collection[]);
            };
            request.onerror = () => resolve([]);
        });
    }

    async createCollection(input: CreateCollectionInput): Promise<Collection> {
        await this.init();
        const now = getCurrentTimestamp();
        const collection: Collection = {
            ...input,
            id: generateId(),
            created_at: now,
            user_id: this.currentUserId
        };

        if (!this.db) return collection;

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(STORE_COLLECTIONS, 'readwrite');
            const store = transaction.objectStore(STORE_COLLECTIONS);
            store.add(collection);
            transaction.oncomplete = () => resolve(collection);
            transaction.onerror = () => resolve(collection);
        });
    }

    async updateCollection(id: string, input: UpdateCollectionInput): Promise<Collection | null> {
        await this.init();
        if (!this.db) return null;

        // Verify existence and ownership
        return new Promise((resolve) => {
            const transaction = this.db!.transaction(STORE_COLLECTIONS, 'readwrite');
            const store = transaction.objectStore(STORE_COLLECTIONS);
            const request = store.get(id);

            request.onsuccess = () => {
                const existing = request.result as Collection;
                if (existing && existing.user_id === this.currentUserId) {
                    const updated: Collection = {
                        ...existing,
                        ...input
                    };
                    store.put(updated);
                    resolve(updated);
                } else {
                    resolve(null);
                }
            };
            request.onerror = () => resolve(null);
        });
    }

    async deleteCollection(id: string): Promise<boolean> {
        await this.init();
        if (!this.db) return false;

        return new Promise((resolve) => {
            const transaction = this.db!.transaction([STORE_COLLECTIONS, STORE_PROMPTS], 'readwrite');
            const colStore = transaction.objectStore(STORE_COLLECTIONS);
            const promptStore = transaction.objectStore(STORE_PROMPTS);

            // 1. Get collection to verify owner
            const getRequest = colStore.get(id);
            getRequest.onsuccess = () => {
                const existing = getRequest.result as Collection;
                if (!existing || existing.user_id !== this.currentUserId) {
                    resolve(false);
                    return;
                }

                // 2. Delete collection
                colStore.delete(id);

                // 3. Move prompts in this collection to root (remove collection_id)
                // Note: Index would be faster but requires opening cursor on index
                const promptCursorRequest = promptStore.index('collection_id').openCursor(IDBKeyRange.only(id));
                promptCursorRequest.onsuccess = (e) => {
                    const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
                    if (cursor) {
                        const prompt = cursor.value;
                        delete prompt.collection_id;
                        cursor.update(prompt);
                        cursor.continue();
                    }
                };

                // Also delete children collections? Or move them to root?
                // For "Move to Root/Unfiled is safest" design decision => Move children to root
                const childrenCursorRequest = colStore.index('parent_id').openCursor(IDBKeyRange.only(id));
                childrenCursorRequest.onsuccess = (e) => {
                    const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
                    if (cursor) {
                        const child = cursor.value;
                        delete child.parent_id;
                        cursor.update(child);
                        cursor.continue();
                    }
                };
            };

            transaction.oncomplete = () => resolve(true);
            transaction.onerror = () => resolve(false);
        });
    }
}


export const indexedDbService = new IndexedDBStorageService();
