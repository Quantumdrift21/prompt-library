---
description: Help debug code and tooling issues. Use when the user reports errors, stack traces, failing tests, or unexpected behavior. allowed-tools:   - Read   - Grep   - Bash
---

1. Ask the user to provide:
   - Exact error message and stack trace
   - Steps to reproduce
   - Recent changes.
2. Use `Read` and `Grep` to inspect relevant files and search for error signatures.
3. Propose a small, testable hypothesis for the root cause.
4. Suggest minimal code edits and show how to run tests or commands to verify the fix.
5. If tests fail, iterate with a new hypothesis.