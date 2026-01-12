# Guest Mode for Collections Implementation Plan

**Goal:** Allow non-logged-in users (guests) to access the Collections page to view public prompts ("Discover" view) while hiding authenticated features like creating collections, favorites, or private libraries.

## User Interface Changes
- **Collections Sidebar:**
  - Guests will ONLY see "Discover" and "Tags".
  - "Favorites", "Recent", "My Collections", "Smart Views", and "+ New Collection" button will be hidden.
- **Collections Page:**
  - Guests will be forced to the "Discover" view regardless of the URL parameters (sanity check).
  - Page title will reflect "Discover".

## Proposed Changes

### 1. `src/components/collections/CollectionsSidebar.tsx`
- Add `isGuest` prop to `CollectionsSidebarProps`.
- Wrap private sections (Favorites, Recent, User Collections, Smart Views) in `!isGuest` checks.
- Keep "Discover" and "Tags" visible for all.

### 2. `src/pages/Collections.tsx`
- In `Collections` component:
  - Determine `isGuest` boolean from `!user`.
  - Pass `isGuest` to `CollectionsSidebar`.
  - If `isGuest`, force `publicPrompts` viewing logic even if other params are present (or just rely on the sidebar only offering Discover links).
  - Ensure `PromptDiscoveryGrid` is rendered for guests.

### 3. `src/App.tsx`
- Add a new **public** route for `/collections`.
- It should NOT be wrapped in `ProtectedRoute`.
- It will render the `<Collections />` page component directly (accessing `Collections` import).

## Verification Plan

### Manual Verification
1.  **Guest User:**
    - Open Incognito window or ensure logged out.
    - Go to `/landing` (Landing Page).
    - Click "Collections" in the navigation bar.
    - **Verify:**
        - Redirects to `/collections`.
        - Shows "Discover" view with public prompts.
        - Sidebar shows ONLY "Discover" and "Tags".
        - "New Collection" button is missing.
2.  **Logged-in User:**
    - Log in.
    - Go to `/collections`.
    - **Verify:**
        - All options (Favorites, Recent, My Collections, New Collection) are visible.
        - "Discover" view still works.

### Automated Tests
- No new automated tests planned for this UI/Routing logic change as it relies heavily on visual state and routing verified manually. Existing tests should pass.
