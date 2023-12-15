// Importing all GraphQL queries from the same directory as app.js
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
} from "./GraphQLQueries";

const userPublicProfile = async (username) => {
  const response = await fetch("http://localhost:3001/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operationName: "userPublicProfile",
      variables: {
        username: username,
      },
      query: userPublicProfileQuery,
    }),
  });
  const data = await response.json();
  return data.data.matchedUser;
};

const globalData = async () => {
  const response = await fetch("http://localhost:3001/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operationName: "globalData",
      variables: {},
      query: globalDataQuery,
    }),
  });
  const data = await response.json();
  return data.data.globalData;
};

const siteAnnouncements = async () => {
  const response = await fetch("http://localhost:3001/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operationName: "siteAnnouncements",
      variables: {},
      query: siteAnnouncementsQuery,
    }),
  });
  const data = await response.json();
  return data.data.siteAnnouncements;
};

const languageStats = async (username) => {
  const response = await fetch("http://localhost:3001/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operationName: "languageStats",
      variables: {
        username: username,
      },
      query: languageStatsQuery,
    }),
  });
  const data = await response.json();
  return data.data.matchedUser;
};

const skillStats = async (username) => {
  const response = await fetch("http://localhost:3001/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operationName: "skillStats",
      variables: {
        username: username,
      },
      query: skillStatsQuery,
    }),
  });
  const data = await response.json();
  return data.data.matchedUser;
};

const userContestRankingInfo = async (username) => {
  const response = await fetch("http://localhost:3001/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrftoken": "undefined",
    },
    body: JSON.stringify({
      operationName: "userContestRankingInfo",
      variables: {
        username: username,
      },
      query: userContestRankingInfoQuery,
    }),
  });
  const data = await response.json();
  return data.data;
};

const userProblemsSolved = async (username) => {
  const response = await fetch("http://localhost:3001/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrftoken": "undefined",
    },
    body: JSON.stringify({
      operationName: "userProblemsSolved",
      variables: {
        username: username,
      },
      query: userProblemsSolvedQuery,
    }),
  });
  const data = await response.json();
  return data.data;
};

const userBadges = async (username) => {
  const response = await fetch("http://localhost:3001/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrftoken": "undefined",
    },
    body: JSON.stringify({
      operationName: "userBadges",
      variables: {
        username: username,
      },
      query: userBadgesQuery,
    }),
  });
  const data = await response.json();
  return data.data;
};

const userProfileCalendar = async (username, year) => {
  const response = await fetch("http://localhost:3001/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrftoken": "undefined",
    },
    body: JSON.stringify({
      operationName: "userProfileCalendar",
      variables: {
        username: username,
        year: year,
      },
      query: userProfileCalendarQuery,
    }),
  });
  const data = await response.json();
  return data.data;
};

const recentAcSubmissions = async (username, limit) => {
  const response = await fetch("http://localhost:3001/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrftoken": "undefined",
    },
    body: JSON.stringify({
      operationName: "recentAcSubmissions",
      variables: {
        username: username,
        limit: limit,
      },
      query: recentAcSubmissionsQuery,
    }),
  });
  const data = await response.json();
  return data.data;
};

const getStreakCounter = async () => {
  const response = await fetch("http://localhost:3001/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrftoken": "undefined",
    },
    body: JSON.stringify({
      operationName: "streakCounter",
      variables: {},
      query: getStreakCounterQuery,
    }),
  });
  const data = await response.json();
  return data;
};

const currentTimestamp = async () => {
  const response = await fetch("http://localhost:3001/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrftoken": "undefined",
    },
    body: JSON.stringify({
      operationName: "currentTimestamp",
      variables: {},
      query: currentTimestampQuery,
    }),
  });
  const data = await response.json();
  return data.data;
};

const questionOfToday = async (timestamp) => {
  const response = await fetch("http://localhost:3001/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrftoken": "undefined",
    },
    body: JSON.stringify({
      operationName: "questionOfToday",
      variables: {
        timestamp: timestamp,
      },
      query: questionOfTodayQuery,
    }),
  });
  const data = await response.json();
  return data.data;
};

const codingChallengeMedal = async (year, month) => {
  const response = await fetch("http://localhost:3001/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operationName: "codingChallengeMedal",
      variables: {
        year: year,
        month: month,
      },
      query: codingChallengeMedalQuery,
    }),
  });
  const data = await response.json();
  return data.data;
};

const getUserProfile = async (username, offset, limit, lastKey) => {
  const response = await fetch("http://localhost:3001/leetcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operationName: "getUserProfile",
      variables: {
        username: username,
        offset: offset,
        limit: limit,
        lastKey: lastKey,
      },
      query: getUserProfileQuery,
    }),
  });
  const data = await response.json();
  return data.data.matchedUser;
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
