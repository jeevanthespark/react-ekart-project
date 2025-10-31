# Copilot Instructions for react-ekart-project

These instructions tailor GitHub Copilot / ChatGPT style assistants to this repository. Focus: a React + TypeScript + Vite e-commerce front-end using Fluent UI, Zustand, Vitest, Playwright, Husky hooks, and a custom coverage gate.

## Core Tech Stack
- React 18, TypeScript, Vite
- Fluent UI (@fluentui/react-components) for design system
- Zustand for cart store state (`CartStoreCore.ts` + `CartStore.tsx` wrapper)
- Vitest for unit/component tests, V8 coverage
- Playwright for e2e tests (`e2e/app.spec.ts`)
- Husky pre-commit & pre-push hooks (lint + coverage threshold ≥ 90% for changed source files)

## Repository Conventions
- Absolute imports via `@/` alias.
- Components grouped under `src/components`, pages under `src/pages`, data under `src/data`.
- Store logic separated: core logic lives in `CartStoreCore.ts` with a thin wrapper `CartStore.tsx`.
- Test files co-located next to source with `.test.tsx` or `.test.ts` suffix.
- Avoid large snapshot tests; prefer specific, semantic assertions.
- Coverage gate excludes tiny wrapper/export-only files automatically.

## Coding Guidelines
1. Prefer functional components + hooks; avoid class components.
2. Keep components focused: extract hook or util if logic > ~80 lines.
3. Use Fluent UI primitives (Button, Input, Card) instead of raw HTML when interactive or styled.
4. Accessibility: add `aria-label` for icon-only buttons; ensure proper roles for interactive elements.
5. State: global for cart only; local UI state via `useState`/`useReducer`.
6. Avoid prop drilling more than two levels; introduce context if necessary.
7. TypeScript: no `any` unless absolutely unavoidable; use discriminated unions for variants.
8. Use utility functions from `src/utils` for formatting (e.g., `formatCurrency`).
9. Keep imports sorted: external libs, alias modules, relative modules.
10. Avoid mutating global test data; clone arrays/objects before modification in tests.

## Testing Guidelines
- Unit/component: Vitest + @testing-library/react.
- E2E: Playwright spec in `e2e/`.
- Mock heavy external concerns (framer-motion is often mocked for performance).
- Prefer `screen.getByRole` with `name` for accessibility alignment.
- Coverage threshold: 90% per changed file (lines). Add targeted tests rather than disabling logic.
- Avoid brittle implementation assertions (class names from Fluent UI / Griffel); assert presence and semantics.

## Performance & DX
- Keep test runtime reasonable—subset runs are planned; full run currently ~200s.
- Consider lazy loading for large feature pages if added.

## Pull Request Expectations
- Include rationale for significant architectural changes.
- Update or add tests for new behavior.
- Mention if coverage gate constraints require exemptions (rare).
- Provide manual testing notes for complex UI flows.

## Style & Lint
- ESLint enforced with max warnings = 0.
- Prefer descriptive variable names; abbreviations only for conventional terms (e.g., `ctx`, `ref`).

## Copilot Behavioral Directives
- When asked for code: produce minimal diff-ready snippets; no extraneous boilerplate.
- When refactoring: explain intent in 2–4 bullets, then show targeted changes.
- Do not suggest disabling coverage/lint rules unless absolutely required.
- Provide fallback or progressive enhancement strategies rather than monolithic rewrites.
- Surface edge cases: empty cart, search with no results, mobile viewport (< 600px).

## Adding Features
1. Define a small contract (inputs/outputs, side effects).
2. Write 1–2 tests first (happy + edge case).
3. Implement with types guiding design.
4. Run lint + tests; confirm coverage for changed file.

## Security & Reliability
- No direct persistence besides Zustand localStorage (persist middleware); avoid exposing sensitive data.
- Validate user input for future server integration (placeholder).

## Common Pitfalls
- Failing coverage due to partial test execution—ensure full instrumentation if adding new file.
- Ambiguous queries in tests (multiple buttons named "Filters"). Use contextual selectors.
- Over-mocking: keep component behavior observable without simulating entire Fluent UI internals.

## Suggestions Handling
Copilot should:
- Offer incremental improvements (add sorting option, refine filter logic) with tests.
- Suggest accessibility enhancements.
- Propose performance profiling steps sparingly.

---
Generated guidance for senior-level assistance; update as architecture evolves.
