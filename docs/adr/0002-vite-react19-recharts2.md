# 2. Vite, React 19 and Recharts 2 replace the CRA stack

Date: 2026-09-04

## Status

Accepted

## Decision

- Build with Vite 7 and React 19 under TypeScript `strict`. Package manager is
  pnpm. `react-scripts` 3.4.3, React 16, TypeScript 3.7, react-router 5,
  styled-components, axios, polished, re-resizable, react-icons and the
  never-imported react-vis and victory are removed.
- Charts stay on Recharts, upgraded from 1.8 to 2.15. The chart is one bar
  series (observed) and one dashed line (expected); no library change is
  warranted.
- Tests: Vitest for `src/lib` and `scripts` (pure functions), Playwright for
  the golden path, with the fit panel's rendered numbers asserted against the
  same library functions run in Node on the committed snapshot.
- Styling is plain CSS in `src/styles.css`. Palette hexes live once in
  `src/config/palette.ts` and are injected as CSS custom properties on the app
  root, so Recharts and CSS read the same values.
- Components render only. State and event handlers live in `src/hooks`
  (`useDataset`, `useControls`, `useAnalysis`, `useDateRange`), pure math in
  `src/lib`, option lists and copy in `src/config`.

## Context

The 2021 code was 2 pages and 1 button. What is worth carrying over is the
palette, the pictograms and the tone of the copy, not the code. CRA 3 is
unmaintained and its webpack 4 build needs the legacy OpenSSL flag on Node 17+.

## Consequences

- One lockfile, `pnpm-lock.yaml`. `yarn.lock` and the 518 kB `yarn-error.log`
  are deleted.
- Production bundle: 632 kB minified, 182 kB gzipped, most of it Recharts.
  Acceptable for a single-page tool; code splitting is not pursued.
- No router. The 2021 World and Brazil routes become the Area control.
