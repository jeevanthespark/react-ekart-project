#!/usr/bin/env node
/**
 * verify-changed-coverage.mjs
 * Runs vitest on changed files (staged for commit) and enforces >=90% line coverage.
 * Strategy:
 * 1. Determine staged TS/TSX files under src/.
 * 2. If none, exit quickly.
 * 3. Run vitest with --coverage focused on those files (using include via CLI env).
 * 4. Read coverage-final.json produced by V8 coverage provider.
 * 5. Evaluate each changed file's coverage metrics (lines) >= 90%.
 */

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

function getStagedFiles() {
  const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
  return output.split('\n').filter(f => f.trim().length > 0);
}

function filterTestable(files) {
  return files.filter(
    f => f.startsWith('src/') && /\.(ts|tsx)$/.test(f) && !/\.test\.tsx?$/.test(f)
  );
}

function mapToTestFiles(files) {
  return files.flatMap(f => {
    const dir = path.dirname(f);
    const base = path.basename(f).replace(/\.(ts|tsx)$/, '');
    const candidates = [path.join(dir, base + '.test.tsx'), path.join(dir, base + '.test.ts')];
    return candidates.filter(c => existsSync(c));
  });
}

function unique(arr) { return [...new Set(arr)]; }

function runVitestFor(files) {
  // Use vitest run for deterministic output; rely on coverage provider already configured.
  // Provide --coverage and pass explicit test file list.
  const cmd = ['npx vitest run --coverage', ...files].join(' ');
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function readCoverage() {
  const coverageFile = path.join(projectRoot, 'coverage', 'coverage-final.json');
  if (!existsSync(coverageFile)) {
    console.error('Coverage file not found at coverage/coverage-final.json');
    process.exit(1);
  }
  const raw = readFileSync(coverageFile, 'utf8');
  return JSON.parse(raw);
}

function evaluateCoverage(changedSources, coverageData) {
  const failures = [];
  const coverageKeys = Object.keys(coverageData);
  for (const file of changedSources) {
    const absPath = path.join(projectRoot, file);
    let entry = coverageData[absPath];
    let entryKey = absPath;
    if (!entry) {
      // Fallback: endsWith matching (robust against path separators or cwd differences)
      entryKey = coverageKeys.find(k => k.replace(/\\/g, '/').endsWith(file.replace(/\\/g, '/')));
      entry = entryKey ? coverageData[entryKey] : undefined;
    }
    if (!entry) {
      try {
        const fileContent = existsSync(absPath) ? readFileSync(absPath, 'utf8') : '';
        if (fileContent.length < 120) {
          console.warn(`Skipping coverage enforcement for tiny file with no instrumentation: ${file}`);
          continue;
        }
      } catch {}
      console.warn(`No coverage entry for ${file}. (Looked for key: ${absPath})`);
      failures.push({ file, pct: 0 });
      continue;
    }
    // Derive line coverage if 'lines' meta not present (v8 provider doesn't always include 'lines')
    let pct = 0;
    let totalLines = 0;
    if (entry.lines && typeof entry.lines.pct === 'number') {
      pct = entry.lines.pct;
      totalLines = entry.lines.total || 0;
    } else if (entry.statementMap && entry.s) {
      const statementIds = Object.keys(entry.statementMap);
      totalLines = statementIds.length;
      const covered = statementIds.filter(id => entry.s[id] > 0).length;
      pct = totalLines === 0 ? 100 : (covered / totalLines) * 100;
    }

    // Heuristic skip for provider / context wrapper or export-only files
    try {
      const content = readFileSync(absPath, 'utf8');
      const isWrapper = /createContext\(/.test(content) || /Provider/.test(content);
      const isExportOnly = /^\s*export\s+/m.test(content) && content.split(/\n/).length < 80 && (coveredExportStatements(content));
      if ((totalLines < 15 && isWrapper) || (totalLines < 10 && isExportOnly)) {
        console.log(`Exempting wrapper/export file '${file}' from coverage threshold (heuristic).`);
        continue;
      }
    } catch {}

    if (pct < 90) failures.push({ file, pct });
  }
  return failures;
}

// Simple helper to detect mostly export-only files
function coveredExportStatements(content) {
  const meaningful = content.split(/\n/).filter(l => l.trim().length && !l.trim().startsWith('//'));
  const exportLines = meaningful.filter(l => /export\s+(const|type|interface|\{)/.test(l)).length;
  return exportLines > 0 && exportLines === meaningful.length;
}

try {
  const staged = getStagedFiles();
  const changedSources = filterTestable(staged).filter(f => !f.startsWith('src/test/'));
  if (changedSources.length === 0) {
    console.log('No staged source TS/TSX files. Skipping coverage enforcement.');
    process.exit(0);
  }

  // Run full suite to avoid partial instrumentation anomalies
  console.log('Running full test suite for coverage (changed files evaluation only).');
  execSync('npx vitest run --coverage', { stdio: 'inherit' });
  const coverage = readCoverage();
  const failures = evaluateCoverage(changedSources, coverage);
  if (failures.length) {
    console.error('Coverage below 90% for changed files:');
    failures.forEach(f => console.error(`  ${f.file}: ${f.pct.toFixed(2)}%`));
    process.exit(1);
  }
  console.log('Per-file coverage (lines) >=90% for all changed files.');
} catch (err) {
  console.error('Error during coverage verification:', err.message || err);
  process.exit(1);
}
