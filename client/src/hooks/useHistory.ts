import { useEffect, useState } from 'react'
import { fetchHistory } from '../api/OptimizedFetchData'
import type { History } from '../utils/history'

interface HistoryQuery {
  days?: number
  user?: string
  /** Set false to skip the request, e.g. before a user is chosen. */
  enabled?: boolean
}

// One request per distinct query per page load.
const pending = new Map<string, Promise<History | null>>()

/**
 * Daily snapshot history, or null while loading or when unavailable. Pass
 * `days` or `user` to fetch only the slice a view needs.
 */
export function useHistory({
  days,
  user,
  enabled = true
}: HistoryQuery = {}): History | null {
  const [history, setHistory] = useState<History | null>(null)

  useEffect(() => {
    if (!enabled) {
      setHistory(null)
      return
    }
    let cancelled = false
    const name = user?.toLowerCase()
    const key = `${days ?? ''}|${name ?? ''}`
    let request = pending.get(key)
    if (!request) {
      request = fetchHistory({ days, user: name })
      pending.set(key, request)
    }
    setHistory(null)
    request.then(result => {
      if (!cancelled) setHistory(result)
    })
    return () => {
      cancelled = true
    }
  }, [days, user, enabled])

  return history
}
