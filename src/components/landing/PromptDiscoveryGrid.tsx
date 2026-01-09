import './PromptDiscoveryGrid.css';

/**
 * Sample prompts for the discovery grid demonstration.
 */
const SAMPLE_PROMPTS = [
    {
        id: '1',
        title: 'Socratic Python Tutor',
        preview: 'Act as a senior Python engineer. When the user provides code, do not give the answer immediately. Instead, ask guiding questions...',
        type: 'System Prompt',
        model: 'GPT-4',
        tokens: 450,
        rating: 4.9,
        ratingCount: 120,
        forkCount: 85,
        tags: ['Education', 'Python', 'Debugging'],
    },
    {
        id: '2',
        title: 'SEO Blog Post Generator',
        preview: 'You are an expert SEO content writer. Generate a comprehensive blog post outline with H1, H2, H3 headers optimized for...',
        type: 'Chain-of-Thought',
        model: 'Claude 3.5',
        tokens: 380,
        rating: 4.7,
        ratingCount: 89,
        forkCount: 62,
        tags: ['Marketing', 'SEO', 'Writing'],
    },
    {
        id: '3',
        title: 'Code Review Assistant',
        preview: 'Analyze the provided code for: 1) Security vulnerabilities, 2) Performance issues, 3) Best practice violations...',
        type: 'System Prompt',
        model: 'GPT-4',
        tokens: 520,
        rating: 4.8,
        ratingCount: 156,
        forkCount: 112,
        tags: ['Development', 'Security', 'Review'],
    },
    {
        id: '4',
        title: 'Data Extraction Pipeline',
        preview: 'Extract structured data from unstructured text. Return valid JSON with the following schema: { entities: [], relations: [] }...',
        type: 'Few-Shot',
        model: 'Claude 3.5',
        tokens: 290,
        rating: 4.6,
        ratingCount: 67,
        forkCount: 41,
        tags: ['Data', 'JSON', 'Extraction'],
    },
    {
        id: '5',
        title: 'Technical Documentation Writer',
        preview: 'Generate clear, maintainable documentation for the provided code. Include: Overview, API reference, Usage examples...',
        type: 'System Prompt',
        model: 'GPT-4',
        tokens: 410,
        rating: 4.5,
        ratingCount: 98,
        forkCount: 73,
        tags: ['Documentation', 'Technical', 'Writing'],
    },
    {
        id: '6',
        title: 'Persona Roleplay Engine',
        preview: 'You are [CHARACTER_NAME]. Respond in character at all times. Maintain personality traits: [TRAITS]. Never break character...',
        type: 'Roleplay',
        model: 'Llama 3',
        tokens: 180,
        rating: 4.4,
        ratingCount: 234,
        forkCount: 189,
        tags: ['Roleplay', 'Creative', 'Persona'],
    },
];

/**
 * Get the appropriate CSS class for a prompt type badge.
 *
 * @param type - The prompt type.
 * @returns CSS class suffix for the badge.
 */
const getTypeBadgeClass = (type: string): string => {
    const typeMap: Record<string, string> = {
        'System Prompt': 'system',
        'Chain-of-Thought': 'cot',
        'Few-Shot': 'fewshot',
        'Roleplay': 'roleplay',
    };
    return typeMap[type] || 'default';
};

/**
 * PromptDiscoveryGrid component - displays a grid of detailed prompt cards.
 *
 * Features:
 * - Technical metadata (tokens, model, type).
 * - Social proof (ratings, forks).
 * - Quick actions (copy, view, star).
 *
 * @returns The PromptDiscoveryGrid JSX element.
 */
export const PromptDiscoveryGrid = () => {
    return (
        <div className="discovery-grid">
            {SAMPLE_PROMPTS.map((prompt) => (
                <article key={prompt.id} className="prompt-card-detail">
                    {/* Card Header */}
                    <header className="card-header">
                        <h3 className="card-title">{prompt.title}</h3>
                        <div className="card-badges">
                            <span className={`card-type-badge card-type-badge--${getTypeBadgeClass(prompt.type)}`}>
                                {prompt.type}
                            </span>
                            <span className="card-model-badge">{prompt.model}</span>
                        </div>
                    </header>

                    {/* Card Preview */}
                    <p className="card-preview">{prompt.preview}</p>

                    {/* Card Tags */}
                    <div className="card-tags">
                        {prompt.tags.map((tag) => (
                            <span key={tag} className="card-tag">{tag}</span>
                        ))}
                    </div>

                    {/* Card Stats */}
                    <div className="card-stats">
                        <span className="card-stat card-stat--rating">
                            ⭐ {prompt.rating} ({prompt.ratingCount})
                        </span>
                        <span className="card-stat card-stat--tokens">
                            ~{prompt.tokens} tokens
                        </span>
                        <span className="card-stat card-stat--forks">
                            🔀 {prompt.forkCount}
                        </span>
                    </div>

                    {/* Card Actions */}
                    <footer className="card-actions">
                        <button className="card-action card-action--primary" title="Copy prompt">
                            Copy
                        </button>
                        <button className="card-action card-action--secondary" title="View details">
                            View
                        </button>
                        <button className="card-action card-action--icon" title="Save to library">
                            ★
                        </button>
                    </footer>
                </article>
            ))}
        </div>
    );
};
