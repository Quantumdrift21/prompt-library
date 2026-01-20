import './Skeleton.css';

interface SkeletonProps {
    width?: string;
    height?: string;
    variant?: 'text' | 'rectangular' | 'circular';
    className?: string;
}

/**
 * Skeleton loader component for content placeholders.
 *
 * @param width - Width of the skeleton (default: '100%').
 * @param height - Height of the skeleton (default: '1rem').
 * @param variant - Shape variant (text, rectangular, circular).
 * @param className - Additional CSS classes.
 */
export const Skeleton = ({
    width = '100%',
    height = '1rem',
    variant = 'text',
    className = ''
}: SkeletonProps) => {
    return (
        <div
            className={`skeleton skeleton--${variant} ${className}`}
            style={{ width, height }}
        />
    );
};

/**
 * Pre-built skeleton for prompt cards.
 */
export const PromptCardSkeleton = () => (
    <div className="prompt-card-skeleton">
        <div className="skeleton-header">
            <Skeleton variant="circular" width="40px" height="40px" />
            <Skeleton width="60%" height="1.2rem" />
        </div>
        <Skeleton height="0.9rem" />
        <Skeleton height="0.9rem" width="80%" />
        <div className="skeleton-footer">
            <Skeleton width="30%" height="1.5rem" />
            <Skeleton width="30%" height="1.5rem" />
        </div>
    </div>
);
