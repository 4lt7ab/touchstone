#!/usr/bin/env bun
/**
 * Post-build verification: every named export in each package's `src/index.ts`
 * must land in `dist/index.d.ts`. Catches silent bundler drops and forgotten
 * barrel re-exports — the kind of failure where the build "succeeds" but the
 * consumer can't import a symbol that the source clearly declares.
 *
 * Run via `bun run verify-exports` (also wired into `bun run build:verify`).
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repoRoot = resolve(import.meta.dir, '..');
const packagesDir = join(repoRoot, 'packages');

interface PackageReport {
  name: string;
  missing: string[];
  missingStarReExports: string[];
  skipped?: string;
}

/**
 * Extract every named export from a TS source file. Handles:
 *   export { X, type Y } from './foo.js'
 *   export type { Z } from './bar.js'
 *   export const X = ...
 *   export function X(...) {}
 *   export class X {}
 *   export interface X { ... }
 *   export type X = ...
 *   export default ...   (skipped — default exports are not part of named surface)
 *   export *             (skipped — opaque, not enumerable here; verified transitively)
 */
function extractNamedExports(source: string): Set<string> {
  const names = new Set<string>();

  // Strip block comments and line comments so they don't leak `export` keywords.
  const stripped = source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');

  // Form 1: re-export lists — `export { A, type B, C as D } from '...'` and bare `export { A, B }`.
  const reExportListRe = /export\s+(?:type\s+)?\{([^}]+)\}/g;
  let match: RegExpExecArray | null;
  while ((match = reExportListRe.exec(stripped)) !== null) {
    const inner = match[1] ?? '';
    for (const part of inner.split(',')) {
      const cleaned = part.trim().replace(/^type\s+/, '');
      if (!cleaned) continue;
      // `X as Y` — the public name is Y.
      const asMatch = /^[\w$]+\s+as\s+([\w$]+)$/.exec(cleaned);
      if (asMatch) {
        names.add(asMatch[1]!);
      } else {
        const bare = /^([\w$]+)$/.exec(cleaned);
        if (bare) names.add(bare[1]!);
      }
    }
  }

  // Form 2: declaration exports — const, let, var, function, class, interface, type, enum.
  const declRe =
    /export\s+(?:declare\s+)?(?:const|let|var|function\*?|class|interface|type|enum)\s+([\w$]+)/g;
  while ((match = declRe.exec(stripped)) !== null) {
    names.add(match[1]!);
  }

  return names;
}

/**
 * Extract every `export * from '...'` target from a TS source file. Re-export
 * targets are kept opaque — the script verifies that the dist round-trips the
 * same target, not that every transitive name is inlined.
 */
function extractStarReExports(source: string): Set<string> {
  const targets = new Set<string>();
  const re = /export\s+\*\s+from\s+['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source)) !== null) {
    targets.add(match[1]!);
  }
  return targets;
}

function verifyPackage(packagePath: string): PackageReport {
  const pkgJsonPath = join(packagePath, 'package.json');
  const name = existsSync(pkgJsonPath)
    ? (JSON.parse(readFileSync(pkgJsonPath, 'utf8')).name ?? packagePath)
    : packagePath;

  const srcIndex = join(packagePath, 'src', 'index.ts');
  const distDts = join(packagePath, 'dist', 'index.d.ts');

  if (!existsSync(srcIndex)) {
    return { name, missing: [], missingStarReExports: [], skipped: 'no src/index.ts' };
  }
  if (!existsSync(distDts)) {
    return {
      name,
      missing: [],
      missingStarReExports: [],
      skipped: 'no dist/index.d.ts (build first)',
    };
  }

  const srcText = readFileSync(srcIndex, 'utf8');
  const distText = readFileSync(distDts, 'utf8');

  const sourceExports = extractNamedExports(srcText);
  const distExports = extractNamedExports(distText);
  const sourceStars = extractStarReExports(srcText);
  const distStars = extractStarReExports(distText);

  const missing: string[] = [];
  for (const name of sourceExports) {
    if (!distExports.has(name)) missing.push(name);
  }
  missing.sort();

  const missingStarReExports: string[] = [];
  for (const target of sourceStars) {
    if (!distStars.has(target)) missingStarReExports.push(target);
  }
  missingStarReExports.sort();

  return { name, missing, missingStarReExports };
}

function main(): void {
  const entries = readdirSync(packagesDir);
  const reports: PackageReport[] = [];

  for (const entry of entries) {
    const full = join(packagesDir, entry);
    if (!statSync(full).isDirectory()) continue;
    reports.push(verifyPackage(full));
  }

  let failed = false;
  for (const r of reports) {
    if (r.skipped) {
      console.log(`  ·  ${r.name} — skipped (${r.skipped})`);
      continue;
    }
    if (r.missing.length === 0 && r.missingStarReExports.length === 0) {
      console.log(`  ✓  ${r.name}`);
      continue;
    }
    failed = true;
    console.log(`  ✗  ${r.name} — barrel mismatch:`);
    for (const name of r.missing) {
      console.log(`       - missing named export: ${name}`);
    }
    for (const target of r.missingStarReExports) {
      console.log(`       - missing re-export *: from '${target}'`);
    }
  }

  if (failed) {
    console.error(
      '\nverify-exports: source declares exports that did not land in dist. ' +
        'Rebuild or check the bundler for silent drops.',
    );
    process.exit(1);
  }
  console.log('\nverify-exports: all package barrels match dist surface.');
}

main();
