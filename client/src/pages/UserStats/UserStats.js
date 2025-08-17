import React, { useState } from 'react'
import './UserStats.css'
import { fetchDataForLeetcoder } from '../../utils/optimizedLeaderboardData'

function UserStats() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    setLoading(true)
    setError('')
    setUserData(null)

    try {
      const fetchedData = await fetchDataForLeetcoder({ userName: username.toLowerCase() })
      setUserData(fetchedData)
      console.log('User data:', fetchedData)
    } catch (err) {
      setError('Failed to fetch user data. Please check the username and try again.')
      console.error('Error fetching user data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const formatValue = (value, fallback = 'N/A') => {
    if (value === undefined || value === null || value === Infinity) {
      return fallback
    }
    return value.toLocaleString()
  }

  return (
    <div className="user-stats">
      <header className="user-stats__header">
        <h1 className="user-stats__title">User Stats</h1>
        <p className="user-stats__subtitle">
          Search for any LeetCode user to view their detailed statistics and progress
        </p>
      </header>

      <div className="user-stats__search">
        <input
          type="text"
          className="user-stats__search-input"
          placeholder="Enter your leetcode username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          aria-label="LeetCode username"
          aria-describedby={error ? 'error-message' : undefined}
        />
        <button 
          className="user-stats__search-button"
          onClick={handleSearch} 
          disabled={loading}
          aria-label={loading ? 'Searching...' : 'Search for user'}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {error && (
        <div className="user-stats__error" id="error-message" role="alert">
          <span className="user-stats__error-icon" aria-hidden="true">⚠</span>
          {error}
        </div>
      )}
      
      {loading && (
        <div className="user-stats__loading">
          <div className="user-stats__loading-spinner" aria-hidden="true"></div>
          <span>Loading user data...</span>
        </div>
      )}
      
      {userData && !loading && (
        <div className="user-stats__data">
          <header className="user-stats__data-header">
            <h2 className="user-stats__data-title">Results for {userData.userName}</h2>
            <p className="user-stats__data-subtitle">LeetCode Statistics Overview</p>
          </header>

          <div className="user-stats__grid">
            <div className="user-stats__card">
              <header className="user-stats__card-header">
                <span className="user-stats__card-icon" aria-hidden="true">📊</span>
                <h3 className="user-stats__card-title">Problems Solved</h3>
              </header>
              <div className="user-stats__card-content">
                <div className="user-stats__stat-item">
                  <span className="user-stats__stat-label">Total Solved:</span>
                  <span className="user-stats__stat-value user-stats__stat-value--highlight">
                    {formatValue(userData.totalSolved, '0')}
                  </span>
                </div>
                <div className="user-stats__stat-item">
                  <span className="user-stats__stat-label">Easy:</span>
                  <span className="user-stats__stat-value user-stats__stat-value--success">
                    {formatValue(userData.easySolved, '0')}
                  </span>
                </div>
                <div className="user-stats__stat-item">
                  <span className="user-stats__stat-label">Medium:</span>
                  <span className="user-stats__stat-value">
                    {formatValue(userData.mediumSolved, '0')}
                  </span>
                </div>
                <div className="user-stats__stat-item">
                  <span className="user-stats__stat-label">Hard:</span>
                  <span className="user-stats__stat-value">
                    {formatValue(userData.hardSolved, '0')}
                  </span>
                </div>
              </div>
            </div>

            <div className="user-stats__card">
              <header className="user-stats__card-header">
                <span className="user-stats__card-icon" aria-hidden="true">🏆</span>
                <h3 className="user-stats__card-title">Contest Stats</h3>
              </header>
              <div className="user-stats__card-content">
                <div className="user-stats__stat-item">
                  <span className="user-stats__stat-label">Rating:</span>
                  <span className="user-stats__stat-value user-stats__stat-value--highlight">
                    {formatValue(userData.globalContestRating, 'Unrated')}
                  </span>
                </div>
                <div className="user-stats__stat-item">
                  <span className="user-stats__stat-label">Global Ranking:</span>
                  <span className="user-stats__stat-value">
                    {formatValue(userData.globalContestRanking, 'N/A')}
                  </span>
                </div>
                <div className="user-stats__stat-item">
                  <span className="user-stats__stat-label">Contests Attended:</span>
                  <span className="user-stats__stat-value">
                    {formatValue(userData.attendedContestCount, '0')}
                  </span>
                </div>
                <div className="user-stats__stat-item">
                  <span className="user-stats__stat-label">Best Rank:</span>
                  <span className="user-stats__stat-value user-stats__stat-value--success">
                    {formatValue(userData.bestContestRank, 'N/A')}
                  </span>
                </div>
              </div>
            </div>

            <div className="user-stats__card">
              <header className="user-stats__card-header">
                <span className="user-stats__card-icon" aria-hidden="true">📅</span>
                <h3 className="user-stats__card-title">Activity</h3>
              </header>
              <div className="user-stats__card-content">
                <div className="user-stats__stat-item">
                  <span className="user-stats__stat-label">Best Streak:</span>
                  <span className="user-stats__stat-value user-stats__stat-value--highlight">
                    {formatValue(userData.bestStreak, '0')} days
                  </span>
                </div>
                <div className="user-stats__stat-item">
                  <span className="user-stats__stat-label">Active Days:</span>
                  <span className="user-stats__stat-value">
                    {formatValue(userData.totalActiveDays, '0')}
                  </span>
                </div>
                <div className="user-stats__stat-item">
                  <span className="user-stats__stat-label">Badges:</span>
                  <span className="user-stats__stat-value">
                    {formatValue(userData.badgeCount, '0')}
                  </span>
                </div>
                <div className="user-stats__stat-item">
                  <span className="user-stats__stat-label">Reputation:</span>
                  <span className="user-stats__stat-value">
                    {formatValue(userData.reputation, '0')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserStats
