import './EngagementGauge.css';

interface EngagementGaugeProps {
    score: number;
}

export const EngagementGauge = ({ score }: EngagementGaugeProps) => {
    // Clamp score between 0 and 100
    const clampedScore = Math.max(0, Math.min(100, score));

    // Semi-circle calculations
    const radius = 70;
    const circumference = Math.PI * radius; // Half circle
    const progress = (clampedScore / 100) * circumference;

    return (
        <div className="engagement-gauge">
            <div className="engagement-gauge__header">
                <h3 className="engagement-gauge__title">Engagement Score</h3>
            </div>

            <div className="engagement-gauge__content">
                <div className="engagement-gauge__arc-container">
                    <svg className="engagement-gauge__arc" viewBox="0 0 180 100">
                        <defs>
                            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#A78BFA" />
                                <stop offset="50%" stopColor="#8B5CF6" />
                                <stop offset="100%" stopColor="#7C3AED" />
                            </linearGradient>
                        </defs>

                        {/* Background arc */}
                        <path
                            d="M 10 90 A 70 70 0 0 1 170 90"
                            fill="none"
                            stroke="#F1F5F9"
                            strokeWidth="12"
                            strokeLinecap="round"
                        />

                        {/* Progress arc */}
                        <path
                            d="M 10 90 A 70 70 0 0 1 170 90"
                            fill="none"
                            stroke="url(#gaugeGradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${progress} ${circumference}`}
                            className="engagement-gauge__progress"
                        />
                    </svg>

                    <div className="engagement-gauge__value-container">
                        <span className="engagement-gauge__value">
                            {clampedScore.toFixed(1)}
                        </span>
                        <span className="engagement-gauge__percent">%</span>
                    </div>
                </div>

                <div className="engagement-gauge__labels">
                    <span className="engagement-gauge__label">0%</span>
                    <span className="engagement-gauge__status">
                        {clampedScore >= 80 ? 'Excellent' : clampedScore >= 60 ? 'Good' : clampedScore >= 40 ? 'Fair' : 'Needs Work'}
                    </span>
                    <span className="engagement-gauge__label">100%</span>
                </div>
            </div>
        </div>
    );
};
