default:
    @just --list

# Bump every workspace package.json version in lockstep. Owns the version-edit
# responsibility for the repo — the agent must never hand-edit a "version" field.
bump level="patch":
    bun run scripts/bump-versions.ts {{level}}
