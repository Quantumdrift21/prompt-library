import { indexedDbService } from './indexedDb';
// import type { Prompt } from '../types';

// =========================================
// Analytics Types
// =========================================

export interface AnalyticsOverview {
    totalPrompts: number;
    totalUses: number;
    activeItems: number;      // Used in last 7 days
    inactiveItems: number;    // Not used in 30 days
    favoritesCount: number;
    draftsCount: number;
    archivedCount: number;
}

export interface UsageTrendPoint {
    date: string;
    label: string;
    count: number;
}

export interface ItemPerformance {
    id: string;
    title: string;
    usageCount: number;
    lastUsedAt: string | null;
    tags: string[];
}

export interface TagInsight {
    tag: string;
    usageCount: number;
    promptCount: number;
    lastUsedAt: string | null;
}

export interface CollectionInsight {
    id: string;
    name: string;
    itemCount: number;
    totalUsage: number;
    avgUsagePerItem: number;
    lastActivityAt: string | null;
}

export interface SmartInsight {
    id: string;
    type: 'warning' | 'info' | 'success';
    icon: string;
    title: string;
    description: string;
}

export interface DraftInsight {
    totalDrafts: number;
    oldDrafts: ItemPerformance[];  // > 7 days old
}

export interface ArchiveInsight {
    archivedCount: number;
    eligibleForCleanup: ItemPerformance[];  // Unused > 90 days
}

export type DateRange = '7d' | '30d' | '90d';

// =========================================
// Analytics Service
// =========================================

class AnalyticsService {
    private usageCache: Map<string, number> = new Map();
    private lastUsedCache: Map<string, string> = new Map();
    private cacheTimestamp: number = 0;
    private readonly CACHE_TTL = 60000; // 1 minute

    /**
     * Refresh usage cache from IndexedDB
     */
    private async refreshUsageCache(): Promise<void> {
        const now = Date.now();
        if (now - this.cacheTimestamp < this.CACHE_TTL) return;

        const db = await indexedDbService.getDb();
        if (!db) return;

        return new Promise((resolve) => {
            const transaction = db.transaction('usage_logs', 'readonly');
            const store = transaction.objectStore('usage_logs');
            const request = store.getAll();

            request.onsuccess = () => {
                const logs = request.result as { promptId: string; timestamp: string }[];
                this.usageCache.clear();
                this.lastUsedCache.clear();

                for (const log of logs) {
                    const current = this.usageCache.get(log.promptId) || 0;
                    this.usageCache.set(log.promptId, current + 1);

                    const existing = this.lastUsedCache.get(log.promptId);
                    if (!existing || log.timestamp > existing) {
                        this.lastUsedCache.set(log.promptId, log.timestamp);
                    }
                }
                this.cacheTimestamp = now;
                resolve();
            };

            request.onerror = () => resolve();
        });
    }

    /**
     * Get overview analytics
     */
    async getOverview(): Promise<AnalyticsOverview> {
        await this.refreshUsageCache();
        const allPrompts = await indexedDbService.getAll(true); // Include deleted

        const activePrompts = allPrompts.filter(p => !p.deleted_at);
        const archivedPrompts = allPrompts.filter(p => p.deleted_at);

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        let activeItems = 0;
        let inactiveItems = 0;
        let totalUses = 0;

        for (const prompt of activePrompts) {
            const usage = this.usageCache.get(prompt.id) || 0;
            const lastUsed = this.lastUsedCache.get(prompt.id);
            totalUses += usage;

            if (lastUsed) {
                const lastUsedDate = new Date(lastUsed);
                if (lastUsedDate >= sevenDaysAgo) {
                    activeItems++;
                } else if (lastUsedDate < thirtyDaysAgo) {
                    inactiveItems++;
                }
            } else {
                // Never used = inactive
                inactiveItems++;
            }
        }

        return {
            totalPrompts: activePrompts.length,
            totalUses,
            activeItems,
            inactiveItems,
            favoritesCount: activePrompts.filter(p => p.favorite).length,
            draftsCount: activePrompts.filter(p => p.is_draft).length,
            archivedCount: archivedPrompts.length
        };
    }

    /**
     * Get usage trends over time
     */
    async getUsageTrends(range: DateRange): Promise<UsageTrendPoint[]> {
        const db = await indexedDbService.getDb();
        if (!db) return [];

        const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
        const now = new Date();
        const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        return new Promise((resolve) => {
            const transaction = db.transaction('usage_logs', 'readonly');
            const store = transaction.objectStore('usage_logs');
            const request = store.getAll();

            request.onsuccess = () => {
                const logs = request.result as { timestamp: string }[];
                const countsByDate = new Map<string, number>();

                // Initialize all dates with 0
                for (let i = 0; i < days; i++) {
                    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
                    const dateStr = date.toISOString().split('T')[0];
                    countsByDate.set(dateStr, 0);
                }

                // Count logs by date
                for (const log of logs) {
                    const dateStr = log.timestamp.split('T')[0];
                    if (countsByDate.has(dateStr)) {
                        countsByDate.set(dateStr, (countsByDate.get(dateStr) || 0) + 1);
                    }
                }

                // Convert to array
                const result: UsageTrendPoint[] = [];
                const sortedDates = [...countsByDate.keys()].sort();

                for (const dateStr of sortedDates) {
                    const date = new Date(dateStr);
                    result.push({
                        date: dateStr,
                        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        count: countsByDate.get(dateStr) || 0
                    });
                }

                resolve(result);
            };

            request.onerror = () => resolve([]);
        });
    }

    /**
     * Get top and bottom performing items
     */
    async getItemPerformance(limit: number = 5): Promise<{
        topItems: ItemPerformance[];
        bottomItems: ItemPerformance[];
        neverUsed: ItemPerformance[];
    }> {
        await this.refreshUsageCache();
        const prompts = await indexedDbService.getAll();

        const withUsage: ItemPerformance[] = prompts.map(p => ({
            id: p.id,
            title: p.title,
            usageCount: this.usageCache.get(p.id) || 0,
            lastUsedAt: this.lastUsedCache.get(p.id) || null,
            tags: p.tags
        }));

        const used = withUsage.filter(p => p.usageCount > 0);
        const neverUsed = withUsage.filter(p => p.usageCount === 0);

        // Sort by usage count
        used.sort((a, b) => b.usageCount - a.usageCount);

        return {
            topItems: used.slice(0, limit),
            bottomItems: used.slice(-limit).reverse(),
            neverUsed: neverUsed.slice(0, limit)
        };
    }

    /**
     * Get tag insights
     */
    async getTagInsights(): Promise<TagInsight[]> {
        await this.refreshUsageCache();
        const prompts = await indexedDbService.getAll();

        const tagMap = new Map<string, { usageCount: number; promptCount: number; lastUsedAt: string | null }>();

        for (const prompt of prompts) {
            const usage = this.usageCache.get(prompt.id) || 0;
            const lastUsed = this.lastUsedCache.get(prompt.id) || null;

            for (const tag of prompt.tags) {
                const existing = tagMap.get(tag) || { usageCount: 0, promptCount: 0, lastUsedAt: null };
                existing.usageCount += usage;
                existing.promptCount += 1;

                if (lastUsed && (!existing.lastUsedAt || lastUsed > existing.lastUsedAt)) {
                    existing.lastUsedAt = lastUsed;
                }

                tagMap.set(tag, existing);
            }
        }

        const result: TagInsight[] = [];
        for (const [tag, data] of tagMap) {
            result.push({ tag, ...data });
        }

        // Sort by usage count
        result.sort((a, b) => b.usageCount - a.usageCount);

        return result;
    }

    /**
     * Get collection insights
     */
    async getCollectionInsights(): Promise<CollectionInsight[]> {
        await this.refreshUsageCache();
        const prompts = await indexedDbService.getAll();
        const collections = await indexedDbService.getCollections();

        const result: CollectionInsight[] = [];

        for (const collection of collections) {
            const collectionPrompts = prompts.filter(p => p.collection_id === collection.id);
            let totalUsage = 0;
            let lastActivityAt: string | null = null;

            for (const prompt of collectionPrompts) {
                totalUsage += this.usageCache.get(prompt.id) || 0;
                const lastUsed = this.lastUsedCache.get(prompt.id);
                if (lastUsed && (!lastActivityAt || lastUsed > lastActivityAt)) {
                    lastActivityAt = lastUsed;
                }
            }

            result.push({
                id: collection.id,
                name: collection.name,
                itemCount: collectionPrompts.length,
                totalUsage,
                avgUsagePerItem: collectionPrompts.length > 0 ? totalUsage / collectionPrompts.length : 0,
                lastActivityAt
            });
        }

        // Sort by total usage
        result.sort((a, b) => b.totalUsage - a.totalUsage);

        return result;
    }

    /**
     * Generate smart insights
     */
    async getSmartInsights(): Promise<SmartInsight[]> {
        const overview = await this.getOverview();
        const itemPerf = await this.getItemPerformance(5);
        const insights: SmartInsight[] = [];

        // Underutilized warning
        if (overview.totalPrompts > 0) {
            const unusedPercent = Math.round((overview.inactiveItems / overview.totalPrompts) * 100);
            if (unusedPercent >= 40) {
                insights.push({
                    id: 'underutilized',
                    type: 'warning',
                    icon: '⚠️',
                    title: 'Underutilized Library',
                    description: `${unusedPercent}% of your prompts haven't been used in 30 days. Consider reviewing or archiving them.`
                });
            }
        }

        // Power items insight
        if (itemPerf.topItems.length >= 5 && overview.totalUses > 0) {
            const topUsage = itemPerf.topItems.reduce((sum, p) => sum + p.usageCount, 0);
            const topPercent = Math.round((topUsage / overview.totalUses) * 100);
            if (topPercent >= 50) {
                insights.push({
                    id: 'power-items',
                    type: 'info',
                    icon: '⭐',
                    title: 'Power Prompts',
                    description: `Your top 5 prompts generate ${topPercent}% of all usage. Consider creating variations.`
                });
            }
        }

        // Never used warning
        if (itemPerf.neverUsed.length >= 5) {
            insights.push({
                id: 'never-used',
                type: 'warning',
                icon: '📭',
                title: 'Unused Prompts',
                description: `You have ${itemPerf.neverUsed.length} prompts that have never been used. Review or archive them.`
            });
        }

        // Active user success
        if (overview.activeItems >= 10) {
            insights.push({
                id: 'active-user',
                type: 'success',
                icon: '🔥',
                title: 'Active Usage',
                description: `You've used ${overview.activeItems} prompts in the last 7 days. Great work!`
            });
        }

        // Favorites insight
        if (overview.favoritesCount > 0 && overview.totalPrompts > 0) {
            const favPercent = Math.round((overview.favoritesCount / overview.totalPrompts) * 100);
            insights.push({
                id: 'favorites',
                type: 'info',
                icon: '💜',
                title: 'Favorites Ratio',
                description: `${favPercent}% of your prompts are marked as favorites (${overview.favoritesCount} total).`
            });
        }

        return insights;
    }

    /**
     * Get draft insights
     */
    async getDraftInsights(): Promise<DraftInsight> {
        const prompts = await indexedDbService.getAll();
        const drafts = prompts.filter(p => p.is_draft);

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const oldDrafts = drafts
            .filter(p => new Date(p.created_at) < sevenDaysAgo)
            .map(p => ({
                id: p.id,
                title: p.title,
                usageCount: 0,
                lastUsedAt: null,
                tags: p.tags
            }));

        return {
            totalDrafts: drafts.length,
            oldDrafts
        };
    }

    /**
     * Get archive/cleanup insights
     */
    async getArchiveInsights(): Promise<ArchiveInsight> {
        await this.refreshUsageCache();
        const allPrompts = await indexedDbService.getAll(true);

        const archived = allPrompts.filter(p => p.deleted_at);
        const active = allPrompts.filter(p => !p.deleted_at);

        const now = new Date();
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

        const eligibleForCleanup: ItemPerformance[] = [];

        for (const prompt of active) {
            const lastUsed = this.lastUsedCache.get(prompt.id);
            if (!lastUsed || new Date(lastUsed) < ninetyDaysAgo) {
                eligibleForCleanup.push({
                    id: prompt.id,
                    title: prompt.title,
                    usageCount: this.usageCache.get(prompt.id) || 0,
                    lastUsedAt: lastUsed || null,
                    tags: prompt.tags
                });
            }
        }

        return {
            archivedCount: archived.length,
            eligibleForCleanup: eligibleForCleanup.slice(0, 10)
        };
    }

    /**
     * Format relative time
     */
    formatRelativeTime(isoString: string | null): string {
        if (!isoString) return 'Never';

        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    }
}

export const analyticsService = new AnalyticsService();
