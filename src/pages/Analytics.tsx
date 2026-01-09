import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsageChart } from '../components/dashboard';
import { DarkLayout } from '../components/layout';
import { useAuth } from '../hooks';
import {
    analyticsService,
    type AnalyticsOverview,
    type UsageTrendPoint,
    type ItemPerformance,
    type TagInsight,
    type SmartInsight,
    type DateRange
} from '../services/analyticsService';
import './Analytics.css';

export const Analytics = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState<DateRange>('30d');

    // Data states
    const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
    const [usageTrends, setUsageTrends] = useState<UsageTrendPoint[]>([]);
    const [itemPerformance, setItemPerformance] = useState<{
        topItems: ItemPerformance[];
        bottomItems: ItemPerformance[];
        neverUsed: ItemPerformance[];
    } | null>(null);
    const [tagInsights, setTagInsights] = useState<TagInsight[]>([]);
    const [smartInsights, setSmartInsights] = useState<SmartInsight[]>([]);

    const userName = user?.email?.split('@')[0] || 'Guest';

    // Load all analytics data
    const loadAnalytics = useCallback(async () => {
        setIsLoading(true);
        try {
            const [
                overviewData,
                trendsData,
                itemPerfData,
                tagData,
                insightsData
            ] = await Promise.all([
                analyticsService.getOverview(),
                analyticsService.getUsageTrends(dateRange),
                analyticsService.getItemPerformance(5),
                analyticsService.getTagInsights(),
                analyticsService.getSmartInsights()
            ]);

            setOverview(overviewData);
            setUsageTrends(trendsData);
            setItemPerformance(itemPerfData);
            setTagInsights(tagData);
            setSmartInsights(insightsData);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setIsLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    // Convert usage trends to chart format
    const chartData = usageTrends.map(t => ({
        month: t.label,
        count: t.count
    }));

    // Handle item click
    const handleViewItem = (id: string) => {
        navigate(`/?highlight=${id}`);
    };

    if (isLoading) {
        return (
            <DarkLayout title="Analytics" userName={userName}>
                <div className="analytics-page__loading">
                    <div className="analytics-page__spinner"></div>
                    <span>Loading analytics...</span>
                </div>
            </DarkLayout>
        );
    }

    const maxTagUsage = tagInsights.length > 0 ? Math.max(...tagInsights.map(t => t.usageCount)) : 1;

    return (
        <DarkLayout title="Analytics" userName={userName}>
            <div className="analytics-page__content">
                {/* Date Range Filter */}
                <div className="analytics-page__filters">
                    {(['7d', '30d', '90d'] as DateRange[]).map(range => (
                        <button
                            key={range}
                            className={`analytics-page__range-btn ${dateRange === range ? 'analytics-page__range-btn--active' : ''}`}
                            onClick={() => setDateRange(range)}
                        >
                            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                        </button>
                    ))}
                </div>

                {/* Overview Stats */}
                <section className="analytics-page__section">
                    <div className="analytics-page__section-header">
                        <h2 className="analytics-page__section-title">
                            <span className="analytics-page__section-icon">📌</span>
                            Overview
                        </h2>
                    </div>
                    <div className="analytics-page__stats-grid">
                        <div className="analytics-stat-card">
                            <span className="analytics-stat-card__label">Total Prompts</span>
                            <span className="analytics-stat-card__value">{overview?.totalPrompts || 0}</span>
                        </div>
                        <div className="analytics-stat-card">
                            <span className="analytics-stat-card__label">Total Uses</span>
                            <span className="analytics-stat-card__value">{overview?.totalUses || 0}</span>
                        </div>
                        <div className="analytics-stat-card">
                            <span className="analytics-stat-card__label">Active (7 days)</span>
                            <span className="analytics-stat-card__value">{overview?.activeItems || 0}</span>
                            {overview && overview.totalPrompts > 0 && (
                                <span className="analytics-stat-card__trend analytics-stat-card__trend--positive">
                                    {Math.round((overview.activeItems / overview.totalPrompts) * 100)}% of library
                                </span>
                            )}
                        </div>
                        <div className="analytics-stat-card">
                            <span className="analytics-stat-card__label">Inactive (30+ days)</span>
                            <span className="analytics-stat-card__value">{overview?.inactiveItems || 0}</span>
                            {overview && overview.inactiveItems > 0 && (
                                <span className="analytics-stat-card__trend analytics-stat-card__trend--negative">
                                    Consider reviewing
                                </span>
                            )}
                        </div>
                    </div>
                </section>

                {/* Usage Trends Chart */}
                <section className="analytics-page__section">
                    <div className="analytics-page__section-header">
                        <h2 className="analytics-page__section-title">
                            <span className="analytics-page__section-icon">📈</span>
                            Usage Trends
                        </h2>
                    </div>
                    {chartData.length > 0 ? (
                        <UsageChart data={chartData} />
                    ) : (
                        <div className="analytics-page__empty">
                            <span className="analytics-page__empty-icon">📭</span>
                            <p className="analytics-page__empty-text">No usage data yet. Start using your prompts to see trends!</p>
                        </div>
                    )}
                </section>

                {/* Item Performance - Two Columns */}
                <div className="analytics-page__row">
                    {/* Top Items */}
                    <section className="analytics-page__section">
                        <div className="analytics-page__section-header">
                            <h2 className="analytics-page__section-title">
                                <span className="analytics-page__section-icon">⭐</span>
                                Top Performers
                            </h2>
                        </div>
                        {itemPerformance && itemPerformance.topItems.length > 0 ? (
                            <div className="analytics-page__item-list">
                                {itemPerformance.topItems.map((item, index) => (
                                    <div className="analytics-item" key={item.id}>
                                        <div className="analytics-item__info">
                                            <span className="analytics-item__title">
                                                #{index + 1} {item.title}
                                            </span>
                                            <span className="analytics-item__meta">
                                                Last used: {analyticsService.formatRelativeTime(item.lastUsedAt)}
                                            </span>
                                        </div>
                                        <div className="analytics-item__stats">
                                            <span className="analytics-item__count">{item.usageCount} uses</span>
                                            <button
                                                className="analytics-item__action"
                                                onClick={() => handleViewItem(item.id)}
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="analytics-page__empty">
                                <span className="analytics-page__empty-icon">📊</span>
                                <p className="analytics-page__empty-text">No usage data yet</p>
                            </div>
                        )}
                    </section>

                    {/* Never Used */}
                    <section className="analytics-page__section">
                        <div className="analytics-page__section-header">
                            <h2 className="analytics-page__section-title">
                                <span className="analytics-page__section-icon">📭</span>
                                Never Used
                            </h2>
                        </div>
                        {itemPerformance && itemPerformance.neverUsed.length > 0 ? (
                            <div className="analytics-page__item-list">
                                {itemPerformance.neverUsed.slice(0, 5).map((item) => (
                                    <div className="analytics-item" key={item.id}>
                                        <div className="analytics-item__info">
                                            <span className="analytics-item__title">{item.title}</span>
                                            <span className="analytics-item__meta">
                                                {item.tags.slice(0, 2).map(t => `#${t}`).join(' ') || 'No tags'}
                                            </span>
                                        </div>
                                        <div className="analytics-item__stats">
                                            <button
                                                className="analytics-item__action"
                                                onClick={() => handleViewItem(item.id)}
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="analytics-page__empty">
                                <span className="analytics-page__empty-icon">🎉</span>
                                <p className="analytics-page__empty-text">All prompts have been used!</p>
                            </div>
                        )}
                    </section>
                </div>

                {/* Tag Insights */}
                <section className="analytics-page__section">
                    <div className="analytics-page__section-header">
                        <h2 className="analytics-page__section-title">
                            <span className="analytics-page__section-icon">🏷️</span>
                            Tag Insights
                        </h2>
                    </div>
                    {tagInsights.length > 0 ? (
                        <div className="analytics-page__tag-bars">
                            {tagInsights.slice(0, 8).map(tag => (
                                <div className="analytics-tag-bar" key={tag.tag}>
                                    <span className="analytics-tag-bar__label">#{tag.tag}</span>
                                    <div className="analytics-tag-bar__track">
                                        <div
                                            className="analytics-tag-bar__fill"
                                            style={{ width: `${(tag.usageCount / maxTagUsage) * 100}%` }}
                                        />
                                    </div>
                                    <span className="analytics-tag-bar__count">{tag.usageCount}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="analytics-page__empty">
                            <span className="analytics-page__empty-icon">🏷️</span>
                            <p className="analytics-page__empty-text">No tags found. Add tags to your prompts for insights!</p>
                        </div>
                    )}
                </section>

                {/* Smart Insights */}
                {smartInsights.length > 0 && (
                    <section className="analytics-page__section">
                        <div className="analytics-page__section-header">
                            <h2 className="analytics-page__section-title">
                                <span className="analytics-page__section-icon">🧠</span>
                                Smart Insights
                            </h2>
                        </div>
                        <div className="analytics-page__insights">
                            {smartInsights.map(insight => (
                                <div
                                    className={`analytics-insight analytics-insight--${insight.type}`}
                                    key={insight.id}
                                >
                                    <span className="analytics-insight__icon">{insight.icon}</span>
                                    <div className="analytics-insight__content">
                                        <div className="analytics-insight__title">{insight.title}</div>
                                        <div className="analytics-insight__description">{insight.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Extra Stats Row */}
                <div className="analytics-page__row">
                    <section className="analytics-page__section">
                        <div className="analytics-page__section-header">
                            <h2 className="analytics-page__section-title">
                                <span className="analytics-page__section-icon">💜</span>
                                Favorites
                            </h2>
                        </div>
                        <div className="analytics-stat-card">
                            <span className="analytics-stat-card__label">Favorited Prompts</span>
                            <span className="analytics-stat-card__value">{overview?.favoritesCount || 0}</span>
                        </div>
                    </section>

                    <section className="analytics-page__section">
                        <div className="analytics-page__section-header">
                            <h2 className="analytics-page__section-title">
                                <span className="analytics-page__section-icon">🧪</span>
                                Drafts
                            </h2>
                        </div>
                        <div className="analytics-stat-card">
                            <span className="analytics-stat-card__label">Draft Prompts</span>
                            <span className="analytics-stat-card__value">{overview?.draftsCount || 0}</span>
                        </div>
                    </section>
                </div>
            </div>
        </DarkLayout>
    );
};
