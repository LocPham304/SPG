# Visual QA Report

## Scope

- Route: `/en`, with `/vi` and `/zh` layout checks
- Section: Homepage Hero
- Reference: `http://en.spe.cn/` and existing `home-top-*` screenshots
- Verification status: VERIFIED for layout/media; PARTIALLY_VERIFIED for entrance timing
- Deterministic state: `data-hero-index="0"`, `data-animation-state="complete"`, `hero-media=poster`

## Viewports

| Viewport | State | Result |
| -------- | ----- | ------ |
| 1920 x 1080 | Poster, final text | PASS |
| 1440 x 900 | Poster, final text | PASS |
| 1366 x 768 | Poster, final text | PASS |
| 1024 x 768 | Poster, final text | PASS |
| 768 x 1024 | Poster, final text | PASS |
| 430 x 932 | Poster, final text | PASS |
| 390 x 844 | Poster, final text | PASS |
| 375 x 667 | Poster, final text | PASS |

All tested viewports used a viewport-height Hero and reported zero horizontal
overflow. The production build had no Next.js development portal or error
overlay.

## Locale checks

| Locale | Viewport | Result | Notes |
| ------ | -------- | ------ | ----- |
| `vi` | 390 x 844 | PASS | Four visual rows, contained within Hero. |
| `en` | 390 x 844 | PASS | Five visual rows, matching the reference wrap. |
| `zh` | 390 x 844 | PASS | Three visual rows, contained within Hero. |

## Measured comparison

| Viewport | Reference title | Local title | Difference |
| -------- | --------------- | ----------- | ---------- |
| 1440 x 900 | x 97.5, y 440.4, 42px / 54.6px | x 97.5, y 441.1, 41.47px / 53.91px | Below 1px geometry/font variance. |
| 1024 x 768 | x 53.3, y 298.8, 35.2px / 45.76px | x 53.3, y 299.3, 35.2px / 45.76px | Below 1px geometry variance. |
| 768 x 1024 | x 40, y 382.3, 30.4px / 39.52px | x 40, y 382.3, 30.4px / 39.52px | Matched measured geometry. |
| 390 x 844 | x 15.6, y 274.9, 28.08px / 36.5px | x 15.6, y 274.3, 28.08px / 36.5px | Below 1px geometry variance. |

## Motion and media checks

- Normal video mode loaded the local MP4 at `1280 x 720`, duration `13.866667s`.
- Video time advanced while visible and the element remained muted, autoplaying,
  looping and inline, with no native controls.
- Poster mode was used for screenshot comparison so no random video frame entered
  a baseline.
- Navigating away and back left one Hero instance, two text lines and no retained
  GSAP inline transform/opacity state.
- Reduced-motion behavior is implemented as a static poster with final visible
  text. Runtime media emulation was unavailable in the connected browser, so the
  reduced-motion runtime state is NOT_VERIFIED; CSS and lifecycle branches were
  reviewed statically.

## Findings

### Low: unavailable DIN font file

- The repository contains no local font asset matching the live `DIN-Medium`.
- The implementation uses the existing heading stack and `Arial Narrow` only at
  900-1199px to preserve the verified 1024px line wrap.
- Remaining desktop font-size variance is below 1px.

### Info: entrance timing

- The live reference reached final text state before a reliable initial frame
  could be sampled.
- The implementation therefore uses a conservative 0.72-second GSAP reveal with
  a 0.12-second stagger, as requested, and records exact easing as partially
  verified.

No generated Playwright report, trace, test result or temporary screenshot was
added to Git.
