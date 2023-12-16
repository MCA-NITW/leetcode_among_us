import "./LeaderBoard.css";
import React from "react";
import RankTable from "./RankTable/RankTable";
import Dropdown from "../../components/Dropdown";

function LeaderBoard(props) {
  const [rankingBasedOn, setRankingBasedOn] = React.useState("totalSolved");
  const [batch, setBatch] = React.useState("all");
  const data = props.data;

  const batchOptions = ["all"];
  // Gett All Unique batch from data and push it in batchOptions
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
      <RankTable data={data} rankingBasedOn={rankingBasedOn} batch={batch} />
    </div>
  );
}

export default LeaderBoard;
