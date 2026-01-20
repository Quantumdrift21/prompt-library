import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Onboarding.css';

interface UseCase {
    id: string;
    icon: string;
    title: string;
    description: string;
}

const USE_CASES: UseCase[] = [
    {
        id: 'developer',
        icon: '💻',
        title: 'Developer',
        description: 'Code, debug, and build faster'
    },
    {
        id: 'writer',
        icon: '✍️',
        title: 'Writer',
        description: 'Create compelling content'
    },
    {
        id: 'marketer',
        icon: '📊',
        title: 'Marketer',
        description: 'Craft campaigns and copy'
    },
    {
        id: 'researcher',
        icon: '🔬',
        title: 'Researcher',
        description: 'Analyze and synthesize data'
    }
];

/**
 * Onboarding page component - guides new users through initial setup.
 * 
 * Three-step flow:
 * 1. Welcome + Name input
 * 2. Use case selection
 * 3. Completion confirmation
 * 
 * @returns The Onboarding JSX element.
 */
export const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [displayName, setDisplayName] = useState('');
    const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Handles completion of onboarding by saving preferences to Supabase.
     */
    const handleComplete = async () => {
        setIsLoading(true);
        setError(null);

        const result = await authService.completeOnboarding({
            display_name: displayName,
            use_case: selectedUseCase || 'general'
        });

        setIsLoading(false);

        if (result.error) {
            setError(result.error.message);
        } else {
            navigate('/home');
        }
    };

    /**
     * Handles skipping the onboarding process.
     */
    const handleSkip = async () => {
        setIsLoading(true);
        await authService.completeOnboarding({
            display_name: '',
            use_case: 'general'
        });
        navigate('/home');
    };

    /**
     * Renders the progress indicator at the top.
     */
    const renderProgress = () => (
        <div className="onboarding-progress">
            {[1, 2, 3].map((stepNum, index) => (
                <div key={stepNum} style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        className={`onboarding-progress__step ${step === stepNum ? 'onboarding-progress__step--active' : ''
                            } ${step > stepNum ? 'onboarding-progress__step--completed' : ''}`}
                    >
                        {step > stepNum ? '✓' : stepNum}
                    </div>
                    {index < 2 && (
                        <div
                            className={`onboarding-progress__connector ${step > stepNum ? 'onboarding-progress__connector--completed' : ''
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );

    /**
     * Renders Step 1: Welcome and name input.
     */
    const renderStep1 = () => (
        <>
            <h1 className="onboarding-title">Welcome to Prompt Library!</h1>
            <p className="onboarding-subtitle">
                Let's personalize your experience. What should we call you?
            </p>

            <div className="onboarding-form">
                <div className="onboarding-field">
                    <label htmlFor="display-name">Your Name</label>
                    <input
                        id="display-name"
                        type="text"
                        className="onboarding-input"
                        placeholder="Enter your name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="onboarding-actions">
                    <button
                        className="onboarding-btn onboarding-btn--primary"
                        onClick={() => setStep(2)}
                        disabled={!displayName.trim()}
                    >
                        Continue
                    </button>
                </div>

                <button className="onboarding-btn--link" onClick={handleSkip}>
                    Skip for now
                </button>
            </div>
        </>
    );

    /**
     * Renders Step 2: Use case selection.
     */
    const renderStep2 = () => (
        <>
            <h1 className="onboarding-title">What brings you here?</h1>
            <p className="onboarding-subtitle">
                Choose your primary use case so we can tailor your experience.
            </p>

            <div className="onboarding-use-cases">
                {USE_CASES.map((useCase) => (
                    <button
                        key={useCase.id}
                        className={`onboarding-use-case ${selectedUseCase === useCase.id ? 'onboarding-use-case--selected' : ''
                            }`}
                        onClick={() => setSelectedUseCase(useCase.id)}
                    >
                        <div className="onboarding-use-case__icon">{useCase.icon}</div>
                        <div className="onboarding-use-case__title">{useCase.title}</div>
                        <div className="onboarding-use-case__desc">{useCase.description}</div>
                    </button>
                ))}
            </div>

            <div className="onboarding-actions">
                <button
                    className="onboarding-btn onboarding-btn--secondary"
                    onClick={() => setStep(1)}
                >
                    Back
                </button>
                <button
                    className="onboarding-btn onboarding-btn--primary"
                    onClick={() => setStep(3)}
                    disabled={!selectedUseCase}
                >
                    Continue
                </button>
            </div>
        </>
    );

    /**
     * Renders Step 3: Completion and confirmation.
     */
    const renderStep3 = () => (
        <div className="onboarding-success">
            <div className="onboarding-success__icon">🎉</div>
            <h1 className="onboarding-title">You're all set, {displayName}!</h1>
            <p className="onboarding-success__message">
                Your Prompt Library is ready. Start organizing your prompts and boost your productivity.
            </p>

            {error && <p className="onboarding-error">{error}</p>}

            <div className="onboarding-actions">
                <button
                    className="onboarding-btn onboarding-btn--secondary"
                    onClick={() => setStep(2)}
                >
                    Back
                </button>
                <button
                    className="onboarding-btn onboarding-btn--primary"
                    onClick={handleComplete}
                    disabled={isLoading}
                >
                    {isLoading ? 'Getting Ready...' : 'Go to Dashboard'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="onboarding-page">
            <div className="onboarding-logo">Prompt Library</div>
            {renderProgress()}
            <div className="onboarding-card">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </div>
        </div>
    );
};
