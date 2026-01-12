# Landing Page Enhancements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement pagination (Load More), context-aware dynamic icons, and a star rating system for the Landing Page prompt discovery grid.

**Architecture:** 
- **Pagination:** Client-side state in `LandingPage` manages page number. `publicPromptsService` updated to support offset-based fetching.
- **Icons:** `PromptIcon` component enhanced to accept `tags` and map them to relevant Lucide icons, improving visual variety.
- **Ratings:** New interactive `StarRating` component. Updates `public_prompts` table (optimistic UI) and `user_ratings` (if exists, or just direct column update for now) via Supabase.

**Tech Stack:** React, TypeScript, Supabase Client, Lucide React, CSS Modules.

---

### Task 1: Public Prompts Service Pagination

**Files:**
- Modify: `src/services/publicPromptsService.ts`

**Step 1: Write the failing test**
*Note: Since we are modifying a service that interacts with Supabase, we will mock the service call or create a pure unit test for the filter logic if possible, but integration testing is harder. We will verify by checking the offset logic.*

**Step 1: Update Search Signature**

Modify `search` method to accept `page` (default 1) and `limit` (default 9).

```typescript
// src/services/publicPromptsService.ts
async search(query?: string, tags?: string[], page = 1, limit = 9): Promise<PublicPrompt[]> {
    // ...
}
```

**Step 2: Implement Offset Logic**

```typescript
const from = (page - 1) * limit;
const to = from + limit - 1;

let request = supabase
    // ... existing query building
    .range(from, to);
```

**Step 3: Commit**
```bash
git add src/services/publicPromptsService.ts
git commit -m "feat(service): add pagination support to public prompts search"
```

---

### Task 2: Landing Page "Load More" UI

**Files:**
- Modify: `src/pages/LandingPage.tsx`
- Modify: `src/pages/LandingPage.css`

**Step 1: Add State for Pagination**

```typescript
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
```

**Step 2: Implement Load More Handler**

```typescript
const handleLoadMore = () => {
    setPage(prev => prev + 1);
};
```

**Step 3: Update Fetch Logic to Append**

```typescript
// Inside fetchPrompts or useEffect
const results = await publicPromptsService.search(..., page, 9);
if (page === 1) {
    setPrompts(results);
} else {
    setPrompts(prev => [...prev, ...results]);
}
setHasMore(results.length === 9); // Simple check
```

**Step 4: Add Load More Button UI**

```tsx
{hasMore && (
    <div className="discovery-load-more">
        <button onClick={handleLoadMore}>Load More</button>
    </div>
)}
```

**Step 5: Commit**
```bash
git add src/pages/LandingPage.tsx src/pages/LandingPage.css
git commit -m "feat(ui): implement load more pagination on landing page"
```

---

### Task 3: Dynamic Icons based on Tags

**Files:**
- Modify: `src/components/common/PromptIcon.tsx`
- Modify: `src/components/landing/PromptDiscoveryGrid.tsx`

**Step 1: Update PromptIcon Props**

```typescript
interface PromptIconProps {
    type: string;
    tags?: string[]; // Add tags prop
    // ...
}
```

**Step 2: Implement Tag-based Icon Logic**

Map common tags to Lucide icons (e.g., Python -> Code, Business -> Briefcase, SEO -> Search).

```typescript
const getIcon = () => {
    // Check tags first for specific icons
    if (tags?.some(t => t.toLowerCase() === 'python')) return <Code />;
    if (tags?.some(t => t.toLowerCase().includes('business'))) return <Briefcase />;
    // ... existing type fallback
}
```

**Step 3: Pass tags from Grid**

```tsx
// src/components/landing/PromptDiscoveryGrid.tsx
<PromptIcon type={prompt.type} tags={prompt.tags} size="md" />
```

**Step 4: Commit**
```bash
git add src/components/common/PromptIcon.tsx src/components/landing/PromptDiscoveryGrid.tsx
git commit -m "feat(ui): implement dynamic icons based on prompt tags"
```

---

### Task 4: Star Rating System

**Files:**
- Create: `src/components/common/StarRating.tsx`
- Create: `src/components/common/StarRating.css`
- Modify: `src/components/landing/PromptDiscoveryGrid.tsx`
- Modify: `src/services/publicPromptsService.ts`

**Step 1: Create StarRating Component**

Interactive component that takes `rating`, `onChange`, and `readonly`.

**Step 2: Add ratePrompt method to Service**

```typescript
async ratePrompt(id: string, rating: number): Promise<void> {
    // Call Supabase RPC or update row
    // For now: implement simple optimistic update or console log if backend not ready
}
```

**Step 3: Integrate into Grid**

Replace the static start icon with `<StarRating>` component.
Show "Login to rate" tooltip if unauthenticated.

**Step 4: Commit**
```bash
git add src/components/common/StarRating.tsx src/components/common/StarRating.css src/services/publicPromptsService.ts src/components/landing/PromptDiscoveryGrid.tsx
git commit -m "feat(ui): add star rating component and integration"
```
