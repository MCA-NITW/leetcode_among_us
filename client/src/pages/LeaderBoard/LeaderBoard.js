// LeaderBoard.js
import React from "react";
import RankTable from "./RankTable/RankTable";
import Dropdown from "../../components/Dropdown";
import Loader from "../../components/Loader/Loader";
import "./LeaderBoard.css";

function LeaderBoard({ data, loading }) {
  const [rankingBasedOn, setRankingBasedOn] = React.useState("totalSolved");
  const [batch, setBatch] = React.useState("all");

  const batchOptions = ["all"];
  data.forEach((leetcoder) => {
    if (!batchOptions.includes(leetcoder.batch)) {
      batchOptions.push(leetcoder.batch);
    }
  });

  const rankingOptions = [
    "totalSolved",
    "easySolved",
    "mediumSolved",
    "hardSolved",
    "globalContestRating",
    "globalContestRanking",
    "questionRanking",
    "contestTopPercentage",
    "attendedContestCount",
    "reputation",
    "bestContestRank",
    "mostFourQuestionsInContest",
    "mostThreeQuestionsInContest",
    "mostTwoQuestionsInContest",
    "mostOneQuestionsInContest",
    "mostZeroQuestionsInContest",
    "averageContestRanking",
    "badgeCount",
    "totalActiveDays",
    "bestStreak",
  ];

  return (
    <div className="leaderboard">
      <h1 className="leaderboard-header">Leetcode Leaderboard</h1>
      <div className="ranking-based-on">
        <Dropdown
          options={rankingOptions}
          selectedValue={rankingBasedOn}
          onChange={(e) => setRankingBasedOn(e.target.value)}
        />
        <Dropdown
          options={batchOptions}
          selectedValue={batch}
          onChange={(e) => setBatch(e.target.value)}
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <RankTable data={data} rankingBasedOn={rankingBasedOn} batch={batch} />
      )}
    </div>
  );
}

export default LeaderBoard;
