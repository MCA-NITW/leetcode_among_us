import React from "react";
import "./RankTable.css";

const camelCaseToSentenceCase = (camelCase) => {
  const result = camelCase.replace(/([A-Z])/g, " $1");
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
  return finalResult;
};

const RankTable = ({ data, rankingBasedOn, batch }) => {
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
  const sortedData = sortData();

  return (
    <div className="profile-cards">
      <div className="profile-row profile-header">
        <div>Rank</div>
        <div>Name</div>
        <div>{camelCaseToSentenceCase(rankingBasedOn)}</div>
        <div>Visit Profile</div>
      </div>
      {sortedData.map((profile) => {
        return (
          <div className="profile-row" key={profile.userName}>
            <div className="profile-row_rank">
              Rank: {sortedData.indexOf(profile) + 1}
            </div>
            <div className="profile-row_name">{profile.name}</div>
            {/* <div className="profile-row_batch">({profile.batch})</div> */}
            <div className="profile-row_title">{profile[rankingBasedOn]}</div>
            <div className="profile-row_link">
              <a
                href={`https://leetcode.com/${profile.userName}`}
                target="blank_"
              >
                Visit Profile
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RankTable;
