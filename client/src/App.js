import "./App.css";

import NavBar from "./components/Nav/NavBar";
import Home from "./pages/Home/Home";
import LeaderBoard from "./pages/LeaderBoard/LeaderBoard";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import leetcoders from "./assets/leetcoders.json";
import { fetchDataForLeetcoder } from "./utils/dataProcessing";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const updatedLeetcoders = await Promise.all(
        leetcoders.leetCoders.map(fetchDataForLeetcoder),
      );
      setData(updatedLeetcoders);
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<LeaderBoard data={data} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
