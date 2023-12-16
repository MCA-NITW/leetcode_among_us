import {
  userPublicProfile,
  userContestRankingInfo,
  userProblemsSolved,
  userBadges,
  userProfileCalendar,
} from "../api/UserData";

// Function to fetch and process data for a single leetcoder
export const fetchDataForLeetcoder = async (leetcoder) => {
  try {
    const userPublicProfileData = await userPublicProfile(leetcoder.userName);
    const userContestRankingInfoData = await userContestRankingInfo(
      leetcoder.userName,
    );
    const userProblemsSolvedData = await userProblemsSolved(leetcoder.userName);
    const userBadgesData = await userBadges(leetcoder.userName);
    const calendarData = await fetchCalendarData(leetcoder.userName);

    return processLeetcoderData(
      leetcoder,
      userPublicProfileData,
      userContestRankingInfoData,
      userProblemsSolvedData,
      userBadgesData,
      calendarData,
    );
  } catch (error) {
    console.error("Error fetching data for user:", leetcoder.userName, error);
    return leetcoder; // Return original leetcoder data in case of an error
  }
};

// Helper function to fetch calendar data
const fetchCalendarData = async (userName) => {
  const years = [
    2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
  ];
  let bestStreak = 0;
  let totalActiveDays = 0;

  for (let year of years) {
    const userCalendarData = await userProfileCalendar(userName, year);
    if (userCalendarData.matchedUser.userCalendar.streak > bestStreak) {
      bestStreak = userCalendarData.matchedUser.userCalendar.streak;
    }
    totalActiveDays +=
      userCalendarData.matchedUser.userCalendar.totalActiveDays;
  }

  return { bestStreak, totalActiveDays };
};

const getAverageContestRanking = (contestHistory) => {
  let totalRanking = 0,
    totalContest = 0;
  contestHistory.forEach((contest) => {
    if (contest.attended === true) {
      totalRanking += contest.ranking;
      totalContest += 1;
    }
  });
  return Math.round(totalRanking / totalContest);
};

const getMostQuestionsInContest = (contestHistory, question) => {
  let mostFourQuestionsInContest = 0;
  contestHistory.forEach((contest) => {
    if (contest.problemsSolved === question && contest.attended === true) {
      mostFourQuestionsInContest += 1;
    }
  });
  return mostFourQuestionsInContest;
};

const getBestContestRank = (contestHistory) => {
  let bestRank = Infinity;
  contestHistory.forEach((contest) => {
    if (contest.ranking < bestRank && contest.ranking !== 0) {
      bestRank = contest.ranking;
    }
  });
  return bestRank;
};

// Function to process and consolidate leetcoder data
const processLeetcoderData = (
  leetcoder,
  userPublicProfileData,
  userContestRankingInfoData,
  userProblemsSolvedData,
  userBadgesData,
  calendarData,
) => {
  // Process the data based on your application's logic
  return {
    ...leetcoder,
    globalContestRating:
      userContestRankingInfoData.userContestRanking === null
        ? 0
        : Math.round(userContestRankingInfoData.userContestRanking.rating, 2),
    globalContestRanking:
      userContestRankingInfoData.userContestRanking === null
        ? "N/A"
        : userContestRankingInfoData.userContestRanking.globalRanking,
    easySolved:
      userProblemsSolvedData.matchedUser.submitStatsGlobal.acSubmissionNum.filter(
        (problem) => problem.difficulty === "Easy",
      )[0].count,
    mediumSolved:
      userProblemsSolvedData.matchedUser.submitStatsGlobal.acSubmissionNum.filter(
        (problem) => problem.difficulty === "Medium",
      )[0].count,
    hardSolved:
      userProblemsSolvedData.matchedUser.submitStatsGlobal.acSubmissionNum.filter(
        (problem) => problem.difficulty === "Hard",
      )[0].count,
    totalSolved:
      userProblemsSolvedData.matchedUser.submitStatsGlobal.acSubmissionNum.filter(
        (problem) => problem.difficulty === "All",
      )[0].count,
    totalEasy: userProblemsSolvedData.allQuestionsCount.filter(
      (problem) => problem.difficulty === "Easy",
    )[0].count,
    totalMedium: userProblemsSolvedData.allQuestionsCount.filter(
      (problem) => problem.difficulty === "Medium",
    )[0].count,
    totalHard: userProblemsSolvedData.allQuestionsCount.filter(
      (problem) => problem.difficulty === "Hard",
    )[0].count,
    totalQuestions: userProblemsSolvedData.allQuestionsCount.filter(
      (problem) => problem.difficulty === "All",
    )[0].count,
    reputation: userPublicProfileData.profile.reputation,
    questionRanking: userPublicProfileData.profile.ranking,
    contestTopPercentage:
      userContestRankingInfoData.userContestRanking === null
        ? 100
        : userContestRankingInfoData.userContestRanking.topPercentage,
    totalParticipants:
      userContestRankingInfoData.userContestRanking === null
        ? 100000
        : userContestRankingInfoData.userContestRanking.totalParticipants,
    attendedContestCount:
      userContestRankingInfoData.userContestRanking === null
        ? 0
        : userContestRankingInfoData.userContestRanking.attendedContestsCount,
    contestHistory: userContestRankingInfoData.userContestRankingHistory,
    badgeCount: userBadgesData.matchedUser.badges.length,
    bestContestRank: getBestContestRank(
      userContestRankingInfoData.userContestRankingHistory,
    ),
    mostFourQuestionsInContest: getMostQuestionsInContest(
      userContestRankingInfoData.userContestRankingHistory,
      4,
    ),
    mostThreeQuestionsInContest: getMostQuestionsInContest(
      userContestRankingInfoData.userContestRankingHistory,
      3,
    ),
    mostTwoQuestionsInContest: getMostQuestionsInContest(
      userContestRankingInfoData.userContestRankingHistory,
      2,
    ),
    mostOneQuestionsInContest: getMostQuestionsInContest(
      userContestRankingInfoData.userContestRankingHistory,
      1,
    ),
    mostZeroQuestionsInContest: getMostQuestionsInContest(
      userContestRankingInfoData.userContestRankingHistory,
      0,
    ),
    averageContestRanking: getAverageContestRanking(
      userContestRankingInfoData.userContestRankingHistory,
    ),
    totalActiveDays: calendarData.totalActiveDays,
    bestStreak: calendarData.bestStreak,
  };
};
