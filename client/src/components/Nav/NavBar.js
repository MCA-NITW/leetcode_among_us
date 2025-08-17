import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './NavBar.css'

const NavBar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <h1 className="navbar__brand">
        <Link to="/" aria-label="Leetcode Among us - Home">
          Leetcode Among us
        </Link>
      </h1>
      
      <div className="navbar__nav">
        <ul className="navbar__nav-list">
          <li>
            <Link 
              to="/" 
              className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/leaderboard" 
              className={`navbar__link ${isActive('/leaderboard') ? 'navbar__link--active' : ''}`}
              aria-current={isActive('/leaderboard') ? 'page' : undefined}
            >
              Leaderboard
            </Link>
          </li>
          <li>
            <Link 
              to="/user-stats" 
              className={`navbar__link ${isActive('/user-stats') ? 'navbar__link--active' : ''}`}
              aria-current={isActive('/user-stats') ? 'page' : undefined}
            >
              User Stats
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default NavBar
