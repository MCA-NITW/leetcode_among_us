import "./App.css";
import React, { useState, useEffect } from "react";
import ProfileCard from "./components/ProfileCard";
import Students from "./assets/leetcoders.json";

const leetcoders = Students.leetCoders;

function App() {
  const url = "https://lcapi.cyclic.app/";
  const [data, setData] = useState([]);

  const fetchInfo = () => {
    return Promise.all(
      leetcoders.map((leetcoder) => {
        return fetch(url + leetcoder.userName).then((res) => res.json());
      }),
    ).then((res) => {
      // console.log(res);
      leetcoders.forEach((leetcoder, i) => {
        leetcoder.contestRating = Math.round(res[i].userContestRanking.rating);
        leetcoder.contestRanking = res[i].userContestRanking.globalRanking;
        leetcoder.easySolved = res[i].easySolved;
        leetcoder.mediumSolved = res[i].mediumSolved;
        leetcoder.hardSolved = res[i].hardSolved;
        leetcoder.totalSolved = res[i].totalSolved;
        leetcoder.totalEasy = res[i].totalEasy;
        leetcoder.totalMedium = res[i].totalMedium;
        leetcoder.totalHard = res[i].totalHard;
        leetcoder.totalQuestions = res[i].totalQuestions;
        leetcoder.reputation = res[i].reputation;
        leetcoder.questionRanking = res[i].ranking;
        leetcoder.contestTopPercentage =
          res[i].userContestRanking.topPercentage;
        leetcoder.totalParticipants =
          res[i].userContestRanking.totalParticipants;
        leetcoder.attendedContestCount =
          res[i].userContestRanking.attendedContestsCount;
        leetcoder.contestHistory = res[i].userContestRankingHistory;
      });
      setData(leetcoders);
    });
  };
  useEffect(() => {
    fetchInfo();
  }, []);

  // console.log(data);

  return (
    <div className="App">
      <h1>LeetCode Leaderboard</h1>
      <div className="leaderboard">
        <div className="profile-row profile-header">
          <div>Local Rank</div>
          <div>Leetcoder</div>
          <div>Contest Rating</div>
          <div>Contest Ranking</div>
        </div>

        {data.map((profile) => {
          return (
            <ProfileCard
              data={profile}
              key={profile.id}
              rank={data.indexOf(profile) + 1}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
