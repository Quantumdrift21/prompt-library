import { useState, useEffect } from 'react';
import './LogoAnimation.css';

interface LogoAnimationProps {
    size?: 'small' | 'medium' | 'large';
    onComplete?: () => void;
}

/**
 * Animated icon SVG - resembles a prompt/chat bubble with sparkle effect.
 */
const AnimatedIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main shape - stylized P/prompt icon */}
        <defs>
            <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b35" />
                <stop offset="100%" stopColor="#ff8f5a" />
            </linearGradient>
        </defs>
        {/* Outer bracket */}
        <path
            d="M8 12C8 9.79086 9.79086 8 12 8H24L32 16V36C32 38.2091 30.2091 40 28 40H12C9.79086 40 8 38.2091 8 36V12Z"
            fill="url(#iconGradient)"
            opacity="0.9"
        />
        {/* Code lines */}
        <path d="M14 20H26" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        <path d="M14 26H22" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M14 32H18" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        {/* Corner fold */}
        <path d="M24 8V14C24 15.1046 24.8954 16 26 16H32" fill="none" stroke="#1a1f2e" strokeWidth="1" opacity="0.3" />
        {/* Sparkle accent */}
        <circle cx="38" cy="12" r="3" fill="#ff6b35" opacity="0.8" />
        <path d="M38 8V16M34 12H42" stroke="#ff6b35" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

/**
 * LogoAnimation - Animated "PROMPT LIBRARY" logo using CSS animations.
 * Features an animated icon and character-by-character text reveal.
 *
 * @param size - Size variant: 'small', 'medium', or 'large'.
 * @param onComplete - Callback fired when animation completes.
 * @returns The LogoAnimation JSX element.
 */
export const LogoAnimation = ({ size = 'large', onComplete }: LogoAnimationProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation after mount
        requestAnimationFrame(() => setIsVisible(true));

        // Call onComplete after animation finishes
        const timeout = setTimeout(() => {
            onComplete?.();
        }, 2000); // Animation duration

        return () => clearTimeout(timeout);
    }, [onComplete]);

    return (
        <div className={`logo-animation logo-animation--${size} ${isVisible ? 'logo-animation--visible' : ''}`}>
            {/* Animated Icon */}
            <div className="logo-animation__icon">
                <AnimatedIcon />
            </div>

            {/* Text Content */}
            <div className="logo-animation__content">
                <div className="logo-animation__text logo-animation__text--prompt">
                    {'PROMPT'.split('').map((char, i) => (
                        <span
                            key={i}
                            className="logo-animation__char"
                            style={{ animationDelay: `${0.3 + i * 0.08}s` }}
                        >
                            {char}
                        </span>
                    ))}
                </div>
                <div className="logo-animation__text logo-animation__text--library">
                    {'LIBRARY'.split('').map((char, i) => (
                        <span
                            key={i}
                            className="logo-animation__char"
                            style={{ animationDelay: `${0.8 + i * 0.06}s` }}
                        >
                            {char}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
