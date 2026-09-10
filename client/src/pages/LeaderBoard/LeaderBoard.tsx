import CustomRankTable from './RankTable/CustomRankTable'
import RecentContestActivity from './RecentContestActivity'
import Loader from '../../components/Loader/Loader'
import './LeaderBoard.css'
import { FaChartBar, FaExclamationTriangle } from 'react-icons/fa'
import type { UserData } from '../../types'

interface LeaderBoardProps {
  data: Partial<UserData>[]
  loading: boolean
  error?: string | null
  loadingProgress?: number
  currentlyProcessing?: string
}

function LeaderBoard({
  data,
  loading,
  error,
  loadingProgress,
  currentlyProcessing
}: LeaderBoardProps) {
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
      return (
        <>
          <CustomRankTable data={data} />
          <RecentContestActivity data={data} />
        </>
      )
    }

    if (error) {
      return (
        <div className="leaderboard__empty" role="alert">
          <div className="leaderboard__empty-icon" aria-hidden="true">
            <FaExclamationTriangle />
          </div>
          <h2 className="leaderboard__empty-title">Could Not Load Data</h2>
          <p className="leaderboard__empty-description">{error}</p>
          <button
            type="button"
            className="leaderboard__retry"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )
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

export default LeaderBoard
