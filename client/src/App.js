// App.js
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

  useEffect(() => {
    const fetchData = async () => {
      const filteredLeetcoders = leetcoders.filter(
        leetcoder =>
          leetcoder.userName &&
          leetcoder.userName.trim() !== '' &&
          (leetcoder.userName = leetcoder.userName.toLowerCase())
      )
      const updatedLeetcoders = await Promise.all(
        filteredLeetcoders.map(fetchDataForLeetcoder)
      )
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
          element={<LeaderBoard data={data} loading={loading} />}
        />
        <Route path="/user-stats" element={<UserStats />} />
      </Routes>
    </Router>
  )
}

export default App
