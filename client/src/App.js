import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavBar from './components/Nav/NavBar'
import Home from './pages/Home/Home'
import LeaderBoard from './pages/LeaderBoard/LeaderBoard'
import UserStats from './pages/UserStats/UserStats'
import leetcoders from './assets/leetcoders_data.json'
import { fetchDataForLeetcoder } from './utils/leaderboardData'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentlyProcessing, setCurrentlyProcessing] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const filteredLeetcoders = leetcoders.filter(
        leetcoder =>
          leetcoder.userName &&
          leetcoder.userName.trim() !== '' &&
          (leetcoder.userName = leetcoder.userName.toLowerCase())
      )

      const totalUsers = filteredLeetcoders.length
      const updatedLeetcoders = []

      const batchSize = 5
      const batches = []

      for (let i = 0; i < filteredLeetcoders.length; i += batchSize) {
        batches.push(filteredLeetcoders.slice(i, i + batchSize))
      }

      let completedUsers = 0

      for (const batch of batches) {
        const batchUsernames = batch.map(user => user.userName).join(', ')
        setCurrentlyProcessing(`Processing: ${batchUsernames}`)

        const batchPromises = batch.map(async leetcoder => {
          try {
            const userData = await fetchDataForLeetcoder(leetcoder)
            return userData
          } catch (error) {
            console.error(
              'Error fetching data for user:',
              leetcoder.userName,
              error
            )
            return leetcoder
          }
        })

        const batchResults = await Promise.all(batchPromises)
        updatedLeetcoders.push(...batchResults)

        completedUsers += batchResults.length
        const progress = (completedUsers / totalUsers) * 100
        setLoadingProgress(progress)
      }

      setCurrentlyProcessing('Complete!')
      setData(updatedLeetcoders)
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
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
      </Routes>
    </Router>
  )
}

export default App
