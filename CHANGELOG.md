# Changelog

## [3.2.0] - 2026-09-10

UI consistency and motion release. No data or API changes.

### Added

- Motion design tokens in `client/src/index.css`: `--dur-fast/base/slow`,
  `--stagger`, `--lift`, `--reveal-distance`. Every transition and entrance
  animation now reads from these instead of ad-hoc literals.
- Shared utilities: `.reveal` (scroll-triggered entrance, driven by the new
  `useReveal` IntersectionObserver hook), `.stagger` (siblings cascade in via an
  inline `--i` index), `.card-lift` (the single hover recipe for cards and
  buttons) and `.surface`. Pattern borrowed from portfolio-react; zero
  dependencies.
- Home page sections below the fold reveal on scroll; stat and feature cards
  stagger in. Recent Contest Activity on the leaderboard reveals when reached.
- Reduced-motion handling now also pins reveals/staggers to their final visible
  state and stops infinite loops after one iteration.

### Changed

- One card recipe across pages: `--radius-lg` corners, `--space-lg` grid gaps,
  hover lifts by `--lift` with accent border and soft glow. Previously lifts
  ranged from -1px to -6px with and without scale, and card radii were split
  between 16px and 24px.
- User Stats: the Social Links buttons, Recent Contest Activity table and
  Upcoming Badges list were inline-styled with light-only colours (`#fafafa`,
  `white`, `#e0e0e0`, `#333`) and JavaScript hover handlers, so they broke in
  dark mode. Rebuilt as CSS classes on the theme tokens; the progress bar now
  has an accessible `progressbar` role.
- Leaderboard, Compare and User Stats inline greys and status colours moved to
  tokens (`--text-2/3`, `--success`, `--warning`, `--danger`, medal tokens).
  Compare's second difficulty palette replaced by the shared
  `--easy/medium/hard-color` tokens.
- Duplicate page-level keyframes (`fadeIn` was defined twice with different
  bodies in Home.css and UserStats.css, plus `fadeInUp`, `scaleIn`,
  `compareFadeIn`, `compareScaleIn`) removed in favour of the shared `g-*` set.
  Hardcoded `nth-child` delay ladders replaced by `--stagger` maths.
- Home CTA paddings tokenised; `transition: all` removed.
- `scrollbar-gutter: stable` on `html` so the layout no longer shifts when a
  page grows a scrollbar.

### Fixed

- Home hero and section titles used inverted `clamp()` bounds (max below min),
  so they never scaled with the viewport.
- Leaderboard retry button removed its focus ring on `:focus-visible`.

## [3.1.0] - 2026-09-10

Audit release: server hardening, client bug fixes, first test suite, and a
documentation rewrite. No API contract changes; the two existing endpoints keep
their request and response shapes.

### Added

- Server-side in-memory cache for LeetCode profiles (default 10 minutes,
  `CACHE_TTL_MINUTES`). Concurrent and duplicate requests for the same user
  share one upstream round-trip. A warm profile now returns in ~50 ms instead of
  ~3 s, and a full leaderboard load no longer fires ~350 GraphQL calls at
  LeetCode per visitor.
- `GET /health` liveness endpoint for Render and uptime monitors (never calls
  LeetCode).
- Test suite: Vitest + Supertest for the server (validation, caching, CORS,
  error handling) and Vitest for the client data-processing layer. `pnpm test`
  now runs in CI.
- `scripts/validate-data.mjs` roster validator, run automatically before every
  client build and via `pnpm validate:data`. Replaces the `validate-json.js` the
  old README referenced but which no longer existed.
- Graceful shutdown on SIGTERM/SIGINT so Render deploys finish in-flight
  requests.
- JSON 404 for unknown `/leetcode/*` paths and a final error handler (CORS
  rejections are 403, malformed bodies 400, nothing leaks a stack trace).
- Leaderboard error state with a retry button, distinct from the empty-roster
  state.
- `LICENSE` (ISC) file, which the README had linked to for years.
- `client/.env.example` documenting `VITE_API_URL`.

### Fixed

- Google Fonts were blocked by the server's Content Security Policy on the
  production Render deployment (`style-src` lacked `fonts.googleapis.com`).
- Daily Coding Challenge badge icons come back from LeetCode as site-relative
  paths (`/static/images/badges/dcc-2025-1.png`) and 404ed against the app's own
  origin. They are now prefixed with `https://leetcode.com`, and the client CSP
  allows that host for images.
- Searching a non-existent user on the Stats and Compare pages rendered a fake
  all-zero profile; it now shows a "no profile found" error.
- Leaderboard "Accept %" column sort was a no-op (sorted a field that does not
  exist on the row); string columns sorted case-sensitively; missing values now
  always sink to the bottom.
- Leaderboard tab bar read "Overview / Stats / Stats / Performance / Stats" -
  the labels were stripping their first word.
- "∞" and "#∞" rendered for users without a ranking (Advanced tab, Compare).
- Stats page "Recent Contest Activity" listed the oldest contests first and
  computed rating deltas against the wrong neighbour (inverted sign).
- Unrated users showed "Rating 0", "Top 100%" and a fabricated 100,000
  participant pool; these now read Unrated / N/A.
- Contest trend arrows rendered a down arrow for LeetCode's `NONE` direction.
- Navbar frosted-glass effect was silently dropped by an invalid
  `blur(blur(24px))` declaration.
- Light-theme users saw a dark first paint; the saved theme is now applied
  before React mounts. `localStorage` access is guarded for privacy modes.
- Compare page headers tracked the live input value instead of the compared
  user; percentage bars divided by zero when totals were missing.
- Roster fetch ran twice under React StrictMode and could set state after
  unmount.
- Calendar history was hardcoded to start in 2022; it now follows the
  `activeYears` LeetCode reports, so pre-2022 activity counts and later joiners
  cost fewer upstream calls.
- Upstream fetches had no timeout (now 15 s) and sent no User-Agent/Referer.
- Batch validation echoed arbitrary invalid input back in the error message.
- Home page claimed "100+ Users Tracked"; it now reports the roster size.
- Bogus `<meta name="LeetCode Among Us">` replaced with a real description.

### Changed

- Removed dead code: `client/src/api/FetchData.ts`, `AllQueries.ts`,
  `utils/leaderboardData.ts`, `components/Dropdown.tsx` (an unimported chain
  that targeted a `/leetcode` route the server never had), the unused
  `fetchDataForMultipleLeetcoders` export, and stray `eslint-disable` comments
  for a linter that was never configured.
- Removed unused dependencies `ag-grid-react` and `react-bootstrap` (zero
  imports).
- Removed the stray `.pnpmrc.json` (not a pnpm config file; `allowBuilds` lives
  in `pnpm-workspace.yaml`) and consolidated the duplicate `qs` override.
- TypeScript: `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch` enabled for client and server; 15 redundant
  `import React` lines removed (automatic JSX runtime).
- `express-rate-limit`: `max` renamed to `limit`, standard `RateLimit` headers
  (draft-8), legacy `X-RateLimit-*` headers off. The SPA catch-all is no longer
  rate limited (static assets never were).
- Upstream failures return 502 instead of 500.
- Client `package.json` version synced with the root (3.1.0).
- README rewritten to match the current stack (pnpm, Vite, TypeScript, Express
  5, Render). SECURITY.md and CONTRIBUTING.md updated.

### Dependencies

- Renovate: pnpm 11.25.0 (#174), monthly dependency updates (#175), pnpm 12
  (#177).
- Added dev dependencies: `vitest`, `supertest`, `@types/supertest`.

## [3.0.2] - 2026-09-03

### Security

- Bump transitive qs to 6.16.0 (alerts #127, #128: array-limit bypass, isBuffer
  DoS).

## [3.0.1] - 2026-09-03

- Security: bump nanoid (3.3.16 -> 3.3.18), postcss (8.5.22 -> 8.5.26),
  ip-address (10.2.0 -> 10.7.0) via pnpm overrides to resolve all 5 open
  Dependabot alerts
- Fix Compare page Overall Winner score miscomputation (#168)
- Dependency maintenance: Vite security updates, express path-to-regexp fix,
  monthly Renovate updates
- Adopt org reusable CI workflows and Renovate automerge config

## [3.0.0] - 2026-03-02

- Full-stack rewrite with pnpm workspace
- New client UI with user statistics, leaderboards, comparison pages
- Suite of charting components for data visualization
- Switch from Dependabot to Renovate

## [2.0.0] - 2026-02-14

- Implement user statistics and comparison pages with diverse charts
- Add leaderboard page with content loader and data fetching

## [1.1.0] - 2025-10-04

- Add Compare page with user performance comparison
- Implement dark/light mode with ThemeContext and ThemeToggle
- Enhance UserStats and CustomRankTable with additional data and improved UI
- Update CORS to include additional allowed origins

## [1.0.0] - 2023-08-26

- Initial LeetCode Among Us: compare LeetCode stats among friends
- MERN stack with real-time leaderboard
