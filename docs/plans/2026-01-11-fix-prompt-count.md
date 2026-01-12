# Prompt Count Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the "284 of 284" count mismatch by integrating "Public/Common" prompts into the main Prompt Library view, ensuring the user sees the full set of available prompts.

**Architecture:** 
Currently, `App.tsx` only fetches local user prompts from `IndexedDB`. We need to modify the data fetching logic to also retrieve public prompts from `publicPromptsService` (Supabase/Fallback), map them to the `Prompt` interface, and merge them with the local list. We will also deal with search/filter logic to ensure it applies to the merged set.

**Tech Stack:** React, TypeScript, IndexedDB, Supabase

---

### Task 1: Update Prompt Type Definition

**Files:**
- Modify: `src/types/prompt.ts`

**Step 1: Update `Prompt` interface**
Add optional fields to `Prompt` to support public data without breaking existing local prompts.

```typescript
export interface Prompt {
  // ... existing fields
  
  /** Whether the prompt is a public/community prompt */
  is_public?: boolean;
  
  /** Author name for public prompts */
  author_name?: string;
  
  /** Community rating */
  rating?: number;
  
  /** Fork/Copy count */
  fork_count?: number;
}
```

**Step 2: Verify**
Run build to ensure no breaking type errors (should be safe as fields are optional).
`npm run build`

**Step 3: Commit**
`git add src/types/prompt.ts`
`git commit -m "feat: add public fields to Prompt type"`

---

### Task 2: Integrate Public Prompts in App.tsx

**Files:**
- Modify: `src/App.tsx`

**Step 1: Import Service**
Import `publicPromptsService` and `PublicPrompt`.

**Step 2: Create Mapper Function**
Create a helper (inside `App.tsx` or util) to convert `PublicPrompt` -> `Prompt`.
- `user_id` -> 'system'
- `is_public` -> true
- Map other matching fields.

**Step 3: Update `refreshPrompts` (Initial Load)**
Modify `refreshPrompts` to:
1. Fetch local: `indexedDbService.getAll()`
2. Fetch public: `publicPromptsService.getAll()`
3. Map public -> `Prompt[]`
4. Set `prompts` state to `[...local, ...mappedPublic]`

**Step 4: Update `doSearch` (Search Logic)**
Modify the search effect:
1. Local Search: `indexedDbService.search(query)`
2. Public Search: `publicPromptsService.search(query)`
3. Map public results.
4. Merge and Set state.

**Step 5: Verify**
- Run `npm run dev`.
- Check if prompt count increases (e.g. > 284).
- Verify basic "Recent" sorting works on the merged list.

**Step 6: Commit**
`git add src/App.tsx`
`git commit -m "feat: integrate public prompts into prompt library"`

---

### Task 3: Update PromptCard UI

**Files:**
- Modify: `src/components/PromptCard.tsx`
- Modify: `src/components/PromptCard.css` (Style badge)

**Step 1: Add Badge UI**
In `PromptCard`, conditional render a "Public" or "Community" badge/icon if `prompt.is_public` is true.

**Step 2: Style Updates**
Add CSS for the public badge (e.g., specific color, distinct from tags).

**Step 3: Verify**
- Browser check: `http://localhost:5173/`
- Ensure public prompts are distinguishable.

**Step 4: Commit**
`git add src/components/PromptCard.tsx src/components/PromptCard.css`
`git commit -m "ui: add public badge to prompt cards"`

---

### Task 4: Final Verification

**Step 1: Full Build**
`npm run build`

**Step 2: Manual Check**
- Open Library.
- Verify "Total Items" count in Filter Bar includes fallback/bundled public prompts (should be 284 + 6 = 290 if fallback used, or more if Supabase connected).
- Search for a specific public prompt title (e.g., "Socratic").
- Verify it appears.

**Step 3: Final Commit**
`git commit -m "chore: complete prompt count fix"`
