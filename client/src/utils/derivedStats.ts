// Derived leaderboard metrics.
//
// Every value here comes from data the batch endpoint already returns, so
// nothing in this file costs an extra LeetCode call. They are materialised onto
// the row object (rather than computed during render) so the table's generic
// sort accessor can order by them like any other numeric field.

import type { ContestEntry, TagProblemCounts, UserData } from '../types'

const SECONDS_PER_DAY = 86400

export interface DerivedStats {
  completionPct: number
  currentStreak: number
  trueBestStreak: number
  totalSubmissions: number
  acceptanceRate: number
  ratingDelta: number
  daysSinceLastContest: number
  lastContestTitle: string
  topTopicName: string
  topTopicCount: number
  yearsActive: number
  beatsMedium: number
  beatsLabel: string
  topLanguage: string
  topLanguageCount: number
  languageCount: number
  hoursSinceLastSolve: number
  lastSolvedTitle: string
  dccProgress: number
  dccLabel: string
}

export type EnrichedUser = Partial<UserData> & DerivedStats

/** UTC day index, matching the UTC-midnight keys LeetCode uses. */
const toDayIndex = (unixSeconds: number): number =>
  Math.floor(unixSeconds / SECONDS_PER_DAY)

/**
 * Current and best streak from the merged submission calendar.
 *
 * The server derives `bestStreak` as the max of each year's own streak, so a
 * run crossing new year (Dec 28 to Jan 5) gets split and undercounted. The
 * calendar is merged across every active year, so walking it directly gives
 * both a correct best streak and a current one, which LeetCode never exposes.
 */
export const computeStreaks = (
  calendar: Record<string, number> | undefined
): { current: number; best: number } => {
  if (!calendar) return { current: 0, best: 0 }

  const days = Object.entries(calendar)
    .filter(([, count]) => count > 0)
    .map(([timestamp]) => toDayIndex(Number(timestamp)))
    .filter(day => Number.isFinite(day))
    .sort((a, b) => a - b)

  const unique = [...new Set(days)]
  if (unique.length === 0) return { current: 0, best: 0 }

  let best = 1
  let run = 1
  for (let i = 1; i < unique.length; i += 1) {
    run = unique[i] === unique[i - 1] + 1 ? run + 1 : 1
    if (run > best) best = run
  }

  // A streak stays "current" until a full day has been missed, so today not
  // being solved yet does not reset it to zero.
  const today = toDayIndex(Date.now() / 1000)
  const last = unique[unique.length - 1]
  if (last < today - 1) return { current: 0, best }

  let current = 1
  for (let i = unique.length - 1; i > 0; i -= 1) {
    if (unique[i] !== unique[i - 1] + 1) break
    current += 1
  }
  return { current, best }
}

const attendedInOrder = (history: ContestEntry[] | undefined): ContestEntry[] =>
  (history ?? [])
    .filter(entry => entry.attended)
    .sort((a, b) => (a.contest?.startTime ?? 0) - (b.contest?.startTime ?? 0))

/** Rating gained or lost in the most recent contest. 0 when unrateable. */
export const computeRatingDelta = (
  history: ContestEntry[] | undefined
): number => {
  const attended = attendedInOrder(history)
  if (attended.length < 2) return 0
  const latest = attended[attended.length - 1]
  const previous = attended[attended.length - 2]
  return Math.round((latest.rating ?? 0) - (previous.rating ?? 0))
}

/** Days since the last attended contest. Infinity sorts to the bottom. */
export const computeDaysSinceLastContest = (
  history: ContestEntry[] | undefined
): { days: number; title: string } => {
  const attended = attendedInOrder(history)
  const latest = attended[attended.length - 1]
  const startTime = latest?.contest?.startTime
  if (!startTime) return { days: Number.POSITIVE_INFINITY, title: '' }
  const days = Math.floor((Date.now() / 1000 - startTime) / SECONDS_PER_DAY)
  return { days: Math.max(days, 0), title: latest.contest?.title ?? '' }
}

/**
 * Strongest topic. Advanced tags outrank intermediate outrank fundamental on a
 * tie, so a Dynamic Programming specialist is not labelled by Array volume.
 */
export const computeTopTopic = (
  tags: TagProblemCounts | undefined
): { name: string; count: number } => {
  if (!tags) return { name: '', count: 0 }

  const tiers: Array<[keyof TagProblemCounts, number]> = [
    ['advanced', 3],
    ['intermediate', 2],
    ['fundamental', 1]
  ]

  let best = { name: '', count: 0, tier: 0 }
  for (const [tier, weight] of tiers) {
    for (const tag of tags[tier] ?? []) {
      const better =
        tag.problemsSolved > best.count ||
        (tag.problemsSolved === best.count && weight > best.tier)
      if (better) {
        best = { name: tag.tagName, count: tag.problemsSolved, tier: weight }
      }
    }
  }
  return { name: best.name, count: best.count }
}

/** Most-used language by problems solved, plus how many languages appear. */
export const computeTopLanguage = (
  languages: Array<{ languageName: string; problemsSolved: number }> | undefined
): { name: string; count: number; total: number } => {
  if (!languages || languages.length === 0)
    return { name: '', count: 0, total: 0 }
  const top = languages.reduce((best, current) =>
    current.problemsSolved > best.problemsSolved ? current : best
  )
  return {
    name: top.languageName,
    count: top.problemsSolved,
    total: languages.length
  }
}

/**
 * Progress on the current month's Daily Coding Challenge badge. LeetCode lists
 * the next few months, so the lowest-index entry with progress is the live one.
 */
export const computeDccProgress = (
  upcoming: Array<{ name: string; progress?: number }> | undefined
): { progress: number; label: string } => {
  const current = upcoming?.find(badge => (badge.progress ?? 0) > 0)
  if (!current) return { progress: 0, label: upcoming?.[0]?.name ?? '' }
  return { progress: current.progress ?? 0, label: current.name }
}

const beatsFor = (
  stats: Array<{ difficulty: string; percentage: number }> | undefined,
  difficulty: string
): number =>
  stats?.find(stat => stat.difficulty === difficulty)?.percentage ?? 0

export const enrichUser = (user: Partial<UserData>): EnrichedUser => {
  const allSubmissions = user.acSubmissionNum?.find(
    stat => stat.difficulty === 'All'
  )
  const submissions = allSubmissions?.submissions ?? 0
  const accepted = allSubmissions?.count ?? 0

  const streaks = computeStreaks(user.submissionCalendar)
  const lastContest = computeDaysSinceLastContest(user.contestHistory)
  const topTopic = computeTopTopic(user.tagProblemCounts)

  const topLanguage = computeTopLanguage(user.languageStats)
  const dcc = computeDccProgress(user.upcomingBadges)
  const lastSolveSeconds = user.lastSolved?.timestamp

  const easyBeats = beatsFor(user.beatsStats, 'Easy')
  const mediumBeats = beatsFor(user.beatsStats, 'Medium')
  const hardBeats = beatsFor(user.beatsStats, 'Hard')

  return {
    ...user,
    completionPct: user.totalQuestions
      ? ((user.totalSolved ?? 0) / user.totalQuestions) * 100
      : 0,
    currentStreak: streaks.current,
    trueBestStreak: Math.max(streaks.best, user.bestStreak ?? 0),
    totalSubmissions: submissions,
    acceptanceRate: submissions > 0 ? (accepted / submissions) * 100 : 0,
    ratingDelta: computeRatingDelta(user.contestHistory),
    daysSinceLastContest: lastContest.days,
    lastContestTitle: lastContest.title,
    topTopicName: topTopic.name,
    topTopicCount: topTopic.count,
    yearsActive: user.activeYears?.length ?? 0,
    beatsMedium: mediumBeats,
    beatsLabel: `Beats Easy ${easyBeats.toFixed(1)}% / Medium ${mediumBeats.toFixed(1)}% / Hard ${hardBeats.toFixed(1)}%`,
    topLanguage: topLanguage.name,
    topLanguageCount: topLanguage.count,
    languageCount: topLanguage.total,
    hoursSinceLastSolve: lastSolveSeconds
      ? Math.max((Date.now() / 1000 - lastSolveSeconds) / 3600, 0)
      : Number.POSITIVE_INFINITY,
    lastSolvedTitle: user.lastSolved?.title ?? '',
    dccProgress: dcc.progress,
    dccLabel: dcc.label
  }
}
