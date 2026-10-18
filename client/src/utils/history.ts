// Daily snapshots recorded by scripts/snapshot.mjs and served at
// GET /leetcode/history. Pure helpers so they can be unit tested.

export interface SnapshotEntry {
  solved: number
  easy: number
  medium: number
  hard: number
  rating: number | null
  contests: number
}

export interface Snapshot {
  date: string // YYYY-MM-DD (UTC)
  takenAt?: string
  users: Record<string, SnapshotEntry>
}

export interface History {
  snapshots: Snapshot[]
}

export interface Mover {
  userName: string
  solvedGained: number
  hardGained: number
  ratingChange: number | null
  solvedNow: number
}

export interface MoversResult {
  movers: Mover[]
  fromDate: string
  toDate: string
  days: number
}

export interface HistoryPoint {
  date: string
  solved: number
  rating: number | null
}

const DAY_MS = 24 * 60 * 60 * 1000

const toTime = (date: string): number => Date.parse(`${date}T00:00:00Z`)

/** Whole days between two YYYY-MM-DD dates. */
export const daysBetween = (from: string, to: string): number =>
  Math.round((toTime(to) - toTime(from)) / DAY_MS)

const sorted = (history: History | null | undefined): Snapshot[] =>
  [...(history?.snapshots ?? [])].sort((a, b) => a.date.localeCompare(b.date))

/**
 * Who solved the most since `windowDays` ago. Compares the latest snapshot
 * with the newest one at least `windowDays` older; while history is shorter
 * than the window it falls back to the oldest snapshot and reports the real
 * span in `days`. Returns null until there are two snapshots to compare.
 */
export function computeMovers(
  history: History | null | undefined,
  windowDays = 7,
  limit = 5
): MoversResult | null {
  const snapshots = sorted(history)
  if (snapshots.length < 2) return null

  const latest = snapshots[snapshots.length - 1]
  const older = snapshots.slice(0, -1)
  const base =
    [...older]
      .reverse()
      .find(s => daysBetween(s.date, latest.date) >= windowDays) ?? older[0]

  const movers: Mover[] = []
  for (const [userName, now] of Object.entries(latest.users)) {
    const then = base.users[userName]
    if (!then) continue
    const solvedGained = now.solved - then.solved
    const ratingChange =
      now.rating !== null && then.rating !== null
        ? now.rating - then.rating
        : null
    if (solvedGained <= 0 && !ratingChange) continue
    movers.push({
      userName,
      solvedGained,
      hardGained: now.hard - then.hard,
      ratingChange,
      solvedNow: now.solved
    })
  }

  movers.sort(
    (a, b) =>
      b.solvedGained - a.solvedGained ||
      (b.ratingChange ?? 0) - (a.ratingChange ?? 0) ||
      a.userName.localeCompare(b.userName)
  )

  return {
    movers: movers.slice(0, limit),
    fromDate: base.date,
    toDate: latest.date,
    days: daysBetween(base.date, latest.date)
  }
}

/** One user's solved count and rating per recorded day, oldest first. */
export function userHistory(
  history: History | null | undefined,
  userName: string
): HistoryPoint[] {
  const key = userName.toLowerCase()
  return sorted(history).flatMap(s => {
    const entry = Object.prototype.hasOwnProperty.call(s.users, key)
      ? s.users[key]
      : undefined
    return entry
      ? [{ date: s.date, solved: entry.solved, rating: entry.rating }]
      : []
  })
}
