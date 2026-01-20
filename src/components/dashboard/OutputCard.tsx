import type { OutputMetrics } from '../../services/dashboardService';
import './OutputCard.css';

interface OutputCardProps {
    metrics: OutputMetrics;
}

export const OutputCard = ({ metrics }: OutputCardProps) => {
    const { reuseIncrease, editsDecrease } = metrics;

    return (
        <div className="output-card">
            <div className="output-card__item output-card__item--purple">
                <div className="output-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                    </svg>
                </div>
                <div className="output-card__info">
                    <span className="output-card__label">Prompt Reuse</span>
                    <span className="output-card__value output-card__value--positive">
                        +{reuseIncrease.toFixed(1)}%
                    </span>
                </div>
            </div>

            <div className="output-card__item output-card__item--red">
                <div className="output-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                        <polyline points="17 18 23 18 23 12" />
                    </svg>
                </div>
                <div className="output-card__info">
                    <span className="output-card__label">Edit Frequency</span>
                    <span className="output-card__value output-card__value--negative">
                        {editsDecrease.toFixed(1)}%
                    </span>
                </div>
            </div>
        </div>
    );
};
