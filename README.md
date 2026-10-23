# LeetCode Among Us

[![CI](https://img.shields.io/github/actions/workflow/status/MCA-NITW/leetcode_among_us/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/MCA-NITW/leetcode_among_us/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-3.4.2-blue?style=flat-square)](CHANGELOG.md)
[![Node](https://img.shields.io/badge/node-%3E%3D22-339933?style=flat-square&logo=node.js&logoColor=white)](package.json)
[![pnpm](https://img.shields.io/badge/pnpm-12-F69220?style=flat-square&logo=pnpm&logoColor=white)](pnpm-workspace.yaml)
[![License: ISC](https://img.shields.io/badge/license-ISC-yellow?style=flat-square)](LICENSE)

A competitive LeetCode tracker for MCA students at NIT Warangal. It pulls public
profile, problem, contest, badge and calendar data from LeetCode's GraphQL API
and renders a sortable leaderboard, per-user analytics, and a head-to-head
comparison view.

Live: <https://leetcode-among-us.onrender.com> (Render free tier: the first
request after ~15 minutes of inactivity takes 30-60 seconds while the service
wakes up).

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/MCA-NITW/leetcode_among_us)

Running a coding club somewhere else?
[Run it for your own college](docs/fork-for-your-college.md): swap the roster,
deploy the Blueprint, turn on the daily snapshot.

| Leaderboard                                                     | Phone (cards below 640px)                                                    |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ![Leaderboard, Overview tab](docs/screenshots/leaderboard.webp) | ![Leaderboard card view on a phone](docs/screenshots/leaderboard-phone.webp) |
| **User Stats**                                                  | **Compare**                                                                  |
| ![User Stats page](docs/screenshots/user-stats.webp)            | ![Compare page](docs/screenshots/compare.webp)                               |

Screenshots captured 2026-10-18 from a local production build against live
LeetCode data, at 1440px and 390px wide.

## Features

- Leaderboard with four tabs, each answering one question: Overview (who is
  winning), Problems, Contests and Consistency. Sortable columns, name search,
  batch filter, medals for the top three, and a Recent Contest Activity feed.
  Below 640px each person becomes a card instead of a 12-column table.
- History that LeetCode does not keep: a scheduled workflow snapshots every
  roster user's solved counts and rating once a day into a `data` branch. The
  leaderboard shows **Movers This Week** (most problems solved over the last
  seven days, with hard-problem and rating deltas) and User Stats adds a
  **Solved Over Time** chart for roster members.
- Derived metrics computed client-side from data the API already returns:
  completion percent, current and best streak (walked across the merged
  multi-year calendar, so a run crossing New Year is not split), rating trend,
  days since last contest, top topic, top language, last solved and
  daily-challenge badge progress.
- User Stats page: profile, difficulty breakdown, topic radar, submission
  heatmap, contest rating history and scatter, badges, streaks.
- Compare page: two users side by side across problems, contests, beats
  percentages and rating history, with an overall winner.
- Dark/light theme (persisted, applied before first paint).
- Server-side cache so the roster loads in seconds on repeat visits and LeetCode
  is not hammered on every page load.
- Route-level code splitting: Chart.js and the analytics pages load only when
  opened, which took the entry chunk from 584.87 kB to 300.25 kB (181.36 to
  96.44 kB gzip, `vite build` on 2026-10-18).
- Forkable: a Render Blueprint (`render.yaml`), a Deploy button and a
  [guide for other colleges](docs/fork-for-your-college.md). CORS allows the
  deployed URL automatically.

## Stack

| Layer     | Technology                                                            |
| --------- | --------------------------------------------------------------------- |
| Client    | React 19, TypeScript, Vite 8, React Router 7, Chart.js 4, React Icons |
| Server    | Node 22+, Express 5, TypeScript, Helmet, CORS, express-rate-limit     |
| Data      | LeetCode GraphQL API (public queries only), roster JSON in the repo   |
| Tooling   | pnpm 12 workspace, Prettier, Vitest, Supertest                        |
| CI/Deploy | GitHub Actions (org reusable workflows, daily snapshot cron), Render  |

## Architecture

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/diagrams/architecture-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="docs/diagrams/architecture-light.svg">
  <img width="880" src="docs/diagrams/architecture-light.svg" alt="Architecture of LeetCode Among Us. Students open the React 19 single-page app in the browser, which has the roster JSON bundled in at build time. The Leaderboard sends the roster in batches of 10, and User Stats and Compare send one user per call, to the Express 5 API on a Render web service (Helmet, CORS, rate limit). The API reads through an in-memory cache (10 minute TTL, 1 hour for history) that only on a miss calls the LeetCode GraphQL API (5 queries plus calendars per user) or reads history.json from the data branch on GitHub. A daily GitHub Actions snapshot at 19:00 UTC sends 1 query per user to LeetCode and commits the day to the data branch.">
</picture>

The spec behind the picture is
[`docs/diagrams/architecture.yaml`](docs/diagrams/architecture.yaml), rendered
with [orrery](https://github.com/Sagargupta16/orrery).

<details>
<summary>The same flow as a Mermaid chart</summary>

```mermaid
flowchart LR
  roster[(leetcoders_data.json<br/>34 students)] --> app
  subgraph browser[Browser]
    app[React SPA] -->|batches of 10| fetchers[fetchDataWithProgress]
  end
  fetchers -->|POST /leetcode/batch-user-data| api
  subgraph render[Render web service]
    api[Express 5 API] --> limiter[Rate limit + validation]
    limiter --> cache{In-memory cache<br/>+ in-flight map}
    cache -->|hit| api
    cache -->|miss| fanout[5 GraphQL queries in parallel<br/>+ calendar per active year]
  end
  fanout -->|public queries| lc[(leetcode.com/graphql)]
  api -->|static| spa[client/dist]
  subgraph actions[GitHub Actions, daily 19:00 UTC]
    cron[snapshot.yml] --> snap[scripts/snapshot.mjs]
  end
  snap -->|1 query per user| lc
  snap -->|commit history.json| data[(data branch)]
  app -->|GET /leetcode/history| api
  api -->|cached 1 h| data
```

</details>

One request path does all the work:

1. The client reads the roster from the bundled JSON and sends it to the API in
   batches of 10 usernames, updating a progress bar as each batch lands.
2. The API validates every username, then asks `getUserData()` for each one. A
   cache hit returns at once; a miss joins any in-flight fetch for the same
   (case-insensitive) user, so duplicates and concurrent visitors share one
   upstream round-trip.
3. A real miss fires five LeetCode GraphQL queries in parallel (profile,
   contests, problems, skills, badges), then one calendar overview call to learn
   `activeYears`, then one calendar call per active year, 100 ms apart.
4. The client shapes the response (`processUserDataResponse`) and enriches it
   with derived metrics (`enrichUser`) before the leaderboard renders.

History runs on a separate path, because LeetCode only exposes current totals:

1. `.github/workflows/snapshot.yml` runs `scripts/snapshot.mjs` once a day. It
   sends one small GraphQL query per roster user (solved by difficulty, rating,
   contests attended), 300 ms apart, and merges the day into `history.json`.
   Re-running on the same day replaces that day; at most 400 days are kept.
2. The workflow commits the file to the `data` branch, so history never touches
   `main` and never triggers a deploy.
3. `GET /leetcode/history` reads the file from raw.githubusercontent.com, caches
   it for an hour and returns only the slice a view asks for (`?days=14` for
   movers, `?user=name` for one chart).

Measured 2026-10-18 with `node scripts/snapshot.mjs` from a laptop in India: the
full 34-entry roster took 21.8 s and recorded 32 users (2 usernames no longer
exist on LeetCode); one day is 6,008 bytes of pretty-printed JSON.

### Design decisions

- **Server proxy, not browser calls.** The browser never talks to leetcode.com.
  The server owns the query shape, timeouts (15 s per query), rate limiting and
  caching, and only public, unauthenticated queries are ever sent.
- **Cache plus in-flight de-duplication.** Before 3.1.0 every page load cost
  roughly 10 upstream calls per user, about 350 per visitor. Profiles are now
  held for `CACHE_TTL_MINUTES`; users LeetCode does not know are never cached so
  a fixed typo shows up on the next load.
- **Partial failure is tolerated.** Each query catches its own error, so one
  timed-out query blanks one section instead of dropping the whole row.
- **Calendar years come from LeetCode.** Fetching exactly the user's
  `activeYears` replaced a hardcoded 2022-to-now loop that lost older history
  and wasted calls for later joiners.
- **Roster as data, validated in CI.** Students join by pull request; the same
  validator runs locally, before every client build and in CI.
- **`/health` never calls upstream,** so a LeetCode outage cannot make Render
  restart a healthy instance.
- **History without a database.** A daily commit to a `data` branch gives a
  versioned, free, inspectable store; the Render service stays stateless and a
  fork gets history by enabling one workflow.
- **"LeetCode is down" is not "no data".** One failed query blanks one section,
  but when all five fail the API returns 502 and the UI says LeetCode is not
  responding instead of reporting the user as missing.

Measured 2026-10-18 against the live service, from India, right after a Render
cold start: one batch of the first 10 roster users took 7.5 s with an empty
cache and 1.5 to 1.8 s on repeat requests served from cache (253 KB of JSON).
Tests: 26 API cases (Vitest + Supertest), 8 roster validator cases, 6 snapshot
script cases, and 15 client cases (data shaping and history math).

## Quick start

Prerequisites: Node 22 or newer and pnpm 12 (`corepack enable` will pick up the
pinned version from `package.json`).

```bash
git clone https://github.com/MCA-NITW/leetcode_among_us.git
cd leetcode_among_us
pnpm install
pnpm dev
```

`pnpm dev` starts the API on <http://localhost:3001> and the Vite client on
<http://localhost:3000>. The client proxies `/leetcode/*` and `/health` to the
API during development (see `client/vite.config.ts`).

### Scripts

| Command              | What it does                                                  |
| -------------------- | ------------------------------------------------------------- |
| `pnpm dev`           | API (tsx watch) + client (Vite) concurrently                  |
| `pnpm start:dev`     | API only, with reload                                         |
| `pnpm build`         | Install, compile server to `dist/`, validate roster, build UI |
| `pnpm start`         | Run the compiled server (serves `client/dist`)                |
| `pnpm test`          | Server tests (Vitest + Supertest) then client tests           |
| `pnpm validate:data` | Validate `client/src/assets/leetcoders_data.json`             |
| `pnpm snapshot`      | Record today's snapshot into `data/history.json` (gitignored) |
| `pnpm format`        | Prettier write                                                |
| `pnpm format:check`  | Prettier check (what CI runs)                                 |

## Configuration

Server (`.env`, see `.env.example`):

| Variable            | Default       | Purpose                                          |
| ------------------- | ------------- | ------------------------------------------------ |
| `PORT`              | `3001`        | Listen port                                      |
| `NODE_ENV`          | `development` | Set to `production` on Render                    |
| `CACHE_TTL_MINUTES` | `10`          | How long a fetched profile is served from memory |
| `ALLOWED_ORIGINS`   | -             | Extra CORS origins, comma-separated              |
| `HISTORY_URL`       | `data` branch | Where to read `history.json` (see below)         |
| `HISTORY_FILE`      | -             | Local `history.json` path; overrides the URL     |

On Render, `RENDER_EXTERNAL_URL` is added to the CORS allowlist automatically
and `HISTORY_URL` defaults to the `data` branch of `RENDER_GIT_REPO_SLUG`, so a
fork needs no configuration. For local development run `pnpm snapshot` and start
the API with `HISTORY_FILE=data/history.json`.

Client (`client/.env`, see `client/.env.example`):

| Variable       | Default | Purpose                                                      |
| -------------- | ------- | ------------------------------------------------------------ |
| `VITE_API_URL` | `''`    | API origin when the client is hosted separately from the API |

Leave `VITE_API_URL` empty when Express serves the built client (the default
Render setup).

## API

The `/leetcode/*` endpoints are rate limited (2000 requests per 5 minutes per
IP) and CORS-restricted to the origins listed in `server.ts` plus
`RENDER_EXTERNAL_URL` and `ALLOWED_ORIGINS`.

| Method | Path                        | Body / query                  | Notes                                      |
| ------ | --------------------------- | ----------------------------- | ------------------------------------------ |
| `GET`  | `/health`                   | -                             | Liveness probe; never calls LeetCode       |
| `POST` | `/leetcode/user-data`       | `{ "username": "..." }`       | Aggregated profile for one user            |
| `POST` | `/leetcode/batch-user-data` | `{ "usernames": ["...", …] }` | Up to 10 users; duplicates share one fetch |
| `GET`  | `/leetcode/history`         | `?days=1..1000`, `?user=name` | Daily snapshots, oldest first              |

Usernames must match `^[a-zA-Z0-9_-]{1,40}$`. Invalid input returns 400, unknown
`/leetcode/*` paths a JSON 404, disallowed origins 403. A single failing
LeetCode query does not fail the request: that section comes back `null` and the
response is still 200. When all five queries fail, LeetCode is unreachable:
`/leetcode/user-data` returns 502, and the batch endpoint marks each affected
user `success: false`. Clients should still treat a missing
`userPublicProfile.data.matchedUser` as "no such user". Successful profiles are
cached for `CACHE_TTL_MINUTES`; not-found users and failed fetches are never
cached.

`/leetcode/history` returns
`{ "snapshots": [{ "date", "takenAt", "users": { "<username>": { "solved", "easy", "medium", "hard", "rating", "contests" } } }] }`.
A missing `data` branch is an empty list, not an error; an unreachable source
is 502.

Each profile response bundles five LeetCode queries run in parallel (public
profile, contest ranking and history, problems solved, skill tags, badges) plus
the submission calendar: one overview call for `activeYears`, then one call per
active year.

## Adding yourself to the leaderboard

1. Fork and clone the repository.
2. Add an entry to `client/src/assets/leetcoders_data.json` (template in
   `client/src/assets/TEMPLATE_ENTRY.json`):

   ```json
   {
     "id": "22MCF1R01",
     "name": "Your Name",
     "userName": "your_leetcode_username",
     "batch": "2025",
     "gender": "male"
   }
   ```

3. Run `pnpm validate:data`. It checks required fields, the username pattern,
   four-digit batch, gender value, and duplicate ids/usernames
   (case-insensitive - LeetCode usernames are case-insensitive too).
4. Open a pull request. CI runs the same validation as part of the build.

Your LeetCode profile must be public. See [CONTRIBUTING.md](CONTRIBUTING.md) for
the full guide.

## Project structure

```
.
├── server.ts                    Express 5 API + static server (single file)
├── tsconfig.server.json         Compiles server.ts -> dist/server.js
├── vitest.config.ts             Server test runner config
├── tests/                       Server, validator and snapshot tests
├── scripts/validate-data.mjs    Roster validator (CLI + importable)
├── scripts/snapshot.mjs         Daily solved/rating snapshot (CLI + importable)
├── render.yaml                  Render Blueprint (Deploy button, forks)
├── docs/                        Fork guide, README screenshots, diagrams
├── client/
│   ├── index.html               CSP meta, fonts, theme pre-paint script
│   ├── vite.config.ts           Dev proxy to :3001
│   ├── vitest.config.ts         Client test runner config
│   ├── tests/                   Client unit tests
│   └── src/
│       ├── api/OptimizedFetchData.ts     Calls the API, shapes responses
│       ├── utils/optimizedLeaderboardData.ts  Batching + progress
│       ├── utils/derivedStats.ts         Streaks, trends, top topic/language
│       ├── utils/history.ts              Weekly movers, per-user history series
│       ├── assets/leetcoders_data.json   Roster (edit this to add users)
│       ├── components/Charts/            Chart.js wrappers
│       ├── components/{Nav,Loader,ThemeToggle}/
│       ├── contexts/ThemeContext.tsx
│       ├── hooks/useReveal.ts             Scroll-triggered entrance reveals
│       ├── hooks/useHistory.ts            Fetches /leetcode/history slices
│       ├── pages/{Home,LeaderBoard,UserStats,Compare}/
│       └── types/index.ts
├── .github/workflows/ci.yml     Calls mca-nitw/.github reusable workflows
├── .github/workflows/snapshot.yml  Daily snapshot to the data branch
└── pnpm-workspace.yaml          Workspace + security overrides
```

## Development notes

- Formatting is enforced by Prettier in CI (`pnpm format:check`). Single quotes,
  no semicolons, 2 spaces, 80 columns, LF line endings. `.gitattributes` pins LF
  on checkout so Windows clones with `core.autocrlf=true` pass the format check
  and the validator test locally.
- Design tokens live in `client/src/index.css` (colours, spacing, radius,
  shadows, motion). Use them; do not add literal colours or durations. For
  motion, reuse the shared utilities: `.reveal` + `useReveal()` for scroll
  entrances, `.stagger` with an inline `--i` for cascading siblings,
  `.card-lift` for hover, and the `g-*` keyframes. Reduced motion is handled
  globally.
- TypeScript runs with `strict`, `noUnusedLocals`, `noUnusedParameters` and
  `noFallthroughCasesInSwitch` on both sides.
- There is no ESLint/Biome yet; adding Biome 2 (lint-only, Prettier stays) is
  the intended next step.
- `pnpm build` runs `pnpm install` first because Render's build command is
  `pnpm build`. Do not remove that without updating the Render service.
- Dependencies are managed by Renovate through the org preset
  (`github>mca-nitw/.github`): one grouped PR per month, security fixes at any
  time, auto-merged when CI is green.

## Deployment

Render web service, root directory `.`, build command `pnpm build`, start
command `pnpm start`, health check path `/health`, environment
`NODE_ENV=production`. The server serves `client/dist` and falls back to
`index.html` for client-side routes. The same settings are in `render.yaml` for
new deployments (Deploy button or **New > Blueprint**).

Daily snapshots need the **Daily snapshot** workflow to have run once; until
then `/leetcode/history` returns an empty list and the history views stay
hidden.

## Security

See [SECURITY.md](SECURITY.md). The server only issues public, unauthenticated
GraphQL queries; no LeetCode credentials are involved anywhere.

## License

ISC. See [LICENSE](LICENSE).
