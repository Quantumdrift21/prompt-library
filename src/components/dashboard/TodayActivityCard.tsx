import type { TodayActivity } from '../../services/dashboardService';
import './TodayActivityCard.css';

interface TodayActivityCardProps {
    activity: TodayActivity;
}

export const TodayActivityCard = ({ activity }: TodayActivityCardProps) => {
    const { promptsCopied, promptsEdited, promptsCreated } = activity;

    const items = [
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
            ),
            label: 'Prompts Copied',
            count: promptsCopied
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            ),
            label: 'Prompts Edited',
            count: promptsEdited
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
            ),
            label: 'Prompts Created',
            count: promptsCreated
        }
    ];

    return (
        <div className="today-activity-card">
            <div className="today-activity-card__header">
                <h3 className="today-activity-card__title">Today's Activity</h3>
            </div>

            <div className="today-activity-card__items">
                {items.map((item, index) => (
                    <div key={index} className="today-activity-card__item">
                        <div className="today-activity-card__icon">
                            {item.icon}
                        </div>
                        <div className="today-activity-card__info">
                            <span className="today-activity-card__label">{item.label}</span>
                            <span className="today-activity-card__count">{item.count}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
