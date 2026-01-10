# Project Workflow Directive

## Overview
This project follows the **Gemini 3-Layer Architecture** to ensure reliability and scalability.

## Architecture Layers

### 1. Directive (Instruction)
- **Location**: `directives/*.md`
- **Purpose**: Define Standard Operating Procedures (SOPs), goals, and workflows.
- **Usage**: Read these before starting complex tasks. Update them when workflows change or new learnings are acquired.

### 2. Orchestration (Decision)
- **Role**: AI Agent (You).
- **Purpose**: Bridge the gap between intent (Directive) and action (Execution). Make decisions, handle errors, and route tasks.

### 3. Execution (Action)
- **Location**: `execution/` (Scripts) or `package.json` (NPM Scripts).
- **Purpose**: Deterministic, reliable code.
- **Rules**:
    - Prefer scripting over manual edits for complex/repetitive tasks.
    - Python scripts go in `execution/`.
    - Node/TS scripts can also live in `execution/` or be defining in `package.json`.

## File Organization
- **`.tmp/`**: Temporary files (logs, intermediate data). **Never commit**.
- **`directives/`**: Logic/SOPs.
- **`execution/`**: Scripts.
- **`src/`**: Application source code.

## Development Loop (Self-Annealing)
1.  **Read Compliance**: Check `gemini.md` and `directives/` for rules.
2.  **Check Tools**: Look in `execution/` for existing scripts.
3.  **Execute**: Run tools.
4.  **Fix & Learn**: If a tool fails, fix it, verify it, and update the directive if the process changes.
