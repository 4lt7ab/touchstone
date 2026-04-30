---
description: Bump all workspace versions and commit every change in the repo, in the workshop voice.
argument-hint: [major|minor|patch]
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git ls-files:*), Bash(git add:*), Bash(git commit:*), Bash(git rev-parse:*), Bash(git check-ignore:*), Bash(find:*), Bash(stat:*), Bash(wc:*), Read, Edit
---

You are committing the working tree of the Touchstone repo. The user wants you to:

1. Stage every legitimate change.
2. Make sure nothing that shouldn't be in the commit quietly slips through.
3. Bump every workspace package version by **`$ARGUMENTS`** (one of `major`, `minor`, `patch`).
4. Make one git commit, in the repository's commit-message voice.

## Argument

`$ARGUMENTS` must be exactly `major`, `minor`, or `patch`. If it is empty, malformed, or anything else, stop and ask the user — do not guess.

## Step 1 — Survey

In parallel:

- `git status` (never `-uall`)
- `git diff` (unstaged)
- `git diff --cached` (staged)
- `git log -7 --format='%H%n%B%n---'` (so you can match the voice)

## Step 2 — Suspicion guard

Before staging, walk every file that would be touched (modified, untracked, deleted, renamed) and flag anything matching:

- **Secrets**: `.env`, `.env.*` (except `.env.example`), `*.pem`, `*.key`, `id_rsa*`, `*.p12`, `*credentials*`, `*secret*`, `*token*` (case-insensitive name match)
- **Build artifacts** that escaped `.gitignore`: anything under `dist/`, `node_modules/`, `storybook-static/`, `coverage/`, `.cache/`, `.parcel-cache/`, `.next/`, `out/`, `*.tsbuildinfo`, `*.vanilla.css`
- **Editor / OS junk**: `.DS_Store`, `*.swp`, `*.swo`, `Thumbs.db`, untracked `.vscode/` or `.idea/`
- **Harness state under `.claude/`**: include checked-in commands, agents, skills, and `settings.json`; flag everything else (e.g. `launch.json`, `*.lock`, `debug/`, `projects/`, `settings.local.json`)
- **Anything binary or larger than 1 MiB** (`stat`/`wc -c`)

Print a one-line note per suspicious file (`path — reason`) and **do not stage it without confirmation**. If the list is non-empty, ask the user once, with the full list, which (if any) to include. If the list is empty, say so and proceed.

## Step 3 — Bump versions

Find every `package.json` in the workspace whose `"version"` is a real semver string:

```
git ls-files '*package.json'
```

Plus any untracked `package.json` from `git status`. Read each and confirm they all share the same current version — if they do not, **stop and ask** before desyncing the workspace.

Bump each `"version"` field in lockstep using `Edit`:

- `patch`: `x.y.z` → `x.y.(z+1)`
- `minor`: `x.y.z` → `x.(y+1).0`, patch resets to `0`
- `major`: `x.y.z` → `(x+1).0.0`, minor and patch reset to `0`

Do **not** run `npm version` / `bun version` — those create tags and we want one combined commit. Skip any `package.json` without a `version` field.

## Step 4 — Stage and verify

- Stage the explicit list of non-suspicious files plus the bumped `package.json`s. Avoid `git add -A` and `git add .` — name the paths.
- Show `git status` and `git diff --cached --stat` so the user can glance and see exactly what is about to land.

## Step 5 — Compose the message

The repository's commit style is deliberate: a lowercase poetic title in **workshop / craft allegory**, blank line, a 3–4 line **two-space-indented** verse describing the change as a parable, blank line, then the `Co-Authored-By` trailer. Read the recent log; imitate the voice. Vocabulary lives around **bench, anvil, ledger, mould, recipe, apprentice, hammer, forge, shelf, vessel, scroll, chamber, dye, stone**.

Example shape (do not copy the words — match the cadence):

```
the recipe named a stone the pantry never held

  An apprentice read aloud from the bench-book —
  'extends the elder pattern' — and the workshop fell silent,
  for the elder pattern's name was nowhere on the shelf.
  Now the shelf bears its label, and the page reads through.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

Write the title + verse from the **staged diff**, not the file list. Speak to the substantive change. Mention the version bump in the verse only if it is the principal change of the commit; otherwise let the cadence of the workshop carry it implicitly.

## Step 6 — Commit

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

- Do **not** push.
- Do **not** use `--amend`, `--no-verify`, `--no-gpg-sign`, or `-i`.
- Do **not** create or move tags.
- If a pre-commit hook fails, fix the root cause and make a **new** commit — never amend.
- If anything is ambiguous (argument, version desync, a suspicious file), stop and ask before acting.
