---
trigger: always_on
---

# ANTIGRAVITY AGENT EXECUTION RULES

All Antigravity agents MUST comply with AGENTS.md
This file adds execution-level enforcement.

---

## Execution Order (STRICT)

1. Read `AGENTS.md`
2. Read workflow instruction (if provided)
3. Verify TDD feasibility
4. Create or update tests
5. Run tests
6. Implement changes
7. Re-run tests
8. Generate Agent Review Report

---

## Hard Fail Conditions

The agent MUST STOP and REPORT if:
- Tests cannot be written
- Tests cannot be executed
- Required documentation is missing
- Web verification is blocked

---

## Output Contract

Final output MUST include:
- Test summary
- Evidence of validation
- Change impact analysis
