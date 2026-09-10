import { describe, expect, it } from 'vitest'
import {
  isUserNotFound,
  processUserDataResponse,
  resolveLeetCodeAsset
} from '../src/api/OptimizedFetchData'

const backendFixture = (overrides: Record<string, unknown> = {}) =>
  ({
    userPublicProfile: {
      data: {
        matchedUser: {
          username: 'alice',
          githubUrl: 'https://github.com/alice',
          contestBadge: {
            name: 'Knight',
            icon: '/static/images/badges/knight.png'
          },
          profile: {
            realName: 'Alice',
            userAvatar: 'https://assets.leetcode.com/users/avatars/a.png',
            ranking: 4321,
            reputation: 12
          }
        }
      }
    },
    userContestRankingInfo: {
      data: {
        userContestRanking: {
          rating: 1650.4,
          globalRanking: 9000,
          topPercentage: 12.34,
          totalParticipants: 500000,
          attendedContestsCount: 3
        },
        userContestRankingHistory: [
          {
            attended: true,
            problemsSolved: 2,
            totalProblems: 4,
            finishTimeInSeconds: 1,
            rating: 1500,
            ranking: 3000
          },
          {
            attended: false,
            problemsSolved: 0,
            totalProblems: 4,
            finishTimeInSeconds: 0,
            rating: 1500,
            ranking: 0
          },
          {
            attended: true,
            problemsSolved: 4,
            totalProblems: 4,
            finishTimeInSeconds: 1,
            rating: 1650,
            ranking: 1000
          }
        ]
      }
    },
    userProblemsSolved: {
      data: {
        allQuestionsCount: [
          { difficulty: 'All', count: 3000 },
          { difficulty: 'Easy', count: 800 }
        ],
        matchedUser: {
          problemsSolvedBeatsStats: [{ difficulty: 'Easy', percentage: 90 }],
          submitStatsGlobal: {
            acSubmissionNum: [
              { difficulty: 'All', count: 250, submissions: 400 },
              { difficulty: 'Easy', count: 150, submissions: 200 }
            ]
          }
        }
      }
    },
    userBadges: {
      data: {
        matchedUser: {
          badges: [
            {
              id: '1',
              name: 'DCC',
              icon: '/static/images/badges/dcc-2025-1.png',
              medal: {
                slug: 'dcc',
                config: { iconGif: '/static/images/badges/dcc.gif' }
              }
            },
            {
              id: '2',
              name: '100 Days',
              icon: 'https://assets.leetcode.com/static_assets/marketing/lg100.png',
              medal: null
            }
          ],
          upcomingBadges: [
            { name: 'Next', icon: '/static/images/badges/next.png' }
          ]
        }
      }
    },
    skillStats: {
      data: { matchedUser: { tagProblemCounts: { advanced: [] } } }
    },
    calendarData: {
      totalActiveDays: 42,
      bestStreak: 7,
      submissionCalendar: { '1735689600': 2 },
      activeYears: [2024, 2025]
    },
    ...overrides
  }) as never

describe('resolveLeetCodeAsset', () => {
  it('prefixes site-relative paths with the LeetCode origin', () => {
    expect(resolveLeetCodeAsset('/static/images/badges/dcc-2025-1.png')).toBe(
      'https://leetcode.com/static/images/badges/dcc-2025-1.png'
    )
  })

  it('leaves absolute URLs untouched and empties nullish input', () => {
    const abs = 'https://assets.leetcode.com/static_assets/marketing/lg1k.png'
    expect(resolveLeetCodeAsset(abs)).toBe(abs)
    expect(resolveLeetCodeAsset(null)).toBe('')
    expect(resolveLeetCodeAsset(undefined)).toBe('')
  })
})

describe('isUserNotFound', () => {
  it('is true when matchedUser is missing or the payload is malformed', () => {
    expect(
      isUserNotFound({ userPublicProfile: { data: { matchedUser: null } } })
    ).toBe(true)
    expect(isUserNotFound({})).toBe(true)
    expect(isUserNotFound(undefined)).toBe(true)
  })

  it('is false for a real profile', () => {
    expect(isUserNotFound(backendFixture())).toBe(false)
  })
})

describe('processUserDataResponse', () => {
  it('returns the input entry untouched when the user does not exist', () => {
    const entry = { userName: 'ghost', name: 'Ghost' }
    const result = processUserDataResponse(
      entry,
      backendFixture({ userPublicProfile: { data: { matchedUser: null } } })
    )
    expect(result).toBe(entry)
    expect(result.totalSolved).toBeUndefined()
  })

  it('maps problem, contest and calendar figures', () => {
    const result = processUserDataResponse(
      { userName: 'alice' },
      backendFixture()
    )
    expect(result.name).toBe('Alice')
    expect(result.totalSolved).toBe(250)
    expect(result.easySolved).toBe(150)
    expect(result.totalQuestions).toBe(3000)
    expect(result.globalContestRating).toBe(1650)
    expect(result.globalContestRanking).toBe(9000)
    expect(result.contestTopPercentage).toBe(12)
    expect(result.attendedContestCount).toBe(3)
    expect(result.questionRanking).toBe(4321)
    expect(result.bestStreak).toBe(7)
    expect(result.totalActiveDays).toBe(42)
    expect(result.activeYears).toEqual([2024, 2025])
  })

  it('derives contest aggregates from attended entries only', () => {
    const result = processUserDataResponse(
      { userName: 'alice' },
      backendFixture()
    )
    expect(result.bestContestRank).toBe(1000)
    expect(result.averageContestRanking).toBe(2000)
    expect(result.mostFourQuestionsInContest).toBe(1)
    expect(result.mostTwoQuestionsInContest).toBe(1)
    expect(result.mostZeroQuestionsInContest).toBe(0)
  })

  it('normalises relative badge, medal and contest-badge icons', () => {
    const result = processUserDataResponse(
      { userName: 'alice' },
      backendFixture()
    )
    expect(result.badges?.[0].icon).toBe(
      'https://leetcode.com/static/images/badges/dcc-2025-1.png'
    )
    expect(result.badges?.[0].medal?.config?.iconGif).toBe(
      'https://leetcode.com/static/images/badges/dcc.gif'
    )
    expect(result.badges?.[1].icon).toBe(
      'https://assets.leetcode.com/static_assets/marketing/lg100.png'
    )
    expect(result.badges?.[1].medal).toBeNull()
    expect(result.upcomingBadges?.[0].icon).toBe(
      'https://leetcode.com/static/images/badges/next.png'
    )
    expect(result.contestBadge?.icon).toBe(
      'https://leetcode.com/static/images/badges/knight.png'
    )
    expect(result.badgeCount).toBe(2)
  })

  it('uses Infinity placeholders for missing rankings so UIs can guard on them', () => {
    const result = processUserDataResponse(
      { userName: 'alice' },
      backendFixture({
        userContestRankingInfo: {
          data: { userContestRanking: null, userContestRankingHistory: [] }
        }
      })
    )
    expect(result.globalContestRanking).toBe(Infinity)
    expect(result.bestContestRank).toBe(Infinity)
    expect(result.averageContestRanking).toBe(Infinity)
    expect(result.globalContestRating).toBe(0)
    expect(result.attendedContestCount).toBe(0)
  })
})
