// Query Without any variables

export const contestRatingHistogramQuery = `
    query contestRatingHistogram {
        contestRatingHistogram {
            userCount
            ratingStart
            ratingEnd
            topPercentage
        }
    }
`

export const getStreakCounterQuery = `
    query getStreakCounter {
        streakCounter {
            streakCount
            daysSkipped
            currentDayCompleted
        }
    }
`

export const globalDataQuery = `
    query globalData {
        userStatus {
            userId
            isSignedIn
            isMockUser
            isPremium
            isVerified
            username
            avatar
            isAdmin
            isSuperuser
            permissions
            isTranslator
            activeSessionId
            checkedInToday
            notificationStatus {
                lastModified
                numUnread
            }
        }
    }
`

export const questionOfTodayQuery = `
    query questionOfToday {
        activeDailyCodingChallengeQuestion {
            date
            userStatus
            link
            question {
                acRate
                difficulty
                freqBar
                frontendQuestionId: questionFrontendId
                isFavor
                paidOnly: isPaidOnly
                status
                title
                titleSlug
                hasVideoSolution
                hasSolution
                topicTags {
                    name
                    id
                    slug
                }
            }
        }
    }
`

export const siteAnnouncementsQuery = `
    query siteAnnouncements {
        siteAnnouncements {
            title
            content
            blacklistUrls
            whitelistUrls
            navbarItem
        }
    }
`

export const currentTimestampQuery = `
    query currentTimestamp {
        currentTimestamp
    }
`

// Query with variables

export const getGlobalRankingsQuery = `
    query GetGlobalRankings($page: Int!) {
        globalRanking(page: $page) {
            totalUsers
            userPerPage
            myRank {
                ranking
                currentGlobalRanking
                currentRating
                dataRegion
                user {
                    nameColor
                    activeBadge {
                        displayName
                        icon
                    }
                }
            }
            rankingNodes {
                ranking
                currentRating
                currentGlobalRanking
                dataRegion
                user {
                    username
                    nameColor
                    activeBadge {
                        displayName
                        icon
                    }
                    profile {
                        userAvatar
                        countryCode
                        countryName
                        realName
                    }
                }
            }
        }
    }
}
`

export const pastContestsQuery = `
    query pastContests($pageNo: Int, $numPerPage: Int) {
        pastContests(pageNo: $pageNo, numPerPage: $numPerPage) {
            pageNum
            currentPage
            totalNum
            numPerPage
            data {
                title
                titleSlug
                startTime
                originStartTime
                cardImg
                sponsors {
                    name
                    lightLogo
                    darkLogo
                }
            }
        }
    }
`

export const problemsetQuestionListQuery = `
    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
        ) {
            total: totalNum
            questions: data {
                acRate
                difficulty
                freqBar
                frontendQuestionId: questionFrontendId
                isFavor
                paidOnly: isPaidOnly
                status
                title
                titleSlug
                topicTags {
                    name
                    id
                    slug
                }
                hasSolution
                hasVideoSolution
            }
        }
    }
`

export const codingChallengeMedalQuery = `
    query codingChallengeMedal($year: Int!, $month: Int!) {
        dailyChallengeMedal(year: $year, month: $month) {
            name
            config {
                icon
            }
        }
    }
`

// Query with variable username

export const languageStatsQuery = `
    query languageStats($username: String!) {
        matchedUser(username: $username) {
            languageProblemCount {
                languageName
                problemsSolved
            }
        }
    }
`

export const recentAcSubmissionsQuery = `
    query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
            id
            title
            titleSlug
            timestamp
        }
    }
`

export const skillStatsQuery = `
    query skillStats($username: String!) {
        matchedUser(username: $username) {
            tagProblemCounts {
                advanced {
                    tagName
                    tagSlug
                    problemsSolved
                }
                intermediate {
                    tagName
                    tagSlug
                    problemsSolved
                }
                fundamental {
                    tagName
                    tagSlug
                    problemsSolved
                }
            }
        }
    }
`

export const userBadgesQuery = `
    query userBadges($username: String!) {
        matchedUser(username: $username) {
            badges {
                id
                name
                shortName
                displayName
                icon
                hoverText
                medal {
                    slug
                    config {
                        iconGif
                        iconGifBackground
                    }
                }
                creationDate
                category
            }
            upcomingBadges {
                name
                icon
                progress
            }
        }
    }
`

export const userContestRankingInfoQuery = `
    query userContestRankingInfo($username: String!) {
        userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            totalParticipants
            topPercentage
            badge {
                name
            }
        }
        userContestRankingHistory(username: $username) {
            attended
            trendDirection
            problemsSolved
            totalProblems
            finishTimeInSeconds
            rating
            ranking
            contest {
                title
                startTime
            }
        }
    }
`

export const userProblemsSolvedQuery = `
    query userProblemsSolved($username: String!) {
        allQuestionsCount {
            difficulty
            count
        }
        matchedUser(username: $username) {
            problemsSolvedBeatsStats {
                difficulty
                percentage
            }
            submitStatsGlobal {
                acSubmissionNum {
                    difficulty
                    count
                }
            }
        }
    }
`

export const userProfileCalendarQuery = `
    query userProfileCalendar($username: String!, $year: Int) {
        matchedUser(username: $username) {
            userCalendar(year: $year) {
                activeYears
                streak
                totalActiveDays
                dccBadges {
                    timestamp
                    badge {
                        name
                        icon
                    }
                }
                submissionCalendar
            }
        }
    }
`

export const userPublicProfileQuery = `
    query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
            contestBadge {
                name
                expired
                hoverText
                icon
            }
            username
            githubUrl
            twitterUrl
            linkedinUrl
            profile {
                ranking
                userAvatar
                realName
                aboutMe
                school
                websites
                countryName
                company
                jobTitle
                skillTags
                postViewCount
                postViewCountDiff
                reputation
                reputationDiff
                solutionCount
                solutionCountDiff
                categoryDiscussCount
                categoryDiscussCountDiff
            }
        }
    }
`

export const getUserProfileQuery = `
    query getUserProfile($username: String!) {
        matchedUser(username: $username) {
            activeBadge {
                displayName
                icon
            }
        }
    }
`
