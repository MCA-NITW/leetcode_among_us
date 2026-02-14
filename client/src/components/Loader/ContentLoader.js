import React from 'react'
import PropTypes from 'prop-types'
import './ContentLoader.css'

function ContentLoader({ message = 'Loading data...', variant = 'default' }) {
  return (
    <div className="content-loader" aria-live="polite" aria-busy="true">
      {/* Spinner + Message */}
      <div className="content-loader__header">
        <div className="content-loader__spinner" aria-hidden="true">
          <div className="content-loader__ring"></div>
          <div className="content-loader__ring"></div>
          <div className="content-loader__ring"></div>
        </div>
        <p className="content-loader__message">{message}</p>
      </div>

      {/* Skeleton Placeholders */}
      <div className="content-loader__skeleton">
        {variant === 'stats' && (
          <>
            <div className="skeleton-profile">
              <div className="skeleton-pulse skeleton-avatar"></div>
              <div className="skeleton-profile__text">
                <div className="skeleton-pulse skeleton-line skeleton-line--lg"></div>
                <div className="skeleton-pulse skeleton-line skeleton-line--sm"></div>
              </div>
              <div className="skeleton-profile__stats">
                <div className="skeleton-pulse skeleton-stat-box"></div>
                <div className="skeleton-pulse skeleton-stat-box"></div>
                <div className="skeleton-pulse skeleton-stat-box"></div>
              </div>
            </div>
            <div className="skeleton-pulse skeleton-tabs"></div>
            <div className="skeleton-cards">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="skeleton-card"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="skeleton-pulse skeleton-line skeleton-line--md"></div>
                  <div className="skeleton-pulse skeleton-line skeleton-line--xl"></div>
                  <div className="skeleton-pulse skeleton-line skeleton-line--sm"></div>
                </div>
              ))}
            </div>
          </>
        )}

        {variant === 'compare' && (
          <>
            <div className="skeleton-compare">
              <div className="skeleton-user-card">
                <div className="skeleton-pulse skeleton-avatar"></div>
                <div className="skeleton-pulse skeleton-line skeleton-line--md"></div>
                <div className="skeleton-pulse skeleton-line skeleton-line--sm"></div>
              </div>
              <div className="skeleton-vs">VS</div>
              <div className="skeleton-user-card">
                <div className="skeleton-pulse skeleton-avatar"></div>
                <div className="skeleton-pulse skeleton-line skeleton-line--md"></div>
                <div className="skeleton-pulse skeleton-line skeleton-line--sm"></div>
              </div>
            </div>
            <div className="skeleton-rows">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className="skeleton-row"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="skeleton-pulse skeleton-line skeleton-line--md"></div>
                  <div className="skeleton-pulse skeleton-line skeleton-line--sm"></div>
                  <div className="skeleton-pulse skeleton-line skeleton-line--md"></div>
                </div>
              ))}
            </div>
          </>
        )}

        {variant === 'default' && (
          <div className="skeleton-cards">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="skeleton-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="skeleton-pulse skeleton-line skeleton-line--lg"></div>
                <div className="skeleton-pulse skeleton-line skeleton-line--md"></div>
                <div className="skeleton-pulse skeleton-line skeleton-line--sm"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <span className="sr-only">Loading content, please wait.</span>
    </div>
  )
}

ContentLoader.propTypes = {
  message: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'stats', 'compare'])
}

export default ContentLoader
