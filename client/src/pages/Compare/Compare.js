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
import Loader from '../../components/Loader/Loader'
import {
  fetchOptimizedUserData,
  processUserDataResponse
} from '../../api/OptimizedFetchData'
import './Compare.css'

const getDifficultyColor = difficulty => {
  if (difficulty === 'Easy') return '#00b8a3'
  if (difficulty === 'Medium') return '#ffc01e'
  return '#ef4743'
}

const Compare = () => {
  const [username1, setUsername1] = useState('')
  const [username2, setUsername2] = useState('')
  const [user1Data, setUser1Data] = useState(null)
  const [user2Data, setUser2Data] = useState(null)
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

      setUser1Data(processedData1)
      setUser2Data(processedData2)
    } catch (err) {
      setError(
        'Error fetching user data. Please check usernames and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleCompare()
    }
  }

  const getWinner = (val1, val2, higherIsBetter = true) => {
    // Handle N/A values
    if (val1 === 'N/A' && val2 === 'N/A') return 'tie'
    if (val1 === 'N/A') return 'user2'
    if (val2 === 'N/A') return 'user1'

    // Extract numeric values from strings (e.g., "#123,456" -> 123456)
    let numVal1 = val1
    let numVal2 = val2

    if (typeof val1 === 'string') {
      numVal1 = parseFloat(val1.replace(/[#,%]/g, '').replace(/,/g, ''))
    }
    if (typeof val2 === 'string') {
      numVal2 = parseFloat(val2.replace(/[#,%]/g, '').replace(/,/g, ''))
    }

    if (
      numVal1 === undefined ||
      numVal2 === undefined ||
      isNaN(numVal1) ||
      isNaN(numVal2)
    )
      return null
    if (numVal1 === numVal2) return 'tie'

    if (higherIsBetter) {
      return numVal1 > numVal2 ? 'user1' : 'user2'
    } else {
      return numVal1 < numVal2 ? 'user1' : 'user2'
    }
  }

  const ComparisonRow = ({
    label,
    value1,
    value2,
    higherIsBetter = true,
    icon
  }) => {
    const winner = getWinner(value1, value2, higherIsBetter)

    return (
      <div className="comparison-row">
        <div
          className={`comparison-value ${
            winner === 'user1' ? 'winner' : winner === 'tie' ? 'tie' : ''
          }`}
        >
          {value1 !== undefined ? value1 : 'N/A'}
        </div>
        <div className="comparison-label">
          {icon && <span className="comparison-icon">{icon}</span>}
          {label}
        </div>
        <div
          className={`comparison-value ${
            winner === 'user2' ? 'winner' : winner === 'tie' ? 'tie' : ''
          }`}
        >
          {value2 !== undefined ? value2 : 'N/A'}
        </div>
      </div>
    )
  }

  const DifficultyComparison = ({ difficulty, solved1, solved2, total }) => {
    const winner = getWinner(solved1, solved2)
    const color = getDifficultyColor(difficulty)

    return (
      <div className="difficulty-comparison">
        <div className="difficulty-header" style={{ color }}>
          {difficulty}
        </div>
        <div className="difficulty-bars">
          <div
            className={`difficulty-bar ${
              winner === 'user1' ? 'winner-bar' : ''
            }`}
          >
            <div
              className="bar-fill"
              style={{
                width: `${(solved1 / total) * 100}%`,
                backgroundColor: color
              }}
            >
              <span className="bar-text">{solved1}</span>
            </div>
          </div>
          <div className="difficulty-total">/ {total}</div>
          <div
            className={`difficulty-bar ${
              winner === 'user2' ? 'winner-bar' : ''
            }`}
          >
            <div
              className="bar-fill"
              style={{
                width: `${(solved2 / total) * 100}%`,
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

  const BeatsComparison = ({ difficulty, beats1, beats2 }) => {
    const winner = getWinner(beats1, beats2)

    return (
      <div className="beats-comparison">
        <div className="beats-header" style={{ color: getDifficultyColor(difficulty) }}>
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
            onChange={e => setUsername1(e.target.value)}
            onKeyDown={handleKeyPress}
            className="compare-input user1-input"
          />
          <span className="vs-text">VS</span>
          <input
            type="text"
            placeholder="Enter second username"
            value={username2}
            onChange={e => setUsername2(e.target.value)}
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

      {loading && <Loader />}

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
                  ? `#${(
                      user1Data.ranking || user1Data.questionRanking
                    ).toLocaleString()}`
                  : 'N/A'
              }
              value2={
                user2Data.ranking || user2Data.questionRanking
                  ? `#${(
                      user2Data.ranking || user2Data.questionRanking
                    ).toLocaleString()}`
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
          {(user1Data.beatsStats?.length > 0 ||
            user2Data.beatsStats?.length > 0) && (
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
                {user1Data.badges?.slice(0, 5).map((badge, idx) => (
                  <img
                    key={idx}
                    src={badge.icon}
                    alt={badge.name}
                    title={badge.hoverText || badge.name}
                    className="badge-icon-small"
                  />
                ))}
                {user1Data.badges?.length > 5 && (
                  <span className="more-badges">
                    +{user1Data.badges.length - 5} more
                  </span>
                )}
              </div>
              <div className="badges-spacer"></div>
              <div className="user-badges">
                {user2Data.badges?.slice(0, 5).map((badge, idx) => (
                  <img
                    key={idx}
                    src={badge.icon}
                    alt={badge.name}
                    title={badge.hoverText || badge.name}
                    className="badge-icon-small"
                  />
                ))}
                {user2Data.badges?.length > 5 && (
                  <span className="more-badges">
                    +{user2Data.badges.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="comparison-summary">
            <h3>🏆 Overall Winner</h3>
            <div className="winner-announcement">
              {(() => {
                // Get actual ranking values (handle both field names)
                const rank1 =
                  user1Data.ranking || user1Data.questionRanking || Infinity
                const rank2 =
                  user2Data.ranking || user2Data.questionRanking || Infinity

                const score1 = [
                  // Higher is better
                  user1Data.totalSolved > user2Data.totalSolved ? 1 : 0,
                  // Lower is better (ranking)
                  rank1 < rank2 ? 1 : 0,
                  // Higher is better
                  (user1Data.globalContestRating || 0) >
                  (user2Data.globalContestRating || 0)
                    ? 1
                    : 0,
                  // Higher is better
                  (user1Data.bestStreak || 0) > (user2Data.bestStreak || 0)
                    ? 1
                    : 0,
                  // Higher is better
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
