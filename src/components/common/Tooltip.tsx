import React from 'react';
import './Tooltip.css';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    position = 'top',
    delay = 0
}) => {
    if (!content) return <>{children}</>;

    return (
        <div
            className="tooltip-wrapper"
            data-tooltip={content}
            data-position={position}
            style={{ '--tooltip-delay': `${delay}ms` } as React.CSSProperties}
        >
            {children}
        </div>
    );
};
