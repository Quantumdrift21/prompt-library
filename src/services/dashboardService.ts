import type { Prompt } from '../types';
import { indexedDbService } from './indexedDb';

export interface OverviewStats {
    totalPrompts: number;
    activePrompts: number;
    archivedPrompts: number;
    growthPercentage: number;
    created: number;
    used: number;
    favorite: number;
}

export interface TodayActivity {
    promptsCopied: number;
    promptsEdited: number;
    promptsCreated: number;
}

export interface OutputMetrics {
    reuseIncrease: number;
    editsDecrease: number;
}

export interface RecentActivity {
    id: string;
    title: string;
    author: string;
    lastUsed: string;
    usageCount: number;
}

export interface MonthlyUsage {
    month: string;
    count: number;
}

export interface Goal {
    id: string;
    title: string;
    icon: string;
    current: number;
    target: number;
    unit: string;
}

export interface Collection {
    id: string;
    name: string;
    promptCount: number;
    color: 'purple' | 'orange' | 'blue';
}

class DashboardService {
    async getOverviewStats(): Promise<OverviewStats> {
        const prompts = await indexedDbService.getAll();
        const totalPrompts = prompts.length;
        const favoriteCount = prompts.filter(p => p.favorite).length;

        // Mock growth calculation (would compare to previous period in real app)
        const growthPercentage = totalPrompts > 0 ? Math.min(23 + Math.floor(Math.random() * 10), 50) : 0;

        return {
            totalPrompts,
            activePrompts: totalPrompts,
            archivedPrompts: 0, // No archive feature yet
            growthPercentage,
            created: totalPrompts,
            used: Math.floor(totalPrompts * 0.7), // Estimate 70% usage
            favorite: favoriteCount
        };
    }

    async getTodayActivity(): Promise<TodayActivity> {
        const prompts = await indexedDbService.getAll();
        const today = new Date().toISOString().split('T')[0];

        const createdToday = prompts.filter(p =>
            p.created_at.startsWith(today)
        ).length;

        const editedToday = prompts.filter(p =>
            p.updated_at.startsWith(today) && !p.created_at.startsWith(today)
        ).length;

        // Mock copied count (would track from usage logs in real app)
        const copiedToday = Math.max(Math.floor(prompts.length * 0.3), createdToday);

        return {
            promptsCopied: copiedToday,
            promptsEdited: editedToday,
            promptsCreated: createdToday
        };
    }

    async getOutputMetrics(): Promise<OutputMetrics> {
        // Mock metrics (would calculate from historical data)
        return {
            reuseIncrease: 12.5,
            editsDecrease: -8.3
        };
    }

    async getEngagementScore(): Promise<number> {
        const prompts = await indexedDbService.getAll();
        if (prompts.length === 0) return 0;

        // Calculate based on activity
        const favoriteRatio = prompts.filter(p => p.favorite).length / prompts.length;
        const recentlyUsed = prompts.filter(p => {
            const updated = new Date(p.updated_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return updated > weekAgo;
        }).length / prompts.length;

        const score = Math.min((favoriteRatio * 50 + recentlyUsed * 50) * 100 + 50, 100);
        return Math.round(score * 100) / 100;
    }

    async getRecentActivity(): Promise<RecentActivity[]> {
        const prompts = await indexedDbService.getAll();

        // Sort by updated_at and take last 10
        const sorted = [...prompts]
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .slice(0, 10);

        return sorted.map(p => ({
            id: p.id,
            title: p.title,
            author: 'You',
            lastUsed: this.formatRelativeTime(p.updated_at),
            usageCount: Math.floor(Math.random() * 20) + 1 // Mock usage count
        }));
    }

    async getMonthlyUsage(): Promise<MonthlyUsage[]> {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const prompts = await indexedDbService.getAll();

        // Group prompts by creation month
        const now = new Date();
        const result: MonthlyUsage[] = [];

        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStr = months[date.getMonth()];
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const count = prompts.filter(p => {
                const created = new Date(p.created_at);
                return created >= monthStart && created <= monthEnd;
            }).length;

            // Add some variance for demo
            result.push({
                month: monthStr,
                count: count + Math.floor(Math.random() * 5)
            });
        }

        return result;
    }

    async getGoals(): Promise<Goal[]> {
        const today = await this.getTodayActivity();
        const prompts = await indexedDbService.getAll();

        // Calculate weekly creations
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weeklyCreations = prompts.filter(p =>
            new Date(p.created_at) > weekAgo
        ).length;

        return [
            {
                id: 'daily-usage',
                title: 'Daily Prompt Usage',
                icon: '📋',
                current: today.promptsCopied,
                target: 10,
                unit: 'prompts'
            },
            {
                id: 'weekly-creation',
                title: 'Weekly Creation Goal',
                icon: '✨',
                current: weeklyCreations,
                target: 5,
                unit: 'prompts'
            }
        ];
    }

    async getPopularCollections(): Promise<Collection[]> {
        const prompts = await indexedDbService.getAll();

        // Group by tags to simulate collections
        const tagCounts = new Map<string, number>();
        prompts.forEach(p => {
            p.tags.forEach(tag => {
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
        });

        // Get top 3 tags as "collections"
        const sorted = [...tagCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        const colors: ('purple' | 'orange' | 'blue')[] = ['purple', 'orange', 'blue'];

        if (sorted.length === 0) {
            // Return mock data if no tags
            return [
                { id: '1', name: 'Code Generation', promptCount: 12, color: 'purple' },
                { id: '2', name: 'Writing Helpers', promptCount: 8, color: 'orange' },
                { id: '3', name: 'Data Analysis', promptCount: 5, color: 'blue' }
            ];
        }

        return sorted.map((entry, i) => ({
            id: `collection-${i}`,
            name: entry[0],
            promptCount: entry[1],
            color: colors[i % 3]
        }));
    }

    private formatRelativeTime(isoString: string): string {
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

export const dashboardService = new DashboardService();
