import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'
import rateLimit from 'express-rate-limit'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.disable('x-powered-by')

let corsOptions = {
  origin: '*'
}
app.use(cors(corsOptions))

app.use(
  helmet({
    contentSecurityPolicy: false
  })
)

app.use(express.json())

const leetcodeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 2000 // Increased limit for parallel processing
})

// Helper function to make GraphQL requests
const fetchGraphQLData = async (operationName, variables, query) => {
  const response = await fetch('https://leetcode.com/graphql', {
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

// Original single GraphQL endpoint
app.post('/leetcode', leetcodeLimiter, async (req, res) => {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(req.body)
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }

    const data = await response.json()
    res.send(data)
  } catch (error) {
    console.error(error)
    res.status(500).send('An error occurred')
  }
})

// New optimized endpoint for fetching user data in parallel
app.post('/leetcode/user-data', leetcodeLimiter, async (req, res) => {
  try {
    const { username } = req.body
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' })
    }

    // All the GraphQL queries needed for a user
    const queries = {
      userPublicProfile: {
        operationName: 'userPublicProfile',
        variables: { username },
        query: `
          query userPublicProfile($username: String!) {
            matchedUser(username: $username) {
              profile {
                userAvatar
                reputation
                ranking
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
            }
            userContestRankingHistory(username: $username) {
              attended
              rating
              ranking
              problemsSolved
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
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
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
        const data = await fetchGraphQLData(query.operationName, query.variables, query.query)
        return [key, data]
      } catch (error) {
        console.error(`Error fetching ${key} for ${username}:`, error)
        return [key, null]
      }
    })

    const results = await Promise.all(promises)
    const userData = Object.fromEntries(results)

    // Fetch calendar data for multiple years in parallel
    const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
    const calendarQuery = {
      operationName: 'userProfileCalendar',
      query: `
        query userProfileCalendar($username: String!, $year: Int!) {
          matchedUser(username: $username) {
            userCalendar(year: $year) {
              streak
              totalActiveDays
            }
          }
        }
      `
    }

    const calendarPromises = years.map(async year => {
      try {
        const data = await fetchGraphQLData(
          calendarQuery.operationName,
          { username, year },
          calendarQuery.query
        )
        return data
      } catch (error) {
        console.error(`Error fetching calendar data for ${username}, year ${year}:`, error)
        return null
      }
    })

    const calendarResults = await Promise.all(calendarPromises)
    
    // Process calendar data
    let bestStreak = 0
    let totalActiveDays = 0

    calendarResults.forEach(result => {
      if (result && result.data && result.data.matchedUser && result.data.matchedUser.userCalendar) {
        const calendar = result.data.matchedUser.userCalendar
        if (calendar.streak > bestStreak) {
          bestStreak = calendar.streak
        }
        totalActiveDays += calendar.totalActiveDays
      }
    })

    userData.calendarData = { bestStreak, totalActiveDays }

    res.json({ success: true, data: userData })
  } catch (error) {
    console.error('Error in user-data endpoint:', error)
    res.status(500).json({ error: 'An error occurred while fetching user data' })
  }
})

// New batch endpoint for processing multiple users in parallel
app.post('/leetcode/batch-user-data', leetcodeLimiter, async (req, res) => {
  try {
    const { usernames } = req.body
    
    if (!usernames || !Array.isArray(usernames)) {
      return res.status(400).json({ error: 'Usernames array is required' })
    }

    if (usernames.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 usernames allowed per batch' })
    }

    // Process all users in parallel
    const userPromises = usernames.map(async username => {
      try {
        // Make a request to our own user-data endpoint
        const response = await fetch(
          `${req.protocol}://${req.get('host')}/leetcode/user-data`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
          }
        )
        
        const userData = await response.json()
        return { username, ...userData }
      } catch (error) {
        console.error(`Error fetching data for user ${username}:`, error)
        return { username, success: false, error: error.message }
      }
    })

    const results = await Promise.all(userPromises)
    
    res.json({ 
      success: true, 
      results,
      processed: results.length 
    })
  } catch (error) {
    console.error('Error in batch-user-data endpoint:', error)
    res.status(500).json({ error: 'An error occurred while processing batch request' })
  }
})

app.use(express.static(path.join(__dirname, 'client', 'build')))

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
