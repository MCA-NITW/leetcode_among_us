import React from 'react'
import PropTypes from 'prop-types'
import CustomRankTable from './RankTable/CustomRankTable'
import Loader from '../../components/Loader/Loader'
import './LeaderBoard.css'
import { FaChartBar } from 'react-icons/fa'

function LeaderBoard({ data, loading, loadingProgress, currentlyProcessing }) {
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
      return <CustomRankTable data={data} />
    }

    return (
      <div className="leaderboard__empty">
        <div className="leaderboard__empty-icon" aria-hidden="true">
          <FaChartBar />
        </div>
        <h2 className="leaderboard__empty-title">No Data Available</h2>
        <p className="leaderboard__empty-description">
          There is no leaderboard data to display at the moment. Please check
          back later or contact an administrator.
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

      <div className="leaderboard__content">{renderContent()}</div>
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
