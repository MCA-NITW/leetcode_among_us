import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
import {
  FaRocket,
  FaTrophy,
  FaChartBar,
  FaUser,
  FaMoon,
  FaMobileAlt,
  FaArrowRight,
  FaCheckCircle
} from 'react-icons/fa'
import { MdLeaderboard } from 'react-icons/md'
import { BiTargetLock } from 'react-icons/bi'

function Home() {
  const features = [
    {
      icon: <MdLeaderboard />,
      title: 'Comprehensive Leaderboard',
      description:
        'Track rankings across multiple categories with sortable columns and advanced filters'
    },
    {
      icon: <FaTrophy />,
      title: 'Contest Performance',
      description:
        'Detailed contest stats showing 4Q, 3Q, 2Q, 1Q, and 0Q performance patterns'
    },
    {
      icon: <BiTargetLock />,
      title: 'Problem Analytics',
      description:
        'Easy, Medium, Hard breakdown with percentages and solve rates'
    },
    {
      icon: <FaUser />,
      title: 'User Profiles',
      description:
        'Detailed stats for any LeetCode user including badges, streaks, and more'
    },
    {
      icon: <FaMoon />,
      title: 'Dark Mode',
      description:
        'Beautiful dark theme for comfortable viewing any time of day'
    },
    {
      icon: <FaMobileAlt />,
      title: 'Responsive Design',
      description: 'Works perfectly on desktop, tablet, and mobile devices'
    }
  ]

  const stats = [
    { value: '5+', label: 'Stat Categories', icon: <FaChartBar /> },
    { value: 'Real-time', label: 'Data Updates', icon: <FaRocket /> },
    { value: '100+', label: 'Users Tracked', icon: <FaUser /> },
    { value: '30+', label: 'Metrics', icon: <FaCheckCircle /> }
  ]

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="home__hero">
        <div className="home__hero-content">
          <div className="home__hero-badge">
            <span className="home__hero-badge-icon">
              <FaRocket />
            </span>
            <span className="home__hero-badge-text">
              LeetCode Analytics Platform
            </span>
          </div>
          <h1 className="home__hero-title">
            Track Your{' '}
            <span className="home__hero-title-gradient">LeetCode Journey</span>
          </h1>
          <p className="home__hero-subtitle">
            Compete, analyze, and improve with comprehensive statistics and
            real-time leaderboards. Track your progress, compare with peers, and
            reach new heights in competitive programming.
          </p>
          <div className="home__hero-actions">
            <Link to="/leaderboard" className="home__cta home__cta--primary">
              <span>View Leaderboard</span>
              <span className="home__cta-icon">
                <FaArrowRight />
              </span>
            </Link>
            <Link to="/user-stats" className="home__cta home__cta--secondary">
              <span>Search User Stats</span>
              <span className="home__cta-icon">
                <FaUser />
              </span>
            </Link>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="home__hero-decoration">
          <div className="home__hero-circle home__hero-circle--1"></div>
          <div className="home__hero-circle home__hero-circle--2"></div>
          <div className="home__hero-circle home__hero-circle--3"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="home__stats">
        <div className="home__stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="home__stat-card">
              <div className="home__stat-icon">{stat.icon}</div>
              <div className="home__stat-value">{stat.value}</div>
              <div className="home__stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="home__features">
        <header className="home__section-header">
          <h2 className="home__section-title">Powerful Features</h2>
          <p className="home__section-subtitle">
            Everything you need to track and improve your competitive
            programming skills
          </p>
        </header>
        <div className="home__features-grid">
          {features.map((feature, index) => (
            <div key={index} className="home__feature-card">
              <div className="home__feature-icon">{feature.icon}</div>
              <h3 className="home__feature-title">{feature.title}</h3>
              <p className="home__feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="home__cta-section">
        <div className="home__cta-card">
          <h2 className="home__cta-title">Ready to Start?</h2>
          <p className="home__cta-description">
            Join your peers in tracking progress and competing on the
            leaderboard
          </p>
          <Link to="/leaderboard" className="home__cta home__cta--large">
            <span>Get Started</span>
            <span className="home__cta-icon">
              <FaArrowRight />
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
