---
description: Rules for reading SKILL.md files to ensure full skill is always loaded.
paths:
  - '**'
---

# Skill File Reading

Rules for reading skill files to ensure full skill is always loaded.

## Rule 1: SKILL.md Must Be Read Fully

**What:** Always read SKILL.md completely from line 1 to last line.

**How:** `read_file({ filePath: ".../SKILL.md", startLine: 1, endLine: 9999 })`

**Why:** Incomplete reads miss instructions, constraints, and output requirements.

## Rule 2: Reference Files Must Be Read Fully

**What:** Read only RELEVANT reference files that are **defined in the SKILL.md file** and match the user's task.

**How:**

1. Read SKILL.md fully to identify the "references" section (list of available reference files)
2. Analyze user's prompt to determine WHICH reference files from the SKILL.md list are needed
3. Read only the matched files completely (startLine: 1, endLine: 9999)

## Rule 3: All Other Files — Minimal Read Only

**What:** For any file that is NOT SKILL.md and NOT a reference file defined in SKILL.md, do NOT read the full file.

**How:** Agent self-determines the minimum line range needed:

- Use `grep_search` or `semantic_search` first to locate relevant sections
- Read only the specific line range that is needed for the task
- Never use `endLine: 9999` on non-skill files

**Why:** Keeping non-essential file reads minimal preserves context window space for what matters.

## Combined Workflow

For every skill task:

1. Read SKILL.md fully (1 → 9999)
2. Identify what user wants (implement, test, debug, etc)
3. Find WHICH reference files from SKILL.md match the task
4. Read only those reference files fully (1 → 9999)
5. For all other files: search first, then read only the relevant range
6. Execute with minimal context
