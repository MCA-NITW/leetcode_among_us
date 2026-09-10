import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import NavBar from './components/Nav/NavBar'
import Home from './pages/Home/Home'
import LeaderBoard from './pages/LeaderBoard/LeaderBoard'
import UserStats from './pages/UserStats/UserStats'
import Compare from './pages/Compare/Compare'
import leetcoders from './assets/leetcoders_data.json'
import { fetchDataWithProgress } from './utils/optimizedLeaderboardData'
import type { UserData } from './types'

function App() {
  const [data, setData] = useState<Partial<UserData>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentlyProcessing, setCurrentlyProcessing] = useState('')

  useEffect(() => {
    // React StrictMode mounts effects twice in development; without this flag
    // the roster would be fetched twice and the stale run could overwrite the
    // fresh one.
    let cancelled = false

    const fetchData = async () => {
      try {
        const filteredLeetcoders = leetcoders
          .filter(
            (leetcoder: { userName?: string }) =>
              leetcoder.userName && leetcoder.userName.trim() !== ''
          )
          .map((leetcoder: { userName?: string }) => ({
            ...leetcoder,
            userName: leetcoder.userName!.toLowerCase()
          }))

        const updatedLeetcoders = await fetchDataWithProgress(
          filteredLeetcoders,
          ({ progress, currentlyProcessing }) => {
            if (cancelled) return
            setLoadingProgress(progress)
            setCurrentlyProcessing(currentlyProcessing)
          }
        )
        if (cancelled) return

        // Filter out users for whom data couldn't be fetched
        const successfullyFetchedUsers = updatedLeetcoders.filter(
          user => user.totalSolved !== undefined
        )

        if (successfullyFetchedUsers.length === 0) {
          setError(
            'Could not load any LeetCode profiles. The server may be waking up or LeetCode may be unreachable. Please try again in a moment.'
          )
        }
        setData(successfullyFetchedUsers)
        setLoading(false)
      } catch (err) {
        if (cancelled) return
        console.error('Error fetching leaderboard data:', err)
        setError(
          'Failed to load leaderboard data. Please check your connection and try again.'
        )
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <ThemeProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/leaderboard"
            element={
              <LeaderBoard
                data={data}
                loading={loading}
                error={error}
                loadingProgress={loadingProgress}
                currentlyProcessing={currentlyProcessing}
              />
            }
          />
          <Route path="/user-stats" element={<UserStats />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
