import {
  contestRatingHistogramQuery,
  getStreakCounterQuery,
  globalDataQuery,
  questionOfTodayQuery,
  siteAnnouncementsQuery,
  currentTimestampQuery,
  getGlobalRankingsQuery,
  pastContestsQuery,
  problemsetQuestionListQuery,
  codingChallengeMedalQuery,
  languageStatsQuery,
  recentAcSubmissionsQuery,
  skillStatsQuery,
  userBadgesQuery,
  userContestRankingInfoQuery,
  userProblemsSolvedQuery,
  getUserProfileQuery,
  userPublicProfileQuery,
  userProfileCalendarQuery
} from './AllQueries'

const getApiBaseUrl = (): string => ''

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchGraphQLData = async (
  operationName: string,
  variables: Record<string, unknown>,
  query: string
): Promise<any> => {
  const response = await fetch(`${getApiBaseUrl()}/leetcode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ operationName, variables, query })
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const codingChallengeMedal = async (
  year: number,
  month: number
): Promise<any> => {
  const data = await fetchGraphQLData(
    'codingChallengeMedal',
    { year, month },
    codingChallengeMedalQuery
  )
  return data.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const contestRatingHistogram = async (): Promise<any> => {
  const data = await fetchGraphQLData(
    'contestRatingHistogram',
    {},
    contestRatingHistogramQuery
  )
  return data.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const currentTimestamp = async (): Promise<any> => {
  const data = await fetchGraphQLData(
    'currentTimestamp',
    {},
    currentTimestampQuery
  )
  return data.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getGlobalRankings = async (page: number): Promise<any> => {
  const data = await fetchGraphQLData(
    'getGlobalRankings',
    { page },
    getGlobalRankingsQuery
  )
  return data.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStreakCounter = async (): Promise<any> => {
  const data = await fetchGraphQLData(
    'streakCounter',
    {},
    getStreakCounterQuery
  )
  return data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalData = async (): Promise<any> => {
  const data = await fetchGraphQLData('globalData', {}, globalDataQuery)
  return data.data.globalData
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUserProfile = async (username: string): Promise<any> => {
  const data = await fetchGraphQLData(
    'getUserProfile',
    { username },
    getUserProfileQuery
  )
  return data.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const languageStats = async (username: string): Promise<any> => {
  const data = await fetchGraphQLData(
    'languageStats',
    { username },
    languageStatsQuery
  )
  return data.data.matchedUser
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pastContests = async (
  pageNo: number,
  numPerPage: number
): Promise<any> => {
  const data = await fetchGraphQLData(
    'pastContests',
    { pageNo, numPerPage },
    pastContestsQuery
  )
  return data.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const problemsetQuestionList = async (
  categorySlug: string,
  limit: number,
  skip: number,
  filters: Record<string, unknown>
): Promise<any> => {
  const data = await fetchGraphQLData(
    'problemsetQuestionList',
    { categorySlug, limit, skip, filters },
    problemsetQuestionListQuery
  )
  return data.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const questionOfToday = async (timestamp: number): Promise<any> => {
  const data = await fetchGraphQLData(
    'questionOfToday',
    { timestamp },
    questionOfTodayQuery
  )
  return data.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const recentAcSubmissions = async (
  username: string,
  limit: number
): Promise<any> => {
  const data = await fetchGraphQLData(
    'recentAcSubmissions',
    { username, limit },
    recentAcSubmissionsQuery
  )
  return data.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const siteAnnouncements = async (): Promise<any> => {
  const data = await fetchGraphQLData(
    'siteAnnouncements',
    {},
    siteAnnouncementsQuery
  )
  return data.data.siteAnnouncements
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const skillStats = async (username: string): Promise<any> => {
  const data = await fetchGraphQLData(
    'skillStats',
    { username },
    skillStatsQuery
  )
  return data.data.matchedUser
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userBadges = async (username: string): Promise<any> => {
  const data = await fetchGraphQLData(
    'userBadges',
    { username },
    userBadgesQuery
  )
  return data.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userContestRankingInfo = async (username: string): Promise<any> => {
  const data = await fetchGraphQLData(
    'userContestRankingInfo',
    { username },
    userContestRankingInfoQuery
  )
  return data.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userProblemsSolved = async (username: string): Promise<any> => {
  const data = await fetchGraphQLData(
    'userProblemsSolved',
    { username },
    userProblemsSolvedQuery
  )
  return data.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userProfileCalendar = async (
  username: string,
  year: number
): Promise<any> => {
  const data = await fetchGraphQLData(
    'userProfileCalendar',
    { username, year },
    userProfileCalendarQuery
  )
  return data.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userPublicProfile = async (username: string): Promise<any> => {
  const data = await fetchGraphQLData(
    'userPublicProfile',
    { username },
    userPublicProfileQuery
  )
  return data.data.matchedUser
}

export {
  codingChallengeMedal,
  contestRatingHistogram,
  currentTimestamp,
  getGlobalRankings,
  getStreakCounter,
  globalData,
  getUserProfile,
  languageStats,
  pastContests,
  problemsetQuestionList,
  questionOfToday,
  recentAcSubmissions,
  siteAnnouncements,
  skillStats,
  userBadges,
  userContestRankingInfo,
  userProblemsSolved,
  userProfileCalendar,
  userPublicProfile
}
