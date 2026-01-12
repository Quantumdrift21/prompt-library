# Remove Collections Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the "Collections" page access from the application, specifically the navigation link and the route.

**Architecture:** Remove route definition in `App.tsx` and navigation link in `DarkLayout.tsx`.

**Tech Stack:** React, React Router, TypeScript

---

### Task 1: Remove Collections Navigation Link

**Files:**
- Modify: `src/components/layout/DarkLayout.tsx`

**Step 1: Write/Update Test (if applicable)**
*Note: No existing layout tests found yet. Will verify manually.*

**Step 2: Modify `DarkLayout.tsx`**

Remove the "Collections" link block from the `nav` section.

```tsx
// Remove this block
<Link
    to="/collections"
    className={`dark-nav__link ${isActive('/collections') ? 'dark-nav__link--active' : ''}`}
>
    Collections
</Link>
```

**Step 3: Verification**
- Manual: Check that "Collections" link is gone from the header.

---

### Task 2: Remove Collections Route

**Files:**
- Modify: `src/App.tsx`

**Step 1: Write/Update Test (if applicable)**
*Note: No existing route tests found yet. Will verify manually.*

**Step 2: Modify `App.tsx`**

Remove the route definition for `/collections`.

```tsx
// Remove this line
<Route path="/collections" element={<CollectionsGateway />} />
```
And remove the import:
```tsx
import { CollectionsGateway } from './pages/CollectionsGateway';
```

**Step 3: Verification**
- Manual: Try to navigate to `/collections` manually. Should redirect to home or 404 (or `*` fallback).

---

## Verification Plan

### Automated Tests
- Run `npm test` to ensure no regressions if any tests exist.
- Command: `npm test`

### Manual Verification
1.  **Open the app** in the browser.
2.  **Verify Header**: Confirm "Collections" link is missing from the top navigation bar.
3.  **Verify Routing**: Manually type URL `/collections` and confirm it redirects to `/` or shows the fallback.
