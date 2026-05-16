# AI Agent Orchestration Guide

> **Last Updated:** December 2024

This guide explains how to use the agent orchestration system for coordinated multi-area feature development. It is **stack-agnostic** — adapt it to any project by adding stack-specific implementation agents as needed (e.g., a `backend.md`, `frontend.md`, `mobile.md`).

---

## Quick Start

```bash
# Start your agent runtime in the workspace
cd /path/to/your-workspace

# You typically start in orchestrator mode
# Switch primary agents with Tab (or your runtime's equivalent)
# Cycles: orchestrator → build → plan → orchestrator

# Orchestrator will analyze, plan, design, then delegate to specialists
```

---

## Agent Architecture

This hub provides a curated set of **generic, reusable agents**. Stack-specific implementation agents (backend, frontend, mobile, database, infra, etc.) should be added to your project as needed.

```
PRIMARY AGENTS (Tab to switch):
┌─────────────────────────────────────────────────────────────┐
│  orchestrator │ Execution coordinator                        │
│  architect    │ Requirements + plan generation               │
│  build        │ Generic implementer for any code area        │
│  plan         │ Analysis without changes (read-only)         │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ delegates to
                          ▼
SUBAGENTS (retained in this hub):
┌─────────────────────────────────────────────────────────────┐
│  Planning & Review                                           │
│  ├── @strategist     │ Pre-plan risk/ambiguity review        │
│  ├── @auditor        │ Plan verification & completeness      │
│  ├── @analyst        │ Requirements & systems analysis       │
│  ├── @architect      │ Architecture validation (read-only)   │
│                                                              │
│  Research & Memory                                           │
│  ├── @explore        │ Codebase exploration                  │
│  ├── @librarian      │ Knowledge & artifact retrieval        │
│  ├── @scribe         │ Execution memory & notepads           │
│  ├── @curator        │ Documentation alignment               │
│                                                              │
│  Implementation                                              │
│  └── @build          │ Generic implementer                   │
│                                                              │
│  Review                                                      │
│  └── @reviewer       │ Code review & quality gates           │
└─────────────────────────────────────────────────────────────┘
```

> **Note:** Add stack-specific implementation agents as needed for your project (e.g., a `backend.md`, `frontend.md`, `mobile.md`, `database.md`, `infra.md`). They follow the same delegation pattern as `@build`.

---

## Orchestrator & Planner Workflow

The workflow centers on **Planner (architect)** → **Orchestrator**. Plans are created in `.opencode/context/plans/` and executed through delegated specialists.

### Intent Classification (Planner)

Planner classifies requests into 7 intent types before interviewing:

| Intent Type   | Signals                                      | Min Questions |
| ------------- | -------------------------------------------- | ------------- |
| Trivial       | Single file, typo fix, <10 lines             | 0-1           |
| Simple        | 1-2 files, clear scope, <30 min work         | 1-2           |
| Refactoring   | Code restructure, no behavior change         | 2-3           |
| Build         | New feature, clear requirements              | 3-4           |
| Mid-sized     | 3+ files, multiple components                | 4-5           |
| Collaborative | Requires user decisions, preferences         | 5+            |
| Architecture  | System design, cross-module, infrastructure  | 5-7           |

### Interview Mode

Planner conducts intent-specific interviews with a 6-point clearance checklist:

1. Intent classified
2. Minimum questions asked
3. Scope boundaries defined
4. Critical unknowns surfaced
5. User confirmed approach
6. Draft updated

All checkpoints must pass before plan generation.

### High Accuracy Mode (Auditor Loop)

For Architecture intent or critical changes, Planner invokes `@auditor` in a loop:

```
REPEAT:
  1. Generate/update plan
  2. @auditor reviews (scoring 0-100)
  3. IF "OKAY" (score >= 85) → EXIT
  4. IF "NEEDS_WORK" → Address issues → GOTO 1
  5. Maximum 3 iterations → ESCALATE to user
```

### Scale Detection

Orchestrator first determines the scale of your request:

| Scale     | Areas Affected                  | Phases Used             | Parallel Execution        |
|-----------|---------------------------------|-------------------------|---------------------------|
| **Quick** | 1 area, trivial (typo, config)  | IMPLEMENT only          | N/A (single agent)        |
| **Small** | 1-2 areas, straightforward      | PLAN → IMPLEMENT        | Within implementation     |
| **Medium**| 2-3 areas, new feature          | PLAN → IMPLEMENT        | Parallel where safe       |
| **Large** | 4+ areas, major feature         | PLAN → IMPLEMENT + audit| Parallel where safe       |

### Phase Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                 PLANNER → ORCHESTRATOR FLOW                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PHASE 1: PLAN                                                   │
│  ├─► @architect interviews (intent-specific strategy)            │
│  ├─► @architect consults @strategist (gap classification)        │
│  │   └─► Gaps: CRITICAL (ask user), MINOR (fix), AMBIGUOUS       │
│  ├─► @architect generates plan with execution waves              │
│  ├─► @auditor validates (OKAY/NEEDS_WORK loop)                   │
│  └─► Output: .opencode/context/plans/{topic}.md                  │
│                                                                  │
│  PHASE 2: IMPLEMENT                                              │
│  ├─► Orchestrator delegates using 6-section format               │
│  │   └─► TASK, EXPECTED OUTCOME, REQUIRED TOOLS,                 │
│  │       MUST DO, MUST NOT DO, CONTEXT (30+ lines min)           │
│  ├─► Agents execute: @build (and any project-specific agents)    │
│  ├─► @reviewer performs quality gates                            │
│  └─► @curator (docs alignment)                                   │
│                                                                  │
│  PHASE 3: VERIFY (4-Part Protocol)                               │
│  ├─► A. Automated: Run {project test command}                    │
│  ├─► B. Manual Review: Read EVERY modified file                  │
│  ├─► C. Hands-On QA: Execute QA scenarios from plan              │
│  ├─► D. Boulder State: Check for regressions                     │
│  └─► Notes in .opencode/context/notepads/{plan}/                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Artifact Output

Orchestrator creates persistent documentation:

```
.opencode/context/
├── drafts/{slug}.md          # Planner interview notes (deleted after plan)
├── plans/{slug}.md           # Finalized execution plans
├── notepads/{slug}/          # Orchestrator execution state
│   ├── learnings.md          # Discoveries during execution
│   ├── decisions.md          # Choices made and rationale
│   ├── issues.md             # Problems encountered
│   └── progress.md           # Task completion tracking
└── evidence/{slug}/          # Audit trail for complex decisions
    ├── decisions/
    ├── verification/
    ├── approvals/
    └── findings/
```

Legacy templates in `.opencode/templates/` remain available for compatibility.

---

## Notepad Protocol

Notepads under `.opencode/context/notepads/{slug}/` provide durable execution state across agent invocations and compaction events.

| Notepad         | Purpose                                            | Written By                  |
|-----------------|----------------------------------------------------|-----------------------------|
| `learnings.md`  | Discoveries made during execution                  | @scribe, any agent          |
| `decisions.md`  | Choices made and their rationale                   | orchestrator, @scribe       |
| `issues.md`     | Problems encountered, open questions, blockers     | any agent                   |
| `progress.md`   | Task completion tracking, batch status             | orchestrator                |

**Rules:**

1. Append-only by default — never silently overwrite prior entries.
2. Timestamp every entry (`YYYY-MM-DD HH:MM`).
3. Reference plan task IDs where applicable.
4. After compaction or restart, the first action is to re-read all notepads for the active plan.

---

## Parallel Execution

Orchestrator runs compatible tasks simultaneously to reduce wall-clock time.

### How It Works

1. **Dependency Analysis**: Orchestrator analyzes task dependencies within each phase
2. **Batch Creation**: Groups independent tasks into parallel batches
3. **Concurrent Execution**: Runs agents simultaneously within each batch
4. **Synchronization**: Waits for all agents in a batch before proceeding
5. **Error Handling**: Manages failures without blocking unrelated tasks

### Batch Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    PARALLEL EXECUTION BATCHES                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Batch 1: Foundation (run in parallel)                           │
│  ├─► @build    - Schema / data layer                             │
│  ├─► @build    - Core API structure                              │
│  └─► @curator  - Documentation updates                           │
│                                                                  │
│  ↓ Wait for Batch 1 completion                                   │
│                                                                  │
│  Batch 2: Features (run in parallel)                             │
│  ├─► @build    - UI components (needs API contract)              │
│  ├─► @build    - Mobile screens (needs API contract)             │
│  └─► @build    - Business logic (needs schema)                   │
│                                                                  │
│  ↓ Wait for Batch 2 completion                                   │
│                                                                  │
│  Batch 3: Quality Assurance (run in parallel)                    │
│  ├─► @build    - Integration tests                               │
│  ├─► @reviewer - Code review                                     │
│  └─► @auditor  - Plan/outcome audit                              │
│                                                                  │
│  ↓ Wait for Batch 3 completion                                   │
│                                                                  │
│  Batch 4: Deployment (sequential)                                │
│  └─► @build    - Deployment / release                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Parallelism Guards

- **Foundation before features** — never start dependent work before its prerequisite batch completes.
- **One writer per file/region** — if two parallel agents would touch the same file, serialize them.
- **Deployment is always sequential** — never parallelize release steps.
- **Read-only agents always parallelize safely** — `@explore`, `@librarian`, `@auditor`, `@architect` (review mode), `@reviewer`.
- **Hard cap on concurrency** — keep within a reasonable per-system limit (typically 2–6 agents) to avoid resource thrash.

### Performance Expectations

| Scale     | Sequential Time | Parallel Time   | Speedup           |
|-----------|-----------------|-----------------|-------------------|
| **Quick** | 30 seconds      | 30 seconds      | 1x (single agent) |
| **Small** | 3-5 minutes     | 2-3 minutes     | 1.5-2x            |
| **Medium**| 8-12 minutes    | 4-6 minutes     | 2-2.5x            |
| **Large** | 15-25 minutes   | 6-12 minutes    | 2.5-3x            |

### Agent Parallel Compatibility

| Category       | Compatible Agents                       | Constraints                       |
|----------------|-----------------------------------------|-----------------------------------|
| **Planning**   | `@architect`, `@strategist`, `@auditor` | Planner drives, reviewers parallelize |
| **Research**   | `@explore`, `@librarian`, `@analyst`    | All read-only, fully parallel     |
| **Foundation** | `@build` (data), `@build` (core API)    | Schema usually first              |
| **Features**   | Multiple `@build` instances             | Need foundation first             |
| **Quality**    | `@reviewer`, `@auditor`                 | Needs features complete           |
| **Docs**       | `@curator`                              | Runs after implementation changes |
| **Deployment** | `@build` (release)                      | Must run last, sequentially       |

Parallel execution is orchestrator-driven; no external config files are required.

---

## Example Orchestrator Sessions

### Quick Scale (typo fix) — No Parallelization

```
User: Fix the typo in the login button

Orchestrator: This is a quick fix (1 area).
              Parallel execution: Not applicable (single agent).
              Delegating directly to implementation.

              @build Fix typo in login button...

              Done! (30 seconds)
```

### Small Scale (simple feature) — Parallel Implementation

```
User: Add a "last login" timestamp to user profiles

Orchestrator: Small feature (2 areas: data + API).
              Parallel execution: Enabled.
              Moving to PLAN phase.

              Plan:
              1. @build - Add last_login_at column
              2. @build - Update user endpoints

              Approve?

User: Yes

Orchestrator: [IMPLEMENT - Parallel Execution]

              Batch 1 (Foundation) - Running in parallel:
              ├─► @build Adding last_login_at column...
              └─► @build Updating user endpoints...

              Batch 1 complete! (1.5 minutes vs 3 minutes sequential)

              Ready to verify and ship?
```

### Medium Scale (new feature) — Full Parallel Workflow

```
User: Add invoice notifications with email and in-app alerts

Orchestrator: Medium feature detected (5 areas).
              Parallel execution: Enabled.
              Starting PLAN phase.

              @architect Drafting plan...
              @strategist Reviewing for risks...
              @auditor Verifying plan completeness...

              Plan ready in .opencode/context/plans/invoice-notifications.md. Approve?

User: Yes

Orchestrator: [IMPLEMENT - Maximum Parallelization]

              Batch 1 (Foundation) - Running in parallel:
              ├─► @build Creating notification tables...
              └─► @build Implementing notification endpoints...

              Batch 2 (Features) - Running in parallel:
              ├─► @build Building notification UI...
              ├─► @build Adding email notification logic...
              └─► @build Adding admin notification controls...

              Batch 3 (Quality) - Running in parallel:
              ├─► @build Creating test scenarios...
              └─► @reviewer Reviewing all notification changes...

              Implementation complete!
              Total: 6 minutes (vs 12 minutes sequential)
```

### Large Scale (complex feature) — Advanced Parallelization

```
User: Implement full multi-tenant notification system with webhooks,
      templates, and analytics

Orchestrator: Large feature detected (8+ areas).
              Starting ANALYZE phase.

              Batch 1 (Research) - Running in parallel:
              ├─► @librarian Finding webhook and template specs...
              ├─► @analyst Gathering complex requirements...
              ├─► @explore Searching multi-tenant patterns...
              └─► @curator Researching analytics docs...

              Moving to PLAN phase.

              Batch 2 (Design) - Running in parallel:
              ├─► @strategist Notification center design...
              ├─► @architect Initial system architecture...
              └─► @auditor Plan validation...

              [Creates detailed plan]
              Approve?

User: Yes

Orchestrator: [IMPLEMENT - Complex Parallel Execution]

              Batch 1 (Data Foundation):
              └─► @build Creating notification schema...

              Batch 2 (Core APIs) - Running in parallel:
              ├─► @build Notification service endpoints...
              └─► @build Template management system...

              Batch 3 (Features) - Running in parallel:
              ├─► @build Notification center UI...
              ├─► @build Mobile notification handling...
              └─► @build Webhook management...

              Batch 4 (Quality) - Running in parallel:
              ├─► @build Comprehensive tests...
              ├─► @reviewer Multi-component review...
              └─► @auditor Final outcome audit...

              Implementation complete!
              Parallel actual: 11 minutes (vs 25 minutes sequential)
```

---

## Available Agents

### Research & Design Agents

| Agent          | Purpose                            | Output                    | Parallel Compatible | Batch Group |
|----------------|------------------------------------|---------------------------|---------------------|-------------|
| `@librarian`   | Find specs, prior plans, patterns  | Research summary          | Yes                 | research    |
| `@curator`     | Documentation alignment            | Doc updates               | Yes                 | research    |
| `@explore`     | Codebase exploration               | File paths + code refs    | Yes                 | research    |
| `@analyst`     | Requirements & systems analysis    | Requirements doc          | Yes                 | research    |
| `@architect`   | Requirements + plan generation     | Plans                     | Yes                 | design      |
| `@strategist`  | Pre-plan gap analysis              | PROCEED / NEEDS_WORK      | Yes                 | design      |
| `@auditor`     | Plan validation                    | OKAY / NEEDS_WORK / ESCALATE | Yes              | design      |

### Gap Classification (@strategist)

| Gap Type   | Action                                      |
|------------|---------------------------------------------|
| CRITICAL   | Stop. Ask user before proceeding.           |
| MINOR      | Fix silently in plan. No interruption.      |
| AMBIGUOUS  | Choose sensible default. Disclose in plan.  |

### Auditor Verdicts

| Verdict     | Meaning                                | Plan Score |
|-------------|----------------------------------------|------------|
| OKAY        | Plan ready for execution               | >= 85      |
| NEEDS_WORK  | Issues must be resolved                | < 85       |
| ESCALATE    | Critical issues need user input        | N/A        |

### Implementation & Memory Agents

| Agent      | Scope                                   | Parallel Compatible | Batch Group |
|------------|-----------------------------------------|---------------------|-------------|
| `@build`   | Generic implementer (any code area)     | Yes                 | foundation / features |
| `@reviewer`| Code review & quality gates             | Yes (read-only)     | testing     |
| `@scribe`  | Execution memory; writes notepads       | Yes                 | cross-cutting |
| `@curator` | Documentation alignment                 | Yes                 | docs        |

> **Stack-specific implementers:** Add agents like `backend.md`, `frontend.md`, `mobile.md`, `database.md`, `infra.md` as your project requires. They plug into the same batch groups as `@build`.

### Parallel Execution Groups

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT PARALLELIZATION MATRIX                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  RESEARCH GROUP (Can run in parallel)                            │
│  ├─► @librarian + @explore + @analyst + @curator                 │
│  └─► No dependencies, all gather different information           │
│                                                                  │
│  DESIGN GROUP (Partially parallel)                               │
│  ├─► @strategist + @auditor (parallel)                           │
│  └─► @architect (needs requirements first)                       │
│                                                                  │
│  FOUNDATION GROUP (Sequenced)                                    │
│  ├─► @build (data/schema first)                                  │
│  ├─► @build (core API after schema)                              │
│  └─► @curator (docs in parallel)                                 │
│                                                                  │
│  FEATURES GROUP (Highly parallel)                                │
│  └─► Multiple @build instances (all parallel)                    │
│                                                                  │
│  TESTING GROUP (Can run in parallel)                             │
│  └─► @build + @reviewer + @auditor                               │
│                                                                  │
│  DEPLOYMENT GROUP (Sequential only)                              │
│  └─► @build (release must run last)                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Subagent Response Format

All execution subagents respond with a structured format:

```markdown
## Result

- **Status**: success | failed | partial
- **Files changed**:
  - path/to/file (created|modified|deleted)
- **Tests**: passed | failed | skipped | N/A
- **Notes**: [issues or follow-ups]
```

This allows the orchestrator to track progress and handle errors appropriately.

---

## When to Use Each Agent

| Situation                                | Agent           | Why                              |
|------------------------------------------|-----------------|----------------------------------|
| Multi-area feature                       | **orchestrator**| Coordinates across areas         |
| Quick fix in one file                    | **build**       | Direct, no orchestration needed  |
| Analyze code without changes             | **plan**        | Read-only exploration            |
| Find relevant documentation              | **@librarian**  | Knows artifact layout            |
| Align/refresh project docs               | **@curator**    | Documentation specialist         |
| Search codebase for patterns             | **@explore**    | Fast file/content search         |
| Need requirements clarified              | **@analyst**    | Structured requirements          |
| Pre-plan risk / gap analysis             | **@strategist** | Classifies gaps before planning  |
| Need a plan                              | **@architect**  | Plan + architecture authority    |
| Validate a plan before execution         | **@auditor**    | Scored verification              |
| Capture decisions / learnings mid-run    | **@scribe**     | Writes durable notepads          |
| Final code review                        | **@reviewer**   | Quality gate                     |

---

## Error Handling

When a subagent fails, Orchestrator will:

1. Present the error to you
2. Offer options:
   - **Retry** with a different approach
   - **Skip** and continue with next task
   - **Abort** the entire plan
3. Wait for your decision

### Sequential Execution Error Handling

```
Orchestrator: @build failed:

              Error: Missing dependency

              Options:
              1. Retry: Add dependency first
              2. Skip: Move to next task
              3. Abort: Stop the plan

User: 1

Orchestrator: @build Adding dependency and retrying...
```

### Parallel Execution Error Handling

```
Orchestrator: [IMPLEMENT - Batch 2 (Features)]
              Running in parallel:
              ├─► @build Building UI...
              ├─► @build Adding mobile screens...
              └─► @build Implementing email logic...

              Batch 2 partial completion:
              ✅ @build - Completed successfully
              ❌ @build - Error: Missing permission config
              ✅ @build - Completed successfully

              Options for failed agent:
              1. Retry: Fix config and retry
              2. Skip: Continue without that piece
              3. Abort: Stop entire implementation

              Note: Other agents in batch completed successfully.

User: 1

Orchestrator: Retrying with fix... ✅ Completed.
              Batch 2 now fully complete! Proceeding to Batch 3...
```

### Parallel Batch Failure Strategies

| Strategy        | Behavior                              | Use Case                |
|-----------------|---------------------------------------|-------------------------|
| **Fail Fast**   | Stop all agents on first failure      | Critical dependencies   |
| **Continue**    | Let successful agents complete        | Independent features    |
| **Retry Batch** | Retry failed agents only              | Transient errors        |
| **Skip Failed** | Continue without failed agents        | Optional components     |

Batch retry behavior is managed by Orchestrator based on task criticality and agent dependency notes.

---

## Escalation Tiers

When something can't be resolved automatically, escalate using these tiers (lowest first):

| Tier | Trigger                                              | Action                                    |
|------|------------------------------------------------------|-------------------------------------------|
| T0   | Recoverable transient error                          | Retry once silently                       |
| T1   | Subagent reports `failed`                            | Surface to user; offer retry/skip/abort   |
| T2   | Auditor returns `NEEDS_WORK` 3× in a row             | Escalate to user with summary of attempts |
| T3   | Conflicting requirements or destructive change       | Stop. Confirm with user before any write  |
| T4   | Security, data loss, or irreversible action          | Hard stop. Require explicit user approval |

Record every T2+ escalation in `notepads/{slug}/decisions.md` and `notepads/{slug}/issues.md`.

---

## Post-Compaction Recovery

If conversation context is compacted, restarted, or you resume a stale session:

1. Identify the active plan slug (most recent file in `.opencode/context/plans/`).
2. Re-read in this order:
   - `plans/{slug}.md`
   - `notepads/{slug}/progress.md`
   - `notepads/{slug}/decisions.md`
   - `notepads/{slug}/issues.md`
   - `notepads/{slug}/learnings.md`
3. Check `evidence/{slug}/` for any approvals/verifications already captured.
4. Reconstruct the next pending batch from `progress.md`.
5. Confirm with the user before resuming destructive operations.

This protocol ensures continuity across agent restarts and context resets.

---

## Bypassing Orchestrator

For quick, single-area changes, bypass orchestration:

### Option 1: Switch to `build` primary agent

```
<Tab>  # Switch to build
Fix the typo in src/components/Button.tsx
```

### Option 2: Directly invoke a subagent

```
# Even while in orchestrator mode
@build Fix the compilation error in {file}
```

---

## Configuration

### Directory Structure

```
.opencode/
├── agent/                  # Agent definitions
│   ├── orchestrator.md     # Primary - execution coordinator
│   ├── architect.md        # Primary - planning lead
│   ├── strategist.md       # Pre-plan analysis
│   ├── auditor.md          # Plan validation
│   ├── analyst.md          # Requirements analysis
│   ├── explore.md          # Codebase exploration
│   ├── librarian.md        # Knowledge retrieval
│   ├── scribe.md           # Execution memory
│   ├── curator.md          # Documentation alignment
│   ├── reviewer.md         # Code review
│   └── build.md            # Generic implementer
│
├── context/                # Plans and execution memory
│   ├── drafts/             # Planner interview notes
│   ├── plans/              # Planner output
│   ├── notepads/           # Orchestrator execution notes
│   ├── evidence/           # Audit trail
│   └── archive/            # Completed plans (gitignored)
│
├── templates/              # Artifact templates
│   ├── BRIEF.md
│   ├── PRD.md
│   └── TECHNICAL.md
│
└── docs/
    └── WORKFLOW.md         # This file
```

> Add stack-specific agents (e.g., `backend.md`, `frontend.md`, `mobile.md`) into `.opencode/agent/` for your project.

### Parallel Execution Configuration

Parallel execution is managed by Orchestrator based on plan scope and agent dependency notes. **There are no external config files.** All batching, concurrency, and failure-handling decisions are made dynamically.

### Creating Custom Agents

Create a new file under `.opencode/agent/{name}.md` with frontmatter declaring parallel-safety and batch group, then a description of the agent's scope and conventions:

```markdown
---
parallel_safe: true
batch_group: "features"
dependencies: ["@build"]
provides: ["custom_feature"]
---

# My Custom Agent

This agent handles ...
```

---

## AGENTS.md Integration

The system leans on `AGENTS.md` files placed throughout the codebase to encode project-specific conventions:

```
AGENTS.md (root)                  → Project map, decision tree
└── {area}/AGENTS.md              → Patterns and conventions for each area
```

Each subagent should be configured to read the relevant `AGENTS.md` for its scope. Stack-specific implementers depend on this for convention-aware behavior.

---

## Tips and Best Practices

### 1. Let the planner research first

The planner uses `@librarian`, `@explore`, and `@curator` to understand before planning. This keeps implementation aligned with existing patterns.

### 2. Be specific in requirements

```
# Less effective
Add notifications

# More effective
Add email notifications for invoice events (created, paid, overdue).
Include a notification center in the web app header.
Users should configure which notifications they receive.
```

### 3. Iterate during early phases

It's cheaper to refine requirements and design than to redo implementation.

### 4. Review artifacts

Check the generated plan and any BRIEF/PRD/TECHNICAL artifacts before approving.

### 5. Use @reviewer / @auditor before merging

```
@reviewer Review all changes for the notifications feature
@auditor Audit final outcome against the plan
```

### 6. Optimize features for parallelization

**Good for parallel:**
```
Add user profile management with avatar upload, preferences, and activity log
# Independent tracks: API, UI, mobile, file storage
```

**Poor for parallel:**
```
Migrate all authentication to a new token format
# Sequential dependencies: token format → API → clients → tests
```

### 7. Disable parallel execution when

- Learning / training (easier to follow sequential)
- Debugging complex issues (simpler to trace)
- Resource-constrained systems
- Critical / irreversible deployments

---

## Verification Commands

Use placeholder commands in plans; resolve them to your project's actual tooling:

| Placeholder              | Example resolution        |
|--------------------------|---------------------------|
| `{project test command}` | your test runner          |
| `{project build command}`| your build/compile step   |
| `{project lint command}` | your linter / formatter   |
| `{project run command}`  | your dev server / app run |

Plans should reference placeholders so they remain portable across stacks.

---

## Related Documentation

| Document                   | Description                              |
|----------------------------|------------------------------------------|
| `AGENTS.md` (project root) | Project map and agent decision tree      |
| `docs/patterns/`           | Cross-cutting architecture patterns      |
| `.opencode/templates/`     | Artifact templates for workflow phases   |
