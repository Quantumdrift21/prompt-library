# Emoji to 3D Icon Replacement Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan.

**Goal:** Replace all flat emojis with "3D" styled elements or Lucide icons to match the premium glass aesthetics. The user explicitly requested "3D icons" similar to the photo (implied context: high-quality 3D renders or styled icons), replacing *all* emojis found on all pages.

**Strategy:**
1.  **Direct Replacements:** Use `lucide-react` icons as the base.
2.  **3D Styling:** Apply a specific CSS class (e.g., `icon-layer-3d`) to these Lucide icons (or wrappers) to give them a "3D-like" appearance using gradients and drop shadows, since we don't have a library of actual 3D PNGs.
    *   *Alternative:* If the user meant "3D *like* the prompt icons", we reuse the `PromptIcon` component or similar styling.
3.  **Audit & Execute:** Systematically go through identified files.

**Identified Locations:**

1.  **DashboardHome.tsx:**
    *   Sidebar Icons: 📊 (Stats), ⭐ (Fav), 📝 (Prompts), ✨ (Create), 📚 (Library), 📁 (Collections)
    *   Greeting: 👋 (Wave)
    *   Learning Card: 🎮 (Controller), 🏆 (Trophy), 🔥 (Streak)
    *   Quick Actions: ✨, 🔍, ⚙️

2.  **FilterBar.tsx:**
    *   Dropdowns: ↕, ▲, ▼, ✓

3.  **PromptDiscoveryGrid.tsx:**
    *   Empty State: 🔍

4.  **PromptCard.tsx:**
    *   (Already mostly Lucide, but check for any lingering emojis)

5.  **MethodSelector.tsx**
    *   (Check for emojis in `STUDY_METHODS` constant in `types/study.ts`)

---

## Tasks

### Task 1: Create 3D Icon Style
**File:** `src/index.css`
- Define `.icon-3d` class with:
    - Gradient text/fill
    - `filter: drop-shadow(...)` for depth
    - `transform: perspective(...)` if needed

### Task 2: DashboardHome Replacement
**File:** `src/pages/DashboardHome.tsx`
- Replace Sidebar emojis with `lucide-react` equivalents:
    - 📊 -> `BarChart2`
    - ⭐ -> `Star` (filled/gradient)
    - 📝 -> `FileText`
    - ✨ -> `Sparkles`
    - 📚 -> `Library`
    - 📁 -> `FolderClosed`
- Replace Greeting 👋 -> `Hand` or stylized wave
- Replace Learning Card emojis -> `Gamepad2`, `Trophy`, `Flame`
- Replace Quick Action emojis.

### Task 3: FilterBar Replacement
**File:** `src/components/FilterBar.tsx`
- Replace ↕ -> `ArrowUpDown`
- Replace ▲/▼ -> `ChevronUp`, `ChevronDown`
- Replace ✓ -> `Check`

### Task 4: Study Types Replacement
**File:** `src/types/study.ts` or `src/services/studyPromptService.ts`
- If emojis are string-embedded, replace them or remove them.

### Task 5: Verification
- Manual visual check of Dashboard, Library, and Learn pages to ensure no emojis remain and the new icons look "Premium 3D".
