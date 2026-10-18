#!/usr/bin/env node
/**
 * Takes one daily snapshot of every roster user's solved counts and contest
 * rating and merges it into a history file.
 *
 * LeetCode only exposes current totals, so history has to be recorded as it
 * happens. The scheduled workflow (.github/workflows/snapshot.yml) runs this
 * once a day and commits the result to the `data` branch; the API serves that
 * file at GET /leetcode/history.
 *
 * Usage: node scripts/snapshot.mjs [--out data/history.json] [--limit 5]
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql'
const FETCH_TIMEOUT_MS = 15_000
// One request per user, spaced out so a full roster run stays polite.
const REQUEST_DELAY_MS = 300
// About 13 months: enough for a year-over-year view, small enough to stay a
// few hundred KB for a cohort of ~35.
export const KEEP_SNAPSHOTS = 400

const SNAPSHOT_QUERY = `
  query snapshotUser($username: String!) {
    matchedUser(username: $username) {
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
    userContestRanking(username: $username) {
      rating
      attendedContestsCount
    }
  }
`

/**
 * Reduce one GraphQL response to the numbers kept per day, or null when
 * LeetCode does not know the user.
 * @returns {{solved:number,easy:number,medium:number,hard:number,rating:number|null,contests:number}|null}
 */
export function toSnapshotEntry(response) {
  const user = response?.data?.matchedUser
  if (!user) return null
  const counts = user.submitStatsGlobal?.acSubmissionNum ?? []
  const count = difficulty =>
    counts.find(row => row.difficulty === difficulty)?.count ?? 0
  const ranking = response.data.userContestRanking
  return {
    solved: count('All'),
    easy: count('Easy'),
    medium: count('Medium'),
    hard: count('Hard'),
    rating: ranking?.rating ? Math.round(ranking.rating) : null,
    contests: ranking?.attendedContestsCount ?? 0
  }
}

/**
 * Insert or replace the snapshot for its date, keep snapshots sorted oldest
 * first and trim to the newest `keep`. Re-running on the same day is safe.
 */
export function mergeSnapshot(history, snapshot, keep = KEEP_SNAPSHOTS) {
  const existing = Array.isArray(history?.snapshots) ? history.snapshots : []
  const snapshots = existing
    .filter(s => s.date !== snapshot.date)
    .concat(snapshot)
    .sort((a, b) => a.date.localeCompare(b.date))
  return { version: 1, snapshots: snapshots.slice(-keep) }
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function fetchEntry(username) {
  const response = await fetch(LEETCODE_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Referer: 'https://leetcode.com',
      'User-Agent': 'Mozilla/5.0 (compatible; LeetCodeAmongUs-snapshot)'
    },
    body: JSON.stringify({
      operationName: 'snapshotUser',
      variables: { username },
      query: SNAPSHOT_QUERY
    }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
  })
  if (!response.ok) throw new Error(`LeetCode responded ${response.status}`)
  return toSnapshotEntry(await response.json())
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectRun) {
  const args = process.argv.slice(2)
  const option = name => {
    const at = args.indexOf(name)
    return at === -1 ? undefined : args[at + 1]
  }
  const here = path.dirname(fileURLToPath(import.meta.url))
  const outPath = path.resolve(
    option('--out') ?? path.join(here, '..', 'data', 'history.json')
  )
  const limit = Number(option('--limit') ?? Infinity)
  const rosterPath = path.join(
    here,
    '..',
    'client',
    'src',
    'assets',
    'leetcoders_data.json'
  )

  const roster = JSON.parse(await readFile(rosterPath, 'utf8'))
  const usernames = [
    ...new Set(
      roster.map(entry => entry.userName?.trim().toLowerCase()).filter(Boolean)
    )
  ].slice(0, limit)

  const users = {}
  let failed = 0
  for (const username of usernames) {
    try {
      const entry = await fetchEntry(username)
      if (entry) {
        users[username] = entry
      } else {
        failed++
        console.error(`Skipped ${username}: no such LeetCode user`)
      }
    } catch (error) {
      failed++
      console.error(
        `Skipped ${username}:`,
        error instanceof Error ? error.message : String(error)
      )
    }
    await sleep(REQUEST_DELAY_MS)
  }

  const recorded = Object.keys(users).length
  if (recorded === 0) {
    // Do not write an empty day: it would show everyone as having gone to 0.
    console.error('No users recorded; LeetCode may be down. Nothing written.')
    process.exit(1)
  }

  let history = { version: 1, snapshots: [] }
  try {
    history = JSON.parse(await readFile(outPath, 'utf8'))
  } catch {
    // First run: start a new file.
  }

  const takenAt = new Date()
  const merged = mergeSnapshot(history, {
    date: takenAt.toISOString().slice(0, 10),
    takenAt: takenAt.toISOString(),
    users
  })
  await mkdir(path.dirname(outPath), { recursive: true })
  await writeFile(outPath, `${JSON.stringify(merged, null, 2)}\n`)
  console.log(
    `Snapshot ${merged.snapshots.at(-1).date}: ${recorded}/${usernames.length} users recorded, ${failed} skipped, ${merged.snapshots.length} day(s) in ${outPath}`
  )
}
