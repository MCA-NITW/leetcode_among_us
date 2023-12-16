// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/Nav/NavBar";
import Home from "./pages/Home/Home";
import LeaderBoard from "./pages/LeaderBoard/LeaderBoard";
import leetcoders from "./assets/leetcoders.json";
import { fetchDataForLeetcoder } from "./utils/dataProcessing";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const updatedLeetcoders = await Promise.all(
        leetcoders.leetCoders.map(fetchDataForLeetcoder),
      );
      setData(updatedLeetcoders);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/leaderboard"
            element={<LeaderBoard data={data} loading={loading} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
