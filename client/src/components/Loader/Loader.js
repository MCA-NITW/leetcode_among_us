import React from 'react'
import PropTypes from 'prop-types'
import './Loader.css'

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
    <output className={getLoaderClass()} aria-live="polite">
      <div className="loader__wrapper">
        <div className="loader__spinner" aria-hidden="true"></div>
        
        <div className="loader__content">
          <div className="loader__progress">
            <span className="loader__percentage" aria-label={`${Math.round(displayProgress)} percent complete`}>
              {Math.round(displayProgress)}%
            </span>
            
            <span className="loader__text">
              {getStatusMessage()}
            </span>
            
            {!isComplete && !hasError && currentlyProcessing && (
              <div className="loader__currently-processing">
                {currentlyProcessing}
              </div>
            )}
            
            {!isComplete && !hasError && (
              <div className="loader__progress-bar">
                <progress 
                  value={displayProgress} 
                  max="100" 
                  aria-label="Loading progress"
                  className="sr-only"
                >
                  {displayProgress}%
                </progress>
                <div
                  className="loader__progress-fill"
                  style={{ width: `${displayProgress}%` }}
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          
          {isComplete && (
            <div className="loader__message loader__message--success">
              <span className="loader__message-icon" aria-hidden="true">✓</span>
              <span>All user data has been loaded successfully</span>
            </div>
          )}
          
          {hasError && (
            <div className="loader__message loader__message--error">
              <span className="loader__message-icon" aria-hidden="true">⚠</span>
              <span>There was an error loading the data. Please try again.</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Screen reader only text for accessibility */}
      <span className="sr-only">
        {isComplete 
          ? 'Loading complete' 
          : `Loading in progress, ${Math.round(displayProgress)} percent complete`
        }
      </span>
    </output>
  )
}

Loader.propTypes = {
  progress: PropTypes.number,
  currentlyProcessing: PropTypes.string
}

export default Loader
