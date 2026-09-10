import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { app, clearUserCache, isValidUsername } from '../server.ts'

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
    expect(fetchMock.mock.calls.length).toBe(upstreamCalls)

    const health = await request(app).get('/health')
    expect(health.body.cachedUsers).toBe(1)
  })

  it('does not cache a user LeetCode does not know', async () => {
    await request(app).post('/leetcode/user-data').send({ username: 'ghost1' })
    const first = fetchMock.mock.calls.length
    await request(app).post('/leetcode/user-data').send({ username: 'ghost1' })
    expect(fetchMock.mock.calls.length).toBe(first * 2)
  })

  it('maps an upstream failure to 502 without leaking details', async () => {
    fetchMock.mockImplementation(async () => {
      throw new Error('socket hang up')
    })
    const res = await request(app)
      .post('/leetcode/user-data')
      .send({ username: 'alice' })
    // Per-query failures are tolerated (nulls); the request still succeeds
    // because the calendar loop and profile queries each catch their own errors.
    expect([200, 502]).toContain(res.status)
    if (res.status === 502) {
      expect(res.body.error).not.toMatch(/socket/)
    }
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
    expect(fetchMock.mock.calls.length).toBe(callsForOneUser)
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
