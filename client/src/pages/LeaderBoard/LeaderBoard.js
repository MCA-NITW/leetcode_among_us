import React from 'react'
import PropTypes from 'prop-types'
import RankTable from './RankTable/RankTable'
import Loader from '../../components/Loader/Loader'
import './LeaderBoard.css'

function LeaderBoard({ data, loading, loadingProgress, currentlyProcessing }) {
  const totalUsers = data ? data.length : 0
  const activeUsers = data ? data.filter(user => user.totalSolved > 0).length : 0

  const renderContent = () => {
    if (loading) {
      return (
        <Loader
          progress={loadingProgress}
          currentlyProcessing={currentlyProcessing}
        />
      )
    }

    if (data && data.length > 0) {
      return <RankTable data={data} />
    }

    return (
      <div className="leaderboard__empty">
        <div className="leaderboard__empty-icon" aria-hidden="true">📊</div>
        <h2 className="leaderboard__empty-title">No Data Available</h2>
        <p className="leaderboard__empty-description">
          There is no leaderboard data to display at the moment. 
          Please check back later or contact an administrator.
        </p>
      </div>
    )
  }

  return (
    <div className="leaderboard">
      <header className="leaderboard__header">
        <h1 className="leaderboard__title">Leetcode Leaderboard</h1>
        <p className="leaderboard__subtitle">
          Compete with fellow coders and track your progress
        </p>
      </header>

      {!loading && data && data.length > 0 && (
        <div className="leaderboard__stats">
          <div className="leaderboard__stat">
            <span className="leaderboard__stat-value">{totalUsers}</span>
            <span className="leaderboard__stat-label">Total Users</span>
          </div>
          <div className="leaderboard__stat">
            <span className="leaderboard__stat-value">{activeUsers}</span>
            <span className="leaderboard__stat-label">Active Users</span>
          </div>
          <div className="leaderboard__stat">
            <span className="leaderboard__stat-value">
              {data.reduce((sum, user) => sum + (user.totalSolved || 0), 0)}
            </span>
            <span className="leaderboard__stat-label">Total Problems Solved</span>
          </div>
        </div>
      )}

      <div className="leaderboard__content">
        {renderContent()}
      </div>
    </div>
  )
}

LeaderBoard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  loadingProgress: PropTypes.number,
  currentlyProcessing: PropTypes.string
}

export default LeaderBoard
