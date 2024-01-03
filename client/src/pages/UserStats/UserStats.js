import React, { useEffect, useState } from 'react'
import './UserStats.css'
import { fetchDataForLeetcoder } from '../../utils/leaderboardData'

function UserStats() {
  const [username, setUsername] = useState('')
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchDataForLeetcoder(username)
      setData(fetchedData)
    }
    fetchData()
    console.log(data)
  }, [username])

  return (
    <div className="user-stats">
      <h1 className="user-stats-header">User Stats</h1>
      <div className="user-stats-search">
        <input
          type="text"
          placeholder="Enter your leetcode username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
    </div>
  )
}

export default UserStats
