# Project Status Check & Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Assess current project health (lint/build/test) and thoroughly clean up temporary and unwanted files from the project root.

**Architecture:** N/A (Maintenance task)

**Tech Stack:** `npm`, `powershell`

---

### Task 1: Project Health Check & Diagnostics

**Files:**
- Read: `package.json`

**Step 1: Run Linting**
Run: `npm run lint`
Expected: No linting errors. If errors exist, log them but do not fix yet (unless trivial).

**Step 2: Run Type Check & Build**
Run: `npm run build`
Expected: Successful build with no TypeScript errors.

**Step 3: Run Tests**
Run: `npm run test -- run`
Expected: All tests pass.

---

### Task 2: Root Directory Cleanup

**Files:**
- Move/Delete: `*.mp4`, `*.jpg` (Root)
- Move: `convert_prompts.py` -> `scripts/convert_prompts.py`
- Delete: `gemini.md`, `summary.md`
- Analyze: `prompts_export.json`

**Step 1: Create Cleanup Directory**
Run: `mkdir .tmp/cleanup_2026_01_10 -Force`

**Step 2: Move Media Files**
Run: `mv *.mp4, *.jpg .tmp/cleanup_2026_01_10/`
*Note: If fails, move individually.*

**Step 3: Organize Scripts**
Run: `mkdir scripts -Force`
Run: `mv convert_prompts.py scripts/`

**Step 4: Remove Old Docs**
Run: `rm gemini.md`
Run: `rm summary.md`

**Step 5: Check & Archive Export**
Run: `mv prompts_export.json .tmp/cleanup_2026_01_10/`

---

### Task 3: "wtc" (What To Check) - Consistency Audit

**Files:**
- Read: `src/**/*`

**Step 1: Check for Duplicate Configs**
Run: `ls *config*`
Expected: `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`, `tsconfig*.json` only.

**Step 2: Check for "TODO" comments**
Run: `grep -r "TODO" src | head -n 20`
Expected: List of current TODOs to assess technical debt.
