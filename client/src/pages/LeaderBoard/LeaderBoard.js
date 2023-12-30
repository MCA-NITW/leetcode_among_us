// LeaderBoard.js
import React from "react";
import PropTypes from "prop-types";
import RankTable from "./RankTable/RankTable";
import Loader from "../../components/Loader/Loader";
import "./LeaderBoard.css";

function LeaderBoard({ data, loading }) {
  return (
    <div className="leaderboard">
      <h1 className="leaderboard-header">Leetcode Leaderboard</h1>
      {loading ? <Loader /> : <RankTable data={data} />}
    </div>
  );
}

LeaderBoard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default LeaderBoard;
