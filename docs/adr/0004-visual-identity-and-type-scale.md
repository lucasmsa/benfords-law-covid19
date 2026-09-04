# 4. Sage and plum stay, the type scale and layout change

Date: 2026-09-04

## Status

Accepted

## Decision

- Palette carried over from 2021: sage `#588166` page background, sage-light
  `#a5bbad` control tracks, sage-deep `#37515a` expected line, plum `#5e2a41`
  observed bars and accents. Added: cream `#fbf3e7` cards, ink `#1b2a22` body
  text, muted ink `#4a5a50` captions.
- Headline face: Big Shoulders Display, weight 800, uppercase, set at
  `clamp(64px, 11vw, 148px)`. It is referenced once, in the `--font-display`
  token. Alternates that fit the same slot: Barlow Condensed, Sofia Sans Extra
  Condensed. Body face: Instrument Sans at 18px. Noto Sans KR is dropped.
- Body text never sits directly on sage. Everything below 24px lives on cream
  cards. The lede is 24px cream on sage. The title's second line is cream on a
  plum block.
- The virus pictogram and the cases/deaths emoji from 2021 stay. Globe and
  Brazil flag pictograms are retired since Area is now a segmented control.
- Every clickable has `cursor: pointer`; range inputs use `ew-resize`.

## Context

The 2021 layout was a centered column with a 60px Noto Sans KR headline and
one chart. The new page has controls, a chart, a fit panel and an explainer,
which needs a grid and a reading surface. Cream cards give body text a
high-contrast ground while keeping the sage identity as the page.

Contrast measured with the WCAG 2 relative-luminance formula
(`/tmp/claude-501/contrast.mjs` during the rebuild):

| Pair | Ratio | Requirement |
|---|---|---|
| cream on sage, title 64px+ | 4.02 | 3.0 (large) |
| cream on plum block, title | 10.13 | 3.0 (large) |
| cream on sage, lede 24px | 4.02 | 3.0 (large) |
| ink on cream, body 18px | 13.62 | 4.5 |
| muted ink on cream, captions 15px | 6.65 | 4.5 |
| plum on cream, card titles | 10.13 | 3.0 (large) |
| ink on sage-light, segmented control | 7.36 | 4.5 |
| cream on plum, selected option | 10.13 | 4.5 |
| cream on sage-deep, verdict chip | 7.67 | 4.5 |
| sage-deep on cream, expected line | 7.67 | 3.0 (graphic) |

Rejected during measurement: plum text on sage (2.54), cream body text at 21px
on sage (4.02 is below 4.5 for non-large text), cream 16px footer on sage.

## Consequences

- Fonts load from Google Fonts with `display=swap` and a condensed system
  fallback stack, so the layout survives a blocked font host.
- Swapping the headline face is a one-token change plus the `<link>` in
  `index.html`.
