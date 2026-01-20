/**
 * Search utilities for text normalization and scoring.
 */

/**
 * Normalize text for search: lowercase, trim, remove punctuation.
 */
export const normalizeText = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, ' ')  // Replace punctuation with spaces
        .replace(/\s+/g, ' ')      // Collapse multiple spaces
        .trim();
};

/**
 * Check if a query matches text (normalized comparison).
 */
export const matchesQuery = (text: string, query: string): boolean => {
    const normalizedText = normalizeText(text);
    const normalizedQuery = normalizeText(query);
    return normalizedText.includes(normalizedQuery);
};

/**
 * Score a prompt for relevance to a query.
 * Higher scores = more relevant.
 * Title: 3x, Tags: 2x, Content: 1x
 */
export const scorePrompt = (
    prompt: { title: string; content: string; tags: string[] },
    query: string
): number => {
    const q = normalizeText(query);
    if (!q) return 0;

    let score = 0;

    // Title match (highest priority)
    if (matchesQuery(prompt.title, query)) {
        score += 3;
    }

    // Tag matches (medium priority)
    for (const tag of prompt.tags) {
        if (matchesQuery(tag, query)) {
            score += 2;
            break; // Only count once for tags
        }
    }

    // Content match (lowest priority)
    if (matchesQuery(prompt.content, query)) {
        score += 1;
    }

    return score;
};

/**
 * Check if query is empty or whitespace-only.
 */
export const isEmptyQuery = (query: string): boolean => {
    return !query || query.trim().length === 0;
};
