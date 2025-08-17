import {
  userPublicProfile,
  userContestRankingInfo,
  userProblemsSolved,
  userBadges,
  userProfileCalendar
} from '../api/FetchData'

const fetchCalendarData = async userName => {
  const years = [
    2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025
  ]
  const calendarPromises = years.map(year =>
    userProfileCalendar(userName, year)
  )
  const calendarDataArray = await Promise.all(calendarPromises)

  let bestStreak = 0
  let totalActiveDays = 0

  calendarDataArray.forEach(userCalendarData => {
    if (userCalendarData.matchedUser.userCalendar.streak > bestStreak) {
      bestStreak = userCalendarData.matchedUser.userCalendar.streak
    }
    totalActiveDays += userCalendarData.matchedUser.userCalendar.totalActiveDays
  })

  return { bestStreak, totalActiveDays }
}

export const fetchDataForLeetcoder = async leetcoder => {
  if (!leetcoder.userName || leetcoder.userName.trim() === '') {
    console.log(`No userName provided for leetcoder with ID: ${leetcoder.id}`)
    return leetcoder
  }

  try {
    const [
      userPublicProfileData,
      userContestRankingInfoData,
      userProblemsSolvedData,
      userBadgesData,
      calendarData
    ] = await Promise.all([
      userPublicProfile(leetcoder.userName),
      userContestRankingInfo(leetcoder.userName),
      userProblemsSolved(leetcoder.userName),
      userBadges(leetcoder.userName),
      fetchCalendarData(leetcoder.userName)
    ])

    return processLeetcoderData(
      leetcoder,
      userPublicProfileData,
      userContestRankingInfoData,
      userProblemsSolvedData,
      userBadgesData,
      calendarData
    )
  } catch (error) {
    console.error('Error fetching data for user:', leetcoder.userName, error)
    return leetcoder
  }
}

const getAverageContestRanking = contestHistory => {
  let totalRanking = 0,
    totalContest = 0
  contestHistory.forEach(contest => {
    if (contest.attended === true) {
      totalRanking += contest.ranking
      totalContest += 1
    }
  })
  if (totalContest === 0) {
    return Infinity
  }
  return Math.round(totalRanking / totalContest)
}

const getMostQuestionsInContest = (contestHistory, question) => {
  let mostQuestionInContest = 0
  contestHistory.forEach(contest => {
    if (contest.problemsSolved === question && contest.attended === true) {
      mostQuestionInContest += 1
    }
  })
  return mostQuestionInContest
}

const getBestContestRank = contestHistory => {
  let bestRank = Infinity
  contestHistory.forEach(contest => {
    if (contest.ranking < bestRank && contest.ranking !== 0) {
      bestRank = contest.ranking
    }
  })
  return bestRank
}

const processLeetcoderData = (
  leetcoder,
  userPublicProfileData,
  userContestRankingInfoData,
  userProblemsSolvedData,
  userBadgesData,
  calendarData
) => {
  const getProblemsSolvedCount = difficulty =>
    userProblemsSolvedData.matchedUser.submitStatsGlobal.acSubmissionNum.find(
      problem => problem.difficulty === difficulty
    )?.count || 0

  const getTotalQuestionsCount = difficulty =>
    userProblemsSolvedData.allQuestionsCount.find(
      problem => problem.difficulty === difficulty
    )?.count || 0

  return {
    ...leetcoder,
    avatar: userPublicProfileData.profile.userAvatar,
    globalContestRating: userContestRankingInfoData.userContestRanking?.rating
      ? Math.round(userContestRankingInfoData.userContestRanking.rating, 2)
      : 0,
    globalContestRanking:
      userContestRankingInfoData.userContestRanking?.globalRanking || Infinity,
    easySolved: getProblemsSolvedCount('Easy'),
    mediumSolved: getProblemsSolvedCount('Medium'),
    hardSolved: getProblemsSolvedCount('Hard'),
    totalSolved: getProblemsSolvedCount('All'),
    totalEasy: getTotalQuestionsCount('Easy'),
    totalMedium: getTotalQuestionsCount('Medium'),
    totalHard: getTotalQuestionsCount('Hard'),
    totalQuestions: getTotalQuestionsCount('All'),
    reputation: userPublicProfileData.profile.reputation,
    questionRanking: userPublicProfileData.profile.ranking,
    contestTopPercentage: userContestRankingInfoData.userContestRanking
      ?.topPercentage
      ? Math.round(
          userContestRankingInfoData.userContestRanking.topPercentage,
          2
        )
      : 100.0,
    totalParticipants:
      userContestRankingInfoData.userContestRanking?.totalParticipants ||
      100000,
    attendedContestCount:
      userContestRankingInfoData.userContestRanking?.attendedContestsCount || 0,
    contestHistory: userContestRankingInfoData.userContestRankingHistory,
    badgeCount: userBadgesData.matchedUser.badges.length,
    bestContestRank: getBestContestRank(
      userContestRankingInfoData.userContestRankingHistory
    ),
    mostFourQuestionsInContest: getMostQuestionsInContest(
      userContestRankingInfoData.userContestRankingHistory,
      4
    ),
    mostThreeQuestionsInContest: getMostQuestionsInContest(
      userContestRankingInfoData.userContestRankingHistory,
      3
    ),
    mostTwoQuestionsInContest: getMostQuestionsInContest(
      userContestRankingInfoData.userContestRankingHistory,
      2
    ),
    mostOneQuestionsInContest: getMostQuestionsInContest(
      userContestRankingInfoData.userContestRankingHistory,
      1
    ),
    mostZeroQuestionsInContest: getMostQuestionsInContest(
      userContestRankingInfoData.userContestRankingHistory,
      0
    ),
    averageContestRanking: getAverageContestRanking(
      userContestRankingInfoData.userContestRankingHistory
    ),
    totalActiveDays: calendarData.totalActiveDays,
    bestStreak: calendarData.bestStreak
  }
}
