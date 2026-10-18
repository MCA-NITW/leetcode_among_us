import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import {
  app,
  buildAllowedOrigins,
  clearUserCache,
  HISTORY_URL,
  isValidUsername
} from '../server.ts'

/** Minimal upstream payload that satisfies every GraphQL query the server issues. */
const matchedUserPayload = (username: string) => ({
  data: {
    matchedUser: {
      username,
      profile: { realName: username, ranking: 1234 },
      userCalendar: {
        activeYears: [2025],
        streak: 3,
        totalActiveDays: 10,
        submissionCalendar: '{"1735689600":2}'
      }
    },
    allQuestionsCount: [],
    userContestRanking: null,
    userContestRankingHistory: []
  }
})

const notFoundPayload = {
  data: { matchedUser: null },
  errors: [{ message: 'That user does not exist.' }]
}

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  clearUserCache()
  fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body)) as {
      variables: { username: string }
    }
    const { username } = body.variables
    return username.startsWith('ghost')
      ? jsonResponse(notFoundPayload)
      : jsonResponse(matchedUserPayload(username))
  })
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('isValidUsername', () => {
  it('accepts alphanumerics, hyphens and underscores up to 40 chars', () => {
    expect(isValidUsername('_Devesh_G')).toBe(true)
    expect(isValidUsername('a-b_c9')).toBe(true)
    expect(isValidUsername('a'.repeat(40))).toBe(true)
  })

  it('rejects empty, overlong, non-string and special-character input', () => {
    expect(isValidUsername('')).toBe(false)
    expect(isValidUsername('   ')).toBe(false)
    expect(isValidUsername('a'.repeat(41))).toBe(false)
    expect(isValidUsername('user name')).toBe(false)
    expect(isValidUsername('user;drop')).toBe(false)
    expect(isValidUsername(42)).toBe(false)
    expect(isValidUsername(null)).toBe(false)
  })
})

describe('GET /health', () => {
  it('reports ok without touching upstream', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(typeof res.body.uptime).toBe('number')
    expect(res.body.cachedUsers).toBe(0)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('POST /leetcode/user-data', () => {
  it('rejects an invalid username with 400 and no upstream call', async () => {
    const res = await request(app)
      .post('/leetcode/user-data')
      .send({ username: 'bad name!' })
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/Invalid username/)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects a missing body with 400', async () => {
    const res = await request(app).post('/leetcode/user-data')
    expect(res.status).toBe(400)
  })

  it('returns the aggregated profile for a valid user', async () => {
    const res = await request(app)
      .post('/leetcode/user-data')
      .send({ username: 'alice' })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.userPublicProfile.data.matchedUser.username).toBe(
      'alice'
    )
    expect(res.body.data.calendarData).toEqual({
      bestStreak: 3,
      totalActiveDays: 10,
      submissionCalendar: { '1735689600': 2 },
      activeYears: [2025]
    })
  })

  it('serves a repeat request from cache (case-insensitively)', async () => {
    await request(app).post('/leetcode/user-data').send({ username: 'Alice' })
    const upstreamCalls = fetchMock.mock.calls.length
    expect(upstreamCalls).toBeGreaterThan(0)

    const res = await request(app)
      .post('/leetcode/user-data')
      .send({ username: 'alice' })
    expect(res.status).toBe(200)
    expect(fetchMock.mock.calls).toHaveLength(upstreamCalls)

    const health = await request(app).get('/health')
    expect(health.body.cachedUsers).toBe(1)
  })

  it('does not cache a user LeetCode does not know', async () => {
    await request(app).post('/leetcode/user-data').send({ username: 'ghost1' })
    const first = fetchMock.mock.calls.length
    await request(app).post('/leetcode/user-data').send({ username: 'ghost1' })
    expect(fetchMock.mock.calls).toHaveLength(first * 2)
  })

  it('maps a full upstream outage to 502 without leaking details', async () => {
    fetchMock.mockImplementation(async () => {
      throw new Error('socket hang up')
    })
    const res = await request(app)
      .post('/leetcode/user-data')
      .send({ username: 'alice' })
    expect(res.status).toBe(502)
    expect(res.body.error).not.toMatch(/socket/)
    // Five parallel queries failed; the calendar calls are skipped.
    expect(fetchMock.mock.calls).toHaveLength(5)

    const health = await request(app).get('/health')
    expect(health.body.cachedUsers).toBe(0)
  })

  it('still returns 200 when only some queries fail', async () => {
    const working = fetchMock.getMockImplementation()!
    fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
      const { operationName } = JSON.parse(String(init?.body)) as {
        operationName: string
      }
      if (operationName === 'userBadges') throw new Error('timeout')
      return working(url, init)
    })
    const res = await request(app)
      .post('/leetcode/user-data')
      .send({ username: 'alice' })
    expect(res.status).toBe(200)
    expect(res.body.data.userBadges).toBeNull()
    expect(res.body.data.userPublicProfile.data.matchedUser.username).toBe(
      'alice'
    )
  })
})

describe('POST /leetcode/batch-user-data', () => {
  it('requires an array', async () => {
    const res = await request(app)
      .post('/leetcode/batch-user-data')
      .send({ usernames: 'alice' })
    expect(res.status).toBe(400)
  })

  it('caps the batch size at 10', async () => {
    const usernames = Array.from({ length: 11 }, (_, i) => `user${i}`)
    const res = await request(app)
      .post('/leetcode/batch-user-data')
      .send({ usernames })
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/Maximum 10/)
  })

  it('rejects invalid usernames without echoing them back', async () => {
    const res = await request(app)
      .post('/leetcode/batch-user-data')
      .send({ usernames: ['alice', '<script>'] })
    expect(res.status).toBe(400)
    expect(res.body.error).not.toContain('<script>')
    expect(res.body.error).toMatch(/1 invalid username/)
  })

  it('fetches each distinct user once even when duplicated in a batch', async () => {
    await request(app).post('/leetcode/user-data').send({ username: 'carol' })
    const callsForOneUser = fetchMock.mock.calls.length
    fetchMock.mockClear()

    const res = await request(app)
      .post('/leetcode/batch-user-data')
      .send({ usernames: ['bob', 'Bob', 'bob'] })
    expect(res.status).toBe(200)
    expect(res.body.processed).toBe(3)
    expect(res.body.results.every((r: { success: boolean }) => r.success)).toBe(
      true
    )
    expect(fetchMock.mock.calls).toHaveLength(callsForOneUser)
  })

  it('marks each user failed when LeetCode is down', async () => {
    fetchMock.mockImplementation(async () => {
      throw new Error('ECONNRESET')
    })
    const res = await request(app)
      .post('/leetcode/batch-user-data')
      .send({ usernames: ['alice', 'bob'] })
    expect(res.status).toBe(200)
    expect(res.body.results).toEqual([
      { username: 'alice', success: false, error: 'Failed to fetch user data' },
      { username: 'bob', success: false, error: 'Failed to fetch user data' }
    ])
  })
})

describe('GET /leetcode/history', () => {
  const history = {
    version: 1,
    snapshots: [
      {
        date: '2026-10-17',
        users: {
          alice: {
            solved: 10,
            easy: 5,
            medium: 4,
            hard: 1,
            rating: 1500,
            contests: 2
          }
        }
      },
      { date: 'not-a-date', users: {} }
    ]
  }

  it('serves valid snapshots from HISTORY_URL and caches them', async () => {
    fetchMock.mockImplementation(async () => jsonResponse(history))
    const res = await request(app).get('/leetcode/history')
    expect(res.status).toBe(200)
    expect(res.body.snapshots).toHaveLength(1)
    expect(res.body.snapshots[0].users.alice.solved).toBe(10)
    expect(fetchMock).toHaveBeenCalledWith(HISTORY_URL, expect.anything())

    await request(app).get('/leetcode/history')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('narrows to recent days and one user', async () => {
    const day = (date: string) => ({
      date,
      users: {
        alice: {
          solved: 1,
          easy: 1,
          medium: 0,
          hard: 0,
          rating: null,
          contests: 0
        },
        bob: {
          solved: 2,
          easy: 2,
          medium: 0,
          hard: 0,
          rating: null,
          contests: 0
        }
      }
    })
    fetchMock.mockImplementation(async () =>
      jsonResponse({
        snapshots: [day('2026-10-18'), day('2026-10-01'), day('2026-10-11')]
      })
    )
    const recent = await request(app).get('/leetcode/history?days=7')
    expect(recent.body.snapshots.map((s: { date: string }) => s.date)).toEqual([
      '2026-10-11',
      '2026-10-18'
    ])

    const one = await request(app).get('/leetcode/history?user=Bob')
    expect(one.body.snapshots).toHaveLength(3)
    expect(Object.keys(one.body.snapshots[0].users)).toEqual(['bob'])

    const nobody = await request(app).get('/leetcode/history?user=carol')
    expect(nobody.body.snapshots).toEqual([])
    // All three requests were served from one upstream fetch.
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('rejects bad days and user parameters', async () => {
    for (const query of ['days=0', 'days=abc', 'days=2.5', 'user=a%20b']) {
      const res = await request(app).get(`/leetcode/history?${query}`)
      expect(res.status).toBe(400)
    }
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('treats a missing data branch as empty history', async () => {
    fetchMock.mockImplementation(
      async () => new Response('404: Not Found', { status: 404 })
    )
    const res = await request(app).get('/leetcode/history')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ snapshots: [] })
  })

  it('returns 502 when the history source fails', async () => {
    fetchMock.mockImplementation(async () => {
      throw new Error('getaddrinfo ENOTFOUND')
    })
    const res = await request(app).get('/leetcode/history')
    expect(res.status).toBe(502)
    expect(res.body.error).not.toMatch(/ENOTFOUND/)
  })
})

describe('buildAllowedOrigins', () => {
  it('adds the Render URL and ALLOWED_ORIGINS to the defaults', () => {
    const origins = buildAllowedOrigins({
      RENDER_EXTERNAL_URL: 'https://my-college.onrender.com',
      ALLOWED_ORIGINS: ' https://a.example/ ,https://b.example,,'
    })
    expect(origins.has('http://localhost:3000')).toBe(true)
    expect(origins.has('https://my-college.onrender.com')).toBe(true)
    expect(origins.has('https://a.example')).toBe(true)
    expect(origins.has('https://b.example')).toBe(true)
    expect(origins.has('')).toBe(false)
  })
})

describe('error handling', () => {
  it('returns JSON 404 for unknown API paths', async () => {
    const res = await request(app).get('/leetcode/does-not-exist')
    expect(res.status).toBe(404)
    expect(res.body).toEqual({ error: 'Not found' })
  })

  it('rejects disallowed origins with 403 instead of a stack trace', async () => {
    const res = await request(app)
      .get('/health')
      .set('Origin', 'https://evil.example')
    expect(res.status).toBe(403)
    expect(res.body).toEqual({ error: 'Origin not allowed' })
    expect(res.text).not.toMatch(/at .*server/)
  })

  it('allows whitelisted origins', async () => {
    const res = await request(app)
      .get('/health')
      .set('Origin', 'http://localhost:3000')
    expect(res.status).toBe(200)
    expect(res.headers['access-control-allow-origin']).toBe(
      'http://localhost:3000'
    )
  })

  it('returns 400 for malformed JSON', async () => {
    const res = await request(app)
      .post('/leetcode/user-data')
      .set('Content-Type', 'application/json')
      .send('{"username": ')
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid request body' })
  })

  it('sends security headers', async () => {
    const res = await request(app).get('/health')
    expect(res.headers['x-powered-by']).toBeUndefined()
    expect(res.headers['content-security-policy']).toContain(
      'https://fonts.googleapis.com'
    )
    expect(res.headers['content-security-policy']).toContain(
      'https://fonts.gstatic.com'
    )
  })
})
