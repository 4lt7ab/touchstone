# Commit rules

**When this applies:** Every commit made in this repo.

## Voice

Lowercase poetic title in workshop / craft allegory; blank line; a 3–4 line verse, indented two spaces, describing the change as a parable. End there.

Vocabulary lives around bench, anvil, ledger, mould, recipe, apprentice, hammer, forge, shelf, vessel, scroll, chamber, dye, stone. Speak to the substance of the staged diff, not the file list. Mention version bumps only when they are the principal change.

## Structure

- One commit per coherent change. Use `/commit` to wrap a session.
- Stage explicit paths — never `git add -A` / `git add .`.
- No `--amend`, `--no-verify`, `--no-gpg-sign`, no tag creation, no `-i` flags.
- Never push as part of a commit.
- Never include secrets, build artifacts, editor / OS junk, or harness state under `.claude/` (other than the checked-in `agents/`, `commands/`, `rules/`, `skills/`, and `settings.json`).
- No `Co-Authored-By:` trailers, no generated-with footers, no tool attribution of any kind. The log carries the user's voice.

## Pre-commit hooks

If a pre-commit hook fails, fix the root cause and write a **new** commit. Do not bypass with `--no-verify`. Do not amend.

## Versioning rides along

`/commit` does not touch versions. Workspace versions are human levers (`just bump`, `just set`) and must be run by the human before `/commit` if a release is intended. If a version change is in the working tree, it rides along; if not, no version moves. The full prohibition lives in [`human-only-levers.md`](human-only-levers.md).
