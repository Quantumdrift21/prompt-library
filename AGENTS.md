# Agent Instructions & Workflows

This document outlines the standard workflows and instructions for agents working on the Prompt Library project.

## Directory Structure
- `.agent/workflows/`: Contains specific workflow instructions (Markdown files).
- `.agent/rules/`: Contains core rules and memory files.
    - `universal-rag.md`: Rules for RAG agent behavior.
- `AGENTS.md`: This file (Index).

## Standard Workflows

### 1. New Feature Implementation
*File:* `.agent/workflows/feature_implementation.md`

- **Plan**: Analyze requirements, check existing code.
- **Design**: Create a design report/artifact.
- **Implement**: Types -> Service -> Components -> Page.
- **Verify**: Browser verification + Manual confirmation.

### 2. Bug Fixes
*File:* `.agent/workflows/bug_fix.md`

- **Reproduce**: Use browser subagent to verify error.
- **Diagnose**: Check logs, source code.
- **Fix**: Apply minimal changes.
- **Verify**: Confirm fix with browser subagent.

## Rules
- **Theme**: Always adhere to `index.css` variables (Dark/Light glass theme).
- **Code Style**: Typescript, React Functional Components, meaningful variable names.
- **Persistence**: Use `indexedDbService` for local data.


# GLOBAL AGENT CONTRACT (MANDATORY)

This file defines non-negotiable rules that ALL AI agents must follow
before making, suggesting, or implementing any change.

Failure to comply invalidates the agent output.

---

## 1. Test-Driven Development (TDD) — REQUIRED

IMPORTANT:
- Use a Test-Driven Development (TDD) approach to solving problems.
- Do NOT assume your solution is correct.
- ALWAYS validate correctness by:
  1. Writing a test case first
  2. Running the test
  3. Proving the solution works as intended

Rules:
- No implementation without a failing test first
- After changes, tests MUST be re-run
- If tests fail, iterate until all tests pass

---

## 2. Knowledge Freshness — REQUIRED

Assume your world knowledge is OUT OF DATE.

Rules:
- You MUST use web search or official documentation
- Do NOT rely on assumptions or memory
- Cite the source in your reasoning or report

---

## 3. Backward Compatibility — DISALLOWED by default

Rules:
- Do NOT preserve backward compatibility unless explicitly requested
- Update all downstream consumers when making changes
- If compatibility is required, it MUST be stated clearly in the task

---

## 4. Mandatory Agent Review Report

Before final output, the agent MUST provide a review report containing:
- What was fixed
- What was optimized
- What was added or changed
- Test results (pass/fail)
- Any assumptions made

No report = task incomplete.
