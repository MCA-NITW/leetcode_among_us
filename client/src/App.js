import "./App.css";
import {
  userPublicProfile,
  globalData,
  siteAnnouncements,
  languageStats,
  skillStats,
  userContestRankingInfo,
  userProblemsSolved,
  userBadges,
  userProfileCalendar,
  recentAcSubmissions,
  getStreakCounter,
  currentTimestamp,
  questionOfToday,
  codingChallengeMedal,
  getUserProfile,
} from "./queries/UserData";

function App() {
  const username = "sagargupta1610";

  console.log(userPublicProfile(username));
  console.log(globalData());
  console.log(siteAnnouncements());
  console.log(languageStats(username));
  console.log(skillStats(username));
  console.log(userContestRankingInfo(username));
  console.log(userProblemsSolved(username));
  console.log(userBadges(username));
  console.log(userProfileCalendar(username));
  console.log(recentAcSubmissions(username, 15));
  console.log(getStreakCounter());
  console.log(currentTimestamp());
  console.log(questionOfToday());
  console.log(codingChallengeMedal(2023, 10));
  console.log(getUserProfile(username, 0, 20, ""));

  return (
    <div className="App">
      <div className="leaderboard">
        <div className="leaderboard-header">
          <h1>Leetcode Leaderboard</h1>
        </div>
        <div className="ranking-based-on">
          <div className="ranking-based-on-sort">
            <select name="ranking-based-on" id="ranking-based-on">
              <option value="totalSolved">Total Solved</option>
              <option value="easySolved">Easy Solved</option>
              <option value="mediumSolved">Medium Solved</option>
              <option value="hardSolved">Hard Solved</option>
              <option value="globalContestRating">Global Contest Rating</option>
              <option value="globalContestRanking">
                Global Contest Ranking
              </option>
              <option value="questionRanking">Question Ranking</option>
              <option value="contestTopPercentage">
                Contest Top Percentage
              </option>
              <option value="attendedContestCount">
                Attended Contest Count
              </option>
              <option value="reputation">Reputation</option>
              <option value="bestContestRank">Best Contest Rank</option>
              <option value="mostFourQuestionsInContest">
                Most Four Questions In Contest
              </option>
              <option value="mostThreeQuestionsInContest">
                Most Three Questions In Contest
              </option>
              <option value="mostTwoQuestionsInContest">
                Most Two Questions In Contest
              </option>
              <option value="mostOneQuestionsInContest">
                Most One Questions In Contest
              </option>
              <option value="mostZeroQuestionsInContest">
                Most Zero Questions In Contest
              </option>
              <option value="averageContestRanking">
                Average Contest Ranking
              </option>
            </select>
          </div>
          <div className="ranking-based-on-filter">
            <select name="ranking-based-on-filter" id="ranking-based-on-filter">
              <option value="all">All</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
