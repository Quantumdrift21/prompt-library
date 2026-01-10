---
trigger: always_on
---

# Architecture & Product Philosophy (Workspace Rule)

- This application is a PROMPT MANAGEMENT TOOL, not an AI execution tool.
- The app MUST NEVER:
  - Execute prompts
  - Call LLM APIs
  - Store model parameters or AI outputs
- Offline-first is mandatory:
  - IndexedDB is the source of truth
  - The UI must always read from local storage first
- Cloud services (Supabase) exist ONLY for sync, never as a dependency.
- Network failure must NEVER block core functionality.
- Simplicity is preferred over clever abstractions.
