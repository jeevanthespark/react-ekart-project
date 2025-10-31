---
description: 'React development standards and best practices'
applyTo: '**/*.jsx, **/*.tsx, **/*.js, **/*.ts, **/*.css, **/*.scss'
---

# React & Fluent UI Development Instructions

> Purpose: Guide GitHub Copilot / Chat assistants to produce consistent, high-quality React + Fluent UI code, tests, and documentation for this repository.

## Project Context
- Stack: React 18 + TypeScript + Vite.
- UI Library: Fluent UI (`@fluentui/react-components`).
- State: Global cart via Zustand (`CartStoreCore.ts`), UI/local state via hooks.
- Testing: Vitest (unit/component), Playwright (e2e).
- Quality Gates: ESLint (0 warnings), per-file coverage ≥90% for changed source files (script enforces exemptions for tiny wrapper/export-only files).

## Assistant Objectives
Copilot should:
1. Produce minimal diffs (only necessary changes).
2. Add/update tests alongside new or modified logic.
3. Maintain or improve accessibility (roles, aria-labels, semantic HTML).
4. Uphold type safety (avoid `any`; prefer discriminated unions & utility types).
5. Avoid regressions in performance and coverage.
6. Suggest incremental refactors, not wholesale rewrites unless requested.

## Code Style Guidelines
- Functional components only; hooks for state/effects.
- Extract logic hooks if component exceeds ~80 lines.
- Use Fluent UI components for interactive elements; provide `aria-label` for icon-only buttons.
- Keep imports ordered: external libs, `@/` alias modules, relative modules.
- Format data & currency via utilities in `src/utils`.
- Avoid deep prop drilling (>2 levels) – introduce context or custom hook.

## Testing Guidelines
- Co-locate tests (`Component.test.tsx`) next to source.
- Favor `@testing-library/react` queries by role/name; fall back to `getByTestId` only when necessary.
- Cover new branches (conditionals, error paths, early returns).
- Keep test data minimal but complete (e.g., include `description`, `inStock` for product filtering).
- Mock `framer-motion` for speed & warning suppression.
- Do not rely on Fluent UI internal class names for assertions.

## Accessibility
- Ensure all interactive icons have `aria-label` or accessible text.
- Use appropriate roles (`button`, `navigation`, `banner`, `list`, `listitem`).
- Provide text alternatives for images (`alt` attribute).

## Performance Considerations
- Memoize expensive derived lists (`useMemo`) when input arrays stable.
- Batch related state updates if multiple changes triggered.
- Avoid unnecessary re-renders (stable dependency arrays, minimal inline object literals).

### Extended Performance Principles (Migrated)
- Prefer lazy loading for future large route bundles.
- Memoize derived product/filter collections reused in multiple components.
- Only introduce `useCallback` when it measurably prevents child re-renders.
- Defer non-critical computations (analytics, logging) to passive effects.
- Plan list virtualization once product list size becomes a UX bottleneck.

### Iteration Loop Template
1. Snapshot objective (single sentence).
2. Micro-plan (3–6 atomic steps: tests → types → impl → verify → optimize).
3. Apply focused diff (minimal unrelated churn).
4. Quick verify (targeted tests; full suite if coverage-sensitive change).
5. Assess impact (coverage %, perf & a11y notes).
6. Repeat until feature complete; consolidate & document.

## Coverage Strategy
- Each changed file should remain ≥90% line coverage; if below, recommend targeted tests.
- Use small utility tests over broad snapshots.
- If subset test run misses coverage entry, fallback to full suite (script behavior).

## Refactor Guidance
When proposing a refactor, include:
- Pain points (e.g., repeated filtering logic).
- Target outcome (e.g., single `applyFiltersAndSort` utility).
- Diff snippet (only changed sections).
- Test adjustments (new cases, removed redundancy).

## Response Pattern Templates
### Feature Implementation
Contract:
- Inputs: (props / params types)
- Outputs: (rendered UI / return type)
- Side Effects: (state updates, storage, navigation)
- Error Modes: (graceful fallback / empty UI)

Deliver:
1. Contract summary.
2. Test additions (list + brief rationale).
3. Diff snippet.
4. Verification steps (lint + test + coverage).

### Bug Fix
1. Reproduction summary.
2. Root cause explanation.
3. Targeted change.
4. Added/updated tests.
5. Risk assessment & fallback.

### Optimization
1. Baseline issue (profiling or observed slowness).
2. Approach (memoization, virtualization, etc.).
3. Diff snippet.
4. Measurement plan (how to validate improvement).

## Do / Don't
Do:
- Align with existing patterns & naming.
- Keep public API stable unless explicitly told otherwise.
- Provide follow-up suggestions (e.g., accessibility enhancements) after completing core task.

Don't:
- Suggest disabling lint/coverage gates.
- Introduce heavy dependencies lightly.
- Produce large, speculative rewrites.

## Common Edge Cases To Test
- Empty product list / empty search results.
- Cart operations (add/remove/update/clear, free shipping threshold).
- Mobile viewport (<600px) layout shifts.
- Filter combinations (category + price + stock + rating).

## Security & Reliability
- Sanitize/validate user-typed input before future API calls (placeholder stage).
- Avoid storing sensitive data in localStorage; only cart basics.

## Example Utility Pattern
```ts
export function applyFiltersAndSort(products: Product[], filters: ProductFilters, sort: SortOption): Product[] {
  // filter
  let result = products.filter(p => {
    if (filters.category && !filters.category.includes(p.category.slug)) return false;
    if (filters.inStock && !p.inStock) return false;
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
  // sort
  switch (sort) {
    case 'price_low_to_high': result = [...result].sort((a,b) => a.price - b.price); break;
    case 'price_high_to_low': result = [...result].sort((a,b) => b.price - a.price); break;
    case 'rating': result = [...result].sort((a,b) => b.rating - a.rating); break;
  }
  return result;
}
```

## Quality Gate Checklist (Assistant)
Before finishing a response involving code changes:
- Build/type-check: PASS.
- Lint: PASS (0 warnings).
- Tests: PASS relevant suite.
- Coverage: Changed files ≥90%.

---
These custom instructions align Copilot with project standards for consistent, maintainable React + Fluent UI development.

## KPIs (Reference)
- Bundle delta per feature: <5% increase (optional analyze on large additions).
- New utility coverage: ≥95%; component/page coverage: ≥90% lines.
- Test runtime incremental increase: <3% per feature.
- Zero new accessibility violations (when axe or e2e checks run).

## Risk Matrix
| Risk | Indicator | Action |
|------|-----------|--------|
| Coverage Drop | Changed file <90% | Add focused test immediately |
| Type Erosion | Appearance of `any` | Replace with explicit type/union |
| Perf Regression | Noticeable render lag | Profile → memoize/split component |
| A11y Gap | Missing aria-label / role | Patch immediately |
| Scope Drift | Large unrelated diff | Split into separate commit/PR |

## Communication & Progress Note Style
Use concise, stateful updates: `Step 2/4: Added failing tests for out-of-stock filter (coverage 0→42%); next implement filter util.` Provide next action every note.

## Quick Contract Abbreviation
`Inputs: ... | Outputs: ... | Side Effects: ... | Errors: ... | Perf: O(...)`

## Fluent UI Design Reference
Design system guidelines: https://fluent2.microsoft.design (tokens, motion, layout, accessibility). Use alongside API docs: https://react.fluentui.dev.

## Performance Triage Checklist
1. Confirm symptom (Profiler: excessive renders / long commit time).
2. Identify hot component or expensive derived computation.
3. Apply smallest viable remedy (memoize derived data, selector refinement, component split).
4. Re-measure; revert if negligible improvement.
5. Document unusual optimizations with inline comment.

## Ambiguity & Assumption Handling
When requirements are unclear:
- State up to two explicit assumptions (Assumption A:, Assumption B:).
- Proceed implementing aligned to those assumptions.
- Flag assumptions at top of response; invite confirmation.
If assumptions prove wrong, supply a concise delta patch rather than rewrite.

## Full Example: Feature Implementation Response
Contract: Adds price range filtering to product listing.
Tests Added:
- filters products within inclusive min/max range.
- returns empty array when min > all prices.
Diff (excerpt): Only new util `applyPriceRange` and integration in `HomePage`.
Verification: lint PASS, tests PASS (2 new), coverage new util 100% lines.
Follow-ups: Consider combining with existing filter pipeline in future refactor.

## Full Example: Bug Fix Response
Reproduction: Adding out-of-stock item increments cart badge.
Root Cause: Missing inStock guard in `addItem` path.
Fix: Early return when `!product.inStock` before state mutation.
Tests: Added test `does not add out-of-stock product`; existing add test unchanged.
Risk: Low—guard narrow; no API surface change.

## Full Example: Optimization Response
Baseline: Product list re-renders 15x per filter toggle (Profiler capture).
Cause: Inline object literal dependencies causing child re-renders.
Change: Extract stable `filterCriteria` via `useMemo` + memoize expensive derived list.
Measurement Plan: Expect renders ≤3 per toggle; verify in Profiler after patch.
