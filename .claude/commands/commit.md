---
description: Bump all workspace versions and commit every change in the repo, in the workshop voice.
argument-hint: [major|minor|patch]
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git ls-files:*), Bash(git add:*), Bash(git commit:*), Bash(git rev-parse:*), Bash(git check-ignore:*), Bash(find:*), Bash(stat:*), Bash(wc:*), Read, Edit
---

Wrap the session: bump every workspace `package.json` and commit the working tree as one change, following the **Commit rules** in `CLAUDE.md`.

## Argument

`$ARGUMENTS` is `major`, `minor`, or `patch`. **Default: `patch`** — if `$ARGUMENTS` is empty, treat it as `patch`. If it is anything else, stop and ask.

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

## Step 4 — Bump versions

Find every workspace `package.json`:

```
git ls-files '*package.json'
```

Plus any untracked `package.json` from `git status`. Read each and confirm they share the same current version — if they do not, **stop and ask** before desyncing the workspace.

Bump each `"version"` field in lockstep with `Edit`:

- `patch`: `x.y.z` → `x.y.(z+1)`
- `minor`: `x.y.z` → `x.(y+1).0`, patch resets to `0`
- `major`: `x.y.z` → `(x+1).0.0`, minor and patch reset to `0`

Do **not** run `npm version` / `bun version` — those create tags and we want one combined commit. Skip any `package.json` without a `version` field.

## Step 5 — Stage and verify

- Stage the explicit list of non-suspicious files plus the bumped `package.json`s and (if edited) `CLAUDE.md`. No `git add -A` / `git add .` — name the paths.
- Show `git status` and `git diff --cached --stat` so the user can glance and see exactly what is about to land.

## Step 6 — Compose and commit

Draft the title and verse from the **staged diff**, following the **Commit rules** section of `CLAUDE.md`. Speak to the substantive change; mention the version bump only if it is the principal change.

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

The **Commit rules** in `CLAUDE.md` are authoritative. In particular: no push, no `--amend`, no `--no-verify`, no `--no-gpg-sign`, no tag creation, no `-i` flags. If a pre-commit hook fails, fix the root cause and make a **new** commit. If anything is ambiguous (argument, version desync, a suspicious file, a CLAUDE.md edit you're unsure about), stop and ask before acting.
