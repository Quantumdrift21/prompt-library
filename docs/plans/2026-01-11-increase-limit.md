# Increase Public Prompt Limit Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Resolve the discrepancy between the 900+ prompts in Supabase/PROMPTS.md and the ~284 prompts visible in the app by increasing the fetch limit.

**Architecture:** 
The `publicPromptsService.ts` currently has a hardcoded `.limit(12)` in its `search` function. We will increase this to `1000` to allow fetching the full dataset the user has migrated. 

*Note: For a dataset of this size (900+), proper pagination is the ideal long-term solution, but increasing the limit is the immediate fix to satisfy the "compare" request.*

**Tech Stack:** TypeScript, Supabase Client

---

### Task 1: Update Public Prompts Service

**Files:**
- Modify: `src/services/publicPromptsService.ts`

**Step 1: Increase Limit**
Change `.limit(12)` to `.limit(1000)` in the `search` function.

```typescript
// src/services/publicPromptsService.ts

const { data, error } = await request.limit(1000); // Increased from 12
```

**Step 2: Verify**
- Run `npm run dev`
- Check the "Total Items" count in the Filter Bar. It should jump from ~284 to ~1200+.
- Search for a prompt known to be in `PROMPTS.md` but not currently visible.

**Step 3: Commit**
`git add src/services/publicPromptsService.ts`
`git commit -m "fix: increase public prompt fetch limit to 1000"`

---

### Task 2: Verification

**Step 1: Manual Check**
- Confirm total count in UI matches expectations (Local + ~900 Public).
