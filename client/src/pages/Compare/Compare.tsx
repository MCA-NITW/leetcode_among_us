import React, { useState } from 'react'
import {
  FaTrophy,
  FaFire,
  FaChartLine,
  FaMedal,
  FaCode,
  FaCalendar,
  FaStar
} from 'react-icons/fa'
import ContentLoader from '../../components/Loader/ContentLoader'
import {
  fetchOptimizedUserData,
  processUserDataResponse
} from '../../api/OptimizedFetchData'
import './Compare.css'
import DualRatingChart from '../../components/Charts/DualRatingChart'
import DualRadarChart from '../../components/Charts/DualRadarChart'
import DifficultyGroupedBar from '../../components/Charts/DifficultyGroupedBar'
import type { UserData } from '../../types'

const getDifficultyColor = (difficulty: string): string => {
  if (difficulty === 'Easy') return '#00b8a3'
  if (difficulty === 'Medium') return '#ffc01e'
  return '#ef4743'
}

const getWinner = (
  val1: string | number | undefined,
  val2: string | number | undefined,
  higherIsBetter: boolean = true
): string | null => {
  // Handle N/A values
  if (val1 === 'N/A' && val2 === 'N/A') return 'tie'
  if (val1 === 'N/A') return 'user2'
  if (val2 === 'N/A') return 'user1'

  // Extract numeric values from strings (e.g., "#123,456" -> 123456)
  let numVal1: number = val1 as number
  let numVal2: number = val2 as number

  if (typeof val1 === 'string') {
    numVal1 = Number.parseFloat(
      val1.replaceAll(/[#,%]/g, '').replaceAll(/,/g, '')
    )
  }
  if (typeof val2 === 'string') {
    numVal2 = Number.parseFloat(
      val2.replaceAll(/[#,%]/g, '').replaceAll(/,/g, '')
    )
  }

  if (
    numVal1 === undefined ||
    numVal2 === undefined ||
    Number.isNaN(numVal1) ||
    Number.isNaN(numVal2)
  )
    return null
  if (numVal1 === numVal2) return 'tie'

  if (higherIsBetter) {
    return numVal1 > numVal2 ? 'user1' : 'user2'
  }
  return numVal1 < numVal2 ? 'user1' : 'user2'
}

interface ComparisonRowProps {
  label: string
  value1?: string | number
  value2?: string | number
  higherIsBetter?: boolean
  icon?: React.ReactNode
}

const ComparisonRow = ({
  label,
  value1,
  value2,
  higherIsBetter = true,
  icon
}: ComparisonRowProps) => {
  const winner = getWinner(value1, value2, higherIsBetter)
  const value1Class = winner === 'user1' ? 'winner' : ''
  const value1TieClass = winner === 'tie' ? 'tie' : value1Class
  const value2Class = winner === 'user2' ? 'winner' : ''
  const value2TieClass = winner === 'tie' ? 'tie' : value2Class

  return (
    <div className="comparison-row">
      <div className={`comparison-value ${value1TieClass}`}>
        {value1 === undefined ? 'N/A' : value1}
      </div>
      <div className="comparison-label">
        {icon && <span className="comparison-icon">{icon}</span>}
        {label}
      </div>
      <div className={`comparison-value ${value2TieClass}`}>
        {value2 === undefined ? 'N/A' : value2}
      </div>
    </div>
  )
}

interface DifficultyComparisonProps {
  difficulty: string
  solved1?: number
  solved2?: number
  total?: number
}

const DifficultyComparison = ({
  difficulty,
  solved1,
  solved2,
  total
}: DifficultyComparisonProps) => {
  const winner = getWinner(solved1, solved2)
  const color = getDifficultyColor(difficulty)

  return (
    <div className="difficulty-comparison">
      <div className="difficulty-header" style={{ color }}>
        {difficulty}
      </div>
      <div className="difficulty-bars">
        <div
          className={`difficulty-bar ${winner === 'user1' ? 'winner-bar' : ''}`}
        >
          <div
            className="bar-fill"
            style={{
              width: `${((solved1 ?? 0) / (total ?? 1)) * 100}%`,
              backgroundColor: color
            }}
          >
            <span className="bar-text">{solved1}</span>
          </div>
        </div>
        <div className="difficulty-total">/ {total}</div>
        <div
          className={`difficulty-bar ${winner === 'user2' ? 'winner-bar' : ''}`}
        >
          <div
            className="bar-fill"
            style={{
              width: `${((solved2 ?? 0) / (total ?? 1)) * 100}%`,
              backgroundColor: color
            }}
          >
            <span className="bar-text">{solved2}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface BeatsComparisonProps {
  difficulty: string
  beats1?: number
  beats2?: number
}

const BeatsComparison = ({
  difficulty,
  beats1,
  beats2
}: BeatsComparisonProps) => {
  const winner = getWinner(beats1, beats2)

  return (
    <div className="beats-comparison">
      <div
        className="beats-header"
        style={{ color: getDifficultyColor(difficulty) }}
      >
        {difficulty}
      </div>
      <div className={`beats-value ${winner === 'user1' ? 'winner' : ''}`}>
        {beats1 ? `${beats1.toFixed(1)}%` : 'N/A'}
      </div>
      <div className={`beats-value ${winner === 'user2' ? 'winner' : ''}`}>
        {beats2 ? `${beats2.toFixed(1)}%` : 'N/A'}
      </div>
    </div>
  )
}

const Compare = () => {
  const [username1, setUsername1] = useState('')
  const [username2, setUsername2] = useState('')
  const [user1Data, setUser1Data] = useState<Partial<UserData> | null>(null)
  const [user2Data, setUser2Data] = useState<Partial<UserData> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCompare = async () => {
    if (!username1.trim() || !username2.trim()) {
      setError('Please enter both usernames')
      return
    }

    setLoading(true)
    setError('')
    setUser1Data(null)
    setUser2Data(null)

    try {
      const [rawData1, rawData2] = await Promise.all([
        fetchOptimizedUserData(username1.trim().toLowerCase()),
        fetchOptimizedUserData(username2.trim().toLowerCase())
      ])

      // Process the raw backend data into the format we need
      const processedData1 = processUserDataResponse(
        { userName: username1 },
        rawData1
      )
      const processedData2 = processUserDataResponse(
        { userName: username2 },
        rawData2
      )

      setUser1Data(processedData1 as Partial<UserData>)
      setUser2Data(processedData2 as Partial<UserData>)
    } catch (err) {
      console.error('Error fetching user data for comparison:', err)
      setError(
        'Error fetching user data. Please check usernames and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCompare()
    }
  }

  return (
    <div className="compare-container">
      <div className="compare-header">
        <h1 className="compare-title">
          <FaChartLine /> Compare LeetCoders
        </h1>
        <p className="compare-subtitle">
          Enter two usernames to compare their LeetCode performance
        </p>
      </div>

      <div className="compare-input-section">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter first username"
            value={username1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername1(e.target.value)
            }
            onKeyDown={handleKeyPress}
            className="compare-input user1-input"
          />
          <span className="vs-text">VS</span>
          <input
            type="text"
            placeholder="Enter second username"
            value={username2}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername2(e.target.value)
            }
            onKeyDown={handleKeyPress}
            className="compare-input user2-input"
          />
        </div>
        <button
          onClick={handleCompare}
          className="compare-button"
          disabled={loading}
        >
          {loading ? 'Comparing...' : 'Compare'}
        </button>
      </div>

      {error && (
        <div className="compare-error" role="alert">
          {error}
        </div>
      )}

      {loading && (
        <ContentLoader
          message="Comparing LeetCode profiles..."
          variant="compare"
        />
      )}

      {!loading && user1Data && user2Data && (
        <div className="comparison-results">
          {/* User Headers */}
          <div className="user-headers">
            <div className="user-header user1-header">
              {user1Data.avatar && (
                <img
                  src={user1Data.avatar}
                  alt={user1Data.name}
                  className="user-avatar"
                />
              )}
              <div className="user-info">
                <h2>{user1Data.name || username1}</h2>
                <p className="username">@{username1}</p>
              </div>
            </div>
            <div className="header-spacer"></div>
            <div className="user-header user2-header">
              {user2Data.avatar && (
                <img
                  src={user2Data.avatar}
                  alt={user2Data.name}
                  className="user-avatar"
                />
              )}
              <div className="user-info">
                <h2>{user2Data.name || username2}</h2>
                <p className="username">@{username2}</p>
              </div>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="comparison-section">
            <h3 className="section-title">
              <FaTrophy /> Overall Performance
            </h3>
            <ComparisonRow
              label="Total Problems Solved"
              value1={user1Data.totalSolved}
              value2={user2Data.totalSolved}
              icon={<FaCode />}
            />
            <ComparisonRow
              label="Global Ranking"
              value1={
                user1Data.ranking || user1Data.questionRanking
                  ? `#${(user1Data.ranking || user1Data.questionRanking!).toLocaleString()}`
                  : 'N/A'
              }
              value2={
                user2Data.ranking || user2Data.questionRanking
                  ? `#${(user2Data.ranking || user2Data.questionRanking!).toLocaleString()}`
                  : 'N/A'
              }
              higherIsBetter={false}
            />
            <ComparisonRow
              label="Reputation"
              value1={user1Data.reputation || 0}
              value2={user2Data.reputation || 0}
              icon={<FaStar />}
            />
          </div>

          {/* Problems by Difficulty */}
          <div className="comparison-section">
            <h3 className="section-title">
              <FaCode /> Problems Solved by Difficulty
            </h3>
            <DifficultyComparison
              difficulty="Easy"
              solved1={user1Data.easySolved}
              solved2={user2Data.easySolved}
              total={user1Data.totalEasy || user2Data.totalEasy}
            />
            <DifficultyComparison
              difficulty="Medium"
              solved1={user1Data.mediumSolved}
              solved2={user2Data.mediumSolved}
              total={user1Data.totalMedium || user2Data.totalMedium}
            />
            <DifficultyComparison
              difficulty="Hard"
              solved1={user1Data.hardSolved}
              solved2={user2Data.hardSolved}
              total={user1Data.totalHard || user2Data.totalHard}
            />
          </div>

          {/* Beats Stats */}
          {((user1Data.beatsStats?.length ?? 0) > 0 ||
            (user2Data.beatsStats?.length ?? 0) > 0) && (
            <div className="comparison-section">
              <h3 className="section-title">
                <FaChartLine /> Performance Comparison (Beats %)
              </h3>
              <BeatsComparison
                difficulty="Easy"
                beats1={
                  user1Data.beatsStats?.find(s => s.difficulty === 'Easy')
                    ?.percentage
                }
                beats2={
                  user2Data.beatsStats?.find(s => s.difficulty === 'Easy')
                    ?.percentage
                }
              />
              <BeatsComparison
                difficulty="Medium"
                beats1={
                  user1Data.beatsStats?.find(s => s.difficulty === 'Medium')
                    ?.percentage
                }
                beats2={
                  user2Data.beatsStats?.find(s => s.difficulty === 'Medium')
                    ?.percentage
                }
              />
              <BeatsComparison
                difficulty="Hard"
                beats1={
                  user1Data.beatsStats?.find(s => s.difficulty === 'Hard')
                    ?.percentage
                }
                beats2={
                  user2Data.beatsStats?.find(s => s.difficulty === 'Hard')
                    ?.percentage
                }
              />
            </div>
          )}

          {/* Contest Stats */}
          <div className="comparison-section">
            <h3 className="section-title">
              <FaMedal /> Contest Performance
            </h3>
            <ComparisonRow
              label="Contest Rating"
              value1={user1Data.globalContestRating || 0}
              value2={user2Data.globalContestRating || 0}
              icon={<FaTrophy />}
            />
            <ComparisonRow
              label="Contest Ranking"
              value1={
                user1Data.globalContestRanking &&
                user1Data.globalContestRanking !== Infinity
                  ? `#${user1Data.globalContestRanking.toLocaleString()}`
                  : 'N/A'
              }
              value2={
                user2Data.globalContestRanking &&
                user2Data.globalContestRanking !== Infinity
                  ? `#${user2Data.globalContestRanking.toLocaleString()}`
                  : 'N/A'
              }
              higherIsBetter={false}
            />
            <ComparisonRow
              label="Top Percentage"
              value1={
                user1Data.contestTopPercentage &&
                user1Data.contestTopPercentage < 100
                  ? `${user1Data.contestTopPercentage.toFixed(2)}%`
                  : 'N/A'
              }
              value2={
                user2Data.contestTopPercentage &&
                user2Data.contestTopPercentage < 100
                  ? `${user2Data.contestTopPercentage.toFixed(2)}%`
                  : 'N/A'
              }
              higherIsBetter={false}
            />
            <ComparisonRow
              label="Contests Attended"
              value1={
                user1Data.attendedContestCount ||
                user1Data.attendedContestsCount ||
                0
              }
              value2={
                user2Data.attendedContestCount ||
                user2Data.attendedContestsCount ||
                0
              }
              icon={<FaMedal />}
            />
          </div>

          {/* Activity Stats */}
          <div className="comparison-section">
            <h3 className="section-title">
              <FaFire /> Activity & Consistency
            </h3>
            <ComparisonRow
              label="Best Streak"
              value1={
                user1Data.bestStreak ? `${user1Data.bestStreak} days` : 'N/A'
              }
              value2={
                user2Data.bestStreak ? `${user2Data.bestStreak} days` : 'N/A'
              }
              icon={<FaFire />}
            />
            <ComparisonRow
              label="Total Active Days"
              value1={user1Data.totalActiveDays}
              value2={user2Data.totalActiveDays}
              icon={<FaCalendar />}
            />
          </div>

          {/* Badges Comparison */}
          <div className="comparison-section">
            <h3 className="section-title">
              <FaMedal /> Badges Earned
            </h3>
            <ComparisonRow
              label="Total Badges"
              value1={user1Data.badges?.length || 0}
              value2={user2Data.badges?.length || 0}
              icon={<FaMedal />}
            />
            <div className="badges-showcase">
              <div className="user-badges">
                {user1Data.badges?.slice(0, 5).map(badge => (
                  <img
                    key={badge.id || badge.name}
                    src={badge.icon}
                    alt={badge.name}
                    title={badge.hoverText || badge.name}
                    className="badge-icon-small"
                  />
                ))}
                {(user1Data.badges?.length ?? 0) > 5 && (
                  <span className="more-badges">
                    +{(user1Data.badges?.length ?? 0) - 5} more
                  </span>
                )}
              </div>
              <div className="badges-spacer"></div>
              <div className="user-badges">
                {user2Data.badges?.slice(0, 5).map(badge => (
                  <img
                    key={badge.id || badge.name}
                    src={badge.icon}
                    alt={badge.name}
                    title={badge.hoverText || badge.name}
                    className="badge-icon-small"
                  />
                ))}
                {(user2Data.badges?.length ?? 0) > 5 && (
                  <span className="more-badges">
                    +{(user2Data.badges?.length ?? 0) - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Chart Comparisons */}
          {((user1Data.contestHistory?.length ?? 0) > 0 ||
            (user2Data.contestHistory?.length ?? 0) > 0) && (
            <div className="comparison-section">
              <h3 className="section-title">
                <FaChartLine /> Contest Rating History
              </h3>
              <DualRatingChart
                user1History={user1Data.contestHistory || []}
                user2History={user2Data.contestHistory || []}
                user1Name={user1Data.name || username1}
                user2Name={user2Data.name || username2}
              />
            </div>
          )}

          {(user1Data.tagProblemCounts || user2Data.tagProblemCounts) && (
            <div className="comparison-section">
              <h3 className="section-title">
                <FaCode /> Topic Proficiency
              </h3>
              <DualRadarChart
                user1Tags={user1Data.tagProblemCounts}
                user2Tags={user2Data.tagProblemCounts}
                user1Name={user1Data.name || username1}
                user2Name={user2Data.name || username2}
              />
            </div>
          )}

          <div className="comparison-section">
            <h3 className="section-title">
              <FaChartLine /> Difficulty Breakdown
            </h3>
            <DifficultyGroupedBar
              user1Data={user1Data}
              user2Data={user2Data}
              user1Name={user1Data.name || username1}
              user2Name={user2Data.name || username2}
            />
          </div>

          {/* Summary */}
          <div className="comparison-summary">
            <h3>🏆 Overall Winner</h3>
            <div className="winner-announcement">
              {(() => {
                const rank1 =
                  user1Data.ranking || user1Data.questionRanking || Infinity
                const rank2 =
                  user2Data.ranking || user2Data.questionRanking || Infinity
                const score1 = [
                  (user1Data.totalSolved ?? 0) > (user2Data.totalSolved ?? 0)
                    ? 1
                    : 0,
                  rank1 < rank2 ? 1 : 0,
                  (user1Data.globalContestRating || 0) >
                  (user2Data.globalContestRating || 0)
                    ? 1
                    : 0,
                  (user1Data.bestStreak || 0) > (user2Data.bestStreak || 0)
                    ? 1
                    : 0,
                  (user1Data.badges?.length || 0) >
                  (user2Data.badges?.length || 0)
                    ? 1
                    : 0
                ].reduce((a, b) => a + b, 0)
                const score2 = 5 - score1
                if (score1 > score2) {
                  return (
                    <div className="winner-text user1-winner">
                      🎉 {user1Data.name || username1} leads in {score1} out of
                      5 categories!
                    </div>
                  )
                } else if (score2 > score1) {
                  return (
                    <div className="winner-text user2-winner">
                      🎉 {user2Data.name || username2} leads in {score2} out of
                      5 categories!
                    </div>
                  )
                } else {
                  return (
                    <div className="winner-text tie-text">
                      🤝 It's a tie! Both users are equally matched!
                    </div>
                  )
                }
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Compare
