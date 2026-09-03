# Changelog

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
