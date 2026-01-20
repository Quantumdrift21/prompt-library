# Active Development Rules & Context

## 1. Critical Directives (Extracted from Image Analysis)
These rules are strictly enforced for this session and future work:

*   **Test-Driven Development (TDD)**:
    *   **Validate First**: Do not assume correctness.
    *   **Proove It**: Create and run test cases to prove the solution works *before* declaring it done.
*   **Iterative Quality**:
    *   Run tests and linting immediately after changes.
    *   Iterate on failures until green.
*   **Knowledge Retrieval**:
    *   Assume internal knowledge is out of date.
    *   **MUST Use Web Search** for up-to-date documentation and information.
*   **Modernization Focus**:
    *   **No Backwards Compatibility**: Do not maintain old patterns unless explicitly requested.
    *   Update all downstream consumers to match new implementations.

## 2. Project Standards (From AGENTS.md & .agent/rules/agent.rules.md)
*   **Execution Order (STRICT)**:
    1.  Read `AGENTS.md` & Workflows.
    2.  Verify TDD feasibility.
    3.  Create/Update Tests.
    4.  Run Tests (Red).
    5.  Implement Changes.
    6.  Re-run Tests (Green).
    7.  Generate Report.
*   **Tech Stack Rules**:
    *   **Theme**: Strict adherence to `index.css` variables (Dark/Light glass premium theme).
    *   **Code**: TypeScript, React Functional Components.
    *   **Data**: Use `indexedDbService` for local persistence.

## 3. Workflow Integration
I have incorporated these rules into my system instructions. I will:
1.  Search for docs before bulky implementations.
2.  Write/Update tests before finalizing code.
3.  Ensure the "Dark/Light Glass" aesthetic is maintained.
4.  Fail hard if testing is blocked.
