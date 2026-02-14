import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'
import rateLimit from 'express-rate-limit'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Constants
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000 // 5 minutes
const RATE_LIMIT_MAX = 2000
const MAX_BATCH_SIZE = 10
const CALENDAR_DELAY_MS = 100
const MAX_USERNAME_LENGTH = 40
const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql'
const BODY_SIZE_LIMIT = '1mb'

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  'https://leetcode-among-us.onrender.com',
  'https://sagargupta.live'
]

const app = express()
app.disable('x-powered-by')

// CORS configuration - restrict to allowed origins
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      // Block requests with no origin in production
      if (process.env.NODE_ENV === 'production') {
        return callback(new Error('Not allowed by CORS'))
      }
      return callback(null, true)
    }

    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// Use helmet with security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'https:', 'data:'],
        connectSrc: ["'self'", 'https://leetcode.com'],
        fontSrc: ["'self'", 'https:', 'data:']
      }
    },
    crossOriginEmbedderPolicy: false
  })
)

app.use(express.json({ limit: BODY_SIZE_LIMIT }))

const leetcodeLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX
})

// Username validation helper
const isValidUsername = username => {
  return (
    typeof username === 'string' &&
    username.trim().length > 0 &&
    username.length <= MAX_USERNAME_LENGTH &&
    /^[a-zA-Z0-9_-]+$/.test(username)
  )
}

// Helper function to make GraphQL requests
const fetchGraphQLData = async (operationName, variables, query) => {
  const response = await fetch(LEETCODE_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ operationName, variables, query })
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`)
  }

  return response.json()
}

// Helper to get calendar years dynamically
const getCalendarYears = () => {
  const currentYear = new Date().getFullYear()
  const startYear = 2022
  const years = []
  for (let year = startYear; year <= currentYear; year++) {
    years.push(year)
  }
  return years
}

// Core user data fetching logic (used by both single and batch endpoints)
const fetchUserData = async username => {
  const queries = {
    userPublicProfile: {
      operationName: 'userPublicProfile',
      variables: { username },
      query: `
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
              reputation
              starRating
            }
          }
        }
      `
    },
    userContestRankingInfo: {
      operationName: 'userContestRankingInfo',
      variables: { username },
      query: `
        query userContestRankingInfo($username: String!) {
          userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            topPercentage
            totalParticipants
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
    },
    userProblemsSolved: {
      operationName: 'userProblemsSolved',
      variables: { username },
      query: `
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
                submissions
              }
            }
          }
        }
      `
    },
    skillStats: {
      operationName: 'skillStats',
      variables: { username },
      query: `
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
    },
    userBadges: {
      operationName: 'userBadges',
      variables: { username },
      query: `
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
            }
          }
        }
      `
    }
  }

  // Execute all queries in parallel
  const promises = Object.entries(queries).map(async ([key, query]) => {
    try {
      const data = await fetchGraphQLData(
        query.operationName,
        query.variables,
        query.query
      )
      return [key, data]
    } catch (error) {
      console.error(`Error fetching ${key} for ${username}:`, error.message)
      return [key, null]
    }
  })

  const results = await Promise.all(promises)
  const userData = Object.fromEntries(results)

  // Fetch calendar data for multiple years with delay to avoid rate limiting
  const years = getCalendarYears()
  const calendarQuery = {
    operationName: 'userProfileCalendar',
    query: `
      query userProfileCalendar($username: String!, $year: Int!) {
        matchedUser(username: $username) {
          userCalendar(year: $year) {
            activeYears
            streak
            totalActiveDays
            submissionCalendar
          }
        }
      }
    `
  }

  // Fetch calendar data sequentially with delay to avoid rate limiting
  const calendarResults = []
  for (const year of years) {
    try {
      const data = await fetchGraphQLData(
        calendarQuery.operationName,
        { username, year },
        calendarQuery.query
      )
      calendarResults.push(data)
      await new Promise(resolve => setTimeout(resolve, CALENDAR_DELAY_MS))
    } catch (error) {
      console.error(
        `Error fetching calendar data for ${username}, year ${year}:`,
        error.message
      )
      calendarResults.push(null)
    }
  }

  // Process calendar data
  let bestStreak = 0
  let totalActiveDays = 0
  let submissionCalendar = {}
  let activeYears = []

  calendarResults.forEach(result => {
    if (
      result &&
      result.data &&
      result.data.matchedUser &&
      result.data.matchedUser.userCalendar
    ) {
      const calendar = result.data.matchedUser.userCalendar
      if (calendar.streak > bestStreak) {
        bestStreak = calendar.streak
      }
      totalActiveDays += calendar.totalActiveDays
      if (calendar.activeYears) {
        activeYears = calendar.activeYears
      }
      if (calendar.submissionCalendar) {
        try {
          const parsed = JSON.parse(calendar.submissionCalendar)
          submissionCalendar = { ...submissionCalendar, ...parsed }
        } catch {
          // ignore parse errors
        }
      }
    }
  })

  userData.calendarData = { bestStreak, totalActiveDays, submissionCalendar, activeYears }

  return userData
}

// Optimized endpoint for fetching user data in parallel
app.post('/leetcode/user-data', leetcodeLimiter, async (req, res) => {
  try {
    const { username } = req.body

    if (!isValidUsername(username)) {
      return res.status(400).json({
        error:
          'Invalid username. Must be 1-40 alphanumeric characters, hyphens, or underscores.'
      })
    }

    const userData = await fetchUserData(username)
    res.json({ success: true, data: userData })
  } catch (error) {
    console.error('Error in user-data endpoint:', error.message)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching user data' })
  }
})

// Batch endpoint for processing multiple users in parallel
app.post('/leetcode/batch-user-data', leetcodeLimiter, async (req, res) => {
  try {
    const { usernames } = req.body

    if (!usernames || !Array.isArray(usernames)) {
      return res.status(400).json({ error: 'Usernames array is required' })
    }

    if (usernames.length > MAX_BATCH_SIZE) {
      return res.status(400).json({
        error: `Maximum ${MAX_BATCH_SIZE} usernames allowed per batch`
      })
    }

    // Validate all usernames
    const invalidUsernames = usernames.filter(u => !isValidUsername(u))
    if (invalidUsernames.length > 0) {
      return res.status(400).json({
        error: `Invalid usernames: ${invalidUsernames.join(', ')}`
      })
    }

    // Process all users in parallel using the shared function directly
    const userPromises = usernames.map(async username => {
      try {
        const userData = await fetchUserData(username)
        return { username, success: true, data: userData }
      } catch (error) {
        console.error(`Error fetching data for user ${username}:`, error.message)
        return { username, success: false, error: 'Failed to fetch user data' }
      }
    })

    const results = await Promise.all(userPromises)

    res.json({
      success: true,
      results,
      processed: results.length
    })
  } catch (error) {
    console.error('Error in batch-user-data endpoint:', error.message)
    res
      .status(500)
      .json({ error: 'An error occurred while processing batch request' })
  }
})

app.use(express.static(path.join(__dirname, 'client', 'build')))

// Serve React app for all routes that don't match API endpoints (Express 5 compatible)
app.get(/^(?!\/leetcode).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
