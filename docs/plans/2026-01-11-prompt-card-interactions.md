# Prompt Card Interactions & 3D Elements Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance prompt cards with 3D-styled icons (replacing emojis), interactive tooltips, and a detailed modal view for full prompt exploration.

**Architecture:** 
- **Icons:** Introduce `lucide-react` for vector icons, styled with CSS for depth (3D effect).
- **Components:** create generic `Modal` and `Tooltip` components, and a specific `PromptDetailModal`.
- **State:** Manage modal open/close state in parent components (`PromptDiscoveryGrid`, `Collections`).

**Tech Stack:** React, CSS Modules (or standard CSS), `lucide-react`.

---

### Task 1: Setup & Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install `lucide-react`**
Run: `npm install lucide-react`

---

### Task 2: Core UI Components

**Files:**
- Create: `src/components/common/Tooltip.tsx`
- Create: `src/components/common/Tooltip.css`
- Create: `src/components/common/Modal.tsx`
- Create: `src/components/common/Modal.css`
- Create: `src/components/common/ThreeDIcon.tsx` (using text 'ThreeD' to avoid potential naming issues, or `PromptIcon.tsx`)
- Create: `src/components/common/ThreeDIcon.css`

**Step 1: Create Tooltip Component**
Simple wrapper that shows a label on hover.

**Step 2: Create Modal Component**
Generic backdrop + content container with animation.

**Step 3: Create 3D Icon Component**
Takes a category/type and renders a corresponding Lucide icon with "Premium 3D" styling (gradients, drop shadows, subtle tilt).

---

### Task 3: Prompt Detail Modal

**Files:**
- Create: `src/components/PromptDetailModal.tsx`
- Create: `src/components/PromptDetailModal.css`

**Step 1: Implement Detail View**
- Receives `prompt` object.
- Displays full Title, full Description (scrollable), Tags, Copy Button, Close Button.
- Uses Glassmorphism style.

---

### Task 4: Integrate into Discovery Grid

**Files:**
- Modify: `src/components/landing/PromptDiscoveryGrid.tsx`
- Modify: `src/services/publicPromptsService.ts` (if needed for type/mock updates)

**Step 1: Replace Emojis with `ThreeDIcon`**
Update the loop to use the new icon component.

**Step 2: Add Interaction Logic**
- Add state `selectedPrompt`.
- On click "View", set `selectedPrompt` and open Modal.

**Step 3: Add Tooltips**
- Wrap buttons (Copy, View, Save) with `Tooltip`.

---

## Verification Plan

### Automated Tests
- Run `npm run test` to ensure no regressions.
- (Optional) Add unit test for Modal rendering.

### Manual Verification
1.  **Icons:** Verify prompts show 3D-styled icons instead of emojis.
2.  **Tooltips:** Hover over stats and buttons -> verify tooltips appear.
3.  **Modal:** Click "View" -> Verify modal opens with full details.
4.  **Responsiveness:** Verify modal works on mobile.
