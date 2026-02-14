import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import NavBar from './components/Nav/NavBar'
import Home from './pages/Home/Home'
import LeaderBoard from './pages/LeaderBoard/LeaderBoard'
import UserStats from './pages/UserStats/UserStats'
import Compare from './pages/Compare/Compare'
import leetcoders from './assets/leetcoders_data.json'
import { fetchDataWithProgress } from './utils/optimizedLeaderboardData'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentlyProcessing, setCurrentlyProcessing] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filteredLeetcoders = leetcoders
          .filter(
            leetcoder =>
              leetcoder.userName && leetcoder.userName.trim() !== ''
          )
          .map(leetcoder => ({
            ...leetcoder,
            userName: leetcoder.userName.toLowerCase()
          }))

        const updatedLeetcoders = await fetchDataWithProgress(
          filteredLeetcoders,
          ({ progress, currentlyProcessing }) => {
            setLoadingProgress(progress)
            setCurrentlyProcessing(currentlyProcessing)
          }
        )

        // Filter out users for whom data couldn't be fetched
        const successfullyFetchedUsers = updatedLeetcoders.filter(
          user => user.totalSolved !== undefined
        )

        setData(successfullyFetchedUsers)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <ThemeProvider>
      <Router
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/leaderboard"
            element={
              <LeaderBoard
                data={data}
                loading={loading}
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
