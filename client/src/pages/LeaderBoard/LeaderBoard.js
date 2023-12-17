// LeaderBoard.js
import React from "react";
import PropTypes from "prop-types";
import RankTable from "./RankTable/RankTable";
import Dropdown from "../../components/Dropdown";
import Loader from "../../components/Loader/Loader";
import "./LeaderBoard.css";

function LeaderBoard({ data, loading }) {
  const [batch, setBatch] = React.useState("all");

  const batchOptions = ["all"];
  data.forEach((leetcoder) => {
    if (!batchOptions.includes(leetcoder.batch)) {
      batchOptions.push(leetcoder.batch);
    }
  });

  return (
    <div className="leaderboard">
      <h1 className="leaderboard-header">Leetcode Leaderboard</h1>
      <div className="ranking-based-on">
        <Dropdown
          options={batchOptions}
          selectedValue={batch}
          onChange={(e) => setBatch(e.target.value)}
        />
      </div>
      {loading ? <Loader /> : <RankTable data={data} batch={batch} />}
    </div>
  );
}

LeaderBoard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default LeaderBoard;
