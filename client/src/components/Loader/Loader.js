// Loader.js
import React from 'react'
import PropTypes from 'prop-types'
import './Loader.css'

const Loader = ({ progress = 0, currentlyProcessing = '' }) => {
  const displayProgress = Math.max(0, Math.min(100, progress))
  const isComplete = displayProgress >= 100

  return (
    <div className="loader-container">
      <div className="loader-wrapper">
        <div className="loader"></div>
        <div className="loader-progress">
          <span className="loader-percentage">{Math.round(displayProgress)}%</span>
          <span className="loader-text">
            {isComplete ? 'Data loaded successfully!' : 'Fetching LeetCode data...'}
          </span>
          {!isComplete && currentlyProcessing && (
            <span className="currently-processing">{currentlyProcessing}</span>
          )}
          {!isComplete && (
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${displayProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

Loader.propTypes = {
  progress: PropTypes.number,
  currentlyProcessing: PropTypes.string
}

export default Loader
