# Run it for your own college

Nothing in the app is tied to NIT Warangal except the roster and a few lines of
copy. A fork with your own students needs no code changes and runs on Render's
free tier.

## 1. Fork

Fork [MCA-NITW/leetcode_among_us](https://github.com/MCA-NITW/leetcode_among_us)
into your account or your coding club's organisation.

## 2. Replace the roster

`client/src/assets/leetcoders_data.json` is the only data file. Replace its
entries with your students, one object each (template in
`client/src/assets/TEMPLATE_ENTRY.json`):

```json
{
  "id": "21CS1001",
  "name": "Jane Doe",
  "userName": "jane_doe",
  "batch": "2025",
  "gender": "female"
}
```

Then check it:

```bash
pnpm install
pnpm validate:data
```

The validator enforces the field rules in [CONTRIBUTING.md](../CONTRIBUTING.md)
(LeetCode username pattern, four-digit batch, no duplicate ids or usernames).
The client build runs it too, so a bad entry fails the deploy instead of
shipping an empty row.

## 3. Change the copy

| File                                   | What to change                                    |
| -------------------------------------- | ------------------------------------------------- |
| `client/index.html`                    | `<title>` and the `description` meta tag          |
| `client/src/components/Nav/NavBar.tsx` | Brand text, if you want a different name          |
| `README.md`                            | Your live URL and the Deploy button link (step 4) |

## 4. Deploy on Render

`render.yaml` describes the whole service (free plan, `pnpm build`,
`pnpm start`, health check on `/health`). Either:

- In Render, choose **New > Blueprint** and pick your fork, or
- Edit the Deploy button URL in your fork's README so `repo=` points at your
  fork, then click it:
  `https://render.com/deploy?repo=https://github.com/<you>/leetcode_among_us`

No environment variables are required:

- **CORS.** Browsers send an `Origin` header even on same-origin POSTs, so the
  API must allow its own URL. It reads Render's `RENDER_EXTERNAL_URL`
  automatically. Add a custom domain, or a client hosted elsewhere, with
  `ALLOWED_ORIGINS=https://leaderboard.example.edu` (comma-separated).
- **History.** The API reads snapshots from the `data` branch of the repo it was
  deployed from (`RENDER_GIT_REPO_SLUG`). Hosting somewhere other than Render?
  Set `HISTORY_URL` to
  `https://raw.githubusercontent.com/<you>/leetcode_among_us/data/history.json`.

## 5. Turn on daily snapshots

LeetCode only reports current totals, so "solved over time" and the weekly
movers come from `.github/workflows/snapshot.yml`, which records every roster
user once a day and commits `history.json` to a `data` branch.

GitHub disables scheduled workflows on forks until you opt in:

1. Open the **Actions** tab of your fork and enable workflows.
2. Run **Daily snapshot** once with **Run workflow**. The first run creates the
   `data` branch.

From then on it runs at 19:00 UTC every day. The leaderboard shows "Movers This
Week" from the second snapshot on, comparing against a full week back once seven
days have been recorded. The workflow pushes with the built-in `GITHUB_TOKEN`
and asks for `contents: write` itself; the only thing that can block it is a
branch ruleset that covers the `data` branch.

## Keeping up with upstream

Your changes live in the roster and a few lines of copy, so upstream fixes
usually merge cleanly: use **Sync fork** on GitHub, and if the roster file
conflicts, keep your version.
