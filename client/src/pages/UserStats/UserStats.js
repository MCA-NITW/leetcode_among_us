import React, { useState } from 'react'
import './UserStats.css'
import { fetchDataForLeetcoder } from '../../utils/leaderboardData'

function UserStats() {
  const [username, setUsername] = useState('')

  const handleSearch = async () => {
    if (username.trim()) {
      const fetchedData = await fetchDataForLeetcoder({ userName: username })
      console.log('User data:', fetchedData)
    }
  }

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
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  )
}

export default UserStats
