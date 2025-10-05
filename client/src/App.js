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
        const filteredLeetcoders = leetcoders.filter(
          leetcoder =>
            leetcoder.userName &&
            leetcoder.userName.trim() !== '' &&
            (leetcoder.userName = leetcoder.userName.toLowerCase())
        )

        console.log(
          `Starting optimized data fetch for ${filteredLeetcoders.length} users`
        )

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

        console.log(
          `Successfully fetched data for ${successfullyFetchedUsers.length} out of ${updatedLeetcoders.length} users`
        )

        setData(successfullyFetchedUsers)
        setLoading(false)
        console.log('Data fetching completed successfully')
      } catch (error) {
        console.error('Error in data fetching:', error)
        setLoading(false)
      }
    }

    fetchData()
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
