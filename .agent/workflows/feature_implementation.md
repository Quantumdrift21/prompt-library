---
description: Standard workflow for implementing new features
---

# Feature Implementation Workflow

1.  **Analysis Phase**
    -   Read user requirements carefully.
    -   Audit existing code (`list_dir`, `view_file`) to understand impact.
    -   Identify necessary changes:
        -   Data Model (Types, DB Schema)
        -   Services (Logic, API interactions)
        -   UI/UX (Components, Pages, Styles)

2.  **Design Phase**
    -   Create a Design Report (Artifact) summarizing the plan.
    -   **Constraint Check**: Ensure theme consistency (Glass/Dark), mobile responsiveness, and performance.
    -   Wait for User Approval (if required/requested).

3.  **Implementation Phase**
    -   **Step 1: Core Logic**: Update `types/` and `services/` first. Ensure data foundation is solid.
    -   **Step 2: Components**: Build reusable components. Use `src/components/`.
    -   **Step 3: Integration**: Assemble pages in `src/pages/` and update routing in `App.tsx`.
    -   **Step 4: Styles**: Use CSS variables from `index.css`. Avoid hardcoded colors.

4.  **Verification Phase**
    -   Use `browser_subagent` to verify the feature works as expected.
    -   Check edge cases (Empty states, Loading states, Error states).
    -   Verify responsiveness.
