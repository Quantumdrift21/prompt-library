import { useState, useEffect } from 'react';

export const useTheme = () => {
    // Theme state - check localStorage or prefer system setting
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.remove('light-theme');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.classList.add('light-theme');
            root.setAttribute('data-theme', 'light');
        }
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(prev => !prev);
    const setTheme = (mode: 'light' | 'dark' | 'system') => {
        if (mode === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(systemDark);
            localStorage.removeItem('theme');
        } else {
            setIsDarkMode(mode === 'dark');
        }
    };

    return { isDarkMode, toggleTheme, setTheme };
};
