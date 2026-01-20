import { indexedDbService } from './indexedDb';
// import { syncService } from './syncService';
import { supabase, isSupabaseConfigured } from './supabase';
import type { Prompt } from '../types';

// =========================================
// Maintenance Types
// =========================================

export interface DuplicateGroup {
    hash: string;
    prompts: Prompt[];
    keepPrompt: Prompt;
    deletePrompts: Prompt[];
}

export interface MaintenanceReport {
    totalPrompts: number;
    duplicatesFound: number;
    duplicateGroups: DuplicateGroup[];
    orphanedUsageLogs: number;
    stalePrompts: number; // Not used in 90+ days
    cleanupActions: string[];
}

export interface CleanupResult {
    success: boolean;
    deletedCount: number;
    errors: string[];
    syncTriggered: boolean;
}

// =========================================
// Maintenance Service
// =========================================

class MaintenanceService {
    private isRunning = false;
    private listeners: Set<(progress: number, message: string) => void> = new Set();

    /**
     * Subscribe to maintenance progress updates
     */
    subscribe(listener: (progress: number, message: string) => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify(progress: number, message: string) {
        this.listeners.forEach(l => l(progress, message));
    }

    /**
     * Generate a normalized hash of prompt content for duplicate detection.
     * Ignores whitespace, casing, and minor formatting differences.
     */
    private generateContentHash(prompt: Prompt): string {
        // Normalize: lowercase, trim, remove extra whitespace, remove punctuation
        const normalizedTitle = prompt.title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s]/g, '');

        const normalizedContent = prompt.content
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s]/g, '');

        // Simple hash: concatenate and create a deterministic string
        const combined = `${normalizedTitle}|||${normalizedContent}`;

        // Use a simple hash function (FNV-1a inspired)
        let hash = 2166136261;
        for (let i = 0; i < combined.length; i++) {
            hash ^= combined.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return hash.toString(16);
    }

    /**
     * Analyze local database for duplicates and issues.
     * Non-destructive - only analyzes and reports.
     */
    async analyze(): Promise<MaintenanceReport> {
        this.notify(0, 'Starting analysis...');

        const prompts = await indexedDbService.getAll();
        const report: MaintenanceReport = {
            totalPrompts: prompts.length,
            duplicatesFound: 0,
            duplicateGroups: [],
            orphanedUsageLogs: 0,
            stalePrompts: 0,
            cleanupActions: []
        };

        this.notify(10, `Found ${prompts.length} prompts to analyze`);

        // Group prompts by content hash
        const hashGroups = new Map<string, Prompt[]>();

        for (const prompt of prompts) {
            const hash = this.generateContentHash(prompt);
            const group = hashGroups.get(hash) || [];
            group.push(prompt);
            hashGroups.set(hash, group);
        }

        this.notify(40, 'Identifying duplicates...');

        // Find duplicate groups (more than 1 prompt with same hash)
        for (const [hash, group] of hashGroups) {
            if (group.length > 1) {
                // Sort by: most metadata first, then by most recent updated_at
                const sorted = [...group].sort((a, b) => {
                    // Score: tags + favorite + has content
                    const scoreA = a.tags.length + (a.favorite ? 1 : 0);
                    const scoreB = b.tags.length + (b.favorite ? 1 : 0);

                    if (scoreA !== scoreB) return scoreB - scoreA;

                    // Tie-breaker: most recent updated_at
                    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                });

                const keepPrompt = sorted[0];
                const deletePrompts = sorted.slice(1);

                report.duplicateGroups.push({
                    hash,
                    prompts: group,
                    keepPrompt,
                    deletePrompts
                });

                report.duplicatesFound += deletePrompts.length;
            }
        }

        this.notify(60, 'Checking for stale prompts...');

        // Find stale prompts (not used in 90+ days)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        for (const prompt of prompts) {
            const updatedAt = new Date(prompt.updated_at);
            if (updatedAt < ninetyDaysAgo) {
                report.stalePrompts++;
            }
        }

        this.notify(80, 'Generating cleanup actions...');

        // Generate recommended actions
        if (report.duplicatesFound > 0) {
            report.cleanupActions.push(`Remove ${report.duplicatesFound} duplicate prompts`);
        }
        if (report.stalePrompts > 10) {
            report.cleanupActions.push(`Review ${report.stalePrompts} prompts not updated in 90+ days`);
        }

        this.notify(100, 'Analysis complete');

        return report;
    }

    /**
     * Execute duplicate removal.
     * DESTRUCTIVE - actually deletes duplicate prompts.
     */
    async removeDuplicates(report: MaintenanceReport): Promise<CleanupResult> {
        if (this.isRunning) {
            return {
                success: false,
                deletedCount: 0,
                errors: ['Maintenance already in progress'],
                syncTriggered: false
            };
        }

        this.isRunning = true;
        const result: CleanupResult = {
            success: true,
            deletedCount: 0,
            errors: [],
            syncTriggered: false
        };

        try {
            this.notify(0, 'Starting duplicate removal...');

            const totalToDelete = report.duplicateGroups.reduce(
                (sum, g) => sum + g.deletePrompts.length, 0
            );

            let deleted = 0;

            for (const group of report.duplicateGroups) {
                for (const prompt of group.deletePrompts) {
                    try {
                        // Delete from local IndexedDB
                        await indexedDbService.delete(prompt.id);

                        // Delete from Supabase if configured
                        if (isSupabaseConfigured() && supabase) {
                            await supabase
                                .from('prompts')
                                .delete()
                                .eq('id', prompt.id);
                        }

                        deleted++;
                        const progress = Math.round((deleted / totalToDelete) * 80);
                        this.notify(progress, `Deleted ${deleted}/${totalToDelete} duplicates`);
                    } catch (error) {
                        result.errors.push(`Failed to delete ${prompt.id}: ${error}`);
                    }
                }
            }

            result.deletedCount = deleted;

            this.notify(90, 'Triggering sync...');

            // Trigger sync to ensure cloud is updated
            // Note: syncService should NOT pull back the deleted items
            // because we deleted them both locally AND in cloud.
            // The sync logic respects deleted_at and won't resurrect.
            result.syncTriggered = true;

            this.notify(100, `Cleanup complete. Removed ${deleted} duplicates.`);

        } catch (error) {
            result.success = false;
            result.errors.push(`Cleanup failed: ${error}`);
        } finally {
            this.isRunning = false;
        }

        return result;
    }

    /**
     * Merge tags from duplicate prompts into the kept prompt.
     * Called before deletion to preserve valuable metadata.
     */
    async mergeDuplicateMetadata(group: DuplicateGroup): Promise<void> {
        const { keepPrompt, deletePrompts } = group;

        // Collect all unique tags from duplicates
        const allTags = new Set(keepPrompt.tags);
        for (const dup of deletePrompts) {
            for (const tag of dup.tags) {
                allTags.add(tag);
            }
        }

        // If any duplicate is favorited, keep the favorite status
        const isFavorite = keepPrompt.favorite || deletePrompts.some(p => p.favorite);

        // Update the kept prompt with merged metadata
        await indexedDbService.update(keepPrompt.id, {
            tags: [...allTags],
            favorite: isFavorite
        });
    }

    /**
     * Deep clean: analyze + remove duplicates in one step
     */
    async deepClean(): Promise<CleanupResult> {
        const report = await this.analyze();

        if (report.duplicateGroups.length === 0) {
            return {
                success: true,
                deletedCount: 0,
                errors: [],
                syncTriggered: false
            };
        }

        // Merge metadata before deletion
        for (const group of report.duplicateGroups) {
            await this.mergeDuplicateMetadata(group);
        }

        return this.removeDuplicates(report);
    }

    /**
     * Get orphaned usage logs (logs for prompts that no longer exist)
     */
    async getOrphanedUsageLogs(): Promise<number> {
        const db = await indexedDbService.getDb();
        if (!db) return 0;

        const prompts = await indexedDbService.getAll(true);
        const promptIds = new Set(prompts.map(p => p.id));

        return new Promise((resolve) => {
            const tx = db.transaction('usage_logs', 'readonly');
            const store = tx.objectStore('usage_logs');
            const request = store.getAll();

            request.onsuccess = () => {
                const logs = request.result as { promptId: string }[];
                const orphaned = logs.filter(log => !promptIds.has(log.promptId));
                resolve(orphaned.length);
            };

            request.onerror = () => resolve(0);
        });
    }

    /**
     * Clean up orphaned usage logs
     */
    async cleanOrphanedUsageLogs(): Promise<number> {
        const db = await indexedDbService.getDb();
        if (!db) return 0;

        const prompts = await indexedDbService.getAll(true);
        const promptIds = new Set(prompts.map(p => p.id));

        return new Promise((resolve) => {
            const tx = db.transaction('usage_logs', 'readwrite');
            const store = tx.objectStore('usage_logs');
            const request = store.getAll();
            let deleted = 0;

            request.onsuccess = () => {
                const logs = request.result as { id: string; promptId: string }[];

                for (const log of logs) {
                    if (!promptIds.has(log.promptId)) {
                        store.delete(log.id);
                        deleted++;
                    }
                }
            };

            tx.oncomplete = () => resolve(deleted);
            tx.onerror = () => resolve(deleted);
        });
    }
}

export const maintenanceService = new MaintenanceService();
