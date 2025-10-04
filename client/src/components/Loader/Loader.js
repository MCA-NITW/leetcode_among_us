import React from 'react'
import PropTypes from 'prop-types'
import './Loader.css'
import { MdSpeed } from 'react-icons/md'

const Loader = ({ progress = 0, currentlyProcessing = '' }) => {
  const displayProgress = Math.max(0, Math.min(100, progress))
  const isComplete = displayProgress >= 100
  const hasError = progress < 0

  const getLoaderClass = () => {
    let baseClass = 'loader'
    if (isComplete) baseClass += ' loader--complete'
    if (hasError) baseClass += ' loader--error'
    return baseClass
  }

  const getStatusMessage = () => {
    if (hasError) return 'Error loading data'
    if (isComplete) return 'Data loaded successfully!'
    return 'Fetching LeetCode data...'
  }

  return (
    <div className={getLoaderClass()} aria-live="polite">
      <div className="loader__wrapper">
        {/* Animated Spinner */}
        <div className="loader__spinner-container" aria-hidden="true">
          <div className="loader__spinner">
            <div className="loader__spinner-ring"></div>
            <div className="loader__spinner-ring"></div>
            <div className="loader__spinner-ring"></div>
            <div className="loader__logo">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#gradient1)" />
                <path
                  d="M2 17L12 22L22 17V12L12 17L2 12V17Z"
                  fill="url(#gradient2)"
                />
                <defs>
                  <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="12">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="2" y1="12" x2="22" y2="22">
                    <stop offset="0%" stopColor="#f093fb" />
                    <stop offset="100%" stopColor="#f5576c" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        <div className="loader__content">
          <div className="loader__progress">
            <div className="loader__header">
              <h2 className="loader__title">{getStatusMessage()}</h2>
              <span
                className="loader__percentage"
                aria-label={`${Math.round(displayProgress)} percent complete`}
              >
                {Math.round(displayProgress)}%
              </span>
            </div>

            {!isComplete && !hasError && currentlyProcessing && (
              <div className="loader__currently-processing">
                <span className="processing-icon">
                  <MdSpeed />
                </span>
                <span className="processing-text">{currentlyProcessing}</span>
              </div>
            )}

            {!isComplete && !hasError && (
              <div className="loader__progress-bar-container">
                <progress
                  value={displayProgress}
                  max="100"
                  aria-label="Loading progress"
                  className="sr-only"
                >
                  {displayProgress}%
                </progress>
                <div className="loader__progress-bar">
                  <div
                    className="loader__progress-fill"
                    style={{ width: `${displayProgress}%` }}
                    aria-hidden="true"
                  >
                    <div className="loader__progress-glow"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isComplete && (
            <div className="loader__message loader__message--success">
              <div className="success-icon-wrapper">
                <svg className="success-icon" viewBox="0 0 52 52">
                  <circle
                    className="success-icon__circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    className="success-icon__check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
              <span>All user data has been loaded successfully</span>
            </div>
          )}

          {hasError && (
            <div className="loader__message loader__message--error">
              <div className="error-icon-wrapper">
                <span className="error-icon">⚠</span>
              </div>
              <span>
                There was an error loading the data. Please try again.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Screen reader only text for accessibility */}
      <span className="sr-only">
        {isComplete
          ? 'Loading complete'
          : `Loading in progress, ${Math.round(
              displayProgress
            )} percent complete`}
      </span>
    </div>
  )
}

Loader.propTypes = {
  progress: PropTypes.number,
  currentlyProcessing: PropTypes.string
}

export default Loader
