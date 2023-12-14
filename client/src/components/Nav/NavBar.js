import React from "react";
import "./NavBar.css";
const NavBar = () => {
  return (
    <div className="navbar">
      <h1>Leetcode Among us</h1>
      <div className="navbar-links">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/leaderboard">Leaderboard</a>
          </li>
          <li>
            <a href="us">Us</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
