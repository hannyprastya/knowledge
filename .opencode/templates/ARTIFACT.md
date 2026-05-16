---
id: {YYYYMMDDXXX}
title: {Title}
status: active
created: {YYYY-MM-DD}
updated: {YYYY-MM-DD}
owner: {agent-name}
related_agents: []
related_docs: []
  # - path: docs/path/to/doc.md
  #   purpose: Why it's relevant
priority: medium
estimated_phases: 1
completed_phases: 0
tags: []
---

<!-- 
  Filename: {YYYYMMDDXXX}-{slug}.md
  Example:  20260206001-worker-health-server.md
  
  To find next sequence for today:
  ls .opencode/artifacts/active/YYYYMMDD* 2>/dev/null | wc -l
-->

# {Title}

> **Status:** {active|paused|completed}  
> **Progress:** Phase {N}/{Total}  
> **Last Updated:** {YYYY-MM-DD}

## Overview

{Brief description of the work - 2-3 sentences explaining what this artifact tracks and why it exists.}

---

## Current Status

### Completed

- {List what has been done}

### In Progress

- {Current phase/task being worked on}

### Remaining

- {List what still needs to be done}

---

## Phases

### Phase 1: {Phase Name}

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

### Phase 2: {Phase Name}

- [ ] Task 1
- [ ] Task 2

{Add more phases as needed}

---

## Key Files

| Purpose | Path |
|---------|------|
| {Description} | `path/to/file` |
| {Description} | `path/to/file` |

---

## Continuation Prompt

Use this prompt to resume work in a new session:

```
Continue {title} implementation.

## Context

{Brief context about the work}

Reference: .opencode/artifacts/active/{YYYYMMDDXXX}-{slug}.md

## Current Status

{What's done and what's next}

## Next Steps

{Specific tasks to work on}

## Verification

{Commands to verify changes}
```

---

## Verification

```bash
# Commands to verify the implementation
{verification commands}
```

---

## Notes

{Any additional context, blockers, decisions, or considerations}

