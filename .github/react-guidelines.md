# React & Fluent UI Guidelines

This document establishes patterns and best practices for building features in this project.

## Architecture Overview
- Entry: `main.tsx` mounts `App` within routing & provider contexts.
- Pages under `src/pages` encapsulate route-level state & composition.
- Reusable presentational + interactive components under `src/components`.
- Data mocks under `src/data` until backend integration.
- Global cart state isolated in Zustand store core (`CartStoreCore.ts`) + wrapper (`CartStore.tsx`).

## Component Design
- Keep components pure (no side effects in render). Use hooks for effects.
- Split large components: UI shell + logic hook (e.g., `useCartSummary()` returning derived totals).
- Avoid deep prop chains: introduce context or collocate logic.
- Accept explicit props; prefer an object param when >=5 props.
- Use explicit event handler names (`onProductClick`, `onFiltersChange`).

## State Management
- Use local `useState` for ephemeral UI (open/close modals, toggles).
- Use `useReducer` for complex multi-field forms (checkout forms when added).
- Persist only necessary cart info; ephemeral UI state should not go to storage.

## Fluent UI Usage
- Favor Fluent UI components for consistency, accessibility, and theming.
- For icon-only buttons: provide `aria-label` and optional `title`.
- Use `Stack`/layout primitives sparingly; rely on CSS grid/flex with design tokens if available.
- Avoid overriding too many class names; compose via style props or Griffel makeStyles (future).

## Styling
- Global CSS limited to resets & base tokens (`styles/global.css`).
- Prefer CSS-in-JS via Fluent UI/Griffel once introduced or utility classes defined in modules.
- Keep responsive breakpoints: mobile (<600px), tablet (600–900px), desktop (>900px).

## Accessibility (A11y)
- Ensure focusable interactive elements are keyboard accessible.
- Provide visible focus outlines (Fluent defaults acceptable).
- Use semantic HTML where possible (lists for products, headings for sections).
- Announce dynamic changes (cart updates) with aria-live regions if complexity grows.

## Testing Strategy
### Unit / Component (Vitest + @testing-library/react)
- Write tests for new logic branches (filters, sorting, conditional rendering).
- Avoid implementation-specific assertions (internal class names or DOM structure that may change).
- Use `getByRole`/`getByLabelText` for accessible queries; fallback to `getByTestId` only when necessary.

### Store Tests
- Exercise add/remove/update/clear flows; assert derived totals.
- Cover edge cases: zero quantity update, free shipping threshold changes.

### Mocking Guidelines
- Mock `framer-motion` for speed and to silence attribute warnings.
- Do not over-mock Fluent UI; rely on its semantics where feasible.
- Keep mock data minimal but complete for search/filter logic (include `description`, `category`, `inStock`).

### Coverage
- Per changed file threshold: ≥90% lines.
- Exempt tiny wrapper/export-only files automatically (script handling).
- If a branch is hard to reach, add a focused test rather than lowering threshold.

## Performance Considerations
- Defer heavy computations (sorting large arrays) with `useMemo` when dependencies stable.
- Batch state updates if multiple changes triggered by user interactions.
- Avoid unnecessary re-renders: pass primitive props or memoized objects.

## Patterns to Follow
- Custom hooks: `useFeatureName()` colocated with component or in `src/hooks` when added.
- Errors: throw early (guard invalid context usage) and test error paths.
- Loading states: minimal skeleton placeholders (future) vs verbose spinners.

## Patterns to Avoid
- Long chains of `.map().filter().reduce()` in JSX; compute outside render.
- Deep optional chaining inside templates; derive sanitized view-model first.
- Anonymous functions inline in lists if causing performance issues; use `useCallback` only when beneficial.

## Extending Functionality
1. Draft interface/types first.
2. Add tests (happy path + edge case).
3. Implement logic/hook.
4. Integrate component UI.
5. Confirm coverage & lint.
6. Document usage in README or inline JSDoc.

## Error Handling & Resilience
- For async additions (future API calls), handle loading, success, retry, and error states distinctly.
- Validate user inputs before state updates (numeric ranges, non-empty search).

## Internationalization (Future)
- Wrap text in a translation layer only after stable copy baseline; design components with flexible text lengths.

## Example Hook Skeleton
```ts
interface UseProductsOptions { filters: ProductFilters; sort: SortOption; }
interface UseProductsResult { products: Product[]; isLoading: boolean; error?: string; }
export function useProducts(opts: UseProductsOptions): UseProductsResult {
  // implement memoized filtering and sorting
}
```

## Code Review Checklist
- Clear separation of concerns (UI vs logic).
- Proper typing (no untyped catches, avoid `any`).
- A11y queryable elements in tests.
- Coverage delta maintained ≥90% for changed files.
- No unnecessary large dependencies.

## Migration & Refactoring Notes
- If introducing React Query or SWR, refactor data-related hooks not cart logic first.
- Gradually replace large conditional blocks with strategy patterns or mapping objects.

---
These guidelines support maintainability, accessibility, testability, and performance for ongoing feature development.
