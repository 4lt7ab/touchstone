# Deployment strategy

**TL;DR:** "Production" is npm. Releases are local-only, human-driven, and gated by lockstep workspace versions. The agent never publishes.

**When to read this:** Before cutting a release or proposing a change to the release flow.

---

## Promotion path

There is one environment: the published `@4lt7ab/touchstone` package on npm. Every other package in the workspace is `private: true` and never reaches the registry.

## Release ritual

Three human levers, in order:

1. `just bump <patch|minor|major>` — moves every workspace `package.json` version in lockstep. (`just set <version>` is the literal-reset variant for one-offs.)
2. `/commit` — wraps the working tree (including the bump, if present) into a single commit in the workshop voice.
3. `just release` — runs the publish script, which builds, asserts a clean tree and lockstep versions, then publishes the public packages topologically with `bun publish --access public`.

Each lever is invoked by a human. The agent never edits `package.json` versions, never runs `just bump` / `just set`, and never runs `just release` / `bun publish` / `npm publish` — not even with `--dry-run`.

## Rollback

Rollback is forward-only: bump again, fix forward, release. There is no automated unpublish.

## What is deliberately absent

No CI publish. No Changesets. No tagging step inside `/commit`. No visual regression gate. The release flow is short on purpose so the human stays in the loop. Adding any of these requires an entry in `decisions.md`.
