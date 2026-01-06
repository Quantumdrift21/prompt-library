import { useState, useEffect } from 'react';

/**
 * Debounce a value by the specified delay.
 * Returns the debounced value that only updates after the delay.
 */
export const useDebounce = <T>(value: T, delay: number = 150): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
};
