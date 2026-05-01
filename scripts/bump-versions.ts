#!/usr/bin/env bun
/**
 * Move every workspace `package.json` version in lockstep.
 *
 * **Humans only.** This script — and the `just bump` / `just set` recipes that
 * wrap it — is the only sanctioned way to move workspace versions, and it is
 * invoked by a human. The agent must never edit a `"version"` field directly
 * and must never run this script itself; if a release is intended, the human
 * runs the recipe before invoking `/commit`, and the resulting diff rides
 * along with whatever else is being committed.
 *
 * Two modes:
 *   - `bump <patch|minor|major>` — increments every version by the given level
 *   - `set <version>`            — forces every version to a literal value
 *                                  (e.g. `set 0.0.1` to reset before a first release)
 *
 * Rules:
 *   - All workspace packages with a `version` must share the same current value.
 *     If they have desynced, the script bails so the divergence can be resolved
 *     deliberately rather than papered over.
 *   - Packages without a `version` field (e.g. tooling stubs) are skipped silently.
 *   - The script edits files only — staging and commit happen separately.
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Level = 'major' | 'minor' | 'patch';
type Action = { kind: 'bump'; level: Level } | { kind: 'set'; target: string };

const repoRoot = resolve(import.meta.dir, '..');
const semverShape = /^\d+\.\d+\.\d+(?:[-+].+)?$/;

function parseAction(argv: string[]): Action {
  const first = argv[0]?.toLowerCase();
  if (first === 'set') {
    const target = argv[1];
    if (!target) {
      console.error('bump-versions: `set` requires a version (e.g. `set 0.0.1`)');
      process.exit(2);
    }
    if (!semverShape.test(target)) {
      console.error(`bump-versions: "${target}" is not semver-shaped`);
      process.exit(2);
    }
    return { kind: 'set', target };
  }
  // Back-compat: `bump-versions.ts patch` (no leading verb) keeps working.
  const levelArg = first === 'bump' ? argv[1] : first;
  const value = (levelArg ?? 'patch').toLowerCase();
  if (value !== 'major' && value !== 'minor' && value !== 'patch') {
    console.error(
      `bump-versions: unknown argument "${levelArg}" (expected major|minor|patch, or \`set <version>\`)`,
    );
    process.exit(2);
  }
  return { kind: 'bump', level: value };
}

function bump(version: string, level: Level): string {
  const match = /^(\d+)\.(\d+)\.(\d+)(.*)$/.exec(version);
  if (!match) {
    console.error(`bump-versions: version "${version}" is not semver-shaped`);
    process.exit(2);
  }
  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);
  if (level === 'major') return `${major + 1}.0.0`;
  if (level === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

function listPackageJsons(): string[] {
  const tracked = execSync('git ls-files "*package.json"', {
    cwd: repoRoot,
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean);
  const untracked = execSync('git ls-files --others --exclude-standard "*package.json"', {
    cwd: repoRoot,
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean);
  return [...new Set([...tracked, ...untracked])].sort();
}

interface Pkg {
  path: string;
  json: Record<string, unknown>;
  version: string;
}

function main(): void {
  const action = parseAction(process.argv.slice(2));
  const paths = listPackageJsons();

  const versioned: Pkg[] = [];
  const skipped: string[] = [];
  for (const rel of paths) {
    const abs = resolve(repoRoot, rel);
    const text = readFileSync(abs, 'utf8');
    const json = JSON.parse(text) as Record<string, unknown>;
    if (typeof json.version !== 'string') {
      skipped.push(rel);
      continue;
    }
    versioned.push({ path: abs, json, version: json.version });
  }

  if (versioned.length === 0) {
    console.error('bump-versions: no package.json with a "version" field found');
    process.exit(1);
  }

  const distinct = new Set(versioned.map((p) => p.version));
  if (distinct.size > 1) {
    console.error('bump-versions: workspace versions are out of sync — refusing to bump.');
    for (const p of versioned) {
      const rel = p.path.slice(repoRoot.length + 1);
      console.error(`  ${p.version}  ${rel}`);
    }
    console.error('\nResolve the divergence (set every package to the same version) and re-run.');
    process.exit(1);
  }

  const current = versioned[0]!.version;
  const next = action.kind === 'bump' ? bump(current, action.level) : action.target;
  const label = action.kind === 'bump' ? action.level : `set ${action.target}`;

  for (const p of versioned) {
    p.json.version = next;
    writeFileSync(p.path, `${JSON.stringify(p.json, null, 2)}\n`);
  }

  console.log(`bump-versions: ${current} → ${next} (${label}) across ${versioned.length} packages`);
  for (const p of versioned) {
    console.log(`  ✓  ${p.path.slice(repoRoot.length + 1)}`);
  }
  if (skipped.length > 0) {
    console.log(`\nskipped (no "version" field): ${skipped.join(', ')}`);
  }
}

main();
