default:
    @just --list

# Bump every workspace package.json version in lockstep.
# HUMANS ONLY: workspace versioning is the human's lever. The agent must never
# run this recipe and must never edit a "version" field directly. If a release
# is intended, run `just bump [level]` yourself before invoking `/commit`.
bump level="patch":
    bun run scripts/bump-versions.ts bump {{level}}

# Set every workspace package.json version to a literal value (e.g. reset to 0.0.1).
# HUMANS ONLY: same lever as `just bump`, just for one-off resets — agent never runs it.
set version:
    bun run scripts/bump-versions.ts set {{version}}

# Publish every public workspace package to npm in topological order.
# HUMANS ONLY: workspace publishing is the human's lever (see scripts/publish.ts).
# Requires npm auth; pass --otp <code> for 2FA, --dry-run to rehearse.
# Ritual: `just bump <level>` -> `/commit` -> `just release`.
release *args:
    bun run scripts/publish.ts {{args}}
