# Context

This directory holds cross-session state for the orchestration workflow. Agents read and write here; everything else in the repo is for humans.

## Subdirectories

| Directory | Owner | Purpose |
|-----------|-------|---------|
| `plans/` | `@architect` | Execution plans (`{date}-{slug}.md`) — the source of truth for what to build |
| `notepads/` | `@orchestrator` | Per-plan execution state: `progress.md`, `decisions.md`, `learnings.md`, `issues.md`, `rework-log.md` |
| `drafts/` | `@architect` | Interview notes and planning scratch before a plan is finalized |
| `research/` | `@explore` / `@librarian` | Research artifacts referenced by plans |
| `evidence/` | `@orchestrator` | Captured decisions, verifications, approvals, findings during execution |
| `audits/` | `@auditor` | Plan audit reports (PASS / GAPS / REWORK) |
| `archive/` | `@scribe` | Completed plans + notepads, organized by year |

## Lifecycle

```
@architect drafts in drafts/  →  @architect writes plan to plans/  →  @auditor audits to audits/
                                                                            ↓
                              @scribe archives to archive/{year}/  ←  @orchestrator executes,
                                                                       writes notepads/ + evidence/
```

## Conventions

- **Filenames**: `{YYYYMMDD}{NNN}-{slug}.md` (e.g., `20260516001-user-profile.md`)
- **Notepad directory**: one subdir per plan, named with the plan slug
- **Append, don't overwrite**: notepad files (especially `learnings.md`, `decisions.md`, `issues.md`) grow over the execution
- **Mark verified tasks**: in `progress.md`, completed tasks get `✓ verified` so they're not re-run after context compaction

## Why this lives in git

The notepads and plans **are** the project's institutional memory for AI-driven work. They make sessions resumable, audits possible, and handoffs clean. Commit them.

If you'd rather keep them local-only, add `.opencode/context/notepads/`, `.opencode/context/drafts/`, etc. to `.gitignore` — but expect to lose cross-session continuity.
