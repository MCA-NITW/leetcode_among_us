// Optimized fetch functions that use the new parallel backend endpoints

import type { LeetcoderEntry, UserData, ContestEntry } from '../types'

interface BackendUserData {
  userPublicProfile: { data: { matchedUser: Record<string, unknown> } }
  userContestRankingInfo: {
    data: {
      userContestRanking: Record<string, unknown> | null
      userContestRankingHistory: ContestEntry[]
    }
  }
  userProblemsSolved: { data: Record<string, unknown> }
  userBadges: {
    data: {
      matchedUser: {
        badges: Array<Record<string, unknown>>
        upcomingBadges: Array<Record<string, unknown>>
      }
    }
  }
  skillStats: {
    data: { matchedUser: { tagProblemCounts: Record<string, unknown> } }
  }
  calendarData: {
    totalActiveDays: number
    bestStreak: number
    submissionCalendar: Record<string, number>
    activeYears: number[]
  }
}

interface BatchResult {
  success: boolean
  data?: BackendUserData
}

const getApiBaseUrl = (): string => import.meta.env.VITE_API_URL || ''

const LEETCODE_ORIGIN = 'https://leetcode.com'

/**
 * LeetCode returns most asset URLs absolute (assets.leetcode.com) but Daily
 * Coding Challenge badge icons arrive as site-relative paths such as
 * "/static/images/badges/dcc-2025-1.png". Rendered as-is they resolve against
 * this app's origin and 404. Prefix them with the LeetCode origin.
 */
export const resolveLeetCodeAsset = (
  url: string | null | undefined
): string => {
  if (!url) return ''
  if (url.startsWith('/')) return `${LEETCODE_ORIGIN}${url}`
  return url
}

type RawBadge = Record<string, unknown> & {
  icon?: string | null
  medal?: { config?: { iconGif?: string | null } } | null
}

const normaliseBadge = <T extends RawBadge>(badge: T): T => {
  const medalGif = badge.medal?.config?.iconGif
  return {
    ...badge,
    icon: resolveLeetCodeAsset(badge.icon),
    medal: medalGif
      ? {
          ...badge.medal,
          config: {
            ...badge.medal?.config,
            iconGif: resolveLeetCodeAsset(medalGif)
          }
        }
      : badge.medal
  }
}

/** True when the backend reports that LeetCode has no such user. */
export const isUserNotFound = (backendData: unknown): boolean => {
  const data = backendData as
    | { userPublicProfile?: { data?: { matchedUser?: unknown } } | null }
    | null
    | undefined
  return !data?.userPublicProfile?.data?.matchedUser
}

// Optimized single user data fetch using the new backend endpoint
export const fetchOptimizedUserData = async (
  username: string
): Promise<BackendUserData> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/leetcode/user-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    })

    if (!response.ok) {
      throw new Error('HTTP error! status: ' + response.status)
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error(`Error fetching optimized data for ${username}:`, error)
    throw error
  }
}

// Batch fetch for multiple users
export const fetchBatchUserData = async (
  usernames: string[]
): Promise<BatchResult[]> => {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/leetcode/batch-user-data`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernames })
      }
    )

    if (!response.ok) {
      throw new Error('HTTP error! status: ' + response.status)
    }

    const result = await response.json()
    return result.results
  } catch (error) {
    console.error('Error fetching batch user data:', error)
    throw error
  }
}

// Helper function to process the backend response into the format expected by the frontend
export const processUserDataResponse = (
  leetcoder: Partial<LeetcoderEntry>,
  backendData: BackendUserData
): Partial<UserData> => {
  if (isUserNotFound(backendData)) {
    return leetcoder
  }

  try {
    const {
      userPublicProfile,
      userContestRankingInfo,
      userProblemsSolved,
      userBadges,
      skillStats,
      calendarData
    } = backendData

    /* Upstream GraphQL payloads are loosely typed; casts are contained here. */
    const publicProfile = userPublicProfile.data.matchedUser as any
    const contestRanking = userContestRankingInfo.data.userContestRanking as any
    const contestHistory =
      userContestRankingInfo.data.userContestRankingHistory || []
    const problemsData = userProblemsSolved.data as any
    const badges = ((userBadges.data.matchedUser as any)?.badges || []).map(
      normaliseBadge
    )
    const upcomingBadges = (
      (userBadges.data.matchedUser as any)?.upcomingBadges || []
    ).map(normaliseBadge)
    const contestBadge = publicProfile?.contestBadge
      ? {
          ...publicProfile.contestBadge,
          icon: resolveLeetCodeAsset(publicProfile.contestBadge.icon)
        }
      : null
    const beatsStats = problemsData.matchedUser?.problemsSolvedBeatsStats || []

    // Helper functions
    const getProblemsSolvedCount = (difficulty: string): number =>
      problemsData.matchedUser?.submitStatsGlobal?.acSubmissionNum?.find(
        (problem: { difficulty: string; count: number }) =>
          problem.difficulty === difficulty
      )?.count || 0

    const getTotalQuestionsCount = (difficulty: string): number =>
      problemsData.allQuestionsCount?.find(
        (problem: { difficulty: string; count: number }) =>
          problem.difficulty === difficulty
      )?.count || 0

    const getAverageContestRanking = (history: ContestEntry[]): number => {
      let totalRanking = 0,
        totalContest = 0
      history.forEach(contest => {
        if (contest.attended === true) {
          totalRanking += contest.ranking
          totalContest += 1
        }
      })
      return totalContest === 0
        ? Infinity
        : Math.round(totalRanking / totalContest)
    }

    const getMostQuestionsInContest = (
      history: ContestEntry[],
      question: number
    ): number => {
      return history.filter(
        contest =>
          contest.problemsSolved === question && contest.attended === true
      ).length
    }

    const getBestContestRank = (history: ContestEntry[]): number => {
      let bestRank = Infinity
      history.forEach(contest => {
        if (contest.ranking < bestRank && contest.ranking !== 0) {
          bestRank = contest.ranking
        }
      })
      return bestRank
    }

    return {
      ...leetcoder,
      name: publicProfile.profile?.realName || leetcoder.name || '',
      avatar: publicProfile.profile?.userAvatar || '',
      aboutMe: publicProfile.profile?.aboutMe || '',
      country: publicProfile.profile?.countryName || '',
      company: publicProfile.profile?.company || '',
      jobTitle: publicProfile.profile?.jobTitle || '',
      school: publicProfile.profile?.school || '',
      websites: publicProfile.profile?.websites || [],
      skillTags: publicProfile.profile?.skillTags || [],
      starRating: publicProfile.profile?.starRating || undefined,
      githubUrl: publicProfile?.githubUrl || '',
      linkedinUrl: publicProfile?.linkedinUrl || '',
      twitterUrl: publicProfile?.twitterUrl || '',
      contestBadge: contestBadge,
      upcomingBadges: upcomingBadges,
      beatsStats: beatsStats,
      globalContestRating: contestRanking?.rating
        ? Math.round(contestRanking.rating)
        : 0,
      globalContestRanking: contestRanking?.globalRanking || Infinity,
      easySolved: getProblemsSolvedCount('Easy'),
      mediumSolved: getProblemsSolvedCount('Medium'),
      hardSolved: getProblemsSolvedCount('Hard'),
      totalSolved: getProblemsSolvedCount('All'),
      totalEasy: getTotalQuestionsCount('Easy'),
      totalMedium: getTotalQuestionsCount('Medium'),
      totalHard: getTotalQuestionsCount('Hard'),
      totalQuestions: getTotalQuestionsCount('All'),
      reputation: publicProfile.profile?.reputation || 0,
      questionRanking: publicProfile.profile?.ranking || Infinity,
      contestTopPercentage: contestRanking?.topPercentage
        ? Math.round(contestRanking.topPercentage)
        : 100,
      totalParticipants: contestRanking?.totalParticipants || 100000,
      attendedContestCount: contestRanking?.attendedContestsCount || 0,
      contestHistory: contestHistory,
      badges: badges,
      badgeCount: badges.length,
      bestContestRank: getBestContestRank(contestHistory),
      mostFourQuestionsInContest: getMostQuestionsInContest(contestHistory, 4),
      mostThreeQuestionsInContest: getMostQuestionsInContest(contestHistory, 3),
      mostTwoQuestionsInContest: getMostQuestionsInContest(contestHistory, 2),
      mostOneQuestionsInContest: getMostQuestionsInContest(contestHistory, 1),
      mostZeroQuestionsInContest: getMostQuestionsInContest(contestHistory, 0),
      averageContestRanking: getAverageContestRanking(contestHistory),
      totalActiveDays: calendarData?.totalActiveDays || 0,
      bestStreak: calendarData?.bestStreak || 0,
      submissionCalendar: calendarData?.submissionCalendar || {},
      activeYears: calendarData?.activeYears || [],
      acSubmissionNum:
        problemsData.matchedUser?.submitStatsGlobal?.acSubmissionNum || [],
      tagProblemCounts:
        (skillStats as any)?.data?.matchedUser?.tagProblemCounts || undefined
    } as Partial<UserData>
  } catch (error) {
    console.error('Error processing user data:', error)
    return leetcoder
  }
}
