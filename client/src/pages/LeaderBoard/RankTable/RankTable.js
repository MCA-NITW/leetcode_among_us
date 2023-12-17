import React from "react";
import PropTypes from "prop-types";
import "./RankTable.css";
import Dropdown from "../../../components/Dropdown";

const RankTable = ({ data, batch }) => {
  const [rankingBasedOn, setRankingBasedOn] = React.useState("totalSolved");
  const [sortedData, setSortedData] = React.useState(data);
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

  React.useEffect(() => {
    const sortData = () => {
      const currentData = data.filter((profile) => {
        if (batch === "all") return profile;
        return profile.batch === batch;
      });

      let descending = [
        "bestContestRank",
        "averageContestRanking",
        "globalContestRanking",
        "questionRanking",
        "contestTopPercentage",
      ];

      currentData.sort((a, b) => {
        if (descending.includes(rankingBasedOn)) {
          return a[rankingBasedOn] - b[rankingBasedOn];
        }
        return b[rankingBasedOn] - a[rankingBasedOn];
      });
      return currentData;
    };

    setSortedData(sortData());
  }, [batch, data, rankingBasedOn]);

  return (
    <div className="profile-cards">
      <div className="profile-row profile-header">
        <div>Rank</div>
        <div>User</div>
        <div>
          <Dropdown
            options={rankingOptions}
            selectedValue={rankingBasedOn}
            onChange={(e) => setRankingBasedOn(e.target.value)}
          />
        </div>
      </div>
      {sortedData.map((profile) => {
        return (
          <div className="profile-row" key={profile.userName}>
            <div className="profile-row_rank">
              {sortedData.indexOf(profile) + 1}
            </div>
            <div className="profile-row_user">
              <div className="profile-row_avatar">
                <img src={profile.avatar} alt="avatar" />
              </div>
              <div className="profile-row_names">
                <div className="profile-row_name">{profile.name}</div>
                <div className="profile-row_userName">
                  <a
                    href={`https://leetcode.com/${profile.userName}`}
                    target="blank_"
                  >
                    {profile.userName}
                  </a>
                </div>
              </div>
            </div>
            <div className="profile-row_title">{profile[rankingBasedOn]}</div>
          </div>
        );
      })}
    </div>
  );
};

RankTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  batch: PropTypes.string.isRequired,
};

export default RankTable;
