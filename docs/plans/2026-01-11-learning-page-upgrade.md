# Learning Page "Method-First" Upgrade Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the `LearnPage` from a game-like lesson interface into a **"Method-First" Study Environment** that scaffolds user input using pedagogical frameworks (Feynman, Cornell, etc.) to generate high-quality prompts.

**Architecture:**
- **UI:** A reusable split-pane layout (`SplitPaneLayout`) or CSS grid.
- **State:** React local state (or a `useStudySession` hook) to manage form inputs and the generated "Active Notes".
- **Logic:** A dictionary/service mapping `StudyMethod` to "Meta-Prompt" templates.
- **Styling:** Glassmorphism/Dark theme consistent with `DarkLayout`.

**Tech Stack:** React, TypeScript, CSS Modules (or existing CSS architecture).

---

## Data Model & Types

### [NEW] `src/types/study.ts`
Define the core data structures for the study session.

```typescript
export type KnowledgeLevel = 'Beginner' | 'Intermediate' | 'Expert';

export type StudyGoal = 'Summarize' | 'Quiz Me' | 'Deep Dive' | 'Find Gaps';

export type StudyMethod = 'Feynman' | 'Active Recall' | 'Cornell' | 'Blurting' | 'Leitner';

export interface StudySessionData {
  topic: string;
  knowledgeLevel: KnowledgeLevel;
  goal: StudyGoal;
  method: StudyMethod;
  generatedPrompt: string; // The preview
  activeNotes: string; // The right-pane content
}
```

---

## Services

### [NEW] `src/services/studyPromptService.ts`
Logic to generate the "Meta-Prompt" based on inputs.

- `generateMetaPrompt(data: StudySessionData): string`
  - Returns the structured prompt text based on the selected Method and Goal.
  - *Example:* If 'Feynman', inject "Explain this concept as if I am 12 years old..."

---

## Components

### [NEW] `src/components/study/MethodSelector.tsx`
- A dropdown or segmented control to switch between Study Methods.
- Includes **Tooltips** explaining each method (e.g., "Feynman: Best for deep understanding by simplifying").

### [NEW] `src/components/study/CognitiveBuilder.tsx`
- The "Left Pane" form.
- Inputs: Topic (Text), Knowledge Level (Select), Goal (Select).
- Displays the **Prompt Preview** (Read-only text area).
- "Basic/Advanced" toggle to show/hide complex fields (like Tone or specific constraints).

### [NEW] `src/components/study/ActiveNotes.tsx`
- The "Right Pane" workspace.
- A textarea or simple rich text editor for the user to type notes.
- "Copy from Preview" button to append generated prompt specific parts to notes.

---

## Page Implementation

### [MODIFY] `src/pages/LearnPage.tsx`
- **Replace** the existing "Gaming/Lesson" UI.
- Implement the **Split-Pane Layout**.
- **Left:** `<CognitiveBuilder />` (wrapping `MethodSelector`).
- **Right:** `<ActiveNotes />`.
- **Header:** Custom Modular Header with Study Method Selector (if not in Builder).

*Note: The existing `lessons` and `learningService` might be orphaned. We will keep them for now or move to a "Legacy" or "Games" sub-route if the user wants to preserve them. **Assumption:** This upgrade replaces the main view.*

---

## Verification Plan

### Automated Tests
- We will add unit tests for `studyPromptService` to ensure correct prompt generation.
- Command: `npm test` (if setup) or manual check via console.

### Manual Verification
1.  **Navigate to `/learn`**.
2.  **Select Method:** Choose "Feynman" and verify the description tooltip.
3.  **Fill Form:** Enter Topic "Black Holes", Level "Beginner".
4.  **Check Preview:** Verify the "Generated Prompt" box updates with the specific Feynman-style instructions.
5.  **Notes:** Type in the "Active Notes" area.
6.  **Responsiveness:** Resize window to mobile width; ensure split-pane stacks or adjusts (likely stacks).
7.  **Theme:** Verify Dark Glass aesthetic matches the rest of the app.
