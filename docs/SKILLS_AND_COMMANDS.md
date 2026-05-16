# Skills & Commands

Custom skills and commands shipped with this knowledge hub. **Skills** provide reusable knowledge that agents load on demand; **commands** are user-triggered actions invoked via `/command`.

---

## Overview

| Layer | What | Examples |
|-------|------|---------|
| **Commands** | Quick, user-triggered actions via `/command` | `/commit`, `/branch` |
| **Skills** | Reusable knowledge loaded by agents on demand | `simple-plan`, `git-workflow` |

Commands often encode a single workflow step. Skills encode broader knowledge and multi-step processes.

---

## Commands

Commands live in `.opencode/commands/` and are invoked with `/command [args]`.

### /commit

**File**: `.opencode/commands/commit.md`

Selectively stages files, auto-detects commit type and scope, and creates a conventional commit.

```
/commit                      # fully auto-detect
/commit fix login redirect   # hint: type=fix, about login redirect
/commit #42                  # include Refs #42 in body
```

Key behaviors:
- Never uses `git add .` — stages each file individually
- Skips `.env`, secrets, build output, dependency directories
- Detects scope from changed paths
- Follows conventional commit format: `type(scope): description`

### /branch

**File**: `.opencode/commands/branch.md`

Creates a branch from a GitHub issue reference or a free-form description.

```
/branch #42                    # derive branch from GitHub issue 42
/branch feat user profile      # free-form description
```

Key behaviors:
- With `#N`: fetches issue via `gh issue view` to derive name + context
- Branch naming: `<type>/<short-slug>` (e.g., `feat/user-profile`, `fix/login-redirect`)
- Branches from `origin/main` (fetches first)
- Warns if working tree has uncommitted changes

---

## Skills

Skills live in `.opencode/skills/{name}/SKILL.md` and are loaded by agents when their trigger conditions are met.

### simple-plan

**File**: `.opencode/skills/simple-plan/SKILL.md`
**Trigger**: Starting any implementation task (bug fix, feature, refactor)

Lightweight planning and progress tracking for 1–10 task implementations.

| Aspect | Detail |
|--------|--------|
| **Scope** | Trivial (1–2 tasks), Simple (3–5), Moderate (6–10) |
| **Plan location** | `.opencode/context/plans/{YYYYMMDDNNN}-{slug}.md` |
| **Progress location** | `.opencode/context/notepads/{YYYYMMDDNNN}-{slug}/progress.md` |
| **Modes** | Plan mode (read-only, outputs text) and Build mode (writes files) |

Steps: Assess scope → research code → write plan → track progress → resume across sessions → complete with verification.

### git-workflow

**File**: `.opencode/skills/git-workflow/SKILL.md`
**Trigger**: Committing, pushing, or creating pull requests

Reference guide for git conventions in this hub.

Covers:
- Branch naming (`<type>/<short-slug>`)
- Conventional commits with module/package scope model
- Selective staging rules (never `git add .`)
- PR body format (Summary / Changes / Testing) suitable for `gh pr create --body`
- Cross-repo issue linking (`Refs owner/repo#N`)

---

## When Skills Auto-Load

| User says... | Skill loaded |
|--------------|--------------|
| "plan this feature", "what's the plan for…" | `simple-plan` |
| (during any commit/PR work) | `git-workflow` |
| "continue", "pick up where we left off" | `simple-plan` (resume protocol) |

---

## See Also

- [AGENTS.md](./AGENTS.md) — Agent lineup overview
- [WORKFLOW.md](./WORKFLOW.md) — Full orchestrator workflow
- [EXECUTION.md](./EXECUTION.md) — Execution & delegation mechanics
- [DOCS_STRUCTURE.md](./DOCS_STRUCTURE.md) — Documentation conventions
