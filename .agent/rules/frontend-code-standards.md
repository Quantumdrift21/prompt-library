---
trigger: always_on
---

# Frontend Code Standards (Workspace Rule)

- All code MUST be written in TypeScript.
- Use functional React components only.
- Prefer small, focused components.
- Avoid prop drilling when context/hooks are appropriate.
- Hooks must:
  - Start with use*
  - Have a single responsibility
- No business logic inside JSX.
- No direct IndexedDB or Supabase calls inside components.
- All async logic must live in services or hooks.
