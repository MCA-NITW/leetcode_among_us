import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { FaTrophy, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { MdAccessTime } from 'react-icons/md'
import './RecentContestActivity.css'

function RecentContestActivity({ data }) {
  const recentContests = useMemo(() => {
    const contestMap = new Map()

    data.forEach(user => {
      if (!user.contestHistory) return

      user.contestHistory.forEach(entry => {
        if (!entry.attended) return

        const contestTitle = entry.contest?.title
        if (!contestTitle) return

        if (!contestMap.has(contestTitle)) {
          contestMap.set(contestTitle, {
            title: contestTitle,
            startTime: entry.contest.startTime,
            participants: []
          })
        }

        contestMap.get(contestTitle).participants.push({
          name: user.name,
          userName: user.userName,
          avatar: user.avatar,
          ranking: entry.ranking,
          problemsSolved: entry.problemsSolved,
          totalProblems: entry.totalProblems,
          rating: Math.round(entry.rating || 0),
          trendDirection: entry.trendDirection
        })
      })
    })

    return Array.from(contestMap.values())
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, 5)
      .map(contest => ({
        ...contest,
        participants: contest.participants.sort((a, b) => a.ranking - b.ranking)
      }))
  }, [data])

  if (recentContests.length === 0) return null

  const formatDate = timestamp => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="recent-contests">
      <div className="recent-contests__header">
        <h2 className="recent-contests__title">
          <FaTrophy /> Recent Contest Activity
        </h2>
        <p className="recent-contests__subtitle">
          Latest contest performances from the community
        </p>
      </div>

      <div className="recent-contests__grid">
        {recentContests.map((contest, index) => (
          <div
            key={contest.title}
            className="contest-card"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="contest-card__header">
              <h3 className="contest-card__title">{contest.title}</h3>
              <span className="contest-card__date">
                <MdAccessTime />
                {formatDate(contest.startTime)}
              </span>
            </div>

            <div className="contest-card__stats">
              <span className="contest-card__stat">
                {contest.participants.length} participant
                {contest.participants.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="contest-card__participants">
              {contest.participants.slice(0, 5).map(p => (
                <div key={p.userName} className="participant-row">
                  <div className="participant-info">
                    {p.avatar && (
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="participant-avatar"
                        onError={e => {
                          e.target.style.display = 'none'
                        }}
                      />
                    )}
                    <a
                      href={`https://leetcode.com/${p.userName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="participant-name"
                    >
                      {p.name}
                    </a>
                  </div>

                  <div className="participant-stats">
                    <span className="participant-solved">
                      {p.problemsSolved}/{p.totalProblems}
                    </span>
                    <span className="participant-rank">
                      #{p.ranking.toLocaleString()}
                    </span>
                    {p.trendDirection && (
                      <span
                        className={`participant-trend trend-${p.trendDirection.toLowerCase()}`}
                      >
                        {p.trendDirection === 'UP' ? (
                          <FaArrowUp />
                        ) : (
                          <FaArrowDown />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {contest.participants.length > 5 && (
                <div className="participant-more">
                  +{contest.participants.length - 5} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

RecentContestActivity.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default RecentContestActivity
