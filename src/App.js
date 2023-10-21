import "./App.css";
import React, { useState, useEffect } from "react";

const userNames = ["sagargupta1610" , "Awasthya" ,"lightmate" , "pranshu0801" ]

function App() {
  const url = "https://lcapi.cyclic.app/";
  const [data, setData] = useState([]);

  const sortData = (data,mode) => {
    if (mode === "rating") {
      return data.sort((a, b) => b.userContestRanking.rating - a.userContestRanking.rating);
    }
    else if (mode === "rank") {
      return data.sort((a, b) => a.userContestRanking.globalRanking - b.userContestRanking.globalRanking);
    }

  }

  const fetchInfo = () => {
    return Promise.all(
      userNames.map((userName) => {
        return fetch(url + userName).then((res) => res.json());
      }),
    ).then((res) => {
      res.map((profile) => {
        profile.userName = userNames[res.indexOf(profile)];
        return profile;
      });
      setData(res);
    });
  };

  useEffect(() => {
    fetchInfo();
  }, []);


  console.log(data);

  const ProfileCard = ({ data , rank }) => {
    const userName = data.userName;
    const contest = data.userContestRanking;
    return (
      <div className="profile-row">
        <div>{rank}</div>
        <div>{userName}</div>
        <div>{Math.round(contest.rating)}</div>
        <div>{contest.globalRanking}/{contest.totalParticipants}</div>
      </div>
    );
  };

  return <div className="App">
    <h1>LeetCode Leaderboard</h1>
    <div className="leaderboard">
      <div className="profile-sort">
        <div>Sort By:</div>
        <div>
          <button onClick={() => setData(sortData(data,"rating"))}>Rating</button>
          <button onClick={() => setData(sortData(data,"rank"))}>Rank</button>
        </div>
      </div>

      <div className="profile-row profile-header">
        <div>Local Rank</div>
        <div>Username</div>
        <div>Contest Rating</div>
        <div>Contest Ranking</div>
      </div>

      {data.map((profile) => {
        return <ProfileCard data={profile} key={profile.userName} rank={data.indexOf(profile)+1} />;
      })}
    </div>


  </div>;
}

export default App;
