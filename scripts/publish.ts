#!/usr/bin/env bun
/**
 * Publish every public workspace package to npm in topological order.
 *
 * **Humans only.** Workspace publishing is a human lever — like `just bump`,
 * the agent must never run this script. The release ritual is:
 *
 *   1. `just bump <patch|minor|major>`   move every version in lockstep
 *   2. `/commit`                          single commit, workshop voice
 *   3. `just release`                     this script
 *
 * Guards (the script bails on any of these):
 *   - working tree must be clean
 *   - every workspace package version must match (same lockstep rule as `just bump`)
 *   - `bun run build` must succeed (which also runs verify-exports)
 *
 * Args (passed through to `bun publish`):
 *   --dry-run      simulate the publish without uploading
 *   --otp <code>   one-time password for npm 2FA
 *   --tag <tag>    dist-tag (default: "latest")
 *
 * Scoped packages publish with `--access public` so npm doesn't silently mark
 * them private. The publishing user must be authenticated against npm
 * (`bun pm whoami` / `npm whoami`) and must own the `@touchstone` scope.
 */

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const repoRoot = resolve(import.meta.dir, '..');

interface Pkg {
  name: string;
  version: string;
  dir: string;
  rel: string;
  workspaceDeps: string[];
  private: boolean;
}

interface Args {
  dryRun: boolean;
  otp?: string;
  tag?: string;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') {
      args.dryRun = true;
    } else if (a === '--otp') {
      args.otp = argv[++i];
    } else if (a === '--tag') {
      args.tag = argv[++i];
    } else {
      console.error(`publish: unknown argument "${a}"`);
      process.exit(2);
    }
  }
  return args;
}

function gitCleanOrBail(): void {
  const status = execSync('git status --porcelain', {
    cwd: repoRoot,
    encoding: 'utf8',
  }).trim();
  if (status.length === 0) return;
  console.error('publish: working tree is dirty — refusing to publish.');
  console.error(status);
  console.error('\nCommit or stash before re-running.');
  process.exit(1);
}

function listPackageJsons(): string[] {
  return execSync('git ls-files "*package.json"', {
    cwd: repoRoot,
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean)
    .sort();
}

function collectVersioned(): Pkg[] {
  const pkgs: Pkg[] = [];
  for (const rel of listPackageJsons()) {
    const abs = resolve(repoRoot, rel);
    const json = JSON.parse(readFileSync(abs, 'utf8')) as Record<string, unknown>;
    if (typeof json.version !== 'string' || typeof json.name !== 'string') continue;
    const deps = (json.dependencies as Record<string, string> | undefined) ?? {};
    const devDeps = (json.devDependencies as Record<string, string> | undefined) ?? {};
    const workspaceDeps = [...Object.keys(deps), ...Object.keys(devDeps)].filter((d) =>
      d.startsWith('@touchstone/'),
    );
    pkgs.push({
      name: json.name,
      version: json.version,
      dir: dirname(abs),
      rel,
      workspaceDeps,
      private: json.private === true,
    });
  }
  return pkgs;
}

function assertLockstep(pkgs: Pkg[]): void {
  const versions = new Set(pkgs.map((p) => p.version));
  if (versions.size <= 1) return;
  console.error('publish: workspace versions are out of sync — refusing to publish.');
  for (const p of pkgs) console.error(`  ${p.version}  ${p.rel}`);
  console.error('\nRun `just bump` to bring them back into lockstep.');
  process.exit(1);
}

function topoSort(pkgs: Pkg[]): Pkg[] {
  const byName = new Map(pkgs.map((p) => [p.name, p] as const));
  const sorted: Pkg[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(p: Pkg): void {
    if (visited.has(p.name)) return;
    if (visiting.has(p.name)) {
      console.error(`publish: dependency cycle through ${p.name}`);
      process.exit(1);
    }
    visiting.add(p.name);
    for (const dep of p.workspaceDeps) {
      const target = byName.get(dep);
      if (target) visit(target);
    }
    visiting.delete(p.name);
    visited.add(p.name);
    sorted.push(p);
  }

  for (const p of pkgs) visit(p);
  return sorted;
}

function run(cmd: string, cwd: string = repoRoot): void {
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  gitCleanOrBail();

  const all = collectVersioned();
  if (all.length === 0) {
    console.error('publish: no versioned workspace packages found.');
    process.exit(1);
  }
  assertLockstep(all);

  const publishable = all.filter((p) => !p.private);
  if (publishable.length === 0) {
    console.error('publish: every versioned package is private — nothing to publish.');
    process.exit(1);
  }

  const ordered = topoSort(publishable);
  const version = ordered[0]!.version;

  console.log(`publish: ${ordered.length} packages at ${version}`);
  for (const p of ordered) console.log(`  ·  ${p.name}`);
  console.log();

  console.log('publish: building…');
  run('bun run build');
  console.log();

  const flags: string[] = ['--access', 'public'];
  if (args.dryRun) flags.push('--dry-run');
  if (args.tag) flags.push('--tag', args.tag);
  if (args.otp) flags.push('--otp', args.otp);
  const flagStr = flags.join(' ');

  for (const p of ordered) {
    console.log(`publish: ${p.name}@${p.version}${args.dryRun ? ' (dry-run)' : ''}`);
    run(`bun publish ${flagStr}`, p.dir);
    console.log();
  }

  console.log(
    args.dryRun
      ? `publish: dry-run complete — ${ordered.length} packages would have shipped at ${version}.`
      : `publish: ${ordered.length} packages shipped at ${version}.`,
  );
}

main();
