import {
  globalDataQuery,
  siteAnnouncementsQuery,
  userPublicProfileQuery,
  languageStatsQuery,
  skillStatsQuery,
  userContestRankingInfoQuery,
  userProblemsSolvedQuery,
  userBadgesQuery,
  userProfileCalendarQuery,
  recentAcSubmissionsQuery,
  getStreakCounterQuery,
  currentTimestampQuery,
  questionOfTodayQuery,
  codingChallengeMedalQuery,
  getUserProfileQuery,
} from "./GraphQLQueries.js";

const fetchGraphQLData = async (operationName, variables, query) => {
  const response = await fetch("http://localhost:3001/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrftoken": "undefined",
    },
    body: JSON.stringify({ operationName, variables, query }),
  });
  return response.json();
};

const userPublicProfile = async (username) => {
  const data = await fetchGraphQLData(
    "userPublicProfile",
    { username },
    userPublicProfileQuery,
  );
  return data.data.matchedUser;
};

const globalData = async () => {
  const data = await fetchGraphQLData("globalData", {}, globalDataQuery);
  return data.data.globalData;
};

const siteAnnouncements = async () => {
  const data = await fetchGraphQLData(
    "siteAnnouncements",
    {},
    siteAnnouncementsQuery,
  );
  return data.data.siteAnnouncements;
};

const languageStats = async (username) => {
  const data = await fetchGraphQLData(
    "languageStats",
    { username },
    languageStatsQuery,
  );
  return data.data.matchedUser;
};

const skillStats = async (username) => {
  const data = await fetchGraphQLData(
    "skillStats",
    { username },
    skillStatsQuery,
  );
  return data.data.matchedUser;
};

const userContestRankingInfo = async (username) => {
  const data = await fetchGraphQLData(
    "userContestRankingInfo",
    { username },
    userContestRankingInfoQuery,
  );
  return data.data;
};

const userProblemsSolved = async (username) => {
  const data = await fetchGraphQLData(
    "userProblemsSolved",
    { username },
    userProblemsSolvedQuery,
  );
  return data.data;
};

const userBadges = async (username) => {
  const data = await fetchGraphQLData(
    "userBadges",
    { username },
    userBadgesQuery,
  );
  return data.data;
};

const userProfileCalendar = async (username, year) => {
  const data = await fetchGraphQLData(
    "userProfileCalendar",
    { username, year },
    userProfileCalendarQuery,
  );
  return data.data;
};

const recentAcSubmissions = async (username, limit) => {
  const data = await fetchGraphQLData(
    "recentAcSubmissions",
    { username, limit },
    recentAcSubmissionsQuery,
  );
  return data.data;
};

const getStreakCounter = async () => {
  const data = await fetchGraphQLData(
    "streakCounter",
    {},
    getStreakCounterQuery,
  );
  return data;
};

const currentTimestamp = async () => {
  const data = await fetchGraphQLData(
    "currentTimestamp",
    {},
    currentTimestampQuery,
  );
  return data.data;
};

const questionOfToday = async (timestamp) => {
  const data = await fetchGraphQLData(
    "questionOfToday",
    { timestamp },
    questionOfTodayQuery,
  );
  return data.data;
};

const codingChallengeMedal = async (year, month) => {
  const data = await fetchGraphQLData(
    "codingChallengeMedal",
    { year, month },
    codingChallengeMedalQuery,
  );
  return data.data;
};

const getUserProfile = async (username, offset, limit, lastKey) => {
  const data = await fetchGraphQLData(
    "getUserProfile",
    { username, offset, limit, lastKey },
    getUserProfileQuery,
  );
  return data.data;
};

export {
  userPublicProfile,
  globalData,
  siteAnnouncements,
  languageStats,
  skillStats,
  userContestRankingInfo,
  userProblemsSolved,
  userBadges,
  userProfileCalendar,
  recentAcSubmissions,
  getStreakCounter,
  currentTimestamp,
  questionOfToday,
  codingChallengeMedal,
  getUserProfile,
};
