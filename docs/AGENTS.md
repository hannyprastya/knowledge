# Agents

Eleven generic agents organized by role, plus two stack-specific implementers wired up for this repo's `apps/`. Each lives in `.opencode/agent/{name}.md` with frontmatter describing its mode, model, tools, and permissions.

## Coordination

### `@architect` — Planning lead
Interviews you to clarify requirements, then produces structured execution plans. Never writes application code. Delegates research to `@explore` and `@librarian`. Uses the Question tool aggressively.

**Outputs**: Plans at `.opencode/context/plans/{slug}.md` with waves, tasks, acceptance criteria, QA scenarios, files to modify.

### `@orchestrator` — Delivery lead
Reads plans and dispatches tasks to specialists. Never writes application code. Maintains notepad state across waves. Invokes `@reviewer` after each wave.

**Key rules**: 8-section delegation prompts, verbatim copy from plan, no parallel dispatch of same code-modifying agent type, no parallel dispatch when files conflict.

## Research & review

### `@explore` — Internal codebase research
Fast search across the workspace. Returns paths, signatures, patterns — never modifies files. Read-only.

### `@librarian` — External knowledge
Fetches documentation from the web (framework docs, API references, RFCs). Use when the answer is outside the codebase.

### `@analyst` — Quantitative analysis
Data analysis, metrics interpretation, structured comparisons. Read-only.

### `@strategist` — Architectural perspective
High-level patterns, tradeoffs, "should we even do this" questions. Read-only.

### `@auditor` — Plan auditor
Reviews `@architect`'s plans before execution. Catches missing acceptance criteria, file conflicts between parallel tasks, unrealistic estimates. Returns PASS / GAPS / REWORK.

### `@reviewer` — Wave reviewer
Validates implementation outcomes after each wave. Compares results against the plan's acceptance criteria. Returns PASS / REWORK / ESCALATE.

## Execution & maintenance

### `@build` — Generic implementation
The generic implementer. **Copy this file** to create stack-specific agents (`backend.md`, `frontend.md`, `mobile.md`, etc.) for your project. Fill in the verification commands (`{project test command}`, `{project lint command}`, `{project build command}`) with real commands for your stack.

### `@api` — Backend implementation (this repo)
Stack-specific implementer for `apps/api/` (Bun + Hono + TypeScript). Owns routes, middleware, validation, and request/response types. Keeps `app.ts` runtime-pure so the web app can import `AppType` for end-to-end RPC. Verifies via `pnpm -F @knowledge/api typecheck|build|test`.

### `@web` — Frontend implementation (this repo)
Stack-specific implementer for `apps/web/` (Vite + React 18 + Tailwind v4 + shadcn). Owns components, pages, hooks, styles. Uses the typed Hono RPC client at `src/lib/api.ts` for all backend calls. Verifies via `pnpm -F @knowledge/web typecheck|build`.

### `@curator` — Documentation maintenance
Keeps documentation in sync with code changes. Invoked by `@orchestrator` after implementation work lands.

### `@scribe` — Knowledge archiving
Archives completed plans and notepads to `.opencode/context/archive/` for cross-session knowledge retention.

## Mode types

- **primary**: User-facing agents (orchestrator, architect)
- **subagent**: Invoked by other agents (everything else)

## Adding new agents

1. Create `agent/{name}.md` with frontmatter (description, mode, model, tools, permissions).
2. Reference the new agent in `@orchestrator`'s parallelism guard table if it's a code-modifying agent.
3. Reference it in `@architect`'s plan task templates where relevant.
4. Update this file.

## Permissions philosophy

- **Read-only agents** (explore, librarian, analyst, strategist, auditor, reviewer, curator, scribe) have `write: deny`, `edit: deny`, `bash: deny`. They produce reports.
- **Planning agents** (architect) can write only to `.opencode/context/`.
- **Implementation agents** (build and your stack-specific clones like `@api`, `@web`) can write code, run bash for verification, but should respect file-scope from the delegation. Stack-specific clones (`@api`, `@web`) additionally restrict their `permission.edit` frontmatter to their owned workspace (`apps/api/**` or `apps/web/**`) and `ask` for paths outside it.
