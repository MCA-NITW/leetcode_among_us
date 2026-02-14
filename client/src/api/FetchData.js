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
} from './AllQueries.js'

const getApiBaseUrl = () =>
  window.location.href.includes('localhost')
    ? 'http://localhost:3001'
    : 'https://leetcode-among-us.onrender.com'

const fetchGraphQLData = async (operationName, variables, query) => {
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

const codingChallengeMedal = async (year, month) => {
  const data = await fetchGraphQLData(
    'codingChallengeMedal',
    { year, month },
    codingChallengeMedalQuery
  )
  return data.data
}

const contestRatingHistogram = async () => {
  const data = await fetchGraphQLData(
    'contestRatingHistogram',
    {},
    contestRatingHistogramQuery
  )
  return data.data
}

const currentTimestamp = async () => {
  const data = await fetchGraphQLData(
    'currentTimestamp',
    {},
    currentTimestampQuery
  )
  return data.data
}

const getGlobalRankings = async page => {
  const data = await fetchGraphQLData(
    'getGlobalRankings',
    { page },
    getGlobalRankingsQuery
  )
  return data.data
}

const getStreakCounter = async () => {
  const data = await fetchGraphQLData(
    'streakCounter',
    {},
    getStreakCounterQuery
  )
  return data
}

const globalData = async () => {
  const data = await fetchGraphQLData('globalData', {}, globalDataQuery)
  return data.data.globalData
}

const getUserProfile = async username => {
  const data = await fetchGraphQLData(
    'getUserProfile',
    { username },
    getUserProfileQuery
  )
  return data.data
}

const languageStats = async username => {
  const data = await fetchGraphQLData(
    'languageStats',
    { username },
    languageStatsQuery
  )
  return data.data.matchedUser
}

const pastContests = async (pageNo, numPerPage) => {
  const data = await fetchGraphQLData(
    'pastContests',
    { pageNo, numPerPage },
    pastContestsQuery
  )
  return data.data
}

const problemsetQuestionList = async (categorySlug, limit, skip, filters) => {
  const data = await fetchGraphQLData(
    'problemsetQuestionList',
    { categorySlug, limit, skip, filters },
    problemsetQuestionListQuery
  )
  return data.data
}

const questionOfToday = async timestamp => {
  const data = await fetchGraphQLData(
    'questionOfToday',
    { timestamp },
    questionOfTodayQuery
  )
  return data.data
}

const recentAcSubmissions = async (username, limit) => {
  const data = await fetchGraphQLData(
    'recentAcSubmissions',
    { username, limit },
    recentAcSubmissionsQuery
  )
  return data.data
}

const siteAnnouncements = async () => {
  const data = await fetchGraphQLData(
    'siteAnnouncements',
    {},
    siteAnnouncementsQuery
  )
  return data.data.siteAnnouncements
}

const skillStats = async username => {
  const data = await fetchGraphQLData(
    'skillStats',
    { username },
    skillStatsQuery
  )
  return data.data.matchedUser
}

const userBadges = async username => {
  const data = await fetchGraphQLData(
    'userBadges',
    { username },
    userBadgesQuery
  )
  return data.data
}

const userContestRankingInfo = async username => {
  const data = await fetchGraphQLData(
    'userContestRankingInfo',
    { username },
    userContestRankingInfoQuery
  )
  return data.data
}

const userProblemsSolved = async username => {
  const data = await fetchGraphQLData(
    'userProblemsSolved',
    { username },
    userProblemsSolvedQuery
  )
  return data.data
}

const userProfileCalendar = async (username, year) => {
  const data = await fetchGraphQLData(
    'userProfileCalendar',
    { username, year },
    userProfileCalendarQuery
  )
  return data.data
}

const userPublicProfile = async username => {
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
