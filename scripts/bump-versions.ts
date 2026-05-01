#!/usr/bin/env bun
/**
 * Bump every workspace `package.json` version in lockstep.
 *
 * **Humans only.** This script — and the `just bump` recipe that wraps it — is
 * the only sanctioned way to move workspace versions, and it is invoked by a
 * human. The agent must never edit a `"version"` field directly and must never
 * run this script (or `just bump`) itself; if a release is intended, the human
 * runs the recipe before invoking `/commit`, and the resulting diff rides along
 * with whatever else is being committed.
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

const repoRoot = resolve(import.meta.dir, '..');

function parseLevel(arg: string | undefined): Level {
  const value = (arg ?? 'patch').toLowerCase();
  if (value !== 'major' && value !== 'minor' && value !== 'patch') {
    console.error(`bump-versions: unknown level "${arg}" (expected major|minor|patch)`);
    process.exit(2);
  }
  return value;
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
  const level = parseLevel(process.argv[2]);
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
  const next = bump(current, level);

  for (const p of versioned) {
    p.json.version = next;
    writeFileSync(p.path, `${JSON.stringify(p.json, null, 2)}\n`);
  }

  console.log(`bump-versions: ${current} → ${next} (${level}) across ${versioned.length} packages`);
  for (const p of versioned) {
    console.log(`  ✓  ${p.path.slice(repoRoot.length + 1)}`);
  }
  if (skipped.length > 0) {
    console.log(`\nskipped (no "version" field): ${skipped.join(', ')}`);
  }
}

main();
