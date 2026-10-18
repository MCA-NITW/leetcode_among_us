import { useMemo } from 'react'
import type { CSSProperties, SyntheticEvent } from 'react'
import { FaArrowUp, FaArrowDown, FaChartLine } from 'react-icons/fa'
import './WeeklyMovers.css'
import type { UserData } from '../../types'
import { useHistory } from '../../hooks/useHistory'
import { useReveal } from '../../hooks/useReveal'
import { computeMovers } from '../../utils/history'
import type { History } from '../../utils/history'

interface WeeklyMoversProps {
  data: Partial<UserData>[]
}

const formatDay = (date: string): string =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  })

/** Who solved the most since last week, from the daily snapshot history. */
function WeeklyMovers({ data }: WeeklyMoversProps) {
  // Two weeks covers the 7-day comparison even if a few daily runs failed.
  const history = useHistory({ days: 14 })
  if (!history || history.snapshots.length === 0) return null
  // Mounted only once there is something to show, so useReveal sees the node.
  return <MoversPanel data={data} history={history} />
}

function MoversPanel({
  data,
  history
}: WeeklyMoversProps & { history: History }) {
  const sectionRef = useReveal<HTMLElement>()

  const people = useMemo(() => {
    const byName = new Map<string, Partial<UserData>>()
    data.forEach(user => {
      if (user.userName) byName.set(user.userName.toLowerCase(), user)
    })
    return byName
  }, [data])

  const result = useMemo(() => computeMovers(history), [history])

  const firstDay = [...history.snapshots].sort((a, b) =>
    a.date.localeCompare(b.date)
  )[0].date

  let subtitle: string
  if (!result) {
    subtitle = `Daily snapshots started on ${formatDay(firstDay)}. Movers appear after the next one.`
  } else if (result.days >= 7) {
    subtitle = `Problems solved from ${formatDay(result.fromDate)} to ${formatDay(result.toDate)}`
  } else {
    subtitle = `Problems solved in the last ${result.days} day${result.days === 1 ? '' : 's'} (history is still filling up to a full week)`
  }

  return (
    <section
      className="weekly-movers reveal"
      ref={sectionRef}
      aria-labelledby="weekly-movers-title"
    >
      <div className="weekly-movers__header">
        <h2 className="weekly-movers__title" id="weekly-movers-title">
          <FaChartLine /> Movers This Week
        </h2>
        <p className="weekly-movers__subtitle">{subtitle}</p>
      </div>

      {result && result.movers.length === 0 && (
        <p className="weekly-movers__empty">
          Nobody solved a new problem in this window yet.
        </p>
      )}

      {result && result.movers.length > 0 && (
        <ol className="weekly-movers__list stagger">
          {result.movers.map((mover, index) => {
            const person = people.get(mover.userName)
            const name = person?.name || mover.userName
            return (
              <li
                key={mover.userName}
                className="weekly-movers__row card-lift"
                style={{ '--i': index } as CSSProperties}
              >
                <span className="weekly-movers__rank">{index + 1}</span>
                {person?.avatar ? (
                  <img
                    src={person.avatar}
                    alt=""
                    className="weekly-movers__avatar"
                    loading="lazy"
                    onError={(e: SyntheticEvent<HTMLImageElement>) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <span className="weekly-movers__avatar" aria-hidden="true" />
                )}
                <a
                  href={`https://leetcode.com/${mover.userName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="weekly-movers__name"
                >
                  {name}
                </a>
                <span className="weekly-movers__gain">
                  +{mover.solvedGained}
                  <span className="weekly-movers__gain-label">solved</span>
                </span>
                {mover.hardGained > 0 && (
                  <span className="weekly-movers__hard">
                    +{mover.hardGained} hard
                  </span>
                )}
                {mover.ratingChange !== null && mover.ratingChange !== 0 && (
                  <span
                    className={`weekly-movers__rating ${
                      mover.ratingChange > 0
                        ? 'weekly-movers__rating--up'
                        : 'weekly-movers__rating--down'
                    }`}
                    aria-label={`Rating ${mover.ratingChange > 0 ? 'up' : 'down'} ${Math.abs(mover.ratingChange)}`}
                  >
                    {mover.ratingChange > 0 ? <FaArrowUp /> : <FaArrowDown />}
                    {Math.abs(mover.ratingChange)}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

export default WeeklyMovers
