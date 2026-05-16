---
name: git-workflow
description: Git conventions for this workspace - branch naming, conventional commits, selective staging, and PR creation with GitHub CLI. Load when committing, pushing, or creating pull requests.
---

# Git Workflow Conventions

This skill defines git conventions for this workspace. Load it when you need to commit changes, push branches, or create pull requests.

---

## Repository Info

- **CLI tool**: `gh` (GitHub CLI)
- **Default base branch**: `main`

Use `gh repo view` to confirm the active repository when needed.

---

## Branch Naming

### Format

```
<type>/<short-slug>
```

### Common types

- `feat/` -- new feature
- `fix/` -- bug fix
- `chore/` -- tooling, config, deps
- `docs/` -- documentation only
- `refactor/` -- non-behavioral restructuring
- `test/` -- test-only changes

### Slug rules

- Derived from the issue title or a short description
- Lowercase, hyphens for spaces/special chars
- No consecutive hyphens, no trailing hyphens
- Max 40 characters (don't cut mid-word)

### Examples

```
feat/user-profile
fix/login-redirect
refactor/notification-sync
chore/bump-deps
```

### Base branch

- Always branch from `origin/main` (fetch first).

---

## Conventional Commits

### Format

```
type(scope): subject

Optional body with details.

Refs #42
```

### Types

| Type | When | Example |
|------|------|---------|
| `feat` | New feature, endpoint, component, page | `feat(auth): add lead scoring endpoint` |
| `fix` | Bug fix, error correction | `fix(api): resolve login redirect loop` |
| `refactor` | Restructuring without behavior change | `refactor(billing): extract invoice service` |
| `chore` | Config, deps, tooling | `chore: bump dependencies` |
| `docs` | Documentation only | `docs(architecture): add API reference` |
| `test` | Test additions/fixes only | `test(payments): add charge tests` |
| `style` | Formatting, linting only | `style: apply formatter` |
| `perf` | Performance improvement | `perf(search): add query index` |
| `ci` | CI/CD changes | `ci: add staging deployment job` |

### Scope

Use the module, package, or directory name as the scope.

Examples:
- `feat(auth): ...`
- `fix(api): ...`
- `test(payments): ...`
- `docs(architecture): ...`

For workspace-wide or cross-cutting changes with no clear single module, omit the scope (`chore: ...`) or use a broad descriptor (`chore(deps): ...`, `docs(readme): ...`).

### Subject line rules

- Lowercase first letter after colon
- No period at the end
- Max 72 characters
- Imperative mood: "add", "fix", "update" (not "added", "fixes")
- Focus on what and why

### Body (for complex changes)

```
feat(auth): add lead scoring endpoint

- Implement scoring algorithm based on activity and profile data
- Add configurable scoring rules per tenant
- Include bulk recalculation command

Refs #42
```

### Issue references in commits

- `Refs #42` -- references issue without closing
- `Closes #42` -- closes issue when PR merges
- Cross-repo: `Refs owner/repo#15` / `Closes owner/repo#15`

---

## Selective Staging

### NEVER stage

- `.env`, `.env.*` (except `.env.example`)
- `*.tfstate`, `*.tfstate.*`
- `credentials.json`, `secrets.*`, `*.pem`, `*.key`
- `node_modules/`, `.opencode/node_modules/`
- `.DS_Store`, `Thumbs.db`
- Build outputs: `dist/`, `target/`, `.next/`, `.output/`, `build/`
- Large binaries unless clearly part of the change

### ALWAYS stage

- Source code you modified
- Config files intentionally changed (e.g. manifest/package files)
- Test files related to the change
- Migration files
- Documentation updates related to the change
- `SKILL.md`, `AGENTS.md` if part of the work

### Stage selectively

```bash
git add path/to/specific/file.ext
```

NEVER use `git add .` or `git add -A`. Stage each file individually.

### Lock files

- Stage a lock file only if its corresponding manifest changed.
- Otherwise ask the user.

---

## Pull Request Creation

### Push and open a PR with `gh`

```bash
git push -u origin HEAD
gh pr create \
  --base main \
  --title "Title" \
  --body "$(cat <<'EOF'
## Summary
<1-3 sentences: what this PR does and why>

## Changes
- Change 1
- Change 2

## Testing
- How it was tested / commands run

Closes #42
EOF
)" \
  --assignee @me
```

Useful follow-ups:
- `gh pr view --web` -- open the PR in the browser
- `gh pr view <number>` -- inspect an existing PR
- `gh issue view <number>` -- inspect a referenced issue

### PR title

- Derive from issue title or summarize commits
- Max 100 characters
- Do NOT prefix with a conventional-commit type (e.g., don't write `feat: ...` in the PR title)

### PR body format

Keep it concise. The three sections below are the canonical structure:

```markdown
## Summary
<1-3 sentences>

## Changes
- Bullet list of notable changes

## Testing
- Commands run, scenarios verified

Closes #<issue>
```

### Cross-repo issue linking

```
Closes owner/repo#42
```

### Draft PRs

Use `gh pr create --draft` if:
- Work is not yet complete
- The user explicitly says "draft"
- There are known TODO items remaining

---

## Available Commands

The workspace has these custom commands you can suggest to the user:
- `/commit` -- selective stage and conventional commit
- `/branch` -- create a branch from an issue or description

## Available Agents

The retained agents are: `orchestrator`, `architect`, `explore`, `reviewer`, `auditor`, `analyst`, `strategist`, `librarian`, `scribe`, `curator`, `build`.

Use `gh` directly for issue/PR operations (`gh issue view`, `gh issue list`, `gh issue create`, `gh pr view`, `gh pr list`, `gh pr create`).
