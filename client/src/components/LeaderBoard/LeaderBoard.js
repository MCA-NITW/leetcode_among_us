import "./LeaderBoard.css";
import React from "react";
import { useEffect } from "react";
import leetcoders from "../../assets/leetcoders.json";
import RankTable from "../RankTable/RankTable";
import Dropdown from "../Dropdown";
import { fetchDataForLeetcoder } from "../dataProcessing";

function LeaderBoard() {
  const [rankingBasedOn, setRankingBasedOn] = React.useState("totalSolved");
  const [batch, setBatch] = React.useState("all");
  const [data, setData] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const updatedLeetcoders = await Promise.all(
        leetcoders.leetCoders.map(fetchDataForLeetcoder),
      );
      setData(updatedLeetcoders);
    };

    fetchData();
  }, []);

  const batchOptions = ["all", "2022", "2023", "2024", "2025", "2026"];
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
