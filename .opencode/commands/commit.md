---
description: Selectively stage and commit with auto-detected conventional commit message
agent: build
---

You are creating a git commit. Follow these steps precisely:

## Step 1: Analyze the working tree

Run these commands in parallel:
- `git status --porcelain` to see all changed/untracked files
- `git diff --stat` to see unstaged change summary
- `git diff --cached --stat` to see already-staged changes
- `git log --oneline -5` to see recent commit style

## Step 2: Selective staging

Review every changed file and decide whether to stage it. Apply these rules:

### ALWAYS SKIP (never stage):
- `.env`, `.env.*` (except `.env.example`)
- `*.tfstate`, `*.tfstate.*`
- `credentials.json`, `secrets.*`, `*.pem`, `*.key`
- `node_modules/`, `.opencode/node_modules/`
- Generated lock files that were NOT intentionally changed (stage a lock file only if its corresponding manifest changed)
- `.DS_Store`, `Thumbs.db`
- Build output directories: `dist/`, `target/`, `.next/`, `.output/`, `build/`
- Large binary files (images, fonts) unless they are clearly part of the change

### ALWAYS STAGE:
- Source code files you modified
- Config/manifest files you intentionally changed (e.g. `package.json`, `Cargo.toml`, `pyproject.toml`, `opencode.json`)
- Test files related to the changes
- Migration files
- Documentation updates related to the changes
- `SKILL.md`, `AGENTS.md` if part of the work

### ASK THE USER if unsure:
- Lock files when it's unclear if they were intentionally changed
- Files in directories unrelated to the main change
- Any file that seems auto-generated

Stage files individually with `git add <path>` for each file. Do NOT use `git add .` or `git add -A`.

If a build/test command is needed before committing, invoke it via the project's task runner using the `{project ...}` placeholder (e.g. `{project test}`, `{project lint}`, `{project build}`). Do not hardcode a specific package manager or build tool.

## Step 3: Determine commit type and scope

### Type detection (from the nature of changes):
| Type | When to use |
|------|------------|
| `feat` | New feature, new endpoint, new component, new page |
| `fix` | Bug fix, error correction, regression fix |
| `refactor` | Code restructuring without behavior change |
| `chore` | Config changes, dependency updates, tooling |
| `docs` | Documentation only changes |
| `test` | Test additions or fixes only |
| `style` | Formatting, linting fixes only |
| `perf` | Performance improvement |
| `ci` | CI/CD pipeline changes |

### Scope detection

Use the module, package, or directory name affected as the scope.

Examples:
- `feat(auth): add password reset flow`
- `fix(api): handle null user id`
- `test(payments): cover refund edge cases`
- `docs(readme): clarify install steps`

For workspace-wide or cross-cutting changes with no single module, omit the scope (`chore: ...`) or use a broad descriptor (`chore(deps): ...`).

## Step 4: Compose the commit message

Format: `type(scope): concise description`

Rules:
- Lowercase first letter after the colon
- No period at the end
- Max 72 characters for the subject line
- Use imperative mood ("add", "fix", "update", not "added", "fixes", "updated")
- Focus on the "what" and "why", not the "how"
- If there's a linked issue, add it to the body: `Refs #<number>` or `Closes #<number>`
- Cross-repo references use `owner/repo#<number>`

For multi-line commits (complex changes), add a body:
```
type(scope): subject line

- Detail about change 1
- Detail about change 2

Refs #123
```

## Step 5: Create the commit

Run `git commit -m "..."` with the composed message.

After committing, run `git status` to verify the commit succeeded and show remaining uncommitted files (if any).

## Additional context

If the user provides arguments with `/commit`, use them as hints:
- `/commit fix login redirect` -> type is `fix`, description is about login redirect
- `/commit #42` -> include `Refs #42` in the commit body
- `/commit` (no args) -> fully auto-detect everything

$ARGUMENTS
