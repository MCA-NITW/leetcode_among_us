# Security Policy

## Supported Versions

Only the latest release on `main` receives security fixes.

| Version      | Supported |
| ------------ | --------- |
| 3.x (`main`) | Yes       |
| < 3.0        | No        |

## Reporting a Vulnerability

Please do not open a public GitHub issue for security problems.

1. Use GitHub's private vulnerability reporting on this repository (Security
   tab, "Report a vulnerability"), or email the maintainer at sg85207@gmail.com.
2. Include a description, steps to reproduce, affected version or commit, and
   the impact you believe it has.
3. You will get an acknowledgement within 48 hours, an assessment within 7 days,
   and a fix or mitigation plan within 30 days for confirmed issues.
4. We will coordinate disclosure with you once a fix is released.

## Scope

In scope:

- `server.ts` (Express API: input validation, CORS, rate limiting, security
  headers, caching, error handling)
- The React client under `client/src` (XSS via LeetCode-supplied profile fields,
  unsafe URLs, Content Security Policy)
- Build and dependency configuration (`package.json`, `pnpm-workspace.yaml`, CI
  workflows)

Out of scope:

- LeetCode itself and its GraphQL API
- Render platform issues
- Denial of service against the free-tier deployment by exhausting the public
  rate limit

## Security Design Notes

- The server sends only public, unauthenticated GraphQL queries to LeetCode. No
  cookies, tokens or credentials exist anywhere in the project.
- Usernames are validated against `^[a-zA-Z0-9_-]{1,40}$` before use and are
  never echoed back verbatim in error responses.
- Responses are cached in process memory only; nothing is written to disk.
- Dependency vulnerabilities are handled by Renovate (security PRs open
  immediately and auto-merge when CI is green) and the org `security-scan`
  workflow. Transitive pins live under `overrides` in `pnpm-workspace.yaml`.
