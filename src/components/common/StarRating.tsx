import React, { useState } from 'react';
import { Star } from 'lucide-react';
import './StarRating.css';

interface StarRatingProps {
    rating: number; // 0-5
    maxRating?: number;
    size?: number;
    readonly?: boolean;
    onChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxRating = 5,
    size = 16,
    readonly = false,
    onChange
}) => {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const handleMouseEnter = (index: number) => {
        if (!readonly) setHoverRating(index);
    };

    const handleMouseLeave = () => {
        if (!readonly) setHoverRating(null);
    };

    const handleClick = (index: number) => {
        if (!readonly && onChange) {
            onChange(index);
        }
    };

    return (
        <div
            className={`star-rating ${readonly ? 'star-rating--readonly' : ''}`}
            onMouseLeave={handleMouseLeave}
        >
            {Array.from({ length: maxRating }).map((_, i) => {
                const starIndex = i + 1;
                // If hovering, show visual feedback. 
                const effectiveRating = hoverRating !== null ? hoverRating : rating;
                const isFilled = effectiveRating >= starIndex;

                return (
                    <button
                        key={i}
                        className={`star-rating__star ${isFilled ? 'star-rating__star--filled' : ''}`}
                        onMouseEnter={() => handleMouseEnter(starIndex)}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClick(starIndex);
                        }}
                        disabled={readonly}
                        type="button"
                        aria-label={`Rate ${starIndex} stars`}
                    >
                        <Star size={size} fill={isFilled ? "currentColor" : "none"} />
                    </button>
                );
            })}
        </div>
    );
};
