---
name: simple-plan
description: Create and track lightweight implementation plans for simple-to-moderate tasks. Use this skill when starting any implementation to structure work, track progress across sessions, and resume after context compaction.
---

# Simple Plan

Create a lightweight execution plan before implementing, then track progress against it. This prevents losing context in long-running sessions or across separate sessions.

---

## When to Use

Load this skill when:

- Starting any implementation task (bug fix, small feature, refactor)
- The work involves 1-10 discrete tasks
- You need to track progress across a long session or multiple sessions
- Full orchestrator-style plans with waves/strategist/auditor are overkill

Do NOT use this skill when:

- The task is truly trivial (single file, single change, < 5 minutes)
- The user explicitly asks for a full plan via Plan mode (use the `@architect` agent instead)
- The work requires complex multi-wave orchestration with 10+ tasks across 3+ agents

---

## Plan Mode vs Build Mode

OpenCode has two primary agents: **Plan** (read-only) and **Build** (read-write). This skill works in both, but the behavior differs:

### In Plan Mode (read-only)

Plan mode is **strictly read-only** — no file writes, no edits, no system changes. When creating a plan in Plan mode:

1. **Research** using read-only tools (Read, Glob, Grep, Task with explore agents)
2. **Present the plan as text output** directly in the conversation — do NOT attempt to write files
3. **Use the plan template** below so it's easy to copy, but output it as a message, not a file write
4. **Tell the user**: "Switch to Build mode and say 'proceed' to save this plan and start execution."

**NEVER attempt to write to `.opencode/plan/` or any other path in Plan mode.** OpenCode's built-in Plan mode restricts writes to `.opencode/plan/*.md`, but that is NOT our project's plan directory. Our plans belong in `.opencode/context/plans/`. Since Plan mode cannot write there, simply present the plan as text output.

### In Build Mode (read-write)

In Build mode, write the plan and progress files normally to `.opencode/context/plans/` and `.opencode/context/notepads/`.

When the user switches from Plan to Build and says "proceed" (or similar):
1. Write the plan file to `.opencode/context/plans/{YYYYMMDDNNN}-{slug}.md`
2. Create the progress file at `.opencode/context/notepads/{YYYYMMDDNNN}-{slug}/progress.md`
3. Begin execution

---

## File Locations

All files live under `.opencode/context/` relative to the **workspace root**:

| File | Path |
|------|------|
| Plan | `.opencode/context/plans/{YYYYMMDDNNN}-{slug}.md` |
| Progress | `.opencode/context/notepads/{YYYYMMDDNNN}-{slug}/progress.md` |

**CRITICAL**: Plans go in `.opencode/context/plans/` — the same directory that holds all existing plans. NEVER create a `plan/` or `plans/` directory anywhere else (not at `.opencode/plan/`, not at the workspace root, nowhere else).

---

## Step 1: Assess and Create Plan

Before writing any code, assess the request and create a plan.

### 1a. Scope Assessment

Classify the work:

| Scope | Signals | Tasks | Plan Detail |
|-------|---------|-------|-------------|
| **Trivial** | Single file, typo, config change | 1-2 | Minimal: just task list |
| **Simple** | 1-3 files, clear scope, one concern | 3-5 | Standard: tasks with acceptance criteria |
| **Moderate** | 3-10 files, multiple concerns, 1-2 agents | 6-10 | Grouped: tasks organized by agent or concern |

### 1b. Research First

Before writing the plan:

1. Read relevant source files to understand current state
2. Identify patterns to follow from existing code
3. Map the files that need changes
4. Note any dependencies between changes

### 1c. Write the Plan

**In Build mode**: Create the plan file at `.opencode/context/plans/{YYYYMMDDNNN}-{slug}.md` (from the workspace root). Verify this directory already contains existing plan files before writing — if it doesn't, you have the wrong path.

**In Plan mode**: Output the plan as text in the conversation using the same template. Do NOT write any files.

Use this template:

```markdown
# Simple Plan: {Title}

**ID**: {YYYYMMDDNNN}
**Status**: in-progress
**Created**: {YYYY-MM-DD}
**Scope**: trivial | simple | moderate

---

## Goal

{1-2 sentences: what we're building/fixing and why}

## Context

**Current**: {Brief description of what exists today}
**Target**: {Brief description of the desired end state}

## Non-Goals

- {What we're explicitly NOT doing}

## Tasks

### 1. {Task title}
- **Accept**:
  - {Criterion 1}
  - {Criterion 2}
- **Files**: `path/to/file`

### 2. {Task title}
- **Accept**:
  - {Criterion 1}
- **Files**: `path/to/file`

{Continue for all tasks...}

## Verify

- `{verification command 1}`
- `{verification command 2}`
```

**Naming convention**: `{YYYYMMDDNNN}-{kebab-case-title}.md` — same as full plans. The `{slug}` used in paths is this full name including the date prefix (e.g., `20260307001-mod-pharma`).

**Sizing rules**:

- **Trivial**: Skip Non-Goals. Tasks can be one-liners without Accept sections.
- **Simple**: Include Accept criteria for each task. Non-Goals if helpful.
- **Moderate**: Group tasks under headings by agent or concern. Note ordering dependencies inline (e.g., "after task 2"). Include Non-Goals.

### 1d. Initialize Tracking

**Skip this step if in Plan mode** — progress tracking begins when execution starts in Build mode.

Create the progress file at `.opencode/context/notepads/{YYYYMMDDNNN}-{slug}/progress.md` (from the workspace root):

```markdown
# Progress: {slug}

**Plan**: .opencode/context/plans/{YYYYMMDDNNN}-{slug}.md
**Started**: {YYYY-MM-DD}
**Updated**: {YYYY-MM-DD HH:MM}
**Status**: executing

---

## Tasks

- [ ] 1. {task description}
- [ ] 2. {task description}
- [ ] 3. {task description}

## Verify

| Check | Result |
|-------|--------|
| `{command}` | pending |

## Notes

{Empty — add inline notes as you go}
```

---

## Step 2: Execute and Track

Work through tasks sequentially (or by logical grouping). After completing each task:

### Update Progress

Edit `progress.md` — mark the task complete with a brief note:

```markdown
- [x] 1. {description} ✓
  - Files: `path/changed.rs`, `path/other.rs`
  - Note: {any decision made or learning discovered}
- [ ] 2. {description} — in-progress
- [ ] 3. {description}
```

### Track Key Information Inline

Instead of separate files, record important context directly in the Notes section:

```markdown
## Notes

- **Decision**: Used cursor-based pagination because the feed is append-only
- **Learning**: `workflow_repo.rs` already has a similar join pattern at line 142
- **Issue**: Tests require mock subscriber data — added factory in test helpers
```

### Update Timestamp

Always update the `**Updated**` timestamp when modifying progress. This tells future sessions when the last work happened.

---

## Step 3: Resume from Previous Session

When continuing work from a previous session (or after context compaction):

### Recovery Protocol

1. **Read the progress file FIRST**: `.opencode/context/notepads/{YYYYMMDDNNN}-{slug}/progress.md`
2. **Trust completed tasks**: Tasks marked `[x] ... ✓` are done. Do NOT re-verify them.
3. **Read inline notes**: The Notes section contains decisions and learnings from prior work.
4. **Read the plan**: `.opencode/context/plans/{YYYYMMDDNNN}-{slug}.md` for full task details.
5. **Resume from first incomplete task**: Find the first `[ ]` and continue from there.

### Signs You Need to Resume

- You don't remember specific changes from earlier
- The user says "continue" or "pick up where we left off"
- Context feels fresh but the progress file shows completed tasks

### Resume Announcement

After reading state, confirm with the user:

```
Resuming {plan title}.
- Completed: tasks 1-3 of 6
- Next: task 4 — {description}
- Key notes: {relevant inline notes}

Continuing with task 4...
```

---

## Step 4: Complete

When all tasks are done:

1. Run all verification commands from the plan
2. Update progress file:
   - Set `**Status**: complete`
   - Fill in the Verify table with results
   - Update timestamp
3. Update plan file: Set `**Status**: complete`
4. Report completion to user with summary of what was done

### Completion Format in Progress

```markdown
# Progress: {slug}

**Plan**: .opencode/context/plans/{YYYYMMDDNNN}-{slug}.md
**Started**: 2026-03-01
**Updated**: 2026-03-01 14:30
**Status**: complete

---

## Tasks

- [x] 1. {description} ✓
  - Files: `path/to/file.rs`
- [x] 2. {description} ✓
  - Files: `path/to/file.ts`
  - Note: Used existing pattern from a related module
- [x] 3. {description} ✓
  - Files: `path/to/file.rs`, `path/to/other.rs`

## Verify

| Check | Result |
|-------|--------|
| `{project test command}` | 42 tests passing |
| `{project lint command}` | no warnings |

## Notes

- **Decision**: Used Decimal for rate precision (consistent with a related feature)
- **Learning**: Existing health route pattern lives at `path/to/health.ext`
```

---

## Rules

### ALWAYS

- Create the plan BEFORE writing any code
- Update progress after completing each task (not in batches)
- Include file paths in completed task entries
- Update the timestamp on every progress edit
- Read progress file first when resuming
- Trust completed tasks — never re-do verified work
- In Plan mode: present the plan as text output, not a file write

### NEVER

- Skip plan creation ("I'll just start coding")
- Batch progress updates (update after each task, not at the end)
- Re-verify completed tasks after resuming
- Delete or overwrite the progress file (append/edit only)
- Create separate learnings/decisions/issues files (keep everything in the single progress file)
- Create plan or progress files outside `.opencode/context/` (never `.opencode/plan/`, never workspace root `plan/`, never any other location)
- Write to `.opencode/plan/` — that path is OpenCode's built-in Plan mode scratch area, NOT our project's plan directory

### ESCALATE TO USER WHEN

- A task reveals the work is more complex than the plan anticipated (> 10 tasks needed)
- A blocking issue is discovered that changes the plan's goal
- The scope has grown beyond "moderate" — suggest switching to full Plan mode
