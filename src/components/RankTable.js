import React from "react";
import "./RankTable.css";

const camelCaseToSentenceCase = (camelCase) => {
  const result = camelCase.replace(/([A-Z])/g, " $1");
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
  return finalResult;
};

const RankTable = ({ data, rankingBasedOn }) => {
  return (
    <>
      <div className="profile-row profile-header">
        <div>Rank</div>
        <div>Name</div>
        <div>{camelCaseToSentenceCase(rankingBasedOn)}</div>
        <div>Visit Profile</div>
      </div>
      {data.map((profile) => {
        return (
          <div className="profile-row">
            <div>{data.indexOf(profile) + 1}</div>
            <div>{profile.name}</div>
            <div>{profile[rankingBasedOn]}</div>
            <div>
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
    </>
  );
};

export default RankTable;
