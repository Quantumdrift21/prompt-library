import type { RecentActivity } from '../../services/dashboardService';
import './RecentPromptsCard.css';

interface RecentPromptsCardProps {
    activities: RecentActivity[];
}

export const RecentPromptsCard = ({ activities }: RecentPromptsCardProps) => {
    return (
        <div className="recent-prompts-card">
            <div className="recent-prompts-card__header">
                <h3 className="recent-prompts-card__title">Recent Prompt Activity</h3>
                <button className="recent-prompts-card__view-all">View All</button>
            </div>

            <div className="recent-prompts-card__list">
                {activities.length === 0 ? (
                    <div className="recent-prompts-card__empty">
                        No recent activity
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} className="recent-prompts-card__item">
                            <div className="recent-prompts-card__icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                            </div>

                            <div className="recent-prompts-card__info">
                                <span className="recent-prompts-card__name">{activity.title}</span>
                                <span className="recent-prompts-card__author">{activity.author}</span>
                            </div>

                            <div className="recent-prompts-card__meta">
                                <span className="recent-prompts-card__time">{activity.lastUsed}</span>
                                <span className="recent-prompts-card__usage">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                    </svg>
                                    {activity.usageCount}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
