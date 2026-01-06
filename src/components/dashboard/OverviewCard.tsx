import type { OverviewStats } from '../../services/dashboardService';
import './OverviewCard.css';

interface OverviewCardProps {
    stats: OverviewStats;
}

export const OverviewCard = ({ stats }: OverviewCardProps) => {
    const { totalPrompts, growthPercentage, created, used, favorite } = stats;

    // Calculate ring percentages for visual
    const total = created + used + favorite || 1;
    const createdPercent = (created / total) * 100;
    const usedPercent = (used / total) * 100;
    const favoritePercent = (favorite / total) * 100;

    // SVG circle calculations
    const radius = 70;
    const circumference = 2 * Math.PI * radius;

    const createdOffset = 0;
    const createdLength = (createdPercent / 100) * circumference;

    const usedOffset = createdLength;
    const usedLength = (usedPercent / 100) * circumference;

    const favoriteOffset = createdLength + usedLength;
    const favoriteLength = (favoritePercent / 100) * circumference;

    return (
        <div className="overview-card">
            <div className="overview-card__header">
                <h3 className="overview-card__title">Overview</h3>
                <span className="overview-card__period">This Month</span>
            </div>

            <div className="overview-card__content">
                <div className="overview-card__ring-container">
                    <svg className="overview-card__ring" viewBox="0 0 180 180">
                        <defs>
                            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#8B5CF6" />
                                <stop offset="100%" stopColor="#A78BFA" />
                            </linearGradient>
                            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#60A5FA" />
                            </linearGradient>
                            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#F97316" />
                                <stop offset="100%" stopColor="#FB923C" />
                            </linearGradient>
                        </defs>

                        {/* Background circle */}
                        <circle
                            cx="90"
                            cy="90"
                            r={radius}
                            fill="none"
                            stroke="#F1F5F9"
                            strokeWidth="14"
                        />

                        {/* Created segment (purple) */}
                        <circle
                            cx="90"
                            cy="90"
                            r={radius}
                            fill="none"
                            stroke="url(#purpleGradient)"
                            strokeWidth="14"
                            strokeLinecap="round"
                            strokeDasharray={`${createdLength} ${circumference}`}
                            strokeDashoffset={-createdOffset}
                            transform="rotate(-90 90 90)"
                            className="overview-card__ring-segment"
                        />

                        {/* Used segment (blue) */}
                        <circle
                            cx="90"
                            cy="90"
                            r={radius}
                            fill="none"
                            stroke="url(#blueGradient)"
                            strokeWidth="14"
                            strokeLinecap="round"
                            strokeDasharray={`${usedLength} ${circumference}`}
                            strokeDashoffset={-usedOffset}
                            transform="rotate(-90 90 90)"
                            className="overview-card__ring-segment"
                        />

                        {/* Favorite segment (orange) */}
                        <circle
                            cx="90"
                            cy="90"
                            r={radius}
                            fill="none"
                            stroke="url(#orangeGradient)"
                            strokeWidth="14"
                            strokeLinecap="round"
                            strokeDasharray={`${favoriteLength} ${circumference}`}
                            strokeDashoffset={-favoriteOffset}
                            transform="rotate(-90 90 90)"
                            className="overview-card__ring-segment"
                        />
                    </svg>

                    <div className="overview-card__ring-center">
                        <span className="overview-card__growth">
                            {growthPercentage > 0 ? '+' : ''}{growthPercentage}%
                        </span>
                        <span className="overview-card__growth-label">Growth</span>
                    </div>
                </div>

                <div className="overview-card__legend">
                    <div className="overview-card__legend-item">
                        <span className="overview-card__legend-dot overview-card__legend-dot--purple"></span>
                        <span className="overview-card__legend-label">Created</span>
                        <span className="overview-card__legend-value">{created}</span>
                    </div>
                    <div className="overview-card__legend-item">
                        <span className="overview-card__legend-dot overview-card__legend-dot--blue"></span>
                        <span className="overview-card__legend-label">Used</span>
                        <span className="overview-card__legend-value">{used}</span>
                    </div>
                    <div className="overview-card__legend-item">
                        <span className="overview-card__legend-dot overview-card__legend-dot--orange"></span>
                        <span className="overview-card__legend-label">Favorite</span>
                        <span className="overview-card__legend-value">{favorite}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
