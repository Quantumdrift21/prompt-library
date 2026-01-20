import type { Goal } from '../../services/dashboardService';
import './GoalsCard.css';

interface GoalsCardProps {
    goals: Goal[];
}

export const GoalsCard = ({ goals }: GoalsCardProps) => {
    return (
        <div className="goals-card">
            <div className="goals-card__header">
                <h3 className="goals-card__title">Productivity Goals</h3>
            </div>

            <div className="goals-card__items">
                {goals.map((goal) => {
                    const progress = Math.min((goal.current / goal.target) * 100, 100);
                    const isComplete = goal.current >= goal.target;

                    return (
                        <div key={goal.id} className="goals-card__item">
                            <div className="goals-card__icon">{goal.icon}</div>

                            <div className="goals-card__info">
                                <div className="goals-card__top">
                                    <span className="goals-card__name">{goal.title}</span>
                                    <span className={`goals-card__status ${isComplete ? 'goals-card__status--complete' : ''}`}>
                                        {isComplete ? '✓ Complete' : `${goal.current}/${goal.target} ${goal.unit}`}
                                    </span>
                                </div>

                                <div className="goals-card__progress-bar">
                                    <div
                                        className={`goals-card__progress-fill ${isComplete ? 'goals-card__progress-fill--complete' : ''}`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
