import React, { useEffect, useState, useMemo } from 'react'
import './CustomRankTable.css'
import {
  FaChartBar,
  FaTrophy,
  FaSearch,
  FaMedal,
  FaFire,
  FaArrowUp,
  FaArrowDown,
  FaStar
} from 'react-icons/fa'
import { BiTargetLock } from 'react-icons/bi'
import { MdCalendarToday } from 'react-icons/md'
import type { UserData } from '../../../types'
import { enrichUser, type EnrichedUser } from '../../../utils/derivedStats'

type PartialUser = Partial<UserData>

const getRatingColor = (rating: number): string => {
  if (rating >= 2200) return '#FF0000'
  if (rating >= 1900) return '#FF8C00'
  if (rating >= 1600) return '#A020F0'
  if (rating >= 1400) return '#0000FF'
  if (rating >= 1200) return '#00C0C0'
  return '#808080'
}

const getRatingBadge = (rating: number): string => {
  if (rating >= 2200) return '👑'
  if (rating >= 1900) return '⭐'
  if (rating >= 1600) return '💎'
  if (rating >= 1400) return '🔵'
  if (rating >= 1200) return '🌊'
  return ''
}

const getAcceptanceRateColor = (rate: number): string => {
  if (rate > 50) return 'var(--easy-color)'
  if (rate > 30) return 'var(--medium-color)'
  return 'var(--hard-color)'
}

const MUTED = { color: 'var(--text-3)' } as const

/** Integers with thousands separators; "N/A" for the Infinity placeholders. */
const rankValue = (value: number | undefined): string =>
  value !== undefined && Number.isFinite(value) ? value.toLocaleString() : 'N/A'

const Placeholder = () => <span style={MUTED}>-</span>

/** Compact relative age: 4h, 3d, 5w. */
const formatAge = (hours: number): string => {
  if (hours < 1) return 'now'
  if (hours < 24) return `${Math.floor(hours)}h`
  const days = Math.floor(hours / 24)
  if (days < 14) return `${days}d`
  return `${Math.floor(days / 7)}w`
}

/**
 * Freshness. A leaderboard that cannot show who solved something this morning
 * reads like a historical record rather than a live competition.
 */
const freshnessColour = (hours: number): string => {
  if (hours < 24) return 'var(--success)'
  if (hours < 24 * 7) return 'var(--warning)'
  return 'var(--text-3)'
}

const LastSolvedCell = ({ user }: { user: EnrichedUser }) => {
  if (!Number.isFinite(user.hoursSinceLastSolve)) return <Placeholder />
  const hours = user.hoursSinceLastSolve
  const colour = freshnessColour(hours)
  return (
    <span style={{ color: colour }} title={user.lastSolvedTitle}>
      {formatAge(hours)}
    </span>
  )
}

/** This month's Daily Coding Challenge badge progress. */
const DccCell = ({ user }: { user: EnrichedUser }) => {
  if (user.dccProgress <= 0) return <Placeholder />
  return (
    <span className="dcc-cell" title={`${user.dccLabel}: ${user.dccProgress}%`}>
      <span className="dcc-cell__track">
        <span
          className="dcc-cell__fill"
          style={{ width: `${Math.min(user.dccProgress, 100)}%` }}
        />
      </span>
      <span className="dcc-cell__value">{user.dccProgress}%</span>
    </span>
  )
}

/* ============================================
   CELL RENDERERS
   ============================================ */

const DifficultyMix = ({ user }: { user: EnrichedUser }) => {
  const total = user.totalSolved ?? 0
  if (total <= 0) return <Placeholder />

  const segments = [
    { count: user.easySolved ?? 0, color: 'var(--easy-color)', label: 'Easy' },
    {
      count: user.mediumSolved ?? 0,
      color: 'var(--medium-color)',
      label: 'Medium'
    },
    { count: user.hardSolved ?? 0, color: 'var(--hard-color)', label: 'Hard' }
  ]

  return (
    <div
      className="mix-bar"
      title={segments.map(s => `${s.label}: ${s.count}`).join('  ')}
    >
      {segments.map(segment => (
        <div
          key={segment.label}
          className="mix-bar__segment"
          style={{
            width: `${(segment.count / total) * 100}%`,
            background: segment.color
          }}
        />
      ))}
    </div>
  )
}

const CONTEST_SPREAD = [
  { key: 'mostFourQuestionsInContest', label: '4 solved', tone: 'contest-4q' },
  { key: 'mostThreeQuestionsInContest', label: '3 solved', tone: 'contest-3q' },
  { key: 'mostTwoQuestionsInContest', label: '2 solved', tone: 'contest-2q' },
  { key: 'mostOneQuestionsInContest', label: '1 solved', tone: 'contest-1q' },
  { key: 'mostZeroQuestionsInContest', label: '0 solved', tone: 'contest-0q' }
] as const

/**
 * Replaces the five separate "N Qs" columns. Same information, one cell, and it
 * reads as a shape so a strong contestant is recognisable at a glance.
 */
const ContestSpread = ({ user }: { user: EnrichedUser }) => {
  const counts = CONTEST_SPREAD.map(
    entry => (user[entry.key] as number | undefined) ?? 0
  )
  const total = counts.reduce((sum, count) => sum + count, 0)
  if (total <= 0) return <Placeholder />

  return (
    <div
      className="spread-bar"
      title={CONTEST_SPREAD.map(
        (entry, index) => `${entry.label}: ${counts[index]}`
      ).join('  ')}
    >
      {CONTEST_SPREAD.map((entry, index) => (
        <div
          key={entry.key}
          className={`spread-bar__segment ${entry.tone}`}
          style={{ width: `${(counts[index] / total) * 100}%` }}
        />
      ))}
    </div>
  )
}

const StreakCell = ({ days }: { days: number }) => {
  if (days <= 0) return <span style={MUTED}>0</span>
  return (
    <span
      className="streak-cell"
      style={{ color: days >= 7 ? 'var(--danger)' : 'var(--warning)' }}
    >
      <FaFire />
      <strong>{days}</strong>
      <span className="unit">d</span>
    </span>
  )
}

const RatingCell = ({ user }: { user: EnrichedUser }) => {
  const rating = user.globalContestRating ?? 0
  if (rating <= 0) return <span style={MUTED}>Unrated</span>
  return (
    <span
      className="rating-cell"
      style={{ color: getRatingColor(rating) }}
      title={
        user.contestTopPercentage
          ? `Top ${user.contestTopPercentage.toFixed(1)}%`
          : undefined
      }
    >
      {getRatingBadge(rating)} {Math.round(rating)}
    </span>
  )
}

const TrendCell = ({ delta }: { delta: number }) => {
  if (!delta) return <Placeholder />
  const up = delta > 0
  return (
    <span
      className="trend-cell"
      style={{ color: up ? 'var(--success)' : 'var(--danger)' }}
      title={`${up ? 'Gained' : 'Lost'} ${Math.abs(delta)} rating in the last contest`}
    >
      {up ? <FaArrowUp /> : <FaArrowDown />}
      {Math.abs(delta)}
    </span>
  )
}

const BadgesCell = ({ user }: { user: EnrichedUser }) => {
  const badges = user.badges ?? []
  if (badges.length === 0) return <span style={MUTED}>0</span>
  const shown = badges.slice(0, 3)
  return (
    <span
      className="badges-cell"
      title={badges.map(badge => badge.displayName || badge.name).join('  ')}
    >
      {shown.map(badge =>
        badge.icon ? (
          <img
            key={badge.id}
            src={badge.icon}
            alt=""
            onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
              ;(event.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : null
      )}
      <strong>{badges.length}</strong>
    </span>
  )
}

const ContestBadgeCell = ({ user }: { user: EnrichedUser }) => {
  const badge = user.contestBadge
  if (!badge) return <Placeholder />
  return (
    <span
      className="badges-cell"
      title={badge.hoverText || badge.name}
      style={{ color: 'var(--contest-color)' }}
    >
      {badge.icon && (
        <img
          src={badge.icon}
          alt=""
          onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
            ;(event.target as HTMLImageElement).style.display = 'none'
          }}
        />
      )}
      <span className="badges-cell__name">{badge.name}</span>
    </span>
  )
}

/* ============================================
   COLUMN MODEL
   ============================================ */

interface ColumnDef {
  /** Sort key on the enriched row. Omitted for derived-visual columns. */
  key?: string
  label: string
  title?: string
  cellClass?: string
  /** Rendered inside the mobile card stat grid. */
  inCard?: boolean
  render: (user: EnrichedUser) => React.ReactNode
}

const nameColumn: ColumnDef = {
  key: 'name',
  label: 'Name',
  cellClass: 'name-col',
  inCard: false,
  render: user => (
    <div className="name-cell">
      {user.avatar && (
        <img
          className="name-cell__avatar"
          src={user.avatar}
          alt=""
          onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
            ;(event.target as HTMLImageElement).style.display = 'none'
          }}
        />
      )}
      <div className="name-cell__text">
        <a
          href={`https://leetcode.com/u/${user.userName}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="username-link"
        >
          {user.name || 'N/A'}
        </a>
        <div className="username-subtitle">@{user.userName}</div>
      </div>
    </div>
  )
}

const batchColumn: ColumnDef = {
  key: 'batch',
  label: 'Batch',
  cellClass: 'batch-col',
  inCard: false,
  render: user => <span className="batch-badge">{user.batch || 'N/A'}</span>
}

const solvedColumn = (label: string): ColumnDef => ({
  key: 'totalSolved',
  label,
  cellClass: 'stat-col total-col',
  render: user => <strong>{user.totalSolved ?? 0}</strong>
})

/** Reads a runtime-named field. Sort keys and shared columns are strings. */
const readField = (user: EnrichedUser, key: string): unknown =>
  (user as unknown as Record<string, unknown>)[key]

const streakColumn = (key: string, label: string): ColumnDef => ({
  key,
  label,
  cellClass: 'stat-col',
  render: user => <StreakCell days={(readField(user, key) as number) ?? 0} />
})

interface TabDef {
  id: string
  label: string
  hint: string
  icon: React.ReactNode
  defaultSort: string
  columns: ColumnDef[]
}

const TABS: TabDef[] = [
  {
    id: 'overview',
    label: 'Overview',
    hint: 'Who is winning overall',
    icon: <FaChartBar />,
    defaultSort: 'totalSolved',
    columns: [
      nameColumn,
      batchColumn,
      solvedColumn('Solved'),
      {
        key: 'completionPct',
        label: 'Done %',
        title: 'Share of all LeetCode problems solved',
        cellClass: 'stat-col',
        render: user => (
          <span
            title={`${user.totalSolved ?? 0} of ${user.totalQuestions ?? 0}`}
          >
            {user.completionPct.toFixed(1)}%
          </span>
        )
      },
      {
        label: 'Mix',
        title: 'Easy / Medium / Hard split',
        cellClass: 'stat-col mix-col',
        render: user => <DifficultyMix user={user} />
      },
      {
        key: 'globalContestRating',
        label: 'Rating',
        cellClass: 'stat-col',
        render: user => <RatingCell user={user} />
      },
      {
        key: 'ratingDelta',
        label: 'Trend',
        title: 'Rating change in the most recent contest',
        cellClass: 'stat-col',
        render: user => <TrendCell delta={user.ratingDelta} />
      },
      streakColumn('currentStreak', 'Streak'),
      {
        key: 'hoursSinceLastSolve',
        label: 'Last Solved',
        title: 'Time since the most recent accepted submission',
        cellClass: 'stat-col',
        render: user => <LastSolvedCell user={user} />
      }
    ]
  },
  {
    id: 'problems',
    label: 'Problems',
    hint: 'Who solves what',
    icon: <BiTargetLock />,
    defaultSort: 'totalSolved',
    columns: [
      nameColumn,
      batchColumn,
      solvedColumn('Total'),
      {
        key: 'easySolved',
        label: 'Easy',
        cellClass: 'stat-col easy-col',
        render: user => <strong>{user.easySolved ?? 0}</strong>
      },
      {
        key: 'mediumSolved',
        label: 'Medium',
        cellClass: 'stat-col medium-col',
        render: user => <strong>{user.mediumSolved ?? 0}</strong>
      },
      {
        key: 'hardSolved',
        label: 'Hard',
        cellClass: 'stat-col hard-col',
        render: user => <strong>{user.hardSolved ?? 0}</strong>
      },
      {
        label: 'Mix',
        title: 'Easy / Medium / Hard split',
        cellClass: 'stat-col mix-col',
        render: user => <DifficultyMix user={user} />
      },
      {
        key: 'acceptanceRate',
        label: 'Accept %',
        title: 'Accepted submissions as a share of all submissions',
        cellClass: 'stat-col',
        render: user => (
          <span style={{ color: getAcceptanceRateColor(user.acceptanceRate) }}>
            {user.acceptanceRate.toFixed(1)}%
          </span>
        )
      },
      {
        key: 'totalSubmissions',
        label: 'Subs',
        title: 'Total submissions, the denominator behind Accept %',
        cellClass: 'stat-col',
        render: user => user.totalSubmissions.toLocaleString()
      },
      {
        key: 'beatsMedium',
        label: 'Beats %',
        title:
          'Percentile beaten on Medium problems; hover a row for all three',
        cellClass: 'stat-col',
        render: user =>
          user.beatsMedium > 0 ? (
            <span title={user.beatsLabel}>{user.beatsMedium.toFixed(1)}%</span>
          ) : (
            <Placeholder />
          )
      },
      {
        key: 'questionRanking',
        label: 'Global Rank',
        title: 'LeetCode problem-solving rank',
        cellClass: 'stat-col',
        render: user => rankValue(user.questionRanking)
      },
      {
        key: 'topTopicCount',
        label: 'Top Topic',
        title: 'Strongest tag by problems solved',
        cellClass: 'topic-col',
        render: user =>
          user.topTopicName ? (
            <span title={`${user.topTopicCount} solved`}>
              {user.topTopicName}
              <span className="topic-col__count">{user.topTopicCount}</span>
            </span>
          ) : (
            <Placeholder />
          )
      },
      {
        key: 'topLanguageCount',
        label: 'Language',
        title: 'Most-used language by problems solved',
        cellClass: 'topic-col',
        render: user =>
          user.topLanguage ? (
            <span
              title={`${user.topLanguageCount} solved in ${user.topLanguage}, ${user.languageCount} languages used`}
            >
              {user.topLanguage}
              <span className="topic-col__count">{user.topLanguageCount}</span>
            </span>
          ) : (
            <Placeholder />
          )
      }
    ]
  },
  {
    id: 'contests',
    label: 'Contests',
    hint: 'Who competes well',
    icon: <FaTrophy />,
    defaultSort: 'globalContestRating',
    columns: [
      nameColumn,
      batchColumn,
      {
        key: 'globalContestRating',
        label: 'Rating',
        cellClass: 'stat-col total-col',
        render: user => <RatingCell user={user} />
      },
      {
        key: 'ratingDelta',
        label: 'Trend',
        title: 'Rating change in the most recent contest',
        cellClass: 'stat-col',
        render: user => <TrendCell delta={user.ratingDelta} />
      },
      {
        key: 'globalContestRanking',
        label: 'Global Rank',
        cellClass: 'stat-col',
        render: user => rankValue(user.globalContestRanking)
      },
      {
        key: 'contestTopPercentage',
        label: 'Top %',
        cellClass: 'stat-col',
        render: user =>
          user.contestTopPercentage ? (
            `${user.contestTopPercentage.toFixed(2)}%`
          ) : (
            <Placeholder />
          )
      },
      {
        key: 'attendedContestCount',
        label: 'Attended',
        cellClass: 'stat-col',
        render: user => <strong>{user.attendedContestCount ?? 0}</strong>
      },
      {
        key: 'bestContestRank',
        label: 'Best Rank',
        cellClass: 'stat-col',
        render: user => rankValue(user.bestContestRank)
      },
      {
        key: 'averageContestRanking',
        label: 'Avg Rank',
        cellClass: 'stat-col',
        render: user => rankValue(user.averageContestRanking)
      },
      {
        label: 'Spread',
        title: 'How many contests ended with 4 / 3 / 2 / 1 / 0 problems solved',
        cellClass: 'stat-col mix-col',
        render: user => <ContestSpread user={user} />
      },
      {
        key: 'daysSinceLastContest',
        label: 'Last Seen',
        title: 'Days since the most recent contest attended',
        cellClass: 'stat-col',
        render: user =>
          Number.isFinite(user.daysSinceLastContest) ? (
            <span
              title={user.lastContestTitle}
              style={
                user.daysSinceLastContest > 30 ? MUTED : { color: 'inherit' }
              }
            >
              {user.daysSinceLastContest}d
            </span>
          ) : (
            <Placeholder />
          )
      },
      {
        label: 'Badge',
        cellClass: 'stat-col',
        render: user => <ContestBadgeCell user={user} />
      }
    ]
  },
  {
    id: 'consistency',
    label: 'Consistency',
    hint: 'Who shows up',
    icon: <FaFire />,
    defaultSort: 'currentStreak',
    columns: [
      nameColumn,
      batchColumn,
      streakColumn('currentStreak', 'Current'),
      streakColumn('trueBestStreak', 'Best'),
      {
        key: 'totalActiveDays',
        label: 'Active Days',
        cellClass: 'stat-col',
        render: user => (
          <span className="streak-cell">
            <MdCalendarToday style={{ color: 'var(--success)' }} />
            <strong>{user.totalActiveDays ?? 0}</strong>
          </span>
        )
      },
      {
        key: 'yearsActive',
        label: 'Years',
        title: 'Number of years with at least one submission',
        cellClass: 'stat-col',
        render: user =>
          user.yearsActive > 0 ? (
            <span title={(user.activeYears ?? []).join(', ')}>
              {user.yearsActive}
            </span>
          ) : (
            <Placeholder />
          )
      },
      {
        key: 'dccProgress',
        label: 'This Month',
        title: "Progress on the current month's Daily Coding Challenge badge",
        cellClass: 'stat-col dcc-col',
        render: user => <DccCell user={user} />
      },
      {
        key: 'solutionCount',
        label: 'Solutions',
        title: 'Public solution articles written',
        cellClass: 'stat-col',
        render: user =>
          user.solutionCount ? (
            <span
              title={`${(user.postViewCount ?? 0).toLocaleString()} post views`}
            >
              {user.solutionCount.toLocaleString()}
            </span>
          ) : (
            <span style={MUTED}>0</span>
          )
      },
      {
        key: 'reputation',
        label: 'Reputation',
        cellClass: 'stat-col',
        render: user => user.reputation ?? 0
      },
      {
        key: 'badgeCount',
        label: 'Badges',
        cellClass: 'stat-col',
        render: user => <BadgesCell user={user} />
      },
      {
        key: 'starRating',
        label: 'Stars',
        title: 'LeetCode star rating',
        cellClass: 'stat-col',
        render: user =>
          user.starRating ? (
            <span className="streak-cell" style={{ color: 'var(--gold)' }}>
              <FaStar />
              <strong>{user.starRating}</strong>
            </span>
          ) : (
            <Placeholder />
          )
      }
    ]
  }
]

/* ============================================
   TABLE
   ============================================ */

interface CustomRankTableProps {
  data: PartialUser[]
}

const CustomRankTable = ({ data }: CustomRankTableProps) => {
  const [activeTab, setActiveTab] = useState(TABS[0].id)
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  }>({ key: TABS[0].defaultSort, direction: 'desc' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBatch, setFilterBatch] = useState('all')

  const tab = TABS.find(entry => entry.id === activeTab) ?? TABS[0]

  // Each tab ranks by its own headline metric. Without this, switching to
  // Contests would leave rows ordered by problems solved and the medals would
  // sit on the wrong people.
  useEffect(() => {
    setSortConfig({ key: tab.defaultSort, direction: 'desc' })
  }, [tab.defaultSort])

  const enriched = useMemo(() => data.map(enrichUser), [data])

  const batches = useMemo(() => {
    const unique = [
      ...new Set(enriched.map(user => user.batch).filter(Boolean))
    ] as string[]
    return unique.sort((a, b) => a.localeCompare(b))
  }, [enriched])

  const processedData = useMemo(() => {
    let filtered = enriched

    if (searchTerm) {
      const needle = searchTerm.toLowerCase()
      filtered = filtered.filter(
        user =>
          user.name?.toLowerCase().includes(needle) ||
          user.userName?.toLowerCase().includes(needle)
      )
    }

    if (filterBatch !== 'all') {
      filtered = filtered.filter(user => user.batch === filterBatch)
    }

    const direction = sortConfig.direction === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const aValue = readField(a, sortConfig.key)
      const bValue = readField(b, sortConfig.key)

      if (typeof aValue === 'string' || typeof bValue === 'string') {
        const aText = typeof aValue === 'string' ? aValue : ''
        const bText = typeof bValue === 'string' ? bValue : ''
        return (
          aText.localeCompare(bText, undefined, { sensitivity: 'base' }) *
          direction
        )
      }

      // Missing values and Infinity placeholders always sink to the bottom
      // regardless of direction so "N/A" rows never take a medal.
      const aNum = typeof aValue === 'number' && Number.isFinite(aValue)
      const bNum = typeof bValue === 'number' && Number.isFinite(bValue)
      if (!aNum && !bNum) return 0
      if (!aNum) return 1
      if (!bNum) return -1
      return ((aValue as number) - (bValue as number)) * direction
    })
  }, [enriched, searchTerm, filterBatch, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }))
  }

  const getSortIcon = (key: string): string => {
    if (sortConfig.key !== key) return '⇅'
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  const ariaSortFor = (
    key: string | undefined
  ): 'ascending' | 'descending' | undefined => {
    if (!key || sortConfig.key !== key) return undefined
    return sortConfig.direction === 'asc' ? 'ascending' : 'descending'
  }

  const getRankBadge = (index: number): React.ReactNode => {
    if (index === 0) return <FaMedal style={{ color: 'var(--gold)' }} />
    if (index === 1) return <FaMedal style={{ color: 'var(--silver)' }} />
    if (index === 2) return <FaMedal style={{ color: 'var(--bronze)' }} />
    return index + 1
  }

  const getRankClass = (index: number): string => {
    if (index === 0) return 'rank-gold'
    if (index === 1) return 'rank-silver'
    if (index === 2) return 'rank-bronze'
    return ''
  }

  const cardColumns = tab.columns.filter(column => column.inCard !== false)

  const emptyState = (
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
  )

  return (
    <div className="custom-rank-table">
      <div className="rank-table__tabs" role="tablist">
        {TABS.map(entry => (
          <button
            key={entry.id}
            role="tab"
            aria-selected={activeTab === entry.id}
            aria-label={`${entry.label}: ${entry.hint}`}
            title={entry.hint}
            className={`tab-button ${
              activeTab === entry.id ? 'tab-button--active' : ''
            }`}
            onClick={() => setActiveTab(entry.id)}
          >
            <span className="tab-icon">{entry.icon}</span>
            <span className="tab-label">{entry.label}</span>
          </button>
        ))}
      </div>

      <div className="rank-table__controls">
        <div className="rank-table__search">
          <span className="search-icon">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search by name or username..."
            aria-label="Search by name or username"
            value={searchTerm}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(event.target.value)
            }
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
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setFilterBatch(event.target.value)
            }
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

      {/* Desktop and tablet: sortable table with a pinned rank + name column. */}
      <div className="rank-table__wrapper">
        <table className="rank-table">
          <thead className="rank-table__head">
            <tr>
              <th className="rank-col">Rank</th>
              {tab.columns.map(column => (
                <th
                  key={column.label}
                  title={column.title}
                  className={`${column.cellClass ?? ''} ${
                    column.key ? 'sortable' : ''
                  }`}
                  aria-sort={ariaSortFor(column.key)}
                  onClick={
                    column.key
                      ? () => handleSort(column.key as string)
                      : undefined
                  }
                >
                  {column.label}
                  {column.key && ` ${getSortIcon(column.key)}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="rank-table__body">
            {processedData.map((user, index) => (
              <tr
                key={user.userName || index}
                className={`rank-table__row ${getRankClass(index)}`}
              >
                <td className="rank-col">
                  <span className="rank-badge">{getRankBadge(index)}</span>
                </td>
                {tab.columns.map(column => (
                  <td key={column.label} className={column.cellClass}>
                    {column.render(user)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {processedData.length === 0 && emptyState}
      </div>

      {/* Phones: one card per person. A 12 column table cannot be read at
          375px even with a pinned name, so the same data is stacked instead. */}
      <div className="rank-cards">
        {processedData.map((user, index) => (
          <article
            key={user.userName || index}
            className={`rank-card ${getRankClass(index)}`}
          >
            <header className="rank-card__head">
              <span className="rank-badge">{getRankBadge(index)}</span>
              {nameColumn.render(user)}
              <span className="batch-badge">{user.batch || 'N/A'}</span>
            </header>
            <dl className="rank-card__stats">
              {cardColumns.map(column => (
                <div key={column.label} className="rank-card__stat">
                  <dt title={column.title}>{column.label}</dt>
                  <dd>{column.render(user)}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}

        {processedData.length === 0 && emptyState}
      </div>
    </div>
  )
}

export default CustomRankTable
