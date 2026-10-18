import { describe, expect, it } from 'vitest'
import { mergeSnapshot, toSnapshotEntry } from '../scripts/snapshot.mjs'

describe('toSnapshotEntry', () => {
  it('keeps solved counts, rounded rating and contest count', () => {
    const entry = toSnapshotEntry({
      data: {
        matchedUser: {
          submitStatsGlobal: {
            acSubmissionNum: [
              { difficulty: 'All', count: 120 },
              { difficulty: 'Easy', count: 60 },
              { difficulty: 'Medium', count: 50 },
              { difficulty: 'Hard', count: 10 }
            ]
          }
        },
        userContestRanking: { rating: 1612.7, attendedContestsCount: 9 }
      }
    })
    expect(entry).toEqual({
      solved: 120,
      easy: 60,
      medium: 50,
      hard: 10,
      rating: 1613,
      contests: 9
    })
  })

  it('records an unrated user with a null rating', () => {
    const entry = toSnapshotEntry({
      data: { matchedUser: {}, userContestRanking: null }
    })
    expect(entry).toEqual({
      solved: 0,
      easy: 0,
      medium: 0,
      hard: 0,
      rating: null,
      contests: 0
    })
  })

  it('returns null for an unknown user', () => {
    expect(toSnapshotEntry({ data: { matchedUser: null } })).toBeNull()
    expect(toSnapshotEntry(undefined)).toBeNull()
  })
})

describe('mergeSnapshot', () => {
  const day = (date: string, solved = 1) => ({
    date,
    users: {
      a: { solved, easy: 0, medium: 0, hard: 0, rating: null, contests: 0 }
    }
  })

  it('starts a history from nothing', () => {
    expect(mergeSnapshot(undefined, day('2026-10-18'))).toEqual({
      version: 1,
      snapshots: [day('2026-10-18')]
    })
  })

  it('replaces a same-day re-run and keeps dates sorted', () => {
    const history = { snapshots: [day('2026-10-18', 1), day('2026-10-16')] }
    const merged = mergeSnapshot(history, day('2026-10-18', 5))
    expect(merged.snapshots.map(s => s.date)).toEqual([
      '2026-10-16',
      '2026-10-18'
    ])
    expect(merged.snapshots[1].users.a.solved).toBe(5)
  })

  it('trims to the newest snapshots', () => {
    const history = {
      snapshots: [day('2026-10-15'), day('2026-10-16'), day('2026-10-17')]
    }
    const merged = mergeSnapshot(history, day('2026-10-18'), 2)
    expect(merged.snapshots.map(s => s.date)).toEqual([
      '2026-10-17',
      '2026-10-18'
    ])
  })
})
