import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import './CustomRankTable.css'
import { FaChartBar, FaTrophy, FaSearch, FaMedal } from 'react-icons/fa'
import { BiTargetLock } from 'react-icons/bi'
import { MdSpeed } from 'react-icons/md'

const CustomRankTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'totalSolved',
    direction: 'desc'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBatch, setFilterBatch] = useState('all')
  const [activeTab, setActiveTab] = useState('overview') // New state for tabs

  // Get unique batches for filter
  const batches = useMemo(() => {
    const uniqueBatches = [
      ...new Set(data.map(user => user.batch).filter(Boolean))
    ]
    return uniqueBatches.sort((a, b) => a.localeCompare(b))
  }, [data])

  // Sort and filter data
  const processedData = useMemo(() => {
    let filtered = [...data]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        user =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.userName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Batch filter
    if (filterBatch !== 'all') {
      filtered = filtered.filter(user => user.batch === filterBatch)
    }

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key] || 0
        const bValue = b[sortConfig.key] || 0

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return filtered
  }, [data, searchTerm, filterBatch, sortConfig])

  const handleSort = key => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const getSortIcon = key => {
    if (sortConfig.key !== key) return '⇅'
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  const getRankBadge = index => {
    if (index === 0) return <FaMedal style={{ color: '#FFD700' }} />
    if (index === 1) return <FaMedal style={{ color: '#C0C0C0' }} />
    if (index === 2) return <FaMedal style={{ color: '#CD7F32' }} />
    return index + 1
  }

  const getRankClass = index => {
    if (index === 0) return 'rank-gold'
    if (index === 1) return 'rank-silver'
    if (index === 2) return 'rank-bronze'
    return ''
  }

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaChartBar /> },
    { id: 'problems', label: 'Problem Stats', icon: <BiTargetLock /> },
    { id: 'contests', label: 'Contest Stats', icon: <FaTrophy /> },
    {
      id: 'contest-performance',
      label: 'Contest Performance',
      icon: <BiTargetLock />
    },
    { id: 'advanced', label: 'Advanced Stats', icon: <MdSpeed /> }
  ]

  // Render different table headers based on active tab
  const renderTableHeaders = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <th className="rank-col">Rank</th>
            <th onClick={() => handleSort('name')} className="sortable">
              Name {getSortIcon('name')}
            </th>
            <th onClick={() => handleSort('batch')} className="sortable">
              Batch {getSortIcon('batch')}
            </th>
            <th
              onClick={() => handleSort('totalSolved')}
              className="sortable stat-col"
            >
              Total Solved {getSortIcon('totalSolved')}
            </th>
            <th
              onClick={() => handleSort('globalContestRating')}
              className="sortable"
            >
              Contest Rating {getSortIcon('globalContestRating')}
            </th>
          </>
        )

      case 'problems':
        return (
          <>
            <th className="rank-col">Rank</th>
            <th onClick={() => handleSort('name')} className="sortable">
              Name {getSortIcon('name')}
            </th>
            <th
              onClick={() => handleSort('totalSolved')}
              className="sortable stat-col"
            >
              Total {getSortIcon('totalSolved')}
            </th>
            <th
              onClick={() => handleSort('easySolved')}
              className="sortable easy-col"
            >
              Easy {getSortIcon('easySolved')}
            </th>
            <th
              onClick={() => handleSort('mediumSolved')}
              className="sortable medium-col"
            >
              Medium {getSortIcon('mediumSolved')}
            </th>
            <th
              onClick={() => handleSort('hardSolved')}
              className="sortable hard-col"
            >
              Hard {getSortIcon('hardSolved')}
            </th>
            <th className="sortable">Easy %</th>
            <th className="sortable">Medium %</th>
            <th className="sortable">Hard %</th>
          </>
        )

      case 'contests':
        return (
          <>
            <th className="rank-col">Rank</th>
            <th onClick={() => handleSort('name')} className="sortable">
              Name {getSortIcon('name')}
            </th>
            <th
              onClick={() => handleSort('globalContestRating')}
              className="sortable stat-col"
            >
              Rating {getSortIcon('globalContestRating')}
            </th>
            <th
              onClick={() => handleSort('globalContestRanking')}
              className="sortable"
            >
              Global Rank {getSortIcon('globalContestRanking')}
            </th>
            <th
              onClick={() => handleSort('contestTopPercentage')}
              className="sortable"
            >
              Top % {getSortIcon('contestTopPercentage')}
            </th>
            <th
              onClick={() => handleSort('attendedContestCount')}
              className="sortable"
            >
              Attended {getSortIcon('attendedContestCount')}
            </th>
            <th
              onClick={() => handleSort('bestContestRank')}
              className="sortable"
            >
              Best Rank {getSortIcon('bestContestRank')}
            </th>
          </>
        )

      case 'contest-performance':
        return (
          <>
            <th className="rank-col">Rank</th>
            <th onClick={() => handleSort('name')} className="sortable">
              Name {getSortIcon('name')}
            </th>
            <th
              onClick={() => handleSort('attendedContestCount')}
              className="sortable"
            >
              Attended {getSortIcon('attendedContestCount')}
            </th>
            <th
              onClick={() => handleSort('mostFourQuestionsInContest')}
              className="sortable stat-col"
              title="Contests with 4 problems solved"
            >
              4 Qs {getSortIcon('mostFourQuestionsInContest')}
            </th>
            <th
              onClick={() => handleSort('mostThreeQuestionsInContest')}
              className="sortable stat-col"
              title="Contests with 3 problems solved"
            >
              3 Qs {getSortIcon('mostThreeQuestionsInContest')}
            </th>
            <th
              onClick={() => handleSort('mostTwoQuestionsInContest')}
              className="sortable stat-col"
              title="Contests with 2 problems solved"
            >
              2 Qs {getSortIcon('mostTwoQuestionsInContest')}
            </th>
            <th
              onClick={() => handleSort('mostOneQuestionsInContest')}
              className="sortable stat-col"
              title="Contests with 1 problem solved"
            >
              1 Q {getSortIcon('mostOneQuestionsInContest')}
            </th>
            <th
              onClick={() => handleSort('mostZeroQuestionsInContest')}
              className="sortable stat-col"
              title="Contests with 0 problems solved"
            >
              0 Qs {getSortIcon('mostZeroQuestionsInContest')}
            </th>
            <th
              onClick={() => handleSort('averageContestRanking')}
              className="sortable"
              title="Average contest ranking"
            >
              Avg Rank {getSortIcon('averageContestRanking')}
            </th>
          </>
        )

      case 'advanced':
        return (
          <>
            <th className="rank-col">Rank</th>
            <th onClick={() => handleSort('name')} className="sortable">
              Name {getSortIcon('name')}
            </th>
            <th onClick={() => handleSort('reputation')} className="sortable">
              Reputation {getSortIcon('reputation')}
            </th>
            <th
              onClick={() => handleSort('questionRanking')}
              className="sortable"
            >
              Ranking {getSortIcon('questionRanking')}
            </th>
            <th onClick={() => handleSort('bestStreak')} className="sortable">
              Best Streak {getSortIcon('bestStreak')}
            </th>
            <th
              onClick={() => handleSort('totalActiveDays')}
              className="sortable"
            >
              Active Days {getSortIcon('totalActiveDays')}
            </th>
            <th onClick={() => handleSort('badgeCount')} className="sortable">
              Badges {getSortIcon('badgeCount')}
            </th>
          </>
        )

      default:
        return null
    }
  }

  // Render table rows based on active tab
  const renderTableRows = () => {
    return processedData.map((user, index) => {
      const rowClass = `rank-table__row ${getRankClass(index)}`

      switch (activeTab) {
        case 'overview':
          return (
            <tr key={user.userName || index} className={rowClass}>
              <td className="rank-col">
                <span className="rank-badge">{getRankBadge(index)}</span>
              </td>
              <td className="name-col" title={user.name}>
                <a
                  href={`https://leetcode.com/${user.userName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="username-link"
                >
                  {user.name || 'N/A'}
                </a>
                <div className="username-subtitle">@{user.userName}</div>
              </td>
              <td className="batch-col">
                <span className="batch-badge">{user.batch || 'N/A'}</span>
              </td>
              <td className="stat-col total-col">
                <strong>{user.totalSolved || 0}</strong>
              </td>
              <td className="stat-col">
                {user.globalContestRating
                  ? Math.round(user.globalContestRating)
                  : 'N/A'}
              </td>
            </tr>
          )

        case 'problems': {
          const easyPercent =
            user.easySolved && user.totalSolved
              ? ((user.easySolved / user.totalSolved) * 100).toFixed(1)
              : 0
          const mediumPercent =
            user.mediumSolved && user.totalSolved
              ? ((user.mediumSolved / user.totalSolved) * 100).toFixed(1)
              : 0
          const hardPercent =
            user.hardSolved && user.totalSolved
              ? ((user.hardSolved / user.totalSolved) * 100).toFixed(1)
              : 0

          return (
            <tr key={user.userName || index} className={rowClass}>
              <td className="rank-col">
                <span className="rank-badge">{getRankBadge(index)}</span>
              </td>
              <td className="name-col" title={user.name}>
                <a
                  href={`https://leetcode.com/${user.userName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="username-link"
                >
                  {user.name || 'N/A'}
                </a>
                <div className="username-subtitle">@{user.userName}</div>
              </td>
              <td className="stat-col total-col">
                <strong>{user.totalSolved || 0}</strong>
              </td>
              <td className="stat-col easy-col">
                <strong>{user.easySolved || 0}</strong>
              </td>
              <td className="stat-col medium-col">
                <strong>{user.mediumSolved || 0}</strong>
              </td>
              <td className="stat-col hard-col">
                <strong>{user.hardSolved || 0}</strong>
              </td>
              <td className="stat-col easy-col">{easyPercent}%</td>
              <td className="stat-col medium-col">{mediumPercent}%</td>
              <td className="stat-col hard-col">{hardPercent}%</td>
            </tr>
          )
        }

        case 'contests':
          return (
            <tr key={user.userName || index} className={rowClass}>
              <td className="rank-col">
                <span className="rank-badge">{getRankBadge(index)}</span>
              </td>
              <td className="name-col" title={user.name}>
                <a
                  href={`https://leetcode.com/${user.userName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="username-link"
                >
                  {user.name || 'N/A'}
                </a>
                <div className="username-subtitle">@{user.userName}</div>
              </td>
              <td className="stat-col total-col">
                <strong>
                  {user.globalContestRating
                    ? Math.round(user.globalContestRating)
                    : 'N/A'}
                </strong>
              </td>
              <td className="stat-col">
                {user.globalContestRanking &&
                user.globalContestRanking !== Infinity
                  ? user.globalContestRanking.toLocaleString()
                  : 'N/A'}
              </td>
              <td className="stat-col">
                {user.contestTopPercentage
                  ? `${user.contestTopPercentage.toFixed(2)}%`
                  : 'N/A'}
              </td>
              <td className="stat-col">{user.attendedContestCount || 0}</td>
              <td className="stat-col">
                {user.bestContestRank && user.bestContestRank !== Infinity
                  ? user.bestContestRank.toLocaleString()
                  : 'N/A'}
              </td>
            </tr>
          )

        case 'contest-performance':
          return (
            <tr key={user.userName || index} className={rowClass}>
              <td className="rank-col">
                <span className="rank-badge">{getRankBadge(index)}</span>
              </td>
              <td className="name-col" title={user.name}>
                <a
                  href={`https://leetcode.com/${user.userName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="username-link"
                >
                  {user.name || 'N/A'}
                </a>
                <div className="username-subtitle">@{user.userName}</div>
              </td>
              <td className="stat-col">
                <strong>{user.attendedContestCount || 0}</strong>
              </td>
              <td className="stat-col contest-4q">
                <strong>{user.mostFourQuestionsInContest || 0}</strong>
              </td>
              <td className="stat-col contest-3q">
                <strong>{user.mostThreeQuestionsInContest || 0}</strong>
              </td>
              <td className="stat-col contest-2q">
                <strong>{user.mostTwoQuestionsInContest || 0}</strong>
              </td>
              <td className="stat-col contest-1q">
                <strong>{user.mostOneQuestionsInContest || 0}</strong>
              </td>
              <td className="stat-col contest-0q">
                <strong>{user.mostZeroQuestionsInContest || 0}</strong>
              </td>
              <td className="stat-col">
                {user.averageContestRanking &&
                user.averageContestRanking !== Infinity
                  ? user.averageContestRanking.toLocaleString()
                  : 'N/A'}
              </td>
            </tr>
          )

        case 'advanced':
          return (
            <tr key={user.userName || index} className={rowClass}>
              <td className="rank-col">
                <span className="rank-badge">{getRankBadge(index)}</span>
              </td>
              <td className="name-col" title={user.name}>
                <a
                  href={`https://leetcode.com/${user.userName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="username-link"
                >
                  {user.name || 'N/A'}
                </a>
                <div className="username-subtitle">@{user.userName}</div>
              </td>
              <td className="stat-col">{user.reputation || 0}</td>
              <td className="stat-col">
                {user.questionRanking
                  ? user.questionRanking.toLocaleString()
                  : 'N/A'}
              </td>
              <td className="stat-col">
                {user.bestStreak ? `${user.bestStreak} days` : 'N/A'}
              </td>
              <td className="stat-col">{user.totalActiveDays || 0}</td>
              <td className="stat-col">{user.badgeCount || 0}</td>
            </tr>
          )

        default:
          return null
      }
    })
  }

  return (
    <div className="custom-rank-table">
      {/* Tab Navigation */}
      <div className="rank-table__tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${
              activeTab === tab.id ? 'tab-button--active' : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label.replace(/^.*?\s/, '')}</span>
          </button>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="rank-table__controls">
        <div className="rank-table__search">
          <span className="search-icon">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search by name or username..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="search-clear"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="rank-table__filter">
          <label htmlFor="batch-filter" className="filter-label">
            Batch:
          </label>
          <select
            id="batch-filter"
            value={filterBatch}
            onChange={e => setFilterBatch(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Batches</option>
            {batches.map(batch => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </div>

        <div className="rank-table__count">
          Showing {processedData.length} of {data.length} users
        </div>
      </div>

      {/* Table */}
      <div className="rank-table__wrapper">
        <table className="rank-table">
          <thead className="rank-table__head">
            <tr>{renderTableHeaders()}</tr>
          </thead>
          <tbody className="rank-table__body">{renderTableRows()}</tbody>
        </table>

        {processedData.length === 0 && (
          <div className="rank-table__empty">
            <span className="empty-icon">
              <FaSearch />
            </span>
            <p>No users found matching your criteria</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterBatch('all')
              }}
              className="reset-btn"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

CustomRankTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default CustomRankTable
