import React from "react";
import "./RankTable.css";

// const camelCaseToSentenceCase = (camelCase) => {
//   const result = camelCase.replace(/([A-Z])/g, " $1");
//   const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
//   return finalResult;
// };

const RankTable = ({ data, rankingBasedOn }) => {
  return (
    <div className="profile-cards">
      {/* <div className="profile-row profile-header">
        <div>Rank</div>
        <div>Name</div>
        <div>{camelCaseToSentenceCase(rankingBasedOn)}</div>
        <div>Visit Profile</div>
      </div> */}
      {data.map((profile) => {
        return (
          <div className="profile-card">
            <div className="profile-card_rank">
              Rank: {data.indexOf(profile) + 1}
            </div>
            <div className="profile-card_name">{profile.name}</div>
            <div className="profile-card_batch">({profile.batch})</div>
            <div className="profile-card_title">{profile[rankingBasedOn]}</div>
            <div className="profile-card_link">
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
