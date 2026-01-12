import './HeroSection.css';

interface HeroSectionProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const HeroSection = ({ searchQuery, onSearchChange }: HeroSectionProps) => {
    return (
        <section className="hero">
            <div className="hero__content">
                <span className="hero__badge">PROMPT LIBRARY</span>
                <h1 className="hero__title">
                    Unlock <span className="gradient-text-orange">Creativity</span>
                    <br />
                    with <span className="gradient-text-teal">Prompt</span> Sharing
                </h1>
                <p className="hero__subtitle">
                    Discover Endless Ideas. Share Your Muse.
                </p>
            </div>

            <div className="hero__search-container">
                <div className="hero__search-input-wrapper">
                    <svg className="hero__search-icon" viewBox="0 0 20 20" fill="none">
                        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                        <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        id="library-search"
                        className="hero__search-input"
                        placeholder="Search for 'Python Debugging', 'SEO Blog Post'..."
                        aria-label="Search prompts"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
        </section>
    );
};
