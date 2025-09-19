import React from 'react'
import PropTypes from 'prop-types'

/**
 * Generic Error Fallback Component
 */
function ErrorFallback({ error, resetErrorBoundary, title = "Something went wrong" }) {
  return (
    <div className="error-fallback">
      <div className="error-content">
        <h2>{title}</h2>
        <details className="error-details">
          <summary>Error details</summary>
          <pre className="error-message">{error.message}</pre>
        </details>
        <div className="error-actions">
          <button 
            onClick={resetErrorBoundary}
            className="retry-button"
          >
            Try again
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="reload-button"
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  )
}

ErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
  title: PropTypes.string
}

/**
 * Game Loading Error Fallback Component
 */
function GameErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="game-error-fallback">
      <div className="game-error-content">
        <h3>Unable to load game</h3>
        <p>We're having trouble loading the game right now.</p>
        <details className="error-details">
          <summary>Technical details</summary>
          <pre className="error-message">{error.message}</pre>
        </details>
        <div className="error-actions">
          <button 
            onClick={resetErrorBoundary}
            className="retry-button primary"
          >
            Try again
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="home-button"
          >
            Go to home
          </button>
        </div>
      </div>
    </div>
  )
}

GameErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
  resetErrorBoundary: PropTypes.func.isRequired
}

/**
 * Data Loading Error Fallback Component
 */
function DataErrorFallback({ error, resetErrorBoundary, dataType = "data" }) {
  return (
    <div className="data-error-fallback">
      <div className="data-error-content">
        <h3>Unable to load {dataType}</h3>
        <p>We're having trouble loading the {dataType}. Please try again.</p>
        <details className="error-details">
          <summary>What happened?</summary>
          <pre className="error-message">{error.message}</pre>
        </details>
        <div className="error-actions">
          <button 
            onClick={resetErrorBoundary}
            className="retry-button primary"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )
}

DataErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
  dataType: PropTypes.string
}

/**
 * Network Error Fallback Component
 */
function NetworkErrorFallback({ error, resetErrorBoundary }) {
  const isOffline = !navigator.onLine
  
  return (
    <div className="network-error-fallback">
      <div className="network-error-content">
        <h3>{isOffline ? "You're offline" : "Connection problem"}</h3>
        <p>
          {isOffline 
            ? "Please check your internet connection and try again."
            : "We're having trouble connecting to our servers."
          }
        </p>
        <details className="error-details">
          <summary>Technical details</summary>
          <pre className="error-message">{error.message}</pre>
        </details>
        <div className="error-actions">
          <button 
            onClick={resetErrorBoundary}
            className="retry-button primary"
          >
            Try again
          </button>
          {isOffline && (
            <p className="offline-note">
              This page will automatically retry when you're back online.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

NetworkErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
  resetErrorBoundary: PropTypes.func.isRequired
}

export { 
  ErrorFallback, 
  GameErrorFallback, 
  DataErrorFallback, 
  NetworkErrorFallback 
}