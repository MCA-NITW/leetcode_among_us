import "./App.css";
import React, { useState, useEffect } from "react";
// import Students from "./assets/leetcoders.json";
// import RankTable from "./components/RankTable";

// const leetcoders = Students.leetCoders;

function App() {
  // const url = "https://leetcode-api-faisalshohag.vercel.app/";
  const [data, setData] = useState(null);
  // const [batch, setBatch] = useState("all");
  // const [rankingBasedOn, setRankingBasedOn] = useState("totalSolved");
  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => {
        setData(data.message);
      });
  }, []);

  // Promise.all(
  //   leetcoders.map((leetcoder) => {
  //     return fetch(url + leetcoder.userName).then((res) => res.json());
  //   }),
  // ).then((res) => {
  //   console.log(res);
  //   leetcoders.forEach((leetcoder, i) => {
  //     leetcoder.globalContestRating = Math.round(
  //       res[i].userContestRanking.rating,
  //     );
  //     leetcoder.globalContestRanking = res[i].userContestRanking.globalRanking;
  //     leetcoder.easySolved = res[i].easySolved;
  //     leetcoder.mediumSolved = res[i].mediumSolved;
  //     leetcoder.hardSolved = res[i].hardSolved;
  //     leetcoder.totalSolved = res[i].totalSolved;
  //     leetcoder.totalEasy = res[i].totalEasy;
  //     leetcoder.totalMedium = res[i].totalMedium;
  //     leetcoder.totalHard = res[i].totalHard;
  //     leetcoder.totalQuestions = res[i].totalQuestions;
  //     leetcoder.reputation = res[i].reputation;
  //     leetcoder.questionRanking = res[i].ranking;
  //     leetcoder.contestTopPercentage = res[i].userContestRanking.topPercentage;
  //     leetcoder.totalParticipants = res[i].userContestRanking.totalParticipants;
  //     leetcoder.attendedContestCount =
  //       res[i].userContestRanking.attendedContestsCount;
  //     leetcoder.contestHistory = res[i].userContestRankingHistory;
  //     leetcoder.bestContestRank = getBestContestRank(leetcoder.contestHistory);
  //     leetcoder.mostFourQuestionsInContest = getMostQuestionsInContest(
  //       leetcoder.contestHistory,
  //       4,
  //     );
  //     leetcoder.mostThreeQuestionsInContest = getMostQuestionsInContest(
  //       leetcoder.contestHistory,
  //       3,
  //     );
  //     leetcoder.mostTwoQuestionsInContest = getMostQuestionsInContest(
  //       leetcoder.contestHistory,
  //       2,
  //     );
  //     leetcoder.mostOneQuestionsInContest = getMostQuestionsInContest(
  //       leetcoder.contestHistory,
  //       1,
  //     );
  //     leetcoder.mostZeroQuestionsInContest = getMostQuestionsInContest(
  //       leetcoder.contestHistory,
  //       0,
  //     );
  //     leetcoder.averageContestRanking = getAverageContestRanking(
  //       leetcoder.contestHistory,
  //     );
  //   });
  //   setData(leetcoders);
  // });

  // const getAverageContestRanking = (contestHistory) => {
  //   let totalRanking = 0,
  //     totalContest = 0;
  //   contestHistory.forEach((contest) => {
  //     if (contest.attended === true) {
  //       totalRanking += contest.ranking;
  //       totalContest += 1;
  //     }
  //   });
  //   return Math.round(totalRanking / totalContest);
  // };

  // const getMostQuestionsInContest = (contestHistory, question) => {
  //   let mostFourQuestionsInContest = 0;
  //   contestHistory.forEach((contest) => {
  //     if (contest.problemsSolved === question && contest.attended === true) {
  //       mostFourQuestionsInContest += 1;
  //     }
  //   });
  //   return mostFourQuestionsInContest;
  // };

  // const getBestContestRank = (contestHistory) => {
  //   let bestRank = 1000000000;
  //   contestHistory.forEach((contest) => {
  //     if (contest.ranking < bestRank && contest.ranking !== 0) {
  //       bestRank = contest.ranking;
  //     }
  //   });
  //   return bestRank;
  // };

  // const displayData = () => {
  //   const currentData = data.filter((profile) => {
  //     if (batch === "all") return profile;
  //     return profile.batch === batch;
  //   });
  //   let descending = [
  //     "bestContestRank",
  //     "averageContestRanking",
  //     "globalContestRanking",
  //     "questionRanking",
  //     "contestTopPercentage",
  //   ];
  //   currentData.sort((a, b) => {
  //     if (descending.includes(rankingBasedOn))
  //       return a[rankingBasedOn] - b[rankingBasedOn];
  //     return b[rankingBasedOn] - a[rankingBasedOn];
  //   });

  //   return <RankTable data={currentData} rankingBasedOn={rankingBasedOn} />;
  // };

  return (
    <div className="App">
      <div className="leaderboard">
        <div className="leaderboard-header">
          <h1>Leetcode Leaderboard</h1>
        </div>
        <div className="ranking-based-on">
          <div className="ranking-based-on-sort">
            <select
              name="ranking-based-on"
              id="ranking-based-on"
              // onChange={(e) => setRankingBasedOn(e.target.value)}
            >
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
            <select
              name="ranking-based-on-filter"
              id="ranking-based-on-filter"
              // onChange={(e) => setBatch(e.target.value)}
            >
              <option value="all">All</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
        {/* {displayData()} */}
      </div>
    </div>
  );
}

export default App;
