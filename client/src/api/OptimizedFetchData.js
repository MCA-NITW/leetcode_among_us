// Optimized fetch functions that use the new parallel backend endpoints

const getApiBaseUrl = () =>
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001'
    : 'https://leetcode-among-us.onrender.com')

// Optimized single user data fetch using the new backend endpoint
export const fetchOptimizedUserData = async username => {
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
export const fetchBatchUserData = async usernames => {
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
export const processUserDataResponse = (leetcoder, backendData) => {
  if (!backendData || !backendData.userPublicProfile?.data?.matchedUser) {
    return leetcoder
  }

  try {
    const {
      userPublicProfile,
      userContestRankingInfo,
      userProblemsSolved,
      userBadges,
      calendarData
    } = backendData

    const publicProfile = userPublicProfile.data.matchedUser
    const contestRanking = userContestRankingInfo.data.userContestRanking
    const contestHistory =
      userContestRankingInfo.data.userContestRankingHistory || []
    const problemsData = userProblemsSolved.data
    const badges = userBadges.data.matchedUser?.badges || []
    const upcomingBadges = userBadges.data.matchedUser?.upcomingBadges || []
    const contestBadge = publicProfile?.contestBadge || null
    const beatsStats = problemsData.matchedUser?.problemsSolvedBeatsStats || []

    // Helper functions
    const getProblemsSolvedCount = difficulty =>
      problemsData.matchedUser?.submitStatsGlobal?.acSubmissionNum?.find(
        problem => problem.difficulty === difficulty
      )?.count || 0

    const getTotalQuestionsCount = difficulty =>
      problemsData.allQuestionsCount?.find(
        problem => problem.difficulty === difficulty
      )?.count || 0

    const getAverageContestRanking = contestHistory => {
      let totalRanking = 0,
        totalContest = 0
      contestHistory.forEach(contest => {
        if (contest.attended === true) {
          totalRanking += contest.ranking
          totalContest += 1
        }
      })
      return totalContest === 0
        ? Infinity
        : Math.round(totalRanking / totalContest)
    }

    const getMostQuestionsInContest = (contestHistory, question) => {
      return contestHistory.filter(
        contest =>
          contest.problemsSolved === question && contest.attended === true
      ).length
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
      starRating: publicProfile.profile?.starRating || null,
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
        ? Math.round(contestRanking.topPercentage, 2)
        : 100.0,
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
      bestStreak: calendarData?.bestStreak || 0
    }
  } catch (error) {
    console.error('Error processing user data:', error)
    return leetcoder
  }
}
