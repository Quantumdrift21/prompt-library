# Resource Radar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Find Resources" feature to the Learn page that generates Google Dork search links to help users find high-quality study materials (PDFs, slides, syllabi) for their chosen topic.

**Architecture:** A pure frontend feature. A new `dorkGeneratorService` will contain templates for different resource types. A `ResourceRadar` UI component will display clickable links that open Google searches in new tabs. No backend/API calls required.

**Tech Stack:** React, TypeScript, lucide-react icons

---

## Task 1: Create the Dork Generator Service

**Files:**
- Create: `src/services/dorkGeneratorService.ts`

**Step 1: Create the service file with types and templates**

```typescript
// src/services/dorkGeneratorService.ts

export interface DorkLink {
    label: string;
    description: string;
    url: string;
    icon: 'file-text' | 'presentation' | 'book-open' | 'users' | 'graduation-cap';
}

interface DorkTemplate {
    label: string;
    description: string;
    icon: DorkLink['icon'];
    query: (topic: string) => string;
}

const DORK_TEMPLATES: DorkTemplate[] = [
    {
        label: 'University PDFs',
        description: 'Find academic PDFs from .edu domains',
        icon: 'graduation-cap',
        query: (topic) => `filetype:pdf site:edu "${topic}"`
    },
    {
        label: 'Lecture Slides',
        description: 'Find PowerPoint presentations',
        icon: 'presentation',
        query: (topic) => `filetype:ppt OR filetype:pptx "${topic}" lecture OR notes`
    },
    {
        label: 'Course Syllabi',
        description: 'Find university course outlines',
        icon: 'book-open',
        query: (topic) => `filetype:pdf site:edu "${topic}" syllabus OR "course outline"`
    },
    {
        label: 'Research Papers',
        description: 'Find papers on Google Scholar',
        icon: 'file-text',
        query: (topic) => `site:scholar.google.com "${topic}"`
    },
    {
        label: 'Reddit Discussions',
        description: 'Find community recommendations',
        icon: 'users',
        query: (topic) => `site:reddit.com "best resource" OR "recommend" "${topic}"`
    }
];

export const dorkGeneratorService = {
    generateLinks(topic: string): DorkLink[] {
        if (!topic || topic.trim().length === 0) {
            return [];
        }
        const safeTopic = topic.trim();
        return DORK_TEMPLATES.map(template => ({
            label: template.label,
            description: template.description,
            icon: template.icon,
            url: `https://www.google.com/search?q=${encodeURIComponent(template.query(safeTopic))}`
        }));
    }
};
```

**Step 2: Verify the build**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add src/services/dorkGeneratorService.ts
git commit -m "feat(services): add dorkGeneratorService for Resource Radar"
```

---

## Task 2: Create the ResourceRadar UI Component

**Files:**
- Create: `src/components/study/ResourceRadar.tsx`
- Create: `src/components/study/ResourceRadar.css`

**Step 1: Create the CSS file**

```css
/* src/components/study/ResourceRadar.css */

.resource-radar {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 1.25rem;
    margin-top: 1rem;
}

.radar-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.radar-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
}

.radar-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.radar-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: rgba(0, 212, 255, 0.05);
    border: 1px solid rgba(0, 212, 255, 0.15);
    border-radius: 10px;
    text-decoration: none;
    color: var(--color-text-primary);
    transition: all 0.2s ease;
}

.radar-link:hover {
    background: rgba(0, 212, 255, 0.12);
    border-color: rgba(0, 212, 255, 0.3);
    transform: translateX(4px);
}

.radar-link-icon {
    color: var(--color-accent-teal);
    flex-shrink: 0;
}

.radar-link-content {
    flex: 1;
    min-width: 0;
}

.radar-link-label {
    font-weight: 500;
    font-size: 0.9rem;
}

.radar-link-desc {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    margin-top: 2px;
}

.radar-empty {
    color: var(--color-text-secondary);
    font-size: 0.85rem;
    text-align: center;
    padding: 1rem;
}
```

**Step 2: Create the React component**

```tsx
// src/components/study/ResourceRadar.tsx
import { Radar, FileText, Presentation, BookOpen, Users, GraduationCap, ExternalLink } from 'lucide-react';
import { dorkGeneratorService, type DorkLink } from '../../services/dorkGeneratorService';
import './ResourceRadar.css';

interface ResourceRadarProps {
    topic: string;
}

const ICON_MAP = {
    'file-text': FileText,
    'presentation': Presentation,
    'book-open': BookOpen,
    'users': Users,
    'graduation-cap': GraduationCap
};

export const ResourceRadar = ({ topic }: ResourceRadarProps) => {
    const links: DorkLink[] = dorkGeneratorService.generateLinks(topic);

    return (
        <div className="resource-radar">
            <div className="radar-header">
                <Radar size={18} className="icon-3d icon-3d-cyan" />
                <h3>Resource Radar</h3>
            </div>
            {links.length > 0 ? (
                <div className="radar-links">
                    {links.map((link, index) => {
                        const IconComponent = ICON_MAP[link.icon];
                        return (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="radar-link"
                            >
                                <IconComponent size={18} className="radar-link-icon" />
                                <div className="radar-link-content">
                                    <div className="radar-link-label">{link.label}</div>
                                    <div className="radar-link-desc">{link.description}</div>
                                </div>
                                <ExternalLink size={14} style={{ opacity: 0.5 }} />
                            </a>
                        );
                    })}
                </div>
            ) : (
                <p className="radar-empty">Enter a topic to find resources</p>
            )}
        </div>
    );
};
```

**Step 3: Verify the build**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/components/study/ResourceRadar.tsx src/components/study/ResourceRadar.css
git commit -m "feat(components): add ResourceRadar UI component"
```

---

## Task 3: Integrate ResourceRadar into the LearnPage

**Files:**
- Modify: `src/pages/LearnPage.tsx`

**Step 1: Import the component**

Add after line 6 in `LearnPage.tsx`:
```tsx
import { ResourceRadar } from '../components/study/ResourceRadar';
```

**Step 2: Add to the layout**

Find the `<aside className="method-sidebar">` section (around line 55). Add the `ResourceRadar` component below the `<MethodSidebar>`:

```tsx
<aside className="method-sidebar">
    <MethodSidebar method={currentMethod} />
    <ResourceRadar topic={sessionData?.topic || ''} />
</aside>
```

**Step 3: Verify the build**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Manual Verification**

1. Navigate to `http://localhost:5173/learn`
2. Enter a topic like "Machine Learning"
3. Verify that 5 resource links appear in the left sidebar
4. Click a link and verify it opens Google in a new tab with the correct dork query

**Step 5: Commit**

```bash
git add src/pages/LearnPage.tsx
git commit -m "feat(learn): integrate ResourceRadar into sidebar"
```

---

## Task 4: Final Cleanup and Push

**Files:**
- No new files

**Step 1: Run final build**

Run: `npm run build`
Expected: Clean build with no errors or warnings related to new code.

**Step 2: Push to trigger Vercel deployment**

```bash
git push origin main
```

---

## Summary

| Task | Description | Est. Time |
|------|-------------|-----------|
| 1 | Create dorkGeneratorService | 3-5 min |
| 2 | Create ResourceRadar component | 5-8 min |
| 3 | Integrate into LearnPage | 3-5 min |
| 4 | Cleanup and push | 2 min |

**Total estimated time: 15-20 minutes**
