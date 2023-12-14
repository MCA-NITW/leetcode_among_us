import "./App.css";

import NavBar from "./components/Nav/NavBar";
import Home from "./components/Home/Home";
import LeaderBoard from "./components/LeaderBoard/LeaderBoard";

import { BrowserRouter as Router, Route , Routes } from "react-router-dom";

function App() {

  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
