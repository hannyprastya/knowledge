# Knowledge — AI Agent Orchestration Patterns

A reference repository of reusable patterns for orchestrating AI coding agents (designed around [OpenCode](https://opencode.ai), portable to similar tools).

This repo is **knowledge, not a runtime**. Copy the pieces you need into your own project. Nothing here is stack-specific — implementation agents (backend/frontend/mobile/etc.) are intentionally left for you to add per project.

## What's inside

```
.
├── .opencode/
│   ├── agent/         # 11 generic agent definitions
│   ├── skills/        # Reusable skills (planning, git workflow, end-to-end flow)
│   ├── commands/      # Slash commands (/commit, /branch)
│   ├── templates/     # PRD / TECHNICAL / BRIEF / ARTIFACT templates
│   ├── context/       # Empty scaffolding for plans / notepads / drafts / etc.
│   └── opencode.json  # Minimal config
├── apps/
│   ├── api/           # Bun + Hono — example backend
│   └── web/           # Vite + React + Tailwind v4 + shadcn — example frontend
└── docs/
    ├── WORKFLOW.md           # End-to-end multi-phase workflow
    ├── AGENTS.md             # Lineup overview of retained agents
    ├── EXECUTION.md          # How execution & delegation work
    ├── SKILLS_AND_COMMANDS.md
    └── DOCS_STRUCTURE.md     # Documentation conventions
```

The `apps/` directory is a minimal pnpm-workspace monorepo that demonstrates the orchestration patterns on a real stack (Hono RPC end-to-end types between api and web). Install with `pnpm install`; develop with `pnpm dev`.

## The agents

Eleven generic agents organized into three layers, plus two stack-specific implementers wired up for this repo's `apps/`:

| Layer | Agents | Purpose |
|-------|--------|---------|
| **Coordination** | `orchestrator`, `architect` | Plan and dispatch work |
| **Research / Review** | `explore`, `librarian`, `analyst`, `strategist`, `auditor`, `reviewer` | Gather context, validate plans, review output |
| **Execution / Maintenance** | `build`, `curator`, `scribe` | Implement code, update docs, archive knowledge |
| **Stack-specific (this repo)** | `api`, `web` | Implement code in `apps/api/` and `apps/web/` |

See [`docs/AGENTS.md`](docs/AGENTS.md) for what each one does.

## How to adopt

1. Copy `.opencode/` into the root of your project.
2. Update agent `model:` frontmatter fields to whatever model you use (default is `anthropic/claude-sonnet-4-5`).
3. Add **stack-specific implementation agents** alongside `build.md` — e.g., `backend.md`, `frontend.md`, `mobile.md`. Use `build.md` as a template.
4. Fill in `{project test command}`, `{project lint command}`, etc. placeholders in your agent files with real commands for your stack.
5. Read [`docs/WORKFLOW.md`](docs/WORKFLOW.md) for the orchestrated multi-phase workflow.
6. Start with the orchestrator — it's the primary agent.

## Core ideas

- **Planning ≠ implementation.** `@architect` interviews, plans, and never writes code. `@orchestrator` dispatches, never writes code. Specialized agents implement.
- **Delegations are structured.** Every delegation is an 8-section prompt (plan context, task, acceptance criteria, implementation notes, QA scenarios, constraints, prior work, verification).
- **Verbatim copy.** Plan details flow verbatim into delegations — no paraphrasing, because subagents can't read the plan file.
- **Notepads bridge sessions.** `progress.md`, `decisions.md`, `learnings.md`, `issues.md`, `rework-log.md` keep state across waves and context compaction.
- **Wave-based execution with reviews.** Tasks group into waves. After each wave, `@reviewer` validates. Rework once, escalate if it fails again.
- **Parallelism guards.** Same-type code-modifying agents serialize (no two `@build` in parallel — workspace conflicts). Tasks sharing files serialize too.

## Skills and commands

- **`/commit`** — selective staging + conventional-commit message
- **`/branch`** — derive a branch from a GitHub issue or description
- **`simple-plan`** — lightweight planning for trivial tasks
- **`git-workflow`** — conventional-commit + branch-naming conventions (GitHub `gh`-oriented)

## Status & provenance

Distilled from a private monorepo's `.opencode/` configuration. All stack-specific content (Rust, Laravel, Astro, Flutter, etc.) has been removed. What's left is the **pattern**, not the implementation.

## License

See [LICENSE](LICENSE).
