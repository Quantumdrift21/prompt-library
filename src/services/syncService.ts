import { supabase, isSupabaseConfigured } from './supabase';
import { indexedDbService } from './indexedDb';
import { authService } from './authService';
import { DEFAULT_PROMPTS } from './defaultPrompts';
import type { Prompt } from '../types';

interface SyncStatus {
    lastSyncAt: string | null;
    isSyncing: boolean;
    error: string | null;
}

class SyncService {
    private status: SyncStatus = {
        lastSyncAt: null,
        isSyncing: false,
        error: null,
    };
    private listeners: Set<(status: SyncStatus) => void> = new Set();
    private syncInterval: number | null = null;
    private userId: string | null = null;

    constructor() {
        // Init guest seeding immediately
        this.checkAndSeedDefaults('guest');

        // Listen for auth changes to switch DB context & Migrate
        authService.subscribe(async (authState) => {
            const newUserId = authState.user?.id || null;

            // Handle Migration Logic when switching from Guest -> User
            if (this.userId === null && newUserId) {
                await this.migrateGuestToUser(newUserId);
            }

            if (this.userId !== newUserId) {
                this.userId = newUserId;
                indexedDbService.setUserId(newUserId);

                // If logged out, stop sync but check seeding for guest
                if (!newUserId) {
                    this.stopBackgroundSync();
                    this.checkAndSeedDefaults('guest');
                } else {
                    // If logged in, start sync and potentially seed
                    this.startBackgroundSync();
                }
            }
        });
    }

    startBackgroundSync(intervalMs: number = 30 * 1000) {
        if (this.syncInterval) return;

        // Initial sync + Seed check
        // Note: Seeding is async, don't await block
        this.sync().then(() => {
            if (this.userId) this.checkAndSeedDefaults(this.userId);
        });

        this.syncInterval = window.setInterval(() => {
            if (authService.isAuthenticated()) {
                this.sync();
            }
        }, intervalMs);

        window.addEventListener('online', () => {
            if (authService.isAuthenticated()) {
                this.sync();
            }
        });
    }

    stopBackgroundSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    subscribe(listener: (status: SyncStatus) => void): () => void {
        this.listeners.add(listener);
        listener(this.status);
        return () => this.listeners.delete(listener);
    }

    getStatus(): SyncStatus {
        return this.status;
    }

    private updateStatus(partial: Partial<SyncStatus>) {
        this.status = { ...this.status, ...partial };
        this.listeners.forEach(l => l(this.status));
    }

    /**
     * Migrate guest prompts to the new user.
     * Strategy: Find all prompts with user_id='guest' and update them to newUserId.
     * Only migrates if there are actual guest prompts to migrate.
     */
    private async migrateGuestToUser(newUserId: string) {
        // 1. Temporarily switch to guest scope to get prompts
        indexedDbService.setUserId('guest');
        const guestPrompts = await indexedDbService.getAll();

        // Only migrate if there are actual guest prompts
        if (guestPrompts.length === 0) {
            indexedDbService.setUserId(newUserId); // Restore to new user
            return;
        }

        console.log(`Migrating ${guestPrompts.length} guest prompts to user ${newUserId}`);

        // 2. Switch to User Scope for migration
        indexedDbService.setUserId(newUserId);

        for (const prompt of guestPrompts) {
            await this.forceUpdatePromptUserId(prompt, newUserId);
        }
    }

    private async forceUpdatePromptUserId(prompt: Prompt, newUserId: string) {
        const db = await this.getDb();
        if (!db) return;

        const tx = db.transaction('prompts', 'readwrite');
        const store = tx.objectStore('prompts');

        // 1. Delete old guest record?
        // Actually, if we just put new one, it overwrites if ID matches.
        // BUT `getAll` filters by user_id. The physical record is one row.
        // So just updating user_id is enough.

        const updated = { ...prompt, user_id: newUserId, updated_at: new Date().toISOString() };
        store.put(updated);

        return new Promise<void>((resolve) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
        });
    }

    /**
     * Seed default prompts if user has not been seeded yet.
     * Uses user_metadata (auth) or localStorage (guest) to track this state persistently.
     * Rationale: Users who delete all prompts should NOT get defaults back.
     */
    private async checkAndSeedDefaults(targetUserId: string) {
        if (!targetUserId) return;

        let hasSeeded = false;

        // 1. Check Flag
        if (targetUserId === 'guest') {
            hasSeeded = localStorage.getItem('guest_has_seeded_defaults') === 'true';
        } else if (supabase) {
            // Check auth user metadata
            const { data: { user } } = await supabase.auth.getUser();
            if (user && user.id === targetUserId) {
                hasSeeded = !!user.user_metadata?.has_seeded_defaults;
            } else {
                // Determine if we should treat a fresh session as potentially seeded?
                // If we can't fetch user, we probably shouldn't seed blindly.
                // But generally syncService runs when we HAVE a user.
                // If user object isn't fresh, trust authService state or fetch it.
                // The most reliable source is the session user.
                const currentUser = authService.getState().user;
                if (currentUser && currentUser.id === targetUserId) {
                    hasSeeded = !!currentUser.user_metadata?.has_seeded_defaults;
                }
            }
        }

        if (hasSeeded) {
            console.log(`[Sync] Defaults already seeded for ${targetUserId}. Skipping.`);
            return;
        }

        console.log(`[Sync] Seeding default prompts for ${targetUserId}...`);

        // 2. Perform Seeding (Local + Cloud)
        const db = await this.getDb();
        if (!db) return;

        const tx = db.transaction('prompts', 'readwrite');
        const store = tx.objectStore('prompts');

        for (const prompt of DEFAULT_PROMPTS) {
            const promptWithUser = { ...prompt, user_id: targetUserId };

            // Check existence to prevent duplicate ID errors if partially seeded before
            // Actually, `add` fails if key exists, `put` overwrites. 
            // We want to be safe. If ID acts as key, `put` is safer.
            store.put(promptWithUser);

            // Push to cloud immediately if real user
            if (targetUserId !== 'guest' && supabase) {
                supabase.from('prompts').upsert({ ...promptWithUser }).then();
            }
        }

        // 3. Set Flag (Persist State)
        if (targetUserId === 'guest') {
            localStorage.setItem('guest_has_seeded_defaults', 'true');
        } else if (supabase) {
            await supabase.auth.updateUser({
                data: { has_seeded_defaults: true }
            });
        }

        // Trigger UI update
        this.updateStatus({ lastSyncAt: new Date().toISOString() });
    }

    async sync(): Promise<void> {
        if (!isSupabaseConfigured() || !supabase) return;
        if (!this.userId) return; // Strict check
        if (this.status.isSyncing) return;

        this.updateStatus({ isSyncing: true, error: null });

        try {
            // INCREMENTAL SYNC LOGIC
            const lastSyncTime = this.status.lastSyncAt;

            // Step 1: Download from cloud (Deltas only)
            let query = supabase
                .from('prompts')
                .select('*')
                .eq('user_id', this.userId);

            // If we have synced before, only get what changed since then
            if (lastSyncTime) {
                // Add a small buffer (e.g. 1s) to handle clock skew or long transactions
                // But generally safe to just query > lastSyncTime
                query = query.gt('updated_at', lastSyncTime);
            }

            const { data: cloudPrompts, error: fetchError } = await query;

            if (fetchError) throw fetchError;

            // Optional: If no changes from cloud and no local changes (tracked elsewhere?), can skip merge
            // For now, we continue to merge to ensure local push happens if needed.
            // Note: Optimizing the Push side (local->cloud) effectively requires tracking "dirty" state locally.
            // Currently we push ALL local prompts that are missing or newer. 
            // Phase 2 optimization: Only push dirty records.
            // For this phase, we accept the push cost or optimize `mergePrompts` to be smarter.

            // Step 2: Get local prompts
            // PERFORMANCE: getAll(true) is still heavy for 50k records.
            // However, we cannot easily filter local by "updated > lastSync" unless we track a separate "localLastSync".
            // For now, we stick to getAll(true) but we MUST optimize mergePrompts to not loop O(N^2) if possible.
            // actually mergePrompts is O(N) because of Map lookup. 
            // The bottleneck is just LOADING 50k items from IDB.
            // We will fix IDB loading in a separate step if strictly required, but Cloud fetch was the P0 risk.
            const localPrompts = await indexedDbService.getAll(true);

            // Step 3: Merge
            // If cloud returns 0 items (steady state), this is fast.
            await this.mergePrompts(localPrompts, cloudPrompts || [], this.userId);

            this.updateStatus({
                isSyncing: false,
                lastSyncAt: new Date().toISOString(),
            });
        } catch (error) {
            console.warn('Sync failed:', error);
            this.updateStatus({
                isSyncing: false,
                error: error instanceof Error ? error.message : 'Sync failed',
            });
        }
    }

    private async mergePrompts(
        localPrompts: Prompt[],
        cloudPrompts: Prompt[],
        userId: string
    ): Promise<void> {
        if (!supabase) return;

        const localById = new Map(localPrompts.map(p => [p.id, p]));
        const cloudById = new Map(cloudPrompts.map(p => [p.id, p]));
        const toUpload: Prompt[] = [];
        const toDownload: Prompt[] = [];

        // Check local
        for (const local of localPrompts) {
            const cloud = cloudById.get(local.id);
            if (!cloud) {
                toUpload.push(local);
            } else {
                // Conflict Resolution with "Deletion Wins" rule
                if (cloud.deleted_at && !local.deleted_at) {
                    // Cloud has deleted it, local is active -> Apply deletion deeply
                    toDownload.push(cloud);
                } else if (local.deleted_at && !cloud.deleted_at) {
                    // Local has deleted it, cloud is active -> Push deletion
                    toUpload.push(local);
                } else if (cloud.deleted_at && local.deleted_at) {
                    // Both deleted -> No-op (consistent)
                } else {
                    // Both active -> Timestamp wins
                    const localTime = new Date(local.updated_at).getTime();
                    const cloudTime = new Date(cloud.updated_at).getTime();
                    if (localTime > cloudTime) {
                        toUpload.push(local);
                    } else if (cloudTime > localTime) {
                        toDownload.push(cloud);
                    }
                }
            }
        }

        // Check cloud-only
        for (const cloud of cloudPrompts) {
            if (!localById.has(cloud.id)) {
                // Only download valid, active prompts from cloud to avoid cluttering local DB with old deletions
                // (Unless specifically debugging, but user rule "Do NOT resurrect" implies we focus on active state)
                if (!cloud.deleted_at) {
                    toDownload.push(cloud);
                }
            }
        }

        // Download
        for (const prompt of toDownload) {
            // Ensure we only download prompts for this user
            if (prompt.user_id !== userId) continue;

            // Use low-level put to avoid context checks if running largely async
            const db = await this.getDb();
            if (db) {
                const tx = db.transaction('prompts', 'readwrite');
                tx.objectStore('prompts').put(prompt); // prompt already has user_id from cloud
            }
        }

        // Upload
        for (const prompt of toUpload) {
            // Ensure we only upload items that match current user (sanity check)
            if (prompt.user_id !== userId && prompt.user_id !== 'guest') continue;

            // Optimistic update
            await supabase.from('prompts').upsert({
                id: prompt.id,
                user_id: userId,
                title: prompt.title,
                content: prompt.content,
                tags: prompt.tags,
                favorite: prompt.favorite,
                created_at: prompt.created_at,
                updated_at: prompt.updated_at,
                deleted_at: prompt.deleted_at
            });
        }
    }

    private async getDb(): Promise<IDBDatabase | null> {
        return indexedDbService.getDb();
    }
}

export const syncService = new SyncService();
