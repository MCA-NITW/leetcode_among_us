import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  computeDaysSinceLastContest,
  computeDccProgress,
  computeRatingDelta,
  computeStreaks,
  computeTopLanguage,
  computeTopTopic,
  enrichUser
} from '../src/utils/derivedStats'
import type { ContestEntry, TagProblemCounts } from '../src/types'

// Saturday 2026-01-10, midday UTC. Every clock-dependent assertion below is
// relative to this instant.
const NOW = '2026-01-10T12:00:00Z'

/** Unix seconds at UTC midnight, the key format LeetCode's calendar uses. */
const day = (iso: string): number => Date.parse(`${iso}T00:00:00Z`) / 1000

/** A calendar with one accepted submission on each listed date. */
const calendar = (...dates: string[]): Record<string, number> =>
  Object.fromEntries(dates.map(date => [String(day(date)), 1]))

const contest = (
  startIso: string,
  rating: number,
  attended = true,
  title = `Weekly Contest ${startIso}`
): ContestEntry => ({
  attended,
  problemsSolved: 2,
  totalProblems: 4,
  finishTimeInSeconds: 3600,
  rating,
  ranking: 1000,
  contest: { title, startTime: day(startIso) }
})

const tag = (tagName: string, problemsSolved: number) => ({
  tagName,
  tagSlug: tagName.toLowerCase(),
  problemsSolved
})

const freezeClock = () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(NOW))
  })
  afterEach(() => {
    vi.useRealTimers()
  })
}

describe('computeStreaks', () => {
  freezeClock()

  it('is zero for a missing or empty calendar', () => {
    expect(computeStreaks(undefined)).toEqual({ current: 0, best: 0 })
    expect(computeStreaks({})).toEqual({ current: 0, best: 0 })
  })

  it('ignores days with zero submissions', () => {
    const cal = {
      ...calendar('2026-01-08', '2026-01-09', '2026-01-10'),
      [String(day('2026-01-07'))]: 0
    }
    expect(computeStreaks(cal)).toEqual({ current: 3, best: 3 })
  })

  it('keeps one streak across the new year', () => {
    // Dec 28 to Jan 5 is nine days. A per-year maximum sees 4 and 5 and
    // reports 5, which is the undercount the server used to ship.
    const cal = calendar(
      '2025-12-28',
      '2025-12-29',
      '2025-12-30',
      '2025-12-31',
      '2026-01-01',
      '2026-01-02',
      '2026-01-03',
      '2026-01-04',
      '2026-01-05'
    )
    expect(computeStreaks(cal).best).toBe(9)
  })

  it('keeps the current streak alive until a full day is missed', () => {
    // Nothing solved yet today, yesterday was: still going.
    expect(
      computeStreaks(calendar('2026-01-07', '2026-01-08', '2026-01-09')).current
    ).toBe(3)
    // Solved today as well.
    expect(computeStreaks(calendar('2026-01-09', '2026-01-10')).current).toBe(2)
    // Yesterday missed: current resets, best is kept.
    expect(
      computeStreaks(calendar('2026-01-06', '2026-01-07', '2026-01-08'))
    ).toEqual({ current: 0, best: 3 })
  })

  it('counts a day once however many timestamps land in it', () => {
    const noon = day('2026-01-10') + 12 * 3600
    const cal = {
      [String(day('2026-01-09'))]: 2,
      [String(day('2026-01-10'))]: 1,
      [String(noon)]: 4
    }
    expect(computeStreaks(cal)).toEqual({ current: 2, best: 2 })
  })

  it('separates runs that have a gap between them', () => {
    const cal = calendar(
      '2026-01-01',
      '2026-01-02',
      '2026-01-03',
      '2026-01-05',
      '2026-01-10'
    )
    expect(computeStreaks(cal)).toEqual({ current: 1, best: 3 })
  })
})

describe('computeRatingDelta', () => {
  it('is zero with fewer than two attended contests', () => {
    expect(computeRatingDelta(undefined)).toBe(0)
    expect(computeRatingDelta([])).toBe(0)
    expect(computeRatingDelta([contest('2026-01-03', 1500)])).toBe(0)
    expect(
      computeRatingDelta([
        contest('2026-01-03', 1500),
        contest('2026-01-10', 1600, false)
      ])
    ).toBe(0)
  })

  it('is the rounded change between the two latest attended contests', () => {
    // Out of order on purpose, and the newest entry was not attended.
    const history = [
      contest('2026-01-10', 1540.6),
      contest('2026-01-01', 1500),
      contest('2026-01-05', 1520.2),
      contest('2026-01-12', 1700, false)
    ]
    expect(computeRatingDelta(history)).toBe(20)
  })

  it('is negative after a drop', () => {
    expect(
      computeRatingDelta([
        contest('2026-01-01', 1600),
        contest('2026-01-08', 1570)
      ])
    ).toBe(-30)
  })
})

describe('computeDaysSinceLastContest', () => {
  freezeClock()

  it('is Infinity with no attended contest', () => {
    const none = { days: Number.POSITIVE_INFINITY, title: '' }
    expect(computeDaysSinceLastContest(undefined)).toEqual(none)
    expect(computeDaysSinceLastContest([])).toEqual(none)
    expect(
      computeDaysSinceLastContest([contest('2026-01-03', 1500, false)])
    ).toEqual(none)
  })

  it('counts whole days since the latest attended contest', () => {
    const history = [
      contest('2026-01-03', 1500, true, 'Weekly 1'),
      contest('2026-01-07', 1510, true, 'Weekly 2'),
      contest('2026-01-09', 1600, false, 'Weekly 3')
    ]
    expect(computeDaysSinceLastContest(history)).toEqual({
      days: 3,
      title: 'Weekly 2'
    })
  })

  it('never goes negative for a contest that has not started', () => {
    expect(
      computeDaysSinceLastContest([contest('2026-01-20', 1500)]).days
    ).toBe(0)
  })
})

describe('computeTopTopic', () => {
  it('is empty without tag data', () => {
    expect(computeTopTopic(undefined)).toEqual({ name: '', count: 0 })
    expect(computeTopTopic({})).toEqual({ name: '', count: 0 })
  })

  it('picks the most solved tag across every tier', () => {
    const tags: TagProblemCounts = {
      fundamental: [tag('Array', 300), tag('String', 120)],
      intermediate: [tag('Hash Table', 90)],
      advanced: [tag('Dynamic Programming', 110)]
    }
    expect(computeTopTopic(tags)).toEqual({ name: 'Array', count: 300 })
  })

  it('breaks ties toward the higher tier', () => {
    const threeWay: TagProblemCounts = {
      fundamental: [tag('Array', 100)],
      intermediate: [tag('Hash Table', 100)],
      advanced: [tag('Dynamic Programming', 100)]
    }
    expect(computeTopTopic(threeWay).name).toBe('Dynamic Programming')

    const twoWay: TagProblemCounts = {
      fundamental: [tag('Array', 50)],
      intermediate: [tag('Tree', 50)]
    }
    expect(computeTopTopic(twoWay).name).toBe('Tree')
  })
})

describe('computeTopLanguage', () => {
  it('is empty without language data', () => {
    const none = { name: '', count: 0, total: 0 }
    expect(computeTopLanguage(undefined)).toEqual(none)
    expect(computeTopLanguage([])).toEqual(none)
  })

  it('picks the most used language and counts how many were used', () => {
    const languages = [
      { languageName: 'Python3', problemsSolved: 30 },
      { languageName: 'C++', problemsSolved: 1294 },
      { languageName: 'MySQL', problemsSolved: 3 }
    ]
    expect(computeTopLanguage(languages)).toEqual({
      name: 'C++',
      count: 1294,
      total: 3
    })
  })

  it('names no top language when nothing has been solved', () => {
    expect(
      computeTopLanguage([{ languageName: 'Java', problemsSolved: 0 }])
    ).toEqual({ name: '', count: 0, total: 1 })
  })
})

describe('computeDccProgress', () => {
  const upcoming = [
    { name: 'Sep LeetCoding Challenge', progress: 56 },
    { name: 'Oct LeetCoding Challenge', progress: 0 },
    { name: 'Nov LeetCoding Challenge', progress: 0 }
  ]

  it('reports the first month that has any progress', () => {
    expect(computeDccProgress(upcoming)).toEqual({
      progress: 56,
      label: 'Sep LeetCoding Challenge'
    })
    expect(
      computeDccProgress([
        { name: 'Oct', progress: 0 },
        { name: 'Nov', progress: 12 }
      ])
    ).toEqual({ progress: 12, label: 'Nov' })
  })

  it('falls back to the first listed month at zero progress', () => {
    const untouched = upcoming.map(badge => ({ ...badge, progress: 0 }))
    expect(computeDccProgress(untouched)).toEqual({
      progress: 0,
      label: 'Sep LeetCoding Challenge'
    })
    expect(computeDccProgress([{ name: 'Oct' }])).toEqual({
      progress: 0,
      label: 'Oct'
    })
  })

  it('is empty without badge data', () => {
    expect(computeDccProgress(undefined)).toEqual({ progress: 0, label: '' })
    expect(computeDccProgress([])).toEqual({ progress: 0, label: '' })
  })
})

describe('enrichUser', () => {
  freezeClock()

  it('avoids divide-by-zero when totals are missing', () => {
    const user = enrichUser({
      userName: 'new',
      totalSolved: 0,
      totalQuestions: 0
    })
    expect(user.completionPct).toBe(0)
    expect(user.acceptanceRate).toBe(0)
    expect(user.totalSubmissions).toBe(0)
    expect(user.ratingDelta).toBe(0)
    expect(user.yearsActive).toBe(0)
    expect(user.languageCount).toBe(0)
    expect(user.hoursSinceLastSolve).toBe(Number.POSITIVE_INFINITY)
    expect(user.daysSinceLastContest).toBe(Number.POSITIVE_INFINITY)
  })

  it('derives percentages from the All bucket', () => {
    const user = enrichUser({
      totalSolved: 250,
      totalQuestions: 1000,
      acSubmissionNum: [
        { difficulty: 'All', count: 250, submissions: 500 },
        { difficulty: 'Easy', count: 100, submissions: 150 }
      ],
      beatsStats: [
        { difficulty: 'Easy', percentage: 90.123 },
        { difficulty: 'Medium', percentage: 75.5 }
      ]
    })
    expect(user.completionPct).toBe(25)
    expect(user.acceptanceRate).toBe(50)
    expect(user.totalSubmissions).toBe(500)
    expect(user.beatsMedium).toBe(75.5)
    expect(user.beatsLabel).toBe('Beats Easy 90.1% / Medium 75.5% / Hard 0.0%')
  })

  it('takes the larger of the calendar streak and the server streak', () => {
    const cal = calendar('2026-01-08', '2026-01-09', '2026-01-10')
    expect(
      enrichUser({ submissionCalendar: cal, bestStreak: 40 }).trueBestStreak
    ).toBe(40)
    expect(
      enrichUser({ submissionCalendar: cal, bestStreak: 2 }).trueBestStreak
    ).toBe(3)
    expect(enrichUser({ submissionCalendar: cal }).currentStreak).toBe(3)
  })

  it('measures hours since the last accepted submission', () => {
    const twoHoursAgo = Date.parse(NOW) / 1000 - 2 * 3600
    const user = enrichUser({
      lastSolved: {
        title: 'Two Sum',
        titleSlug: 'two-sum',
        timestamp: twoHoursAgo
      }
    })
    expect(user.hoursSinceLastSolve).toBeCloseTo(2)
    expect(user.lastSolvedTitle).toBe('Two Sum')
  })

  it('keeps every original field on the row', () => {
    const user = enrichUser({ userName: 'alice', name: 'Alice', batch: '2024' })
    expect(user).toMatchObject({
      userName: 'alice',
      name: 'Alice',
      batch: '2024'
    })
  })
})
