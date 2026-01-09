import { useState, useEffect } from 'react';
import {
    OverviewCard,
    TodayActivityCard,
    OutputCard,
    EngagementGauge,
    RecentPromptsCard,
    UsageChart,
    GoalsCard,
    CollectionsCard,
    ProfilePictureUpload
} from '../components/dashboard';
import { DarkLayout } from '../components/layout';
import {
    dashboardService,
    type OverviewStats,
    type TodayActivity,
    type OutputMetrics,
    type RecentActivity,
    type MonthlyUsage,
    type Goal,
    type Collection
} from '../services/dashboardService';
import { useAuth } from '../hooks';
import './ProfileDashboard.css';

export const ProfileDashboard = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
    const [todayActivity, setTodayActivity] = useState<TodayActivity | null>(null);
    const [outputMetrics, setOutputMetrics] = useState<OutputMetrics | null>(null);
    const [engagementScore, setEngagementScore] = useState<number>(0);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [monthlyUsage, setMonthlyUsage] = useState<MonthlyUsage[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const [
                    overview,
                    today,
                    output,
                    engagement,
                    recent,
                    monthly,
                    goalsData,
                    collectionsData
                ] = await Promise.all([
                    dashboardService.getOverviewStats(),
                    dashboardService.getTodayActivity(),
                    dashboardService.getOutputMetrics(),
                    dashboardService.getEngagementScore(),
                    dashboardService.getRecentActivity(),
                    dashboardService.getMonthlyUsage(),
                    dashboardService.getGoals(),
                    dashboardService.getPopularCollections()
                ]);

                setOverviewStats(overview);
                setTodayActivity(today);
                setOutputMetrics(output);
                setEngagementScore(engagement);
                setRecentActivity(recent);
                setMonthlyUsage(monthly);
                setGoals(goalsData);
                setCollections(collectionsData);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, [user?.id]);

    const userName = user?.email?.split('@')[0] || 'Guest';

    if (isLoading) {
        return (
            <DarkLayout title="Profile" userName={userName}>
                <div className="profile-dashboard__loading">
                    <div className="profile-dashboard__spinner"></div>
                    <span>Loading dashboard...</span>
                </div>
            </DarkLayout>
        );
    }

    return (
        <DarkLayout title="Profile Dashboard" userName={userName}>
            <div className="profile-dashboard__content">
                {/* Profile Header with Picture Upload */}
                <div className="profile-dashboard__header">
                    <ProfilePictureUpload userName={userName} />
                    <div className="profile-dashboard__user-info">
                        <h1 className="profile-dashboard__user-name">{userName}</h1>
                        <p className="profile-dashboard__user-email">{user?.email || 'Guest User'}</p>
                    </div>
                </div>

                {/* Row 1: Overview Cards */}
                <div className="profile-dashboard__row profile-dashboard__row--top">
                    {overviewStats && (
                        <div className="profile-dashboard__card profile-dashboard__card--overview">
                            <OverviewCard stats={overviewStats} />
                        </div>
                    )}

                    {todayActivity && (
                        <div className="profile-dashboard__card profile-dashboard__card--activity">
                            <TodayActivityCard activity={todayActivity} />
                        </div>
                    )}

                    {outputMetrics && (
                        <div className="profile-dashboard__card profile-dashboard__card--output">
                            <OutputCard metrics={outputMetrics} />
                        </div>
                    )}

                    <div className="profile-dashboard__card profile-dashboard__card--gauge">
                        <EngagementGauge score={engagementScore} />
                    </div>
                </div>

                {/* Row 2: Recent Activity & Chart */}
                <div className="profile-dashboard__row profile-dashboard__row--middle">
                    <div className="profile-dashboard__card profile-dashboard__card--recent">
                        <RecentPromptsCard activities={recentActivity} />
                    </div>

                    <div className="profile-dashboard__card profile-dashboard__card--chart">
                        <UsageChart data={monthlyUsage} />
                    </div>
                </div>

                {/* Row 3: Goals & Collections */}
                <div className="profile-dashboard__row profile-dashboard__row--bottom">
                    <div className="profile-dashboard__card profile-dashboard__card--goals">
                        <GoalsCard goals={goals} />
                    </div>

                    <div className="profile-dashboard__card profile-dashboard__card--collections">
                        <CollectionsCard collections={collections} />
                    </div>
                </div>
            </div>
        </DarkLayout>
    );
};
