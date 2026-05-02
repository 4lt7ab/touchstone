# Human-only levers

**When this applies:** Any time the agent considers editing a workspace `package.json` `"version"` field, running a version-bump script, or invoking a publish command.

## Versioning

The agent must never edit a `"version"` field in any `package.json` (no `Edit`, no `Write`), and must never run `just bump`, `just set`, `npm version`, or `bun version`.

Workspace versions move through `just bump <patch|minor|major>` (incremental) or `just set <version>` (literal reset) — both wrap `scripts/bump-versions.ts` and both are invoked by a human. The agent only carries the resulting diff into a commit alongside everything else.

## Publishing

The agent must never run `just release`, `bun publish`, or `npm publish` — **not even with `--dry-run`**.

Releases go through `just release` (see `scripts/publish.ts`), which a human invokes after `just bump` and `/commit`. The npm registry is downstream of this repo; the agent never reaches it.

## Why

Releases are infrequent and high-stakes. Keeping the human in the loop is cheaper than wiring up automation that has to be trusted. The release ritual is `just bump <level>` → `/commit` → `just release`.
