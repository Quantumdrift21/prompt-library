# Unify Discover View Implementation Plan

**Goal:** Ensure the "Discover" view in Collections lists ALL prompts, including the user's local "Collection" prompts, effectively merging Public and Private data in this view.

## User Interface Changes
- **Discover Grid:** Will now display local private prompts alongside public community prompts.
- **Badges:** Local prompts will look similar to public ones but with default metadata (e.g., Author: "You").

## Proposed Changes

### 1. `src/pages/Collections.tsx`
- **Logic Update:** inside `loadData` for `discover` view:
  - Fetch `indexedDbService.getAll()` in parallel with `publicPromptsService.getAll()`.
  - Map local prompts to `PublicPrompt` interface using a helper (defaults for missing fields like `rating`, `model`).
  - Merge the arrays: `[...publicData, ...localMapped]`.
  - Update `setPublicPrompts` with the merged list.

### 2. `src/utils/promptMappers.ts` (New or Inline)
- Create a helper `mapPrivateToPublic(prompt: Prompt, authorName: string): PublicPrompt`.
  - `id`: `prompt.id`
  - `title`: `prompt.title`
  - `content`: `prompt.content`
  - `author_name`: passed `authorName` (e.g., 'You' or 'Guest')
  - `rating`: 0 (or null handling if UI supports it)
  - `type`: 'Roleplay' (default) or detect
  - `tags`: `prompt.tags`

## Verification Plan

### Manual Verification
1.  **Logged Out (Same Browser):**
    - Go to `/collections`.
    - **Verify:** "Discover" view shows prompts from the local library.
2.  **Logged In:**
    - Go to `/collections?view=discover`.
    - **Verify:** "Discover" view shows BOTH Public prompts (if any) and Local prompts.
3.  **Guest (Incognito):**
    - Go to `/collections`.
    - **Verify:** Shows Public prompts (empty if none), Local is empty.
4.  **Creation:**
    - Create a new prompt in Library.
    - Go to "Discover".
    - **Verify:** The new prompt appears there.

### Automated Tests
- N/A - pure logic/UI merge.
