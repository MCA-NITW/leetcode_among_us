import "./App.css";
import React, { useState, useEffect } from "react";
import ProfileCard from "./components/ProfileCard";

const leetcoders = [
  {
    id: "21MCF1R47",
    name: "Sagar Gupta",
    userName: "sagargupta1610",
    batch: 2024,
  },
  {
    id: "21MCF1R37",
    name: "Pranshu Singh",
    userName: "pranshu0801",
    batch: 2024,
  },
  {
    id: "21MCF1R04",
    name: "Amit Awasthi",
    userName: "Awasthya",
    batch: 2024,
  },
  {
    id: "21MCF1R41",
    name: "Rahul Kumar",
    userName: "lightmate",
    batch: 2024,
  },
];

function App() {
  const url = "https://lcapi.cyclic.app/";
  const [data, setData] = useState([]);

  const fetchInfo = () => {
    return Promise.all(
      leetcoders.map((leetcoder) => {
        return fetch(url + leetcoder.userName).then((res) => res.json());
      }),
    ).then((res) => {
      res.map((profile) => {
        profile.id = leetcoders[res.indexOf(profile)].id;
        profile.userName = leetcoders[res.indexOf(profile)].userName;
        profile.name = leetcoders[res.indexOf(profile)].name;
        profile.batch = leetcoders[res.indexOf(profile)].batch;
        return profile;
      });
      setData(res);
    });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  
  const sortData = (data, mode) => {
    if (mode === "rating") {
      return data.sort(
        (a, b) => b.userContestRanking.rating - a.userContestRanking.rating,
      );
    } else if (mode === "rank") {
      return data.sort(
        (a, b) =>
          a.userContestRanking.globalRanking -
          b.userContestRanking.globalRanking,
      );
    }
  };

  console.log(data);

  return (
    <div className="App">
      <h1>LeetCode Leaderboard</h1>
      <div className="leaderboard">
        <div className="profile-sort">
          <div>Sort By:</div>
          <div>
            <button onClick={() => setData(sortData(data, "rating"))}>
              Rating
            </button>
            <button onClick={() => setData(sortData(data, "rank"))}>
              Rank
            </button>
          </div>
        </div>

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
