# Public Prompts Discovery Search Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable guests to search a public prompts database from the landing page Discover section.

**Architecture:** 
- Create a `public_prompts` table in Supabase with public read access
- Build a service to fetch/search public prompts
- Wire the landing page search input to filter the PromptDiscoveryGrid
- Category pills filter by tags

**Tech Stack:** Supabase (Postgres + RLS), React, TypeScript

---

## Task 1: Create public_prompts Table in Supabase

**Files:**
- Supabase migration (via MCP)

**Step 1: Create the table**

```sql
-- Create public_prompts table for guest-visible prompts
CREATE TABLE IF NOT EXISTS public_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    preview TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'System Prompt',
    model TEXT NOT NULL DEFAULT 'GPT-4',
    tokens INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    fork_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    author_name TEXT DEFAULT 'Community',
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for search
CREATE INDEX idx_public_prompts_title ON public_prompts USING gin(to_tsvector('english', title));
CREATE INDEX idx_public_prompts_tags ON public_prompts USING gin(tags);

-- Enable RLS
ALTER TABLE public_prompts ENABLE ROW LEVEL SECURITY;

-- Allow public read access (no auth required)
CREATE POLICY "Public prompts are viewable by everyone"
    ON public_prompts FOR SELECT
    USING (true);
```

**Step 2: Seed sample data**

```sql
INSERT INTO public_prompts (title, preview, content, type, model, tokens, rating, rating_count, fork_count, tags) VALUES
('Socratic Python Tutor', 'Act as a senior Python engineer. When the user provides code, do not give the answer immediately. Instead, ask guiding questions...', 'You are a senior Python engineer with 15 years of experience. When a user shows you code with a problem, do NOT immediately provide the solution. Instead, use the Socratic method...', 'System Prompt', 'GPT-4', 450, 4.9, 120, 85, ARRAY['Education', 'Python', 'Debugging']),
('SEO Blog Post Generator', 'You are an expert SEO content writer. Generate a comprehensive blog post outline with H1, H2, H3 headers optimized for...', 'You are an expert SEO content strategist. Generate blog post outlines optimized for search engines...', 'Chain-of-Thought', 'Claude 3.5', 380, 4.7, 89, 62, ARRAY['Marketing', 'SEO', 'Writing']),
('Code Review Assistant', 'Analyze the provided code for: 1) Security vulnerabilities, 2) Performance issues, 3) Best practice violations...', 'You are a code review expert. Analyze code systematically...', 'System Prompt', 'GPT-4', 520, 4.8, 156, 112, ARRAY['Development', 'Security', 'Review']),
('Data Extraction Pipeline', 'Extract structured data from unstructured text. Return valid JSON with the following schema...', 'Extract entities and relationships from text...', 'Few-Shot', 'Claude 3.5', 290, 4.6, 67, 41, ARRAY['Data', 'JSON', 'Extraction']),
('Technical Documentation Writer', 'Generate clear, maintainable documentation for the provided code...', 'Create comprehensive technical documentation...', 'System Prompt', 'GPT-4', 410, 4.5, 98, 73, ARRAY['Documentation', 'Technical', 'Writing']),
('Persona Roleplay Engine', 'You are [CHARACTER_NAME]. Respond in character at all times...', 'Roleplay framework for character personas...', 'Roleplay', 'Llama 3', 180, 4.4, 234, 189, ARRAY['Roleplay', 'Creative', 'Persona']);
```

**Step 3: Verify in Supabase dashboard**

---

## Task 2: Create Public Prompts Service

**Files:**
- Create: `src/services/publicPromptsService.ts`
- Create: `src/types/publicPrompt.ts`

**Step 1: Create the type**

```typescript
// src/types/publicPrompt.ts

/**
 * PublicPrompt - represents a prompt visible to all users (no auth required).
 */
export interface PublicPrompt {
    id: string;
    title: string;
    preview: string;
    content: string;
    type: 'System Prompt' | 'Chain-of-Thought' | 'Few-Shot' | 'Roleplay';
    model: string;
    tokens: number;
    rating: number;
    rating_count: number;
    fork_count: number;
    tags: string[];
    author_name: string;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}
```

**Step 2: Create the service**

```typescript
// src/services/publicPromptsService.ts
import { supabase, isSupabaseConfigured } from './supabase';
import type { PublicPrompt } from '../types/publicPrompt';

/**
 * Service for fetching public prompts (no auth required).
 */
export const publicPromptsService = {
    /**
     * Fetches all public prompts, optionally filtered by search query and tags.
     * 
     * @param query - Optional search string to filter by title.
     * @param tags - Optional array of tags to filter by.
     * @returns Array of matching public prompts.
     */
    async search(query?: string, tags?: string[]): Promise<PublicPrompt[]> {
        if (!isSupabaseConfigured() || !supabase) {
            console.warn('Supabase not configured, returning empty results');
            return [];
        }

        let request = supabase
            .from('public_prompts')
            .select('*')
            .order('rating', { ascending: false });

        // Filter by search query (title ilike)
        if (query && query.trim()) {
            request = request.ilike('title', `%${query.trim()}%`);
        }

        // Filter by tags (contains any)
        if (tags && tags.length > 0) {
            request = request.overlaps('tags', tags);
        }

        const { data, error } = await request.limit(12);

        if (error) {
            console.error('Error fetching public prompts:', error);
            return [];
        }

        return data as PublicPrompt[];
    },

    /**
     * Fetches featured prompts for initial display.
     * 
     * @returns Array of featured or top-rated prompts.
     */
    async getFeatured(): Promise<PublicPrompt[]> {
        if (!isSupabaseConfigured() || !supabase) {
            return [];
        }

        const { data, error } = await supabase
            .from('public_prompts')
            .select('*')
            .order('rating', { ascending: false })
            .limit(6);

        if (error) {
            console.error('Error fetching featured prompts:', error);
            return [];
        }

        return data as PublicPrompt[];
    },
};
```

**Step 3: Export from types index**

Add to `src/types/index.ts`:
```typescript
export type { PublicPrompt } from './publicPrompt';
```

**Step 4: Commit**

```bash
git add src/types/publicPrompt.ts src/services/publicPromptsService.ts src/types/index.ts
git commit -m "feat: add publicPromptsService for guest search"
```

---

## Task 3: Update PromptDiscoveryGrid to Accept Props

**Files:**
- Modify: `src/components/landing/PromptDiscoveryGrid.tsx`

**Step 1: Add props interface and make dynamic**

```typescript
// src/components/landing/PromptDiscoveryGrid.tsx
import type { PublicPrompt } from '../../types/publicPrompt';
import './PromptDiscoveryGrid.css';

interface PromptDiscoveryGridProps {
    prompts: PublicPrompt[];
    isLoading?: boolean;
}

/**
 * Get the appropriate CSS class for a prompt type badge.
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
 * PromptDiscoveryGrid component - displays a grid of public prompt cards.
 */
export const PromptDiscoveryGrid = ({ prompts, isLoading }: PromptDiscoveryGridProps) => {
    if (isLoading) {
        return (
            <div className="discovery-grid discovery-grid--loading">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="prompt-card-skeleton" />
                ))}
            </div>
        );
    }

    if (prompts.length === 0) {
        return (
            <div className="discovery-empty">
                <p>No prompts found. Try a different search term.</p>
            </div>
        );
    }

    return (
        <div className="discovery-grid">
            {prompts.map((prompt) => (
                <article key={prompt.id} className="prompt-card-detail">
                    <header className="card-header">
                        <h3 className="card-title">{prompt.title}</h3>
                        <div className="card-badges">
                            <span className={`card-type-badge card-type-badge--${getTypeBadgeClass(prompt.type)}`}>
                                {prompt.type}
                            </span>
                            <span className="card-model-badge">{prompt.model}</span>
                        </div>
                    </header>
                    <p className="card-preview">{prompt.preview}</p>
                    <div className="card-tags">
                        {prompt.tags.map((tag) => (
                            <span key={tag} className="card-tag">{tag}</span>
                        ))}
                    </div>
                    <div className="card-stats">
                        <span className="card-stat card-stat--rating">
                            ⭐ {prompt.rating} ({prompt.rating_count})
                        </span>
                        <span className="card-stat card-stat--tokens">
                            ~{prompt.tokens} tokens
                        </span>
                        <span className="card-stat card-stat--forks">
                            🔀 {prompt.fork_count}
                        </span>
                    </div>
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
```

**Step 2: Add skeleton/empty state CSS**

Add to `PromptDiscoveryGrid.css`:
```css
.prompt-card-skeleton {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    height: 280px;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
}

.discovery-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    color: rgba(255, 255, 255, 0.6);
}
```

**Step 3: Commit**

```bash
git add src/components/landing/PromptDiscoveryGrid.tsx src/components/landing/PromptDiscoveryGrid.css
git commit -m "feat: make PromptDiscoveryGrid accept props for dynamic data"
```

---

## Task 4: Wire Up LandingPage Search

**Files:**
- Modify: `src/pages/LandingPage.tsx`

**Step 1: Add state and fetch logic**

```typescript
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import { TerminalHero } from '../components/landing/TerminalHero';
import { PromptDiscoveryGrid } from '../components/landing/PromptDiscoveryGrid';
import { LogoAnimation } from '../components/common';
import { AuthModal } from '../components/AuthModal';
import { publicPromptsService } from '../services/publicPromptsService';
import type { PublicPrompt } from '../types/publicPrompt';

// Available categories for filtering
const CATEGORIES = [
    { label: 'All', tags: [] },
    { label: 'Development', tags: ['Development', 'Python', 'Debugging', 'Security'] },
    { label: 'Writing', tags: ['Writing', 'SEO', 'Documentation', 'Creative'] },
    { label: 'Business', tags: ['Marketing', 'Business'] },
    { label: 'Data', tags: ['Data', 'JSON', 'Extraction'] },
];

export const LandingPage = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [prompts, setPrompts] = useState<PublicPrompt[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch prompts on mount and when filters change
    const fetchPrompts = useCallback(async () => {
        setIsLoading(true);
        const categoryTags = CATEGORIES.find(c => c.label === activeCategory)?.tags || [];
        const results = await publicPromptsService.search(
            searchQuery || undefined,
            categoryTags.length > 0 ? categoryTags : undefined
        );
        setPrompts(results);
        setIsLoading(false);
    }, [searchQuery, activeCategory]);

    useEffect(() => {
        fetchPrompts();
    }, [fetchPrompts]);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(fetchPrompts, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSignUp = () => setShowAuthModal(true);
    const handleFeatureCardClick = () => setShowAuthModal(true);

    return (
        <div className="landing-page">
            {/* ... nav unchanged ... */}

            {/* Discovery Section - UPDATED */}
            <section id="discover" className="discovery-section">
                <h2 className="section-title">Explore Prompts</h2>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search for 'Python Debugging', 'SEO Blog Post'..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search public prompts"
                    />
                </div>
                <div className="category-pills">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.label}
                            className={`category-pill ${activeCategory === cat.label ? 'category-pill--active' : ''}`}
                            onClick={() => setActiveCategory(cat.label)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
                <PromptDiscoveryGrid prompts={prompts} isLoading={isLoading} />
            </section>

            {/* ... rest unchanged ... */}
        </div>
    );
};
```

**Step 2: Add active category pill CSS**

Add to `LandingPage.css`:
```css
.category-pill--active {
    background: linear-gradient(135deg, #ff6b35, #ff8c5a);
    color: #fff;
    border-color: transparent;
}
```

**Step 3: Verify in browser**

1. Navigate to http://localhost:5173/
2. Scroll to Discover section
3. Type in search box → should filter prompts
4. Click category pills → should filter by tags

**Step 4: Commit**

```bash
git add src/pages/LandingPage.tsx src/pages/LandingPage.css
git commit -m "feat: wire up landing page search to public prompts"
```

---

## Task 5: Build Verification

**Step 1: Run build**

```bash
npm run build
```

Expected: Build passes

**Step 2: Browser test**

1. Search for "Python" → should show Socratic Python Tutor
2. Click "Development" category → should filter to dev prompts
3. Clear search → should show all prompts

---

## Summary

| Component | Purpose |
|-----------|---------|
| `public_prompts` table | Supabase table with public RLS |
| `publicPromptsService` | Fetches/searches public prompts |
| `PublicPrompt` type | Type definition for public prompts |
| Updated `PromptDiscoveryGrid` | Accepts props instead of hardcoded data |
| Updated `LandingPage` | Search state + category filters |
