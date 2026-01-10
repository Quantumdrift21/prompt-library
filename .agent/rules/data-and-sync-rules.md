---
trigger: always_on
---

# Data & Sync Rules (Workspace Rule)

- IndexedDB is ALWAYS written first.
- UI state must update immediately after local writes.
- Supabase sync must be:
  - Asynchronous
  - Non-blocking
  - Resilient to failures
- Never delete data blindly:
  - Prefer soft deletes (deleted_at) where applicable
- last-write-wins using updated_at timestamps is the default strategy.
- Sync logic must NEVER live inside UI components.
