import { useState, useEffect, useCallback } from 'react';
import './TerminalHero.css';

/**
 * Sample prompts to display in the terminal carousel.
 * Each prompt showcases a different use case.
 */
const SAMPLE_PROMPTS = [
    {
        input: 'Refactor this React component to use Hooks and remove class syntax...',
        output: 'const Counter = () => {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n};',
        model: 'GPT-4',
        category: 'Coding',
    },
    {
        input: 'Rewrite this email to sound professional yet firm about the deadline...',
        output: 'Dear Team,\n\nI wanted to follow up regarding the Q4 deliverables. The deadline of January 15th remains firm, and I trust we can align on the remaining tasks by EOD Friday.',
        model: 'Claude 3.5',
        category: 'Writing',
    },
    {
        input: 'Extract structured JSON from this unstructured customer feedback...',
        output: '{\n  "sentiment": "positive",\n  "topics": ["delivery", "packaging"],\n  "rating": 4.5,\n  "actionable": true\n}',
        model: 'GPT-4',
        category: 'Data',
    },
];

/**
 * Custom hook for typewriter animation effect.
 *
 * @param text - The full text to animate.
 * @param speed - Typing speed in milliseconds per character.
 * @param startDelay - Delay before starting the animation.
 * @returns The currently displayed portion of the text.
 */
const useTypewriter = (text: string, speed = 30, startDelay = 500): string => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText('');
        let currentIndex = 0;
        let timeoutId: ReturnType<typeof setTimeout>;

        const startTyping = () => {
            const typeNextChar = () => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.slice(0, currentIndex + 1));
                    currentIndex++;
                    timeoutId = setTimeout(typeNextChar, speed);
                }
            };
            typeNextChar();
        };

        const delayTimeout = setTimeout(startTyping, startDelay);

        return () => {
            clearTimeout(delayTimeout);
            clearTimeout(timeoutId);
        };
    }, [text, speed, startDelay]);

    return displayedText;
};

/**
 * TerminalHero component - displays an animated terminal showcasing prompt examples.
 *
 * Features:
 * - Typewriter animation for the prompt output.
 * - Carousel navigation between different prompt examples.
 * - Model badges and category indicators.
 *
 * @returns The TerminalHero JSX element.
 */
export const TerminalHero = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const currentPrompt = SAMPLE_PROMPTS[activeIndex];
    const animatedOutput = useTypewriter(currentPrompt.output, 20, 800);

    const goToNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % SAMPLE_PROMPTS.length);
    }, []);

    const goToPrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + SAMPLE_PROMPTS.length) % SAMPLE_PROMPTS.length);
    }, []);

    // Auto-advance carousel every 8 seconds
    useEffect(() => {
        const interval = setInterval(goToNext, 8000);
        return () => clearInterval(interval);
    }, [goToNext]);

    return (
        <div className="terminal-hero">
            <div className="terminal-window">
                {/* Terminal Header */}
                <div className="terminal-header">
                    <div className="terminal-buttons">
                        <span className="terminal-btn terminal-btn--close"></span>
                        <span className="terminal-btn terminal-btn--minimize"></span>
                        <span className="terminal-btn terminal-btn--maximize"></span>
                    </div>
                    <span className="terminal-title">prompt-preview.sh</span>
                </div>

                {/* Terminal Body */}
                <div className="terminal-body">
                    {/* Input Section */}
                    <div className="terminal-input">
                        <span className="terminal-prompt">$</span>
                        <span className="terminal-command">{currentPrompt.input}</span>
                    </div>

                    {/* Output Section */}
                    <div className="terminal-output">
                        <pre>
                            <code>{animatedOutput}</code>
                            <span className="terminal-cursor">|</span>
                        </pre>
                    </div>
                </div>

                {/* Terminal Footer */}
                <div className="terminal-footer">
                    <span className="terminal-badge terminal-badge--model">{currentPrompt.model}</span>
                    <span className="terminal-badge terminal-badge--category">{currentPrompt.category}</span>
                    <div className="terminal-nav">
                        <button onClick={goToPrev} aria-label="Previous example">←</button>
                        <span className="terminal-nav-dots">
                            {SAMPLE_PROMPTS.map((_, i) => (
                                <span
                                    key={i}
                                    className={`terminal-nav-dot ${i === activeIndex ? 'active' : ''}`}
                                    onClick={() => setActiveIndex(i)}
                                />
                            ))}
                        </span>
                        <button onClick={goToNext} aria-label="Next example">→</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
