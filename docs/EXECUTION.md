# Execution Guidelines

This document provides guidance for executing implementation plans in build mode.

## Execution Order

Tasks should follow a dependency order appropriate to your project. A typical layered flow:

```
@build (foundation: schema, migrations, data model)
    ↓
@build (backend: services, business logic)
    ↓
@build (presentation: UI, API surface)
    ↓
@build (quality: tests, lint, type checks)
    ↓
@build (deployment, release)
```

**Rule:** Never start a layer until the previous layer completes.

---

## Build Agent Scope

In this hub, implementation work is performed by `@build` (generic) and any stack-specific clones you add. This repo ships two such clones — `@api` (for `apps/api/`) and `@web` (for `apps/web/`) — as concrete examples. Cross-cutting roles remain specialized:

| Agent | Scope |
|-------|-------|
| `@build` | Generic implementation. Use as-is, or copy as a template for stack-specific clones |
| `@api` *(this repo)* | All work in `apps/api/` — Bun + Hono backend |
| `@web` *(this repo)* | All work in `apps/web/` — Vite + React + Tailwind + shadcn frontend |
| `@curator` | Documentation alignment |
| `@reviewer` | Post-implementation validation |
| `@auditor` | Plan validation |
| `@architect` | Plan creation |
| `@strategist` | Pre-plan risk analysis |
| `@analyst` | Plan optimality review |
| `@explore` | Read-only codebase exploration |
| `@librarian` | External documentation research |
| `@scribe` | Cross-session archival |
| `@orchestrator` | Wave dispatch and coordination |

Project-specific guidance lives in your project's `AGENTS.md` files.

---

## Delegation Format

When delegating to an agent, use this format:

```
@agent-name {task description}

Context:
- Plan: {link to plan or summary}
- Dependencies: {what's already done}
- Spec: {relevant spec file if any}
```

**Example:**
```
@build Create migration for notification_preferences table

Context:
- Plan: Add user notification preferences feature
- Dependencies: None (first task)
- Spec: docs/specs/notification/NOTIFICATION.md
```

---

## Execution Modes

| Mode | When | How |
|------|------|-----|
| **Sequential** | Debugging, simple tasks, same-agent code work | One agent at a time |
| **Parallel** | Independent tasks across different read-only agents | Multiple agents simultaneously |

**Default:** Sequential for safety. Parallel dispatch is governed by the binding **Parallelism Policy** and **Batching Policy** in the root [`AGENTS.md`](../../AGENTS.md) — that's the source of truth; this doc only summarizes.

### Parallelism Policy (summary)

Code-modifying agents hold workspace state (build caches, lockfiles, dependency caches) that conflicts under concurrent edits. **Same-type parallel is forbidden. Cross-type parallel is allowed.**

| Agent class | Max parallel | Why |
|---|---|---|
| Code-modifying (`@build`, plus stack-specific clones like `@api`, `@web`) | 1 per agent type | Build caches, lockfiles, dependency state |
| Read-only agents (`explore`, `librarian`, `analyst`, `auditor`, `reviewer`, `scribe`, `curator`, `strategist`) | unlimited | Hold no state |

Examples:
- OK: 3× `@explore` dispatched in parallel.
- OK: 1× `@api` + 1× `@web` in parallel — different code-modifying types, disjoint workspaces.
- FORBIDDEN: 2× `@build` (or 2× `@api`, or 2× `@web`) in parallel — serialize or split waves.

### Batching Policy (summary)

Multiple small same-agent tasks in the same wave can be batched into ONE subagent session via the opt-in `Dispatch: batched:{id}` field in the plan. A batch counts as a single dispatch under the Parallelism Policy. See [`AGENTS.md`](../../AGENTS.md) "Batching Policy" for the full rules (batch size 2–8, members share agent + wave, etc.).

### Per-wave Verification

For `@build` work, run your project's verification commands (`{project test command}`, `{project lint command}`, `{project build command}`) at the end of each wave via the orchestrator's wave-final verification step before `@reviewer` is dispatched.

---

## Progress Tracking

Track execution status with this format:

```markdown
## Execution Progress

**Plan:** {Feature name}

| Phase | Agent | Status | Notes |
|-------|-------|--------|-------|
| Foundation | @build | ✅ Done | Migration created |
| Backend | @build | 🔄 In progress | |
| Frontend | @build | ⏳ Waiting | Needs backend |
| Tests | @build | ⏳ Waiting | |
```

### Status Icons

| Icon | Meaning |
|------|---------|
| ⏳ | Waiting (not started) |
| 🔄 | In progress |
| ✅ | Completed |
| ❌ | Failed |
| ⏸️ | Paused |

---

## Error Handling

If an agent fails:

1. **Report** the failure clearly
2. **Assess** impact on other tasks
3. **Options:**
   - Retry the failed task
   - Skip and continue (if non-blocking)
   - Pause and ask user

**Never continue past a blocking failure without user approval.**

### Blocking vs Non-Blocking Failures

| Failure Type | Blocking? | Action |
|--------------|-----------|--------|
| Schema/migration fails | YES | Stop, fix before continuing |
| Backend compilation error | YES | Stop, fix before frontend |
| Test failure | NO | Can continue, fix later |
| Linting warning | NO | Note and continue |
| Missing optional feature | NO | Document and continue |

---

## Completion Checklist

When all tasks are done:

```markdown
## Execution Complete

**Feature:** {name}

**Summary:**
- {N} tasks completed
- {Files changed}

**Next steps:**
- [ ] Code review (if not done)
- [ ] Deploy to staging?
- [ ] Update documentation?

Ready to deploy? (yes/no/staging-only)
```

---

## Quick Reference

### Starting Execution
```
User: "Execute the plan" or "Implement {feature}"
Action: Review plan → Start with first phase → Delegate
```

### Checking Status
```
User: "What's the status?"
Action: Show progress table
```

### Handling Issues
```
User: "There's an error in @build"
Action: Pause execution → Investigate → Propose fix → Resume
```

---

## Tips

- **Read the plan carefully** before starting
- **One phase at a time** - don't rush ahead
- **Communicate clearly** - tell user what's happening
- **Ask when unsure** - better to clarify than guess
- **Track everything** - keep progress visible
- **Use plans** for multi-session work (see `.opencode/context/plans/`)
