import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
const NavBar = () => {
  return (
    <div className="navbar">
      <h1>Leetcode Among us</h1>
      <div className="navbar-links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/leaderboard">Leaderboard</Link>
          </li>
          <li>
            <Link to="/us">Us</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
