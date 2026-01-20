# UI/UX Improvements & Learn Page Fix - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the missing Learn page route, and implement priority UI/UX improvements identified in the comprehensive audit.

**Architecture:** This plan addresses critical bugs first (missing route), then progressively enhances user experience with empty states, navigation improvements, loading feedback, and save confirmations. Changes are isolated to individual components without architectural changes.

**Tech Stack:** React, TypeScript, react-router-dom, Lucide React icons, CSS custom properties

---

## Task 1: Fix Missing `/learn` Route (Critical Bug)

**Files:**
- Modify: `src/App.tsx:278-316`

**Step 1: Add LearnPage import**

Add to the imports section at the top of App.tsx (around line 11):

```tsx
import { LearnPage } from './pages/LearnPage';
```

**Step 2: Add /learn route**

Add after line 311 (after `/settings` route, before `{/* Fallback */}`):

```tsx
      <Route path="/learn" element={
        <ProtectedRoute>
          <LearnPage />
        </ProtectedRoute>
      } />
```

**Step 3: Verify the fix**

Run: Open browser to `http://localhost:5173/learn`
Expected: Learn page loads with "Method-First Learning" header

**Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "fix: add missing /learn route to App.tsx"
```

---

## Task 2: Improve Dashboard Empty States

**Files:**
- Modify: `src/pages/DashboardHome.tsx`

**Step 1: Update stats display to show CTAs when zero**

Find the stats-grid section (around line 295-330) and update:

```tsx
{/* Usage Stats Card */}
<div className="insight-card">
    <div className="insight-card-header">
        <h3>Usage Stats</h3>
    </div>
    <div className="insight-card-content stats-grid">
        <div className="stat-mini">
            <span className="stat-mini-value">{stats.totalPrompts || '—'}</span>
            <span className="stat-mini-label">Total</span>
        </div>
        <div className="stat-mini">
            <span className="stat-mini-value">{stats.favorites || '—'}</span>
            <span className="stat-mini-label">Favorites</span>
        </div>
        <div className="stat-mini">
            <span className="stat-mini-value">{stats.totalCollections || '—'}</span>
            <span className="stat-mini-label">Collections</span>
        </div>
        <div className="stat-mini">
            <span className="stat-mini-value">{activityData.reduce((sum, d) => sum + d.count, 0) || '—'}</span>
            <span className="stat-mini-label">This Week</span>
        </div>
    </div>
</div>
```

**Step 2: Update Recent Prompts empty state**

Find the "No prompts yet" message and update:

```tsx
) : (
    <div className="insight-empty-state">
        <p className="insight-empty">No prompts yet</p>
        <button className="empty-cta" onClick={handleCreatePrompt}>
            Create your first prompt →
        </button>
    </div>
)}
```

**Step 3: Add CSS for empty state CTA**

Add to `src/pages/DashboardHome.css`:

```css
.insight-empty-state {
    text-align: center;
    padding: 1rem;
}

.empty-cta {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, var(--accent-orange), var(--accent-pink));
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 0.85rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.empty-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
}
```

**Step 4: Verify**

Run: Navigate to `/home` as a new user with no prompts
Expected: "Create your first prompt →" button appears instead of just "No prompts yet"

**Step 5: Commit**

```bash
git add src/pages/DashboardHome.tsx src/pages/DashboardHome.css
git commit -m "feat: improve dashboard empty states with engaging CTAs"
```

---

## Task 3: Add Active State to Current Sidebar Link

**Files:**
- Modify: `src/pages/DashboardHome.tsx`
- Modify: `src/pages/DashboardHome.css`

**Step 1: Import useLocation hook**

Update imports:

```tsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
```

**Step 2: Add location check**

Add after `const navigate = useNavigate();`:

```tsx
const location = useLocation();
const isActive = (path: string) => location.pathname === path;
```

**Step 3: Update sidebar links to use active class**

```tsx
<Link to="/home" className={`sidebar-link ${isActive('/home') ? 'sidebar-link--active' : ''}`}>
    <Home size={18} className="sidebar-icon icon-3d icon-3d-cyan" />
    <span className="sidebar-label">Home</span>
</Link>
<Link to="/library" className={`sidebar-link ${isActive('/library') ? 'sidebar-link--active' : ''}`}>
    <Library size={18} className="sidebar-icon icon-3d icon-3d-cyan" />
    <span className="sidebar-label">Library</span>
</Link>
```

(Apply same pattern to all sidebar links)

**Step 4: Add active link CSS**

```css
.sidebar-link--active {
    background: rgba(0, 212, 255, 0.15);
    border-left: 3px solid var(--accent-cyan);
}

.sidebar-link--active .sidebar-label {
    color: var(--accent-cyan);
}
```

**Step 5: Verify**

Run: Navigate to `/home`, check that Home link is highlighted
Expected: Home link has cyan left border and background highlight

**Step 6: Commit**

```bash
git add src/pages/DashboardHome.tsx src/pages/DashboardHome.css
git commit -m "feat: add active state styling to sidebar navigation"
```

---

## Task 4: Add Save Confirmation Toast to Settings

**Files:**
- Create: `src/components/common/Toast.tsx`
- Create: `src/components/common/Toast.css`
- Modify: `src/pages/SettingsPage.tsx`

**Step 1: Create Toast component**

Create `src/components/common/Toast.tsx`:

```tsx
import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './Toast.css';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

/**
 * Toast notification component for displaying feedback messages.
 */
export const Toast = ({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) => {
    useEffect(() => {
        if (isVisible && duration) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const icons = {
        success: <CheckCircle size={20} />,
        error: <XCircle size={20} />,
        info: <AlertCircle size={20} />
    };

    return (
        <div className={`toast toast--${type}`}>
            <span className="toast__icon">{icons[type]}</span>
            <span className="toast__message">{message}</span>
            <button className="toast__close" onClick={onClose}>×</button>
        </div>
    );
};
```

**Step 2: Create Toast CSS**

Create `src/components/common/Toast.css`:

```css
.toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    border-radius: 12px;
    background: rgba(30, 30, 40, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    animation: slideInUp 0.3s ease;
    z-index: 1000;
}

@keyframes slideInUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.toast--success {
    border-color: rgba(0, 212, 255, 0.3);
}

.toast--success .toast__icon {
    color: #00d4ff;
}

.toast--error {
    border-color: rgba(255, 107, 53, 0.3);
}

.toast--error .toast__icon {
    color: #ff6b35;
}

.toast--info {
    border-color: rgba(168, 85, 247, 0.3);
}

.toast--info .toast__icon {
    color: #a855f7;
}

.toast__message {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
}

.toast__close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 4px;
}

.toast__close:hover {
    color: white;
}
```

**Step 3: Export Toast from common index**

Add to `src/components/common/index.ts`:

```tsx
export { Toast } from './Toast';
```

**Step 4: Add Toast to SettingsPage**

In `src/pages/SettingsPage.tsx`, add state and rendering:

```tsx
import { Toast } from '../components/common';

// Add state
const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

// In handleSave function, after successful save:
setToast({ message: 'Settings saved successfully!', type: 'success' });

// Add Toast at end of component return:
{toast && (
    <Toast
        message={toast.message}
        type={toast.type}
        isVisible={!!toast}
        onClose={() => setToast(null)}
    />
)}
```

**Step 5: Verify**

Run: Go to Settings, make a change, click Save
Expected: Green toast appears at bottom-right saying "Settings saved successfully!"

**Step 6: Commit**

```bash
git add src/components/common/Toast.tsx src/components/common/Toast.css src/components/common/index.ts src/pages/SettingsPage.tsx
git commit -m "feat: add toast notifications for settings save confirmation"
```

---

## Task 5: Improve Loading States with Skeleton Loaders

**Files:**
- Create: `src/components/common/Skeleton.tsx`
- Create: `src/components/common/Skeleton.css`
- Modify: `src/pages/Collections.tsx`

**Step 1: Create Skeleton component**

Create `src/components/common/Skeleton.tsx`:

```tsx
import './Skeleton.css';

interface SkeletonProps {
    width?: string;
    height?: string;
    variant?: 'text' | 'rectangular' | 'circular';
    className?: string;
}

/**
 * Skeleton loader component for content placeholders.
 */
export const Skeleton = ({ 
    width = '100%', 
    height = '1rem', 
    variant = 'text',
    className = ''
}: SkeletonProps) => {
    return (
        <div 
            className={`skeleton skeleton--${variant} ${className}`}
            style={{ width, height }}
        />
    );
};

/**
 * Pre-built skeleton for prompt cards.
 */
export const PromptCardSkeleton = () => (
    <div className="prompt-card-skeleton">
        <div className="skeleton-header">
            <Skeleton variant="circular" width="40px" height="40px" />
            <Skeleton width="60%" height="1.2rem" />
        </div>
        <Skeleton height="0.9rem" />
        <Skeleton height="0.9rem" width="80%" />
        <div className="skeleton-footer">
            <Skeleton width="30%" height="1.5rem" />
            <Skeleton width="30%" height="1.5rem" />
        </div>
    </div>
);
```

**Step 2: Create Skeleton CSS**

Create `src/components/common/Skeleton.css`:

```css
.skeleton {
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.05) 25%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0.05) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.skeleton--circular {
    border-radius: 50%;
}

.skeleton--rectangular {
    border-radius: 8px;
}

.prompt-card-skeleton {
    background: rgba(30, 30, 40, 0.6);
    border-radius: 16px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.skeleton-header {
    display: flex;
    align-items: center;
    gap: 12px;
}

.skeleton-footer {
    display: flex;
    gap: 12px;
    margin-top: 0.5rem;
}
```

**Step 3: Export from common index**

Add to `src/components/common/index.ts`:

```tsx
export { Skeleton, PromptCardSkeleton } from './Skeleton';
```

**Step 4: Use skeleton in Collections loading state**

In `src/pages/Collections.tsx`, update the loading state:

```tsx
import { PromptCardSkeleton } from '../components/common';

// In loading section:
{isLoading ? (
    <div className="prompts-grid">
        {[...Array(6)].map((_, i) => (
            <PromptCardSkeleton key={i} />
        ))}
    </div>
) : (
    // existing grid content
)}
```

**Step 5: Verify**

Run: Navigate to `/collections`, observe loading state
Expected: 6 skeleton cards animate with shimmer effect while loading

**Step 6: Commit**

```bash
git add src/components/common/Skeleton.tsx src/components/common/Skeleton.css src/components/common/index.ts src/pages/Collections.tsx
git commit -m "feat: add skeleton loaders for improved loading UX"
```

---

## Task 6: Improve Search Bar Visibility on Landing Page

**Files:**
- Modify: `src/components/landing/PromptDiscoveryGrid.css`

**Step 1: Update search input styles**

Find the search input styling and update:

```css
.discovery-search__input {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 2.75rem;
    background: rgba(30, 30, 40, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.discovery-search__input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.discovery-search__input:focus {
    outline: none;
    border-color: var(--accent-cyan);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.15);
    background: rgba(30, 30, 40, 0.95);
}
```

**Step 2: Verify**

Run: Navigate to `/` (landing page), check search bar
Expected: Search placeholder is now clearly visible (50% opacity white)

**Step 3: Commit**

```bash
git add src/components/landing/PromptDiscoveryGrid.css
git commit -m "fix: improve search bar visibility on landing page"
```

---

## Task 7: Add "Show More" to Tags Sidebar in Collections

**Files:**
- Modify: `src/pages/Collections.tsx`
- Modify: `src/pages/Collections.css`

**Step 1: Add state for expanded tags**

```tsx
const [tagsExpanded, setTagsExpanded] = useState(false);
const VISIBLE_TAGS_COUNT = 8;
```

**Step 2: Update tags rendering**

```tsx
<div className="sidebar-tags-list">
    {(tagsExpanded ? availableTags : availableTags.slice(0, VISIBLE_TAGS_COUNT)).map(tag => (
        <button
            key={tag}
            className={`tag-chip ${selectedTag === tag ? 'tag-chip--active' : ''}`}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
        >
            #{tag}
        </button>
    ))}
</div>
{availableTags.length > VISIBLE_TAGS_COUNT && (
    <button 
        className="tags-toggle" 
        onClick={() => setTagsExpanded(!tagsExpanded)}
    >
        {tagsExpanded ? 'Show Less' : `+${availableTags.length - VISIBLE_TAGS_COUNT} more`}
    </button>
)}
```

**Step 3: Add CSS for toggle**

```css
.tags-toggle {
    background: none;
    border: none;
    color: var(--accent-cyan);
    font-size: 0.8rem;
    cursor: pointer;
    padding: 0.5rem 0;
    width: 100%;
    text-align: left;
}

.tags-toggle:hover {
    text-decoration: underline;
}
```

**Step 4: Verify**

Run: Navigate to `/collections`, check tags sidebar
Expected: Only 8 tags shown initially with "+X more" button

**Step 5: Commit**

```bash
git add src/pages/Collections.tsx src/pages/Collections.css
git commit -m "feat: add show more/less toggle to tags sidebar"
```

---

## Summary Checklist

| Task | Description | Priority |
|------|-------------|----------|
| 1 | Fix missing `/learn` route | P0 Critical |
| 2 | Dashboard empty state CTAs | P2 Minor |
| 3 | Sidebar active link styling | P2 Minor |
| 4 | Settings save toast | P2 Minor |
| 5 | Skeleton loading states | P2 Minor |
| 6 | Search bar visibility | P2 Minor |
| 7 | Tags "Show More" toggle | P2 Minor |

---

**Total Estimated Time:** 45-60 minutes

**After completing all tasks, run full verification:**
1. `npm run lint` - Check for any lint errors
2. `npm run test` - Run unit tests
3. Navigate through all pages manually to verify changes
