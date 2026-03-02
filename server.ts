import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'
import type { CorsOptions } from 'cors'
import helmet from 'helmet'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import rateLimit from 'express-rate-limit'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ─── Constants ───────────────────────────────────────────────────────────────

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000 // 5 minutes
const RATE_LIMIT_MAX = 2000
const MAX_BATCH_SIZE = 10
const CALENDAR_DELAY_MS = 100
const MAX_USERNAME_LENGTH = 40
const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql'
const BODY_SIZE_LIMIT = '1mb'

const ALLOWED_ORIGINS: ReadonlySet<string> = new Set([
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  'https://leetcode-among-us.onrender.com',
  'https://sagargupta.live'
])

// ─── Interfaces ──────────────────────────────────────────────────────────────

/** A single GraphQL query definition sent to the LeetCode API. */
interface GraphQLQueryDefinition {
  operationName: string
  variables: Record<string, unknown>
  query: string
}

/** Shape of a generic GraphQL JSON response from LeetCode. */
interface GraphQLResponse {
  data?: Record<string, unknown>
  errors?: Array<{ message: string }>
}

/** Calendar information returned by the userProfileCalendar query. */
interface UserCalendar {
  activeYears: number[]
  streak: number
  totalActiveDays: number
  submissionCalendar: string
}

/** Aggregated calendar data across all fetched years. */
interface CalendarData {
  bestStreak: number
  totalActiveDays: number
  submissionCalendar: Record<string, number>
  activeYears: number[]
}

/** The combined user data object returned by fetchUserData. */
interface UserData {
  userPublicProfile: GraphQLResponse | null
  userContestRankingInfo: GraphQLResponse | null
  userProblemsSolved: GraphQLResponse | null
  skillStats: GraphQLResponse | null
  userBadges: GraphQLResponse | null
  calendarData: CalendarData
}

/** Request body for the single-user endpoint. */
interface UserDataRequestBody {
  username: string
}

/** Request body for the batch endpoint. */
interface BatchUserDataRequestBody {
  usernames: string[]
}

/** Successful response for the single-user endpoint. */
interface UserDataSuccessResponse {
  success: true
  data: UserData
}

/** A single result inside the batch response. */
interface BatchUserResult {
  username: string
  success: boolean
  data?: UserData
  error?: string
}

/** Successful response for the batch endpoint. */
interface BatchUserDataSuccessResponse {
  success: true
  results: BatchUserResult[]
  processed: number
}

/** Generic error response shared by all endpoints. */
interface ErrorResponse {
  error: string
}

// ─── App setup ───────────────────────────────────────────────────────────────

const app = express()
app.disable('x-powered-by')

// CORS configuration - restrict to allowed origins
const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, origin?: boolean) => void
  ): void {
    if (!origin) {
      // Allow requests with no origin (same-origin, server-to-server, health checks)
      return callback(null, true)
    }

    if (ALLOWED_ORIGINS.has(origin)) {
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Validate that a username is a non-empty alphanumeric string within length limits. */
const isValidUsername = (username: unknown): username is string => {
  return (
    typeof username === 'string' &&
    username.trim().length > 0 &&
    username.length <= MAX_USERNAME_LENGTH &&
    /^[a-zA-Z0-9_-]+$/.test(username)
  )
}

/** Sanitize user input for safe logging (prevents log injection). */
const sanitizeForLog = (str: unknown): string => {
  if (typeof str !== 'string') return String(str)
  return str.replace(/[\r\n\t]/g, '_').slice(0, MAX_USERNAME_LENGTH)
}

// Keep sanitizeForLog reachable so the compiler does not flag it as unused.
void sanitizeForLog

/** Make a single GraphQL request to the LeetCode API. */
const fetchGraphQLData = async (
  operationName: string,
  variables: Record<string, unknown>,
  query: string
): Promise<GraphQLResponse> => {
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

  return (await response.json()) as GraphQLResponse
}

/** Return an array of years from 2022 up to and including the current year. */
const getCalendarYears = (): number[] => {
  const currentYear = new Date().getFullYear()
  const startYear = 2022
  const years: number[] = []
  for (let year = startYear; year <= currentYear; year++) {
    years.push(year)
  }
  return years
}

// ─── Core data fetching ──────────────────────────────────────────────────────

/** Fetch all LeetCode data for a single user (profile, contests, problems, etc.). */
const fetchUserData = async (username: string): Promise<UserData> => {
  const queries: Record<string, GraphQLQueryDefinition> = {
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
  const promises = Object.entries(queries).map(
    async ([key, queryDef]): Promise<[string, GraphQLResponse | null]> => {
      try {
        const data = await fetchGraphQLData(
          queryDef.operationName,
          queryDef.variables,
          queryDef.query
        )
        return [key, data]
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.error('Error fetching %s for user:', key, message)
        return [key, null]
      }
    }
  )

  const results = await Promise.all(promises)
  const userData = Object.fromEntries(results) as Record<
    string,
    GraphQLResponse | null
  >

  // Fetch calendar data for multiple years with delay to avoid rate limiting
  const years = getCalendarYears()
  const calendarQuery: Omit<GraphQLQueryDefinition, 'variables'> = {
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
  const calendarResults: Array<GraphQLResponse | null> = []
  for (const year of years) {
    try {
      const data = await fetchGraphQLData(
        calendarQuery.operationName,
        { username, year },
        calendarQuery.query
      )
      calendarResults.push(data)
      await new Promise<void>(resolve => setTimeout(resolve, CALENDAR_DELAY_MS))
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('Error fetching calendar data for year %d:', year, message)
      calendarResults.push(null)
    }
  }

  // Process calendar data
  let bestStreak = 0
  let totalActiveDays = 0
  let submissionCalendar: Record<string, number> = {}
  let activeYears: number[] = []

  calendarResults.forEach(result => {
    const matchedUser = result?.data?.matchedUser as
      | { userCalendar?: UserCalendar }
      | undefined
    const calendar = matchedUser?.userCalendar
    if (calendar) {
      if (calendar.streak > bestStreak) {
        bestStreak = calendar.streak
      }
      totalActiveDays += calendar.totalActiveDays
      if (calendar.activeYears) {
        activeYears = calendar.activeYears
      }
      if (calendar.submissionCalendar) {
        try {
          const parsed = JSON.parse(calendar.submissionCalendar) as Record<
            string,
            number
          >
          submissionCalendar = { ...submissionCalendar, ...parsed }
        } catch {
          // ignore parse errors
        }
      }
    }
  })

  const calendarData: CalendarData = {
    bestStreak,
    totalActiveDays,
    submissionCalendar,
    activeYears
  }

  return {
    userPublicProfile: userData.userPublicProfile ?? null,
    userContestRankingInfo: userData.userContestRankingInfo ?? null,
    userProblemsSolved: userData.userProblemsSolved ?? null,
    skillStats: userData.skillStats ?? null,
    userBadges: userData.userBadges ?? null,
    calendarData
  }
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// Optimized endpoint for fetching user data in parallel
app.post(
  '/leetcode/user-data',
  leetcodeLimiter,
  async (
    req: Request<
      Record<string, never>,
      UserDataSuccessResponse | ErrorResponse,
      UserDataRequestBody
    >,
    res: Response<UserDataSuccessResponse | ErrorResponse>
  ): Promise<void> => {
    try {
      const { username } = req.body

      if (!isValidUsername(username)) {
        res.status(400).json({
          error:
            'Invalid username. Must be 1-40 alphanumeric characters, hyphens, or underscores.'
        })
        return
      }

      const userData = await fetchUserData(username)
      res.json({ success: true, data: userData })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('Error in user-data endpoint:', message)
      res
        .status(500)
        .json({ error: 'An error occurred while fetching user data' })
    }
  }
)

// Batch endpoint for processing multiple users in parallel
app.post(
  '/leetcode/batch-user-data',
  leetcodeLimiter,
  async (
    req: Request<
      Record<string, never>,
      BatchUserDataSuccessResponse | ErrorResponse,
      BatchUserDataRequestBody
    >,
    res: Response<BatchUserDataSuccessResponse | ErrorResponse>
  ): Promise<void> => {
    try {
      const { usernames } = req.body

      if (!usernames || !Array.isArray(usernames)) {
        res.status(400).json({ error: 'Usernames array is required' })
        return
      }

      if (usernames.length > MAX_BATCH_SIZE) {
        res.status(400).json({
          error: `Maximum ${MAX_BATCH_SIZE} usernames allowed per batch`
        })
        return
      }

      // Validate all usernames
      const invalidUsernames = usernames.filter(
        (u: unknown) => !isValidUsername(u)
      )
      if (invalidUsernames.length > 0) {
        res.status(400).json({
          error: `Invalid usernames: ${invalidUsernames.join(', ')}`
        })
        return
      }

      // Process all users in parallel using the shared function directly
      const userPromises = usernames.map(
        async (username: string): Promise<BatchUserResult> => {
          try {
            const userData = await fetchUserData(username)
            return { username, success: true, data: userData }
          } catch (error) {
            const message =
              error instanceof Error ? error.message : String(error)
            console.error('Error fetching data for user:', message)
            return {
              username,
              success: false,
              error: 'Failed to fetch user data'
            }
          }
        }
      )

      const results = await Promise.all(userPromises)

      res.json({
        success: true,
        results,
        processed: results.length
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('Error in batch-user-data endpoint:', message)
      res
        .status(500)
        .json({ error: 'An error occurred while processing batch request' })
    }
  }
)

app.use(express.static(path.join(__dirname, 'client', 'dist')))

// Serve React app for all routes that don't match API endpoints (Express 5 compatible)
app.get(
  /^(?!\/leetcode).*/,
  leetcodeLimiter,
  (_req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  }
)

const PORT: string | number = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
