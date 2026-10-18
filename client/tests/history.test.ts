import { describe, expect, it } from 'vitest'
import { computeMovers, daysBetween, userHistory } from '../src/utils/history'
import type { History, SnapshotEntry } from '../src/utils/history'

const entry = (
  solved: number,
  rating: number | null = null,
  hard = 0
): SnapshotEntry => ({
  solved,
  easy: 0,
  medium: 0,
  hard,
  rating,
  contests: 0
})

const history: History = {
  snapshots: [
    { date: '2026-10-01', users: { ann: entry(100, 1500), bob: entry(50) } },
    {
      date: '2026-10-10',
      users: { ann: entry(110, 1520, 2), bob: entry(60), cat: entry(5) }
    },
    {
      date: '2026-10-17',
      users: { ann: entry(112, 1490, 3), bob: entry(80), cat: entry(9) }
    },
    // Out of order on purpose: helpers must sort by date.
    { date: '2026-10-03', users: { ann: entry(101, 1500), bob: entry(50) } }
  ]
}

describe('daysBetween', () => {
  it('counts whole UTC days', () => {
    expect(daysBetween('2026-10-10', '2026-10-17')).toBe(7)
    expect(daysBetween('2026-12-31', '2027-01-01')).toBe(1)
  })
})

describe('computeMovers', () => {
  it('needs two snapshots', () => {
    expect(computeMovers(null)).toBeNull()
    expect(computeMovers({ snapshots: [history.snapshots[0]] })).toBeNull()
  })

  it('compares with the newest snapshot a full week back', () => {
    const result = computeMovers(history)!
    expect(result.fromDate).toBe('2026-10-10')
    expect(result.toDate).toBe('2026-10-17')
    expect(result.days).toBe(7)
    expect(result.movers.map(m => m.userName)).toEqual(['bob', 'cat', 'ann'])
    expect(result.movers[0]).toMatchObject({
      solvedGained: 20,
      solvedNow: 80,
      ratingChange: null
    })
    expect(result.movers[2]).toMatchObject({
      solvedGained: 2,
      hardGained: 1,
      ratingChange: -30
    })
  })

  it('falls back to the oldest snapshot while history is short', () => {
    const short: History = { snapshots: history.snapshots.slice(0, 1) }
    short.snapshots.push(history.snapshots[3])
    const result = computeMovers(short)!
    expect(result.days).toBe(2)
    expect(result.movers).toHaveLength(1)
    expect(result.movers[0].userName).toBe('ann')
  })

  it('skips users who did nothing and caps the list', () => {
    const result = computeMovers(history, 7, 1)!
    expect(result.movers).toHaveLength(1)
    const idle: History = {
      snapshots: [
        { date: '2026-10-01', users: { ann: entry(5, 1400) } },
        { date: '2026-10-08', users: { ann: entry(5, 1400) } }
      ]
    }
    expect(computeMovers(idle)!.movers).toEqual([])
  })
})

describe('userHistory', () => {
  it('returns one point per recorded day, oldest first, case-insensitively', () => {
    expect(userHistory(history, 'Bob')).toEqual([
      { date: '2026-10-01', solved: 50, rating: null },
      { date: '2026-10-03', solved: 50, rating: null },
      { date: '2026-10-10', solved: 60, rating: null },
      { date: '2026-10-17', solved: 80, rating: null }
    ])
    expect(userHistory(history, 'cat')).toHaveLength(2)
    expect(userHistory(history, 'nobody')).toEqual([])
  })
})
