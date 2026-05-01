---
description: Commit every change in the repo as one coherent change, in the workshop voice.
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git ls-files:*), Bash(git add:*), Bash(git commit:*), Bash(git rev-parse:*), Bash(git check-ignore:*), Bash(find:*), Bash(stat:*), Bash(wc:*), Read, Edit
---

Wrap the session: stage the working tree and commit it as one coherent change, following the **Commit rules** in `CLAUDE.md`.

This command does **not** touch versions. Workspace bumps are owned by `just bump` and run by a human before (or instead of) invoking `/commit`. If a bump landed in the working tree, it gets included in the commit like any other change. If no bump is staged, no version moves — that is the correct behavior.

## Step 1 — Survey

In parallel:

- `git status` (never `-uall`)
- `git diff` (unstaged)
- `git diff --cached` (staged)
- `git log -7 --format='%H%n%B%n---'` (so you can match the voice)

## Step 2 — Suspicion guard

Walk every file that would be touched (modified, untracked, deleted, renamed) and flag anything matching:

- **Secrets:** `.env`, `.env.*` (except `.env.example`), `*.pem`, `*.key`, `id_rsa*`, `*.p12`, `*credentials*`, `*secret*`, `*token*` (case-insensitive)
- **Build artifacts:** anything under `dist/`, `node_modules/`, `storybook-static/`, `coverage/`, `.cache/`, `.parcel-cache/`, `.next/`, `out/`, plus `*.tsbuildinfo`, `*.vanilla.css`
- **Editor / OS junk:** `.DS_Store`, `*.swp`, `*.swo`, `Thumbs.db`, untracked `.vscode/` or `.idea/`
- **Harness state under `.claude/`:** include checked-in `commands/`, `agents/`, `skills/`, and `settings.json`; flag everything else (e.g. `launch.json`, `*.lock`, `debug/`, `projects/`, `settings.local.json`)
- **Anything binary or larger than 1 MiB** (`stat` / `wc -c`)

Print one line per suspicious file (`path — reason`). If the list is non-empty, ask the user once which (if any) to include. If empty, say so and continue.

## Step 3 — Pass over CLAUDE.md

Read `CLAUDE.md` and make a small, surgical pass:

- Trim sections that have grown stale, redundant, or over-long.
- Confirm the **Commit rules** section is present and concise. If a recent rule has hardened (a new file pattern to flag, a new artifact to ignore, a clarification the workshop voice now demands), fold it in here so the rules stay the single source of truth.

Edit only what genuinely improves the file — if nothing needs changing, say so and move on. If you edit `CLAUDE.md`, stage it with the rest of the commit.

## Step 4 — Stage and verify

- Stage the explicit list of non-suspicious files (and, if edited, `CLAUDE.md`). No `git add -A` / `git add .` — name the paths.
- If the working tree contains `package.json` `"version"` changes, **leave them as-is** and stage them — but do not author or modify them yourself. The bump came from `just bump`; you are only carrying it through.
- Show `git status` and `git diff --cached --stat` so the user can glance and see exactly what is about to land.

## Step 5 — Compose and commit

Draft the title and verse from the **staged diff**, following the **Commit rules** section of `CLAUDE.md`. Speak to the substantive change; mention any version bump only if it is the principal change.

Use a heredoc so indentation survives:

```
git commit -m "$(cat <<'EOF'
<lowercase poetic title>

  <line 1>
  <line 2>
  <line 3>
  [<line 4>]

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Then run `git status` and report whether the tree is clean (or, if suspicious files were intentionally skipped, what remains).

## Hard rules

The **Commit rules** in `CLAUDE.md` are authoritative. In particular: no push, no `--amend`, no `--no-verify`, no `--no-gpg-sign`, no tag creation, no `-i` flags. **Never edit a `"version"` field in `package.json`, and never run `just bump` (or `npm version` / `bun version`) yourself** — workspace versioning is the human's lever, not the agent's. If a pre-commit hook fails, fix the root cause and make a **new** commit. If anything is ambiguous (a suspicious file, a CLAUDE.md edit you're unsure about, an unexpected version change in the working tree), stop and ask before acting.
