# Contributing

Thanks for helping keep the leaderboard alive. Most contributions are one of two
kinds: adding yourself to the roster, or improving the app.

## Adding your LeetCode ID

1. Fork this repository and clone your fork.
2. Open `client/src/assets/leetcoders_data.json`.
3. Add an entry in this exact shape (template: `TEMPLATE_ENTRY.json`):

   ```json
   {
     "id": "22MCF1R01",
     "name": "Your Full Name",
     "userName": "your_leetcode_username",
     "batch": "2025",
     "gender": "male"
   }
   ```

4. Run `pnpm install` once, then `pnpm validate:data`. Fix anything it reports.
5. Commit, push, and open a pull request.

### Field rules

| Field      | Rule                                                     |
| ---------- | -------------------------------------------------------- |
| `id`       | Your official student ID, unique in the file             |
| `name`     | Your full name (LeetCode's `realName` is shown if set)   |
| `userName` | Your LeetCode username: 1-40 letters, digits, `_` or `-` |
| `batch`    | Graduation year, four digits                             |
| `gender`   | `male`, `female` or `other`                              |

Notes:

- LeetCode usernames are case-insensitive; the validator treats `Jane_Doe` and
  `jane_doe` as duplicates. Use the spelling shown on your profile URL.
- Your LeetCode profile must be public or no data can be fetched.
- Keep entries in order by student ID.
- Do not add extra fields; the validator rejects them.

The same validator runs before every client build, so CI will fail on a bad
entry before it can reach production.

## Working on the app

```bash
pnpm install
pnpm dev            # API on :3001, client on :3000
pnpm test           # server + client tests
pnpm build          # what CI and Render run
pnpm format         # Prettier
```

Conventions:

- Prettier is enforced in CI; run `pnpm format` before pushing.
- TypeScript is strict with unused-code checks on both client and server.
- Server changes need a Supertest case in `tests/server.test.ts` when they touch
  validation, caching or error handling. Client data-shaping changes go in
  `client/tests/`.
- Keep `server.ts` free of anything that would require LeetCode credentials.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `docs:`,
  `chore:`, `test:`, `refactor:`).
- Bump the version in both `package.json` files and add a `CHANGELOG.md` entry
  in the same PR as a user-visible change.

## Reporting problems

Open an issue with the page, the username involved (if any), and what you
expected. For security issues follow [SECURITY.md](SECURITY.md) instead.
