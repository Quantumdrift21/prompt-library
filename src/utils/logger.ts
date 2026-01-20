/**
 * Logger utility for consistent logging behavior.
 * Only logs in development mode to prevent information leakage in production.
 */

const isDev = import.meta.env.DEV;

export const logger = {
    /**
     * Log informational messages (dev only)
     */
    log: (...args: unknown[]): void => {
        if (isDev) {
            console.log(...args);
        }
    },

    /**
     * Log warning messages (dev only)
     */
    warn: (...args: unknown[]): void => {
        if (isDev) {
            console.warn(...args);
        }
    },

    /**
     * Log error messages (always, for debugging critical issues)
     */
    error: (...args: unknown[]): void => {
        console.error(...args);
    },

    /**
     * Log debug messages (dev only, with prefix)
     */
    debug: (context: string, ...args: unknown[]): void => {
        if (isDev) {
            console.log(`[${context}]`, ...args);
        }
    }
};
