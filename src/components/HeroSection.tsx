import './HeroSection.css';

interface HeroSectionProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const HeroSection = ({ searchQuery, onSearchChange }: HeroSectionProps) => {
    return (
        <section className="hero">
            <div className="hero__content">
                <span className="hero__badge">SERVICES</span>
                <h1 className="hero__title">
                    Unlock <span className="gradient-text-orange">Creativity</span>
                    <br />
                    with <span className="gradient-text-teal">Prompt</span> Sharing
                </h1>
                <p className="hero__subtitle">
                    Discover Endless Ideas. Share Your Muse.
                </p>
            </div>

            <div className="hero__decoration">
                <svg viewBox="0 0 200 200" className="hero__shape">
                    <defs>
                        <linearGradient id="shapeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                        <linearGradient id="shapeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00d4ff" />
                            <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                        <linearGradient id="shapeGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ff6b35" />
                            <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                    </defs>
                    <polygon
                        points="100,10 180,50 180,130 100,170 20,130 20,50"
                        fill="url(#shapeGradient1)"
                        opacity="0.9"
                    />
                    <polygon
                        points="100,30 160,60 160,120 100,150 40,120 40,60"
                        fill="url(#shapeGradient2)"
                        opacity="0.7"
                    />
                    <polygon
                        points="100,50 140,70 140,110 100,130 60,110 60,70"
                        fill="url(#shapeGradient3)"
                        opacity="0.5"
                    />
                </svg>
            </div>

            <div className="hero__search-bar">
                <div className="hero__search-input-wrapper">
                    <svg className="hero__search-icon" viewBox="0 0 20 20" fill="none">
                        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                        <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        className="hero__search-input"
                        placeholder="Search Prompts..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <button className="hero__filter-btn">
                    CATEGORY
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                    </svg>
                </button>
                <button className="hero__filter-btn">
                    TRENDING
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                    </svg>
                </button>
            </div>
        </section>
    );
};
