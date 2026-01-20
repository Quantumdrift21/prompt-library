---
description: Gemini - Executing Plans
---

# Gemini Executing Plans

## Overview

Load plan, review critically, execute tasks in batches, report for review between batches.
Optimized for Gemini's capabilities.

**Core principle:** Batch execution with checkpoints for architect review.

**Announce at start:** "I'm using the gemini-executing-plans workflow."

## The Process

### Step 1: Load and Review Plan
1. **Read plan file**: Use `view_file` to read the current plan (e.g., `implementation_plan.md` or `.agent/plans/...`).
2. **Review critically**: Identify any questions, missing context, or potential risks.
3. **Check State**: Verify what has already been done (check file contents, `git status` if available, or project state).
4. **Decide**:
   - If concerns: STOP and raise them with the user.
   - If no concerns: Proceed to Step 2.

### Step 2: Execute Batch
**Scope:** Execute the next logical batch of tasks (typically 2-3 small tasks or 1 complex task).

For each task in the batch:
1. **Contextualize**: Read necessary files to understand the specific task.
2. **Implement**: Make code changes using `write_to_file`, `replace_file_content`, etc.
3. **Verify**:
   - Run tests (`npm test`, etc.) if applicable.
   - Build (`npm run build`) if a structural change.
   - Verify in browser if UI related.
4. **Update Plan**: If the plan is a file, mark the task as `[x]` (completed).

### Step 3: Report
When the batch is complete:
- **Summary**: List clearly what was implemented.
- **Verification**: Show evidence that it works (test output, screenshot, build success).
- **Next Steps**: Mention what is next in the plan.
- **Prompt**: Say "Ready for feedback before proceeding."

### Step 4: Loop
Based on user feedback:
- Fix issues if reported.
- Repeat Step 2 for the next batch.

### Step 5: Complete Development
When ALL tasks in the plan are complete:
1. **Final Verification**: Run the full test suite and build one last time.
2. **Cleanup**: Remove any temporary files or debug logs.
3. **Report Completion**:
   - Announce: "Implementation complete. All tasks verified."
   - Ask: "Would you like me to commit these changes or do you have any final adjustments?"

## When to Stop and Ask for Help

**STOP executing immediately when:**
- Hit a blocker (missing dependency, test fails and you can't fix it, instruction unclear).
- Plan has critical gaps.
- You don't understand an instruction.
- Verification fails repeatedly.

## Best Practices for Gemini
- **Be Explicit**: Always explain *why* you are doing a step if it's not obvious.
- **Verify Often**: Don't wait until the end to check if the build fails.
- **Read Parameters**: Ensure you use absolute paths for tools.
- **Don't Hallucinate**: If a file doesn't exist, check `list_dir` before trying to read it.
