export interface LeetcoderEntry {
  id: string
  name: string
  userName: string
  batch: string
  gender: string
}

export interface UserData extends LeetcoderEntry {
  avatar?: string
  aboutMe?: string
  country?: string
  company?: string
  jobTitle?: string
  school?: string
  websites?: string[]
  skillTags?: string[]
  starRating?: number
  githubUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
  contestBadge?: {
    name: string
    icon?: string
    hoverText?: string
    expired?: boolean
  }
  upcomingBadges?: Array<{
    name: string
    id?: string
    icon?: string
    progress?: number
  }>
  beatsStats?: Array<{ difficulty: string; percentage: number }>
  globalContestRating: number
  globalContestRanking: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  totalSolved: number
  totalEasy: number
  totalMedium: number
  totalHard: number
  totalQuestions: number
  reputation: number
  questionRanking: number
  contestTopPercentage: number
  totalParticipants: number
  attendedContestCount: number
  contestHistory?: ContestEntry[]
  badges?: Badge[]
  badgeCount: number
  bestContestRank: number
  mostFourQuestionsInContest: number
  mostThreeQuestionsInContest: number
  mostTwoQuestionsInContest: number
  mostOneQuestionsInContest: number
  mostOneQuestionInContest?: number
  mostZeroQuestionsInContest: number
  averageContestRanking: number
  totalActiveDays: number
  bestStreak: number
  submissionCalendar?: Record<string, number>
  activeYears?: number[]
  acSubmissionNum?: Array<{
    difficulty: string
    count: number
    submissions: number
  }>
  tagProblemCounts?: TagProblemCounts
  ranking?: number
  attendedContestsCount?: number
}

export interface ContestEntry {
  attended: boolean
  trendDirection?: string
  problemsSolved: number
  totalProblems: number
  finishTimeInSeconds: number
  rating: number
  ranking: number
  contest?: { title: string; startTime: number }
}

export interface Badge {
  id: string
  name: string
  shortName?: string
  displayName?: string
  icon?: string
  hoverText?: string
  medal?: {
    slug: string
    config?: { iconGif?: string; iconGifBackground?: string }
  }
}

export interface TagProblemCounts {
  advanced?: Array<{
    tagName: string
    tagSlug: string
    problemsSolved: number
  }>
  intermediate?: Array<{
    tagName: string
    tagSlug: string
    problemsSolved: number
  }>
  fundamental?: Array<{
    tagName: string
    tagSlug: string
    problemsSolved: number
  }>
}
