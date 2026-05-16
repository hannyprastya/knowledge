---
description: Create a branch from a GitHub issue number or a free-form description
agent: build
---

You are creating a git branch. Follow these steps:

## Step 1: Parse arguments

`$ARGUMENTS` may be one of:
- A GitHub issue reference: `/branch #42` or `/branch 42`
- A cross-repo issue: `/branch owner/repo#42`
- A free-form description: `/branch fix login redirect`
- Combined: `/branch #42 fix login redirect` (issue + override description)

## Step 2: Derive the branch inputs

### If an issue number was provided

Use `gh issue view <number>` (add `--repo owner/repo` if a cross-repo reference was given) to fetch:
- Issue title (for the slug)
- Issue labels (to help infer the branch type)

### If only a description was provided

Use the description directly as the slug source. Infer the type from the wording (e.g. "fix", "add", "refactor", "docs").

## Step 3: Determine branch type

Pick one of: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.

Heuristics:
- Issue labels like `bug` / wording like "fix", "broken" -> `fix`
- Labels like `enhancement`, `feature` / wording like "add", "new" -> `feat`
- Pure docs work -> `docs`
- Pure refactor / no behavior change -> `refactor`
- Test-only work -> `test`
- Tooling, deps, config -> `chore`

If unclear, ask the user.

## Step 4: Generate the branch name

Format: `<type>/<slug>`

Slug rules:
- Lowercase everything
- Replace spaces and special characters with hyphens
- Remove consecutive hyphens
- Truncate to max 40 characters (without cutting mid-word)
- Remove trailing hyphens

Examples:
- Issue #42 "Add user profile page" -> `feat/user-profile`
- Issue #15 "Login redirect broken on mobile" -> `fix/login-redirect`
- Description "refactor notification sync" -> `refactor/notification-sync`
- Description "bump deps" -> `chore/bump-deps`

## Step 5: Ensure clean state

Run `git status --porcelain`. If there are uncommitted changes:
- Warn the user
- Ask if they want to stash first (`git stash`)
- Or abort

## Step 6: Create and checkout the branch

```bash
git fetch origin main
git checkout -b <branch-name> origin/main
```

Use `origin/main` as the base to ensure a clean start from the latest main.

## Step 7: Report

Output:
- Branch name created
- Base commit (from `origin/main`)
- Issue reference and title (if applicable)
- Remind the user they can start working now, and that `/commit` will help with the first commit

$ARGUMENTS
