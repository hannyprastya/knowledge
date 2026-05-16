# Agentic Documentation Structure

> **Last Updated:** December 2024

This document defines how documentation should be structured to maximize AI agent discoverability and effectiveness.

---

## Core Principles

1. **Proximity** - Documentation lives close to the code it describes
2. **Brevity** - AGENTS.md files are concise (150-200 lines)
3. **Discoverability** - Quick Reference tables enable fast lookup
4. **Separation** - Project-specific vs cross-cutting documentation

---

## Two-Tier Documentation Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DOCUMENTATION TIERS                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Tier 1: Project-Local Documentation                                │
│  ───────────────────────────────────────────────────────────────    │
│  Location:   {project}/AGENTS.md + {project}/docs/                  │
│  Content:    Project-specific patterns, commands, architecture      │
│  Ownership:  Project team                                           │
│                                                                      │
│  Tier 2: Central Documentation                                       │
│  ───────────────────────────────────────────────────────────────    │
│  Location:   docs/                                                  │
│  Content:    Cross-cutting concerns (auth, patterns, specs)         │
│  Ownership:  Platform team                                          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

### Project-Local Documentation

Each project maintains its own documentation:

```
{project}/
├── AGENTS.md              # Entry point (150-200 lines)
└── docs/                  # Detailed documentation
    ├── {PATTERN}.md       # Architecture/pattern docs
    ├── {GUIDE}.md         # How-to guides
    └── ...
```

> Document your project's specific structure here. Each subproject should have its own `AGENTS.md` and a `docs/` directory with relevant architecture, patterns, and how-to guides.

### Central Documentation

Cross-cutting concerns that apply to multiple projects:

```
docs/
├── INDEX.md               # Topic-based navigation
├── patterns/              # Cross-cutting patterns
│   ├── AUTHENTICATION.md  # Platform-wide auth
│   ├── MULTI_TENANCY.md   # Tenant isolation (if applicable)
│   └── ...
├── business/              # Business requirements
├── guides/                # Setup guides
├── specs/                 # Feature specifications
└── technical/
    ├── architecture/      # Platform architecture
    ├── security/          # Security guidelines
    └── observability/     # Logging, metrics
```

---

## AGENTS.md Structure

### Size Constraint

**Target: 150-200 lines** (hard limit: 250 lines)

Why:
- AI agents have limited context windows
- Long files dilute important information
- Quick lookup is more valuable than comprehensive reference

### Required Sections

Every AGENTS.md MUST have these sections in this order:

```markdown
# Agent Guidelines - {Project Name}

## Quick Reference

| Task | Doc | Key Points |
|------|-----|------------|
| [Common task 1] | [Link](docs/X.md) | 1-line summary |
| [Common task 2] | [Link](docs/Y.md) | 1-line summary |
| [Common task 3] | AGENTS.md#section | 1-line summary |

## Commands

```bash
{project dev command}     # Start development server
{project test command}    # Run tests
{project lint command}    # Lint code
```

## Before Committing

```bash
# Required checks before any commit
{project lint command} && {project test command}
```

## Code Style (Summary)

[Brief summary - 10-15 lines max]
[Reference docs/ for full details]

## Architecture (Summary)

[Brief summary - 15-20 lines max]
[Reference docs/ for full details]

## Common Tasks

### [Task 1]
[Step-by-step - keep concise]

### [Task 2]
[Step-by-step - keep concise]

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VAR_1    | Description | Yes      |

## See Also

- [Link to related doc](docs/X.md) - Description
- [Link to central doc](../../docs/patterns/Y.md) - Description
```

### Quick Reference Table

The Quick Reference table is **mandatory** and must be the first section after the title.

**Purpose:** Enable agents to find the right documentation in one lookup.

**Format:**

| Task | Doc | Key Points |
|------|-----|------------|
| Action-oriented task | Relative link | Essential info |

**Good Examples:**

| Task | Doc | Key Points |
|------|-----|------------|
| Add new module | [MODULE_TEMPLATE.md](docs/MODULE_TEMPLATE.md) | Layered structure |
| Handle errors | [CODE_STYLE.md](docs/CODE_STYLE.md#errors) | Typed errors |
| Add pagination | [RESPONSE_TYPES.md](docs/RESPONSE_TYPES.md) | Cursor vs Offset |

**Bad Examples:**

| Task | Doc | Key Points |
|------|-----|------------|
| Architecture | docs/ARCH.md | See doc | *(not action-oriented)*
| Read this | docs/IMPORTANT.md | Important | *(vague)*

### What Goes in AGENTS.md vs docs/

| Content Type | AGENTS.md | docs/ |
|--------------|-----------|-------|
| Quick Reference table | ✅ | ❌ |
| Command reference | ✅ | ❌ |
| Pre-commit checks | ✅ | ❌ |
| Code style summary | ✅ (10-15 lines) | Full details |
| Architecture summary | ✅ (15-20 lines) | Full details |
| Common tasks | ✅ | Extended guides |
| Environment variables | ✅ | ❌ |
| Detailed patterns | ❌ | ✅ |
| Code examples (>20 lines) | ❌ | ✅ |
| Decision rationale | ❌ | ✅ |

---

## Detailed Documentation (docs/)

### File Naming

- Use SCREAMING_SNAKE_CASE for documentation files
- Be specific: `STATE_MANAGEMENT.md` not `STATE.md`
- Use descriptive names

### Document Structure

```markdown
# {Topic Name}

> **Last Updated:** {Date}

Brief description (1-2 sentences).

---

## Overview

[Explain the concept - when to use, why it exists]

## [Main Sections]

[Detailed content with code examples]

## Examples

[Complete, copy-paste ready examples]

## Anti-Patterns

[What NOT to do]

## See Also

- [Related doc](./OTHER.md)
- [External resource](https://...)
```

### Cross-References

Always use relative paths:

```markdown
# Good - relative path
See [AUTHENTICATION](../../docs/patterns/AUTHENTICATION.md)

# Bad - absolute path from workspace root
See [AUTHENTICATION](/docs/patterns/AUTHENTICATION.md)
```

---

## Central docs/ Guidelines

### What Belongs in Central docs/

| Category | Examples | Location |
|----------|----------|----------|
| Cross-cutting patterns | Auth, Multi-tenancy | `docs/patterns/` |
| Business requirements | Platform plan, Roles | `docs/business/` |
| Feature specifications | Billing, Notifications | `docs/specs/` |
| Setup guides | Environment, DNS | `docs/guides/` |
| Platform architecture | High-level design | `docs/technical/architecture/` |
| Security guidelines | OWASP, Secrets | `docs/technical/security/` |

### What Does NOT Belong in Central docs/

Project-specific patterns, conventions, and guides belong in the project's own `{project}/docs/` directory — not in central docs.

### INDEX.md

Central `docs/INDEX.md` provides topic-based navigation:

```markdown
# Documentation Index

## By Topic

### Architecture
- [Platform Overview](technical/architecture/OVERVIEW.md)
- Project-specific architecture lives in each project's AGENTS.md

### Patterns
- [Authentication](patterns/AUTHENTICATION.md) - Cross-platform
- [Multi-tenancy](patterns/MULTI_TENANCY.md) - Cross-platform

### By Project
| Project | AGENTS.md | Detailed Docs |
|---------|-----------|---------------|
| {project} | [AGENTS.md]({path}/AGENTS.md) | [docs/]({path}/docs/) |
```

---

## OpenCode Subagent Integration

### Required Reading Pattern

Subagent configs in `.opencode/agent/` reference documentation via the REQUIRED READING table:

```markdown
## REQUIRED READING

| Priority | File | Purpose |
|----------|------|---------|
| **CRITICAL** | `{project}/AGENTS.md` | Commands, patterns |
| **HIGH** | `{project}/docs/ARCHITECTURE.md` | Architecture |
| **MEDIUM** | `docs/patterns/AUTHENTICATION.md` | Auth flow |
```

### Why This Matters

1. **Subagents reference, not duplicate** - AGENTS.md is the source of truth
2. **Quick Reference enables routing** - Agents can find the right doc fast
3. **Proximity reduces context switches** - Project docs are near project code

---

## Decision Tree: Where Does This Doc Go?

```
Is this documentation project-specific?
├── YES: Does a docs/ folder exist in the project?
│   ├── YES → Put it in {project}/docs/
│   └── NO → Create {project}/docs/ and put it there
└── NO: Is this a cross-cutting concern?
    ├── YES → Put it in central docs/
    │   ├── Pattern? → docs/patterns/
    │   ├── Spec? → docs/specs/
    │   ├── Guide? → docs/guides/
    │   └── Technical? → docs/technical/
    └── NO → Reconsider if it needs to be documented
```

---

## Validation Checklist

### For AGENTS.md Files

- [ ] Under 200 lines (hard limit: 250)
- [ ] Has Quick Reference table as first section
- [ ] Has Commands section
- [ ] Has Before Committing section
- [ ] Has Environment Variables section
- [ ] Has See Also section with links to docs/
- [ ] All links use relative paths
- [ ] No code examples longer than 20 lines

### For docs/ Files

- [ ] Uses SCREAMING_SNAKE_CASE naming
- [ ] Has Last Updated date
- [ ] Has Overview section
- [ ] Has Examples section
- [ ] Has See Also section
- [ ] All links use relative paths

### For Central docs/

- [ ] Only contains cross-cutting concerns
- [ ] No project-specific documentation
- [ ] INDEX.md is up to date
