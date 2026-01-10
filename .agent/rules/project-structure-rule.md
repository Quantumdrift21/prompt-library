---
trigger: always_on
---

# Project Structure Rule (Workspace Rule)

- Components:
  - Must be reusable and presentation-focused
- Pages:
  - Must orchestrate components
  - Must NOT contain business logic
- Services:
  - Handle IndexedDB, Supabase, and sync logic
- Hooks:
  - Bridge UI and services
- Types:
  - Centralized and reused
- No circular dependencies allowed.
