# Dashboard UI Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the DashboardHome component based on user feedback to streamline the sidebar navigation, improve prompt browsing with a functional Favorites tab, add a Create New Prompt modal, and replace Quick Actions with a more useful feature.

**Architecture:** This is a UI-focused refactor of `DashboardHome.tsx`. We will modify the sidebar layout, remove redundant elements, wire up the Favorites tab to filter prompts, create a modal-based prompt creation flow, and replace the Quick Actions card.

**Tech Stack:** React, lucide-react icons, existing Modal component, PromptEditor component

---

## Summary of Changes from User Feedback

Based on the annotated screenshot, here are the 7 changes requested:

| # | Change | Location |
|---|--------|----------|
| 1 | Remove metric icons (Grid, Star, Folder) from sidebar | `metric-icon-group` section |
| 2 | Remove "Create New" button from sidebar nav | `sidebar-nav` section |
| 3 | Remove "Home" link from sidebar nav | `sidebar-nav` section |
| 4 | Add icon to "Library" button in sidebar | `sidebar-nav` section |
| 5 | Remove "Collections" tab from main content tabs | `dashboard-tabs` section |
| 6 | Wire up "Favorites" tab to display favorite prompts | `dashboard-tabs` and Recent Prompts list |
| 7 | Add "Create New Prompt" button to header + Modal popup | Top-right of greeting banner |
| 8 | Replace "Quick Actions" card with different feature | Right panel |

---

## Task 1: Remove Metric Icons from Sidebar

**Files:**
- Modify: `src/pages/DashboardHome.tsx:159-163`

**Step 1: Remove the metric-icon-group div**

Delete lines 159-163 which contain:
```tsx
<div className="metric-icon-group">
    <Grid className="metric-icon icon-3d icon-3d-cyan" />
    <Star className="metric-icon icon-3d icon-3d-orange" />
    <FolderClosed className="metric-icon icon-3d icon-3d-purple" />
</div>
```

**Step 2: Remove unused icon imports**

Remove `Grid` from the lucide-react import at line 7 (if no longer used elsewhere).

**Step 3: Verify the build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 4: Commit**

```bash
git add src/pages/DashboardHome.tsx
git commit -m "refactor(dashboard): remove metric icons from sidebar"
```

---

## Task 2: Remove "Create New" and "Home" from Sidebar Nav

**Files:**
- Modify: `src/pages/DashboardHome.tsx:195-202`

**Step 1: Remove the Create New button**

Delete lines 195-198:
```tsx
<button className="sidebar-link" onClick={handleCreatePrompt}>
    <Sparkles size={18} className="sidebar-icon icon-3d icon-3d-orange" />
    <span className="sidebar-label">Create New</span>
</button>
```

**Step 2: Remove the Home link**

Delete lines 199-202:
```tsx
<Link to="/home" className={`sidebar-link ${isActive('/home') ? 'sidebar-link--active' : ''}`}>
    <Home size={18} className="sidebar-icon icon-3d icon-3d-cyan" />
    <span className="sidebar-label">Home</span>
</Link>
```

**Step 3: Clean up unused imports**

Remove `Home` from lucide-react imports (line 7).

**Step 4: Verify the build**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/pages/DashboardHome.tsx
git commit -m "refactor(dashboard): remove Create New and Home from sidebar nav"
```

---

## Task 3: Ensure Library Has Proper Icon

**Files:**
- Modify: `src/pages/DashboardHome.tsx:203-206`

**Step 1: Verify Library link has icon**

The current code already has an icon:
```tsx
<Link to="/library" className={`sidebar-link ${isActive('/library') ? 'sidebar-link--active' : ''}`}>
    <Library size={18} className="sidebar-icon icon-3d icon-3d-cyan" />
    <span className="sidebar-label">Library</span>
</Link>
```

If it's missing or wrong, ensure `Library` is imported from lucide-react and used correctly.

**Step 2: No changes needed if icon already present**

Verify visually that the Library icon displays properly.

**Step 3: Commit (if changes made)**

```bash
git add src/pages/DashboardHome.tsx
git commit -m "fix(dashboard): ensure Library button has proper icon"
```

---

## Task 4: Remove "Collections" Tab from Main Content

**Files:**
- Modify: `src/pages/DashboardHome.tsx:276-282`
- Modify: `src/pages/DashboardHome.tsx:27` (state type)

**Step 1: Update tab state type**

Change line 27 from:
```tsx
const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'collections'>('all');
```
To:
```tsx
const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
```

**Step 2: Remove Collections tab button**

Delete lines 276-282:
```tsx
<button
    className={`tab-item ${activeTab === 'collections' ? 'tab-active' : ''}`}
    onClick={() => setActiveTab('collections')}
>
    <FolderClosed size={16} className="tab-icon" style={{ marginRight: 6 }} />
    Collections
</button>
```

**Step 3: Verify the build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/pages/DashboardHome.tsx
git commit -m "refactor(dashboard): remove Collections tab from main content"
```

---

## Task 5: Wire Up Favorites Tab to Show Favorite Prompts

**Files:**
- Modify: `src/pages/DashboardHome.tsx:285-311`

**Step 1: Update the Recent Prompts display logic**

Change the prompt list rendering to filter based on `activeTab`. Replace the current rendering logic:

```tsx
{/* Inside the Recent Prompts card */}
{(() => {
    const displayPrompts = activeTab === 'favorites' 
        ? recentPrompts.filter(p => p.favorite)
        : recentPrompts;
    
    return displayPrompts.length > 0 ? (
        <ul className="recent-list">
            {displayPrompts.slice(0, 4).map(p => (
                <li key={p.id} className="recent-item" onClick={() => navigate(`/library?id=${p.id}`)}>
                    <span className="recent-title">{p.title}</span>
                </li>
            ))}
        </ul>
    ) : (
        <div className="insight-empty-state">
            <p className="insight-empty">
                {activeTab === 'favorites' ? 'No favorite prompts yet' : 'No prompts yet'}
            </p>
            <button className="empty-cta" onClick={handleCreatePrompt}>
                {activeTab === 'favorites' ? 'Browse prompts →' : 'Create your first prompt →'}
            </button>
        </div>
    );
})()}
```

**Step 2: Update card header title**

Change the "Recent Prompts" header to be dynamic:
```tsx
<h3>{activeTab === 'favorites' ? 'Favorite Prompts' : 'Recent Prompts'}</h3>
```

**Step 3: Verify functionality**

Navigate to /home, click Favorites tab, ensure only favorite prompts show.

**Step 4: Commit**

```bash
git add src/pages/DashboardHome.tsx
git commit -m "feat(dashboard): wire Favorites tab to filter favorite prompts"
```

---

## Task 6: Add "Create New Prompt" Button to Header with Modal

**Files:**
- Modify: `src/pages/DashboardHome.tsx` (add state + modal component)

**Step 1: Import Modal and PromptEditor**

Add to imports:
```tsx
import { Modal } from '../components/common/Modal';
import { PromptEditor } from '../components/PromptEditor';
```

**Step 2: Add modal state**

Add after line 27:
```tsx
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
```

**Step 3: Add create button to greeting banner**

In the greeting-banner section (after the refresh button), add:
```tsx
<button 
    className="create-prompt-btn"
    onClick={() => setIsCreateModalOpen(true)}
>
    <Sparkles size={18} />
    Create New Prompt
</button>
```

**Step 4: Add modal at end of component (before closing div)**

```tsx
<Modal
    isOpen={isCreateModalOpen}
    onClose={() => setIsCreateModalOpen(false)}
    title="Create New Prompt"
    size="lg"
>
    <PromptEditor
        prompt={null}
        onSave={async (data) => {
            await indexedDbService.create(data);
            setIsCreateModalOpen(false);
            // Refresh prompts
            const allPrompts = await indexedDbService.getAll();
            setPrompts(allPrompts);
            setRecentPrompts(allPrompts.slice(0, 5));
        }}
        onCancel={() => setIsCreateModalOpen(false)}
        autoFocusTitle
    />
</Modal>
```

**Step 5: Add CSS for the create button**

Add to `src/pages/DashboardHome.css`:
```css
.create-prompt-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: linear-gradient(135deg, var(--color-accent-orange), #ff8f5a);
    border: none;
    border-radius: 12px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.create-prompt-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4);
}
```

**Step 6: Verify the build and functionality**

Run: `npm run build`
Test: Click button, modal opens, fill form, save, prompt appears in list.

**Step 7: Commit**

```bash
git add src/pages/DashboardHome.tsx src/pages/DashboardHome.css
git commit -m "feat(dashboard): add Create New Prompt button with modal popup"
```

---

## Task 7: Replace Quick Actions with "Trending Tags" Feature

**Files:**
- Modify: `src/pages/DashboardHome.tsx:372-391`

**Step 1: Replace Quick Actions card content**

Replace the Quick Actions card with a "Trending Tags" card:

```tsx
{/* Trending Tags Card */}
<div className="insight-card">
    <div className="insight-card-header">
        <h3>Trending Tags</h3>
    </div>
    <div className="insight-card-content tags-cloud">
        {(() => {
            // Get tag counts
            const tagCounts: Record<string, number> = {};
            prompts.forEach(p => {
                p.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            });
            const sortedTags = Object.entries(tagCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6);
            
            return sortedTags.length > 0 ? (
                <div className="tag-pills">
                    {sortedTags.map(([tag, count]) => (
                        <span key={tag} className="tag-pill" onClick={() => navigate(`/library?tag=${tag}`)}>
                            #{tag} <span className="tag-count">({count})</span>
                        </span>
                    ))}
                </div>
            ) : (
                <p className="insight-empty">Add tags to your prompts to see trends</p>
            );
        })()}
    </div>
</div>
```

**Step 2: Add CSS for tag pills**

Add to `src/pages/DashboardHome.css`:
```css
.tags-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tag-pill {
    padding: 6px 12px;
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid rgba(0, 212, 255, 0.3);
    border-radius: 20px;
    color: var(--color-accent-teal);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
}

.tag-pill:hover {
    background: rgba(0, 212, 255, 0.2);
    transform: translateY(-1px);
}

.tag-count {
    opacity: 0.7;
    font-size: 0.75rem;
}
```

**Step 3: Commit**

```bash
git add src/pages/DashboardHome.tsx src/pages/DashboardHome.css
git commit -m "feat(dashboard): replace Quick Actions with Trending Tags feature"
```

---

## Task 8: Final Cleanup and Testing

**Files:**
- Modify: `src/pages/DashboardHome.tsx` (cleanup unused code)

**Step 1: Remove unused imports**

Review imports and remove any that are no longer used after previous tasks:
- `Grid` (if removed from template)
- `Home` (if removed from template)
- Any unused utilities

**Step 2: Run full build**

Run: `npm run build`
Expected: Clean build with no warnings about unused imports

**Step 3: Visual verification**

Navigate through the dashboard and verify:
1. ✅ No metric icons in sidebar
2. ✅ No "Create New" or "Home" in sidebar nav
3. ✅ Library has proper icon
4. ✅ No "Collections" tab
5. ✅ Favorites tab filters prompts
6. ✅ Create button opens modal
7. ✅ Trending Tags shows instead of Quick Actions

**Step 4: Final commit**

```bash
git add .
git commit -m "chore(dashboard): final cleanup after UI redesign"
git push origin main
```

---

## Summary

| Task | Description | Estimated Time |
|------|-------------|----------------|
| 1 | Remove metric icons | 2-3 min |
| 2 | Remove Create New + Home nav | 2-3 min |
| 3 | Verify Library icon | 1 min |
| 4 | Remove Collections tab | 2-3 min |
| 5 | Wire Favorites tab | 5-8 min |
| 6 | Add Create Prompt modal | 10-15 min |
| 7 | Replace Quick Actions | 8-10 min |
| 8 | Final cleanup | 3-5 min |

**Total estimated time: 35-50 minutes**
