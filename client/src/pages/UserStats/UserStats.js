import React, { useState } from 'react'
import './UserStats.css'
import { fetchDataForLeetcoder } from '../../utils/optimizedLeaderboardData'
import {
  FaUser,
  FaChartBar,
  FaTrophy,
  FaChartLine,
  FaCalendarAlt,
  FaMedal,
  FaSearch,
  FaArrowRight,
  FaStar,
  FaGlobeAmericas,
  FaLink,
  FaLightbulb,
  FaFileAlt,
  FaCheckCircle,
  FaFire,
  FaUsers,
  FaAward,
  FaCode,
  FaRocket,
  FaBullseye
} from 'react-icons/fa'
import { MdLeaderboard } from 'react-icons/md'
import { BiTargetLock } from 'react-icons/bi'
import { AiFillTrophy, AiOutlineBarChart } from 'react-icons/ai'

function UserStats() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const handleSearch = async () => {
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    setLoading(true)
    setError('')
    setUserData(null)

    try {
      const fetchedData = await fetchDataForLeetcoder({
        userName: username.toLowerCase()
      })
      setUserData(fetchedData)
      console.log('User data:', fetchedData)
    } catch (err) {
      setError(
        'Failed to fetch user data. Please check the username and try again.'
      )
      console.error('Error fetching user data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = e => {
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaUser /> },
    { id: 'problems', label: 'Problems', icon: <FaCode /> },
    { id: 'contests', label: 'Contests', icon: <FaTrophy /> },
    { id: 'performance', label: 'Performance', icon: <FaChartLine /> },
    { id: 'activity', label: 'Activity', icon: <FaCalendarAlt /> },
    { id: 'badges', label: 'Badges & More', icon: <FaMedal /> }
  ]

  return (
    <div className="user-stats">
      <div className="user-stats__hero">
        <div className="user-stats__hero-content">
          <h1 className="user-stats__title">
            LeetCode{' '}
            <span className="user-stats__title-gradient">User Analytics</span>
          </h1>
          <p className="user-stats__subtitle">
            Discover comprehensive statistics and insights for any LeetCode user
          </p>

          <div className="user-stats__search">
            <div className="user-stats__search-wrapper">
              <span className="user-stats__search-icon">
                <FaSearch />
              </span>
              <input
                type="text"
                className="user-stats__search-input"
                placeholder="Enter LeetCode username..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                aria-label="LeetCode username"
              />
              <button
                className="user-stats__search-button"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="user-stats__search-spinner"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    Search
                    <span className="user-stats__search-arrow">
                      <FaArrowRight />
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="user-stats__error" role="alert">
              <span className="user-stats__error-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="user-stats__hero-decoration">
          <div className="user-stats__hero-circle user-stats__hero-circle--1"></div>
          <div className="user-stats__hero-circle user-stats__hero-circle--2"></div>
        </div>
      </div>

      {loading && (
        <div className="user-stats__loading">
          <div className="user-stats__loading-spinner"></div>
          <span>Fetching comprehensive user data...</span>
        </div>
      )}

      {userData && !loading && (
        <div className="user-stats__content">
          <div className="user-stats__profile-header">
            <div className="user-stats__profile-info">
              <h2 className="user-stats__profile-name">
                {userData.name || userData.userName}
              </h2>
              <p className="user-stats__profile-username">
                @{userData.userName}
              </p>
              {userData.starRating && (
                <div className="user-stats__profile-rating">
                  <span className="user-stats__profile-star">
                    <FaStar />
                  </span>
                  <span>{userData.starRating} Stars</span>
                </div>
              )}
            </div>

            <div className="user-stats__profile-quick-stats">
              <div className="user-stats__quick-stat">
                <span className="user-stats__quick-stat-value">
                  {formatValue(userData.totalSolved, '0')}
                </span>
                <span className="user-stats__quick-stat-label">Problems</span>
              </div>
              <div className="user-stats__quick-stat">
                <span className="user-stats__quick-stat-value">
                  {formatValue(userData.globalContestRating, 'N/A')}
                </span>
                <span className="user-stats__quick-stat-label">Rating</span>
              </div>
              <div className="user-stats__quick-stat">
                <span className="user-stats__quick-stat-value">
                  {formatValue(userData.badgeCount, '0')}
                </span>
                <span className="user-stats__quick-stat-label">Badges</span>
              </div>
            </div>
          </div>

          <div className="user-stats__tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`user-stats__tab ${
                  activeTab === tab.id ? 'user-stats__tab--active' : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="user-stats__tab-icon">{tab.icon}</span>
                <span className="user-stats__tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="user-stats__tab-content">
            {activeTab === 'overview' && (
              <div className="user-stats__grid">
                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <FaUser />
                    </span>
                    Profile Information
                  </h3>
                  <div className="user-stats__card-content">
                    {userData.name && (
                      <div className="user-stats__info-item">
                        <span className="user-stats__info-label">Name:</span>
                        <span className="user-stats__info-value">
                          {userData.name}
                        </span>
                      </div>
                    )}
                    <div className="user-stats__info-item">
                      <span className="user-stats__info-label">Username:</span>
                      <span className="user-stats__info-value">
                        {userData.userName}
                      </span>
                    </div>
                    {userData.country && (
                      <div className="user-stats__info-item">
                        <span className="user-stats__info-label">Country:</span>
                        <span className="user-stats__info-value">
                          {userData.country}
                        </span>
                      </div>
                    )}
                    {userData.school && (
                      <div className="user-stats__info-item">
                        <span className="user-stats__info-label">School:</span>
                        <span className="user-stats__info-value">
                          {userData.school}
                        </span>
                      </div>
                    )}
                    <div className="user-stats__info-item">
                      <span className="user-stats__info-label">Ranking:</span>
                      <span className="user-stats__info-value">
                        {formatValue(userData.questionRanking)}
                      </span>
                    </div>
                    <div className="user-stats__info-item">
                      <span className="user-stats__info-label">
                        Reputation:
                      </span>
                      <span className="user-stats__info-value">
                        {formatValue(userData.reputation, '0')}
                      </span>
                    </div>
                    {userData.starRating && (
                      <div className="user-stats__info-item">
                        <span className="user-stats__info-label">
                          Star Rating:
                        </span>
                        <span className="user-stats__info-value">
                          <FaStar
                            style={{ color: '#ffa500', marginRight: '4px' }}
                          />{' '}
                          {userData.starRating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <FaChartBar />
                    </span>
                    Quick Stats
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__info-item">
                      <span className="user-stats__info-label">
                        Total Solved:
                      </span>
                      <span className="user-stats__info-value user-stats__info-value--primary">
                        {formatValue(userData.totalSolved, '0')}
                      </span>
                    </div>
                    <div className="user-stats__info-item">
                      <span className="user-stats__info-label">
                        Contest Rating:
                      </span>
                      <span className="user-stats__info-value user-stats__info-value--success">
                        {formatValue(userData.globalContestRating, 'Unrated')}
                      </span>
                    </div>
                    <div className="user-stats__info-item">
                      <span className="user-stats__info-label">
                        Active Days:
                      </span>
                      <span className="user-stats__info-value">
                        {formatValue(userData.totalActiveDays, '0')}
                      </span>
                    </div>
                    <div className="user-stats__info-item">
                      <span className="user-stats__info-label">
                        Best Streak:
                      </span>
                      <span className="user-stats__info-value">
                        {formatValue(userData.bestStreak, '0')} days
                      </span>
                    </div>
                  </div>
                </div>

                {userData.skillTags && userData.skillTags.length > 0 && (
                  <div className="user-stats__card user-stats__card--wide">
                    <h3 className="user-stats__card-title">
                      <span className="user-stats__card-icon">
                        <FaLightbulb />
                      </span>
                      Skills & Expertise
                    </h3>
                    <div className="user-stats__card-content">
                      <div className="user-stats__skills">
                        {userData.skillTags.map((skill, index) => (
                          <span key={index} className="user-stats__skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {userData.aboutMe && (
                  <div className="user-stats__card user-stats__card--wide">
                    <h3 className="user-stats__card-title">
                      <span className="user-stats__card-icon">
                        <FaFileAlt />
                      </span>
                      About
                    </h3>
                    <div className="user-stats__card-content">
                      <p className="user-stats__about-text">
                        {userData.aboutMe}
                      </p>
                    </div>
                  </div>
                )}

                {userData.websites && userData.websites.length > 0 && (
                  <div className="user-stats__card user-stats__card--wide">
                    <h3 className="user-stats__card-title">
                      <span className="user-stats__card-icon">
                        <FaLink />
                      </span>
                      Websites & Links
                    </h3>
                    <div className="user-stats__card-content">
                      <div className="user-stats__websites">
                        {userData.websites.map((website, index) => (
                          <a
                            key={index}
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="user-stats__website-link"
                          >
                            {website}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="user-stats__card user-stats__card--wide">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <FaChartLine />
                    </span>
                    Problem Solving Distribution
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__progress-group">
                      <div className="user-stats__progress-item">
                        <div className="user-stats__progress-header">
                          <span className="user-stats__progress-label">
                            Easy
                          </span>
                          <span className="user-stats__progress-value">
                            {formatValue(userData.easySolved, '0')}
                          </span>
                        </div>
                        <div className="user-stats__progress-bar">
                          <div
                            className="user-stats__progress-fill user-stats__progress-fill--easy"
                            style={{
                              width: `${
                                (userData.easySolved / userData.totalSolved) *
                                  100 || 0
                              }%`
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="user-stats__progress-item">
                        <div className="user-stats__progress-header">
                          <span className="user-stats__progress-label">
                            Medium
                          </span>
                          <span className="user-stats__progress-value">
                            {formatValue(userData.mediumSolved, '0')}
                          </span>
                        </div>
                        <div className="user-stats__progress-bar">
                          <div
                            className="user-stats__progress-fill user-stats__progress-fill--medium"
                            style={{
                              width: `${
                                (userData.mediumSolved / userData.totalSolved) *
                                  100 || 0
                              }%`
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="user-stats__progress-item">
                        <div className="user-stats__progress-header">
                          <span className="user-stats__progress-label">
                            Hard
                          </span>
                          <span className="user-stats__progress-value">
                            {formatValue(userData.hardSolved, '0')}
                          </span>
                        </div>
                        <div className="user-stats__progress-bar">
                          <div
                            className="user-stats__progress-fill user-stats__progress-fill--hard"
                            style={{
                              width: `${
                                (userData.hardSolved / userData.totalSolved) *
                                  100 || 0
                              }%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'problems' && (
              <div className="user-stats__grid">
                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <FaCheckCircle />
                    </span>
                    Total Problems
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__big-stat">
                      <span className="user-stats__big-stat-value">
                        {formatValue(userData.totalSolved, '0')}
                      </span>
                      <span className="user-stats__big-stat-label">
                        Problems Solved
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">🟢</span>
                    Easy Problems
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__big-stat">
                      <span className="user-stats__big-stat-value user-stats__big-stat-value--easy">
                        {formatValue(userData.easySolved, '0')}
                      </span>
                      <span className="user-stats__big-stat-label">
                        Easy Solved
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">🟡</span>
                    Medium Problems
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__big-stat">
                      <span className="user-stats__big-stat-value user-stats__big-stat-value--medium">
                        {formatValue(userData.mediumSolved, '0')}
                      </span>
                      <span className="user-stats__big-stat-label">
                        Medium Solved
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">🔴</span>
                    Hard Problems
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__big-stat">
                      <span className="user-stats__big-stat-value user-stats__big-stat-value--hard">
                        {formatValue(userData.hardSolved, '0')}
                      </span>
                      <span className="user-stats__big-stat-label">
                        Hard Solved
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-stats__card user-stats__card--wide">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <MdLeaderboard />
                    </span>
                    Global Ranking
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__info-item">
                      <span className="user-stats__info-label">
                        Question Ranking:
                      </span>
                      <span className="user-stats__info-value user-stats__info-value--primary">
                        {formatValue(userData.questionRanking)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contests' && (
              <div className="user-stats__grid">
                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <AiOutlineBarChart />
                    </span>
                    Contest Rating
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__big-stat">
                      <span className="user-stats__big-stat-value user-stats__big-stat-value--contest">
                        {formatValue(userData.globalContestRating, 'Unrated')}
                      </span>
                      <span className="user-stats__big-stat-label">
                        Global Rating
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <FaGlobeAmericas />
                    </span>
                    Global Ranking
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__big-stat">
                      <span className="user-stats__big-stat-value">
                        {formatValue(userData.globalContestRanking)}
                      </span>
                      <span className="user-stats__big-stat-label">Rank</span>
                    </div>
                  </div>
                </div>

                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <AiFillTrophy />
                    </span>
                    Best Rank
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__big-stat">
                      <span className="user-stats__big-stat-value user-stats__big-stat-value--success">
                        {formatValue(userData.bestContestRank)}
                      </span>
                      <span className="user-stats__big-stat-label">
                        Best Performance
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <FaCalendarAlt />
                    </span>
                    Contests Attended
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__big-stat">
                      <span className="user-stats__big-stat-value">
                        {formatValue(userData.attendedContestCount, '0')}
                      </span>
                      <span className="user-stats__big-stat-label">
                        Total Contests
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-stats__card user-stats__card--wide">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <BiTargetLock />
                    </span>
                    Contest Performance
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__contest-grid">
                      <div className="user-stats__contest-stat user-stats__contest-stat--4q">
                        <span className="user-stats__contest-label">
                          4 Questions
                        </span>
                        <span className="user-stats__contest-value">
                          {formatValue(
                            userData.mostFourQuestionsInContest,
                            '0'
                          )}
                        </span>
                      </div>
                      <div className="user-stats__contest-stat user-stats__contest-stat--3q">
                        <span className="user-stats__contest-label">
                          3 Questions
                        </span>
                        <span className="user-stats__contest-value">
                          {formatValue(
                            userData.mostThreeQuestionsInContest,
                            '0'
                          )}
                        </span>
                      </div>
                      <div className="user-stats__contest-stat user-stats__contest-stat--2q">
                        <span className="user-stats__contest-label">
                          2 Questions
                        </span>
                        <span className="user-stats__contest-value">
                          {formatValue(userData.mostTwoQuestionsInContest, '0')}
                        </span>
                      </div>
                      <div className="user-stats__contest-stat user-stats__contest-stat--1q">
                        <span className="user-stats__contest-label">
                          1 Question
                        </span>
                        <span className="user-stats__contest-value">
                          {formatValue(userData.mostOneQuestionInContest, '0')}
                        </span>
                      </div>
                      <div className="user-stats__contest-stat user-stats__contest-stat--0q">
                        <span className="user-stats__contest-label">
                          0 Questions
                        </span>
                        <span className="user-stats__contest-value">
                          {formatValue(
                            userData.mostZeroQuestionsInContest,
                            '0'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="user-stats__grid">
                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <FaChartBar />
                    </span>
                    Top Percentage
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__big-stat">
                      <span className="user-stats__big-stat-value user-stats__big-stat-value--contest">
                        {formatValue(userData.contestTopPercentage, 'N/A')}%
                      </span>
                      <span className="user-stats__big-stat-label">
                        Top Percentile
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <FaUsers />
                    </span>
                    Total Participants
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__big-stat">
                      <span className="user-stats__big-stat-value">
                        {formatValue(userData.totalParticipants, 'N/A')}
                      </span>
                      <span className="user-stats__big-stat-label">
                        Contest Pool
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <FaRocket />
                    </span>
                    Average Ranking
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__big-stat">
                      <span className="user-stats__big-stat-value">
                        {formatValue(userData.averageContestRanking, 'N/A')}
                      </span>
                      <span className="user-stats__big-stat-label">
                        Average Rank
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-stats__card user-stats__card--wide">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <FaBullseye />
                    </span>
                    Problem Completion Stats
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__info-item">
                      <span className="user-stats__info-label">
                        Easy ({formatValue(userData.easySolved, '0')} /{' '}
                        {formatValue(userData.totalEasy, '0')}):
                      </span>
                      <span className="user-stats__info-value user-stats__info-value--success">
                        {userData.totalEasy > 0
                          ? (
                              (userData.easySolved / userData.totalEasy) *
                              100
                            ).toFixed(1)
                          : '0'}
                        %
                      </span>
                    </div>
                    <div className="user-stats__info-item">
                      <span className="user-stats__info-label">
                        Medium ({formatValue(userData.mediumSolved, '0')} /{' '}
                        {formatValue(userData.totalMedium, '0')}):
                      </span>
                      <span className="user-stats__info-value">
                        {userData.totalMedium > 0
                          ? (
                              (userData.mediumSolved / userData.totalMedium) *
                              100
                            ).toFixed(1)
                          : '0'}
                        %
                      </span>
                    </div>
                    <div className="user-stats__info-item">
                      <span className="user-stats__info-label">
                        Hard ({formatValue(userData.hardSolved, '0')} /{' '}
                        {formatValue(userData.totalHard, '0')}):
                      </span>
                      <span className="user-stats__info-value">
                        {userData.totalHard > 0
                          ? (
                              (userData.hardSolved / userData.totalHard) *
                              100
                            ).toFixed(1)
                          : '0'}
                        %
                      </span>
                    </div>
                    <div className="user-stats__info-item">
                      <span className="user-stats__info-label">
                        Total ({formatValue(userData.totalSolved, '0')} /{' '}
                        {formatValue(userData.totalQuestions, '0')}):
                      </span>
                      <span className="user-stats__info-value user-stats__info-value--primary">
                        {userData.totalQuestions > 0
                          ? (
                              (userData.totalSolved / userData.totalQuestions) *
                              100
                            ).toFixed(1)
                          : '0'}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="user-stats__grid">
                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <FaFire />
                    </span>
                    Best Streak
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__big-stat">
                      <span className="user-stats__big-stat-value user-stats__big-stat-value--streak">
                        {formatValue(userData.bestStreak, '0')}
                      </span>
                      <span className="user-stats__big-stat-label">Days</span>
                    </div>
                  </div>
                </div>

                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <FaCalendarAlt />
                    </span>
                    Active Days
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__big-stat">
                      <span className="user-stats__big-stat-value">
                        {formatValue(userData.totalActiveDays, '0')}
                      </span>
                      <span className="user-stats__big-stat-label">
                        Days Active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <FaStar />
                    </span>
                    Reputation
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__big-stat">
                      <span className="user-stats__big-stat-value">
                        {formatValue(userData.reputation, '0')}
                      </span>
                      <span className="user-stats__big-stat-label">Points</span>
                    </div>
                  </div>
                </div>

                <div className="user-stats__card">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <FaAward />
                    </span>
                    Total Badges
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__big-stat">
                      <span className="user-stats__big-stat-value user-stats__big-stat-value--badge">
                        {formatValue(userData.badgeCount, '0')}
                      </span>
                      <span className="user-stats__big-stat-label">Earned</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'badges' && (
              <div className="user-stats__grid">
                <div className="user-stats__card user-stats__card--wide">
                  <h3 className="user-stats__card-title">
                    <span className="user-stats__card-icon">
                      <FaMedal />
                    </span>
                    Badge Summary
                  </h3>
                  <div className="user-stats__card-content">
                    <div className="user-stats__info-item">
                      <span className="user-stats__info-label">
                        Total Badges:
                      </span>
                      <span className="user-stats__info-value user-stats__info-value--primary">
                        {formatValue(userData.badgeCount, '0')}
                      </span>
                    </div>
                    {userData.badgeCount > 0 && (
                      <p className="user-stats__badge-note">
                        This user has earned {userData.badgeCount} badge
                        {userData.badgeCount !== 1 ? 's' : ''} for their
                        achievements on LeetCode!
                      </p>
                    )}
                  </div>
                </div>

                {userData.starRating && (
                  <div className="user-stats__card user-stats__card--wide">
                    <h3 className="user-stats__card-title">
                      <span className="user-stats__card-icon">
                        <FaStar />
                      </span>
                      Star Rating
                    </h3>
                    <div className="user-stats__card-content">
                      <div className="user-stats__star-display">
                        <span className="user-stats__star-value">
                          {userData.starRating}
                        </span>
                        <div className="user-stats__star-icons">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`user-stats__star-icon ${
                                i < Math.floor(userData.starRating)
                                  ? 'user-stats__star-icon--filled'
                                  : ''
                              }`}
                            >
                              <FaStar />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {userData.badges && userData.badges.length > 0 && (
                  <div className="user-stats__card user-stats__card--wide">
                    <h3 className="user-stats__card-title">
                      <span className="user-stats__card-icon">
                        <FaAward />
                      </span>
                      Earned Badges ({userData.badges.length})
                    </h3>
                    <div className="user-stats__card-content">
                      <div className="user-stats__badges-grid">
                        {userData.badges.map(badge => (
                          <div
                            key={badge.id}
                            className="user-stats__badge-item"
                          >
                            {badge.icon && (
                              <div className="user-stats__badge-icon-wrapper">
                                <img
                                  src={badge.icon}
                                  alt={badge.displayName || badge.name}
                                  className="user-stats__badge-icon-img"
                                />
                              </div>
                            )}
                            <div className="user-stats__badge-details">
                              <h4 className="user-stats__badge-name">
                                {badge.displayName || badge.name}
                              </h4>
                              {badge.category && (
                                <span className="user-stats__badge-category">
                                  {badge.category}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserStats
