import React from 'react'
import PropTypes from 'prop-types'
import { useI18n } from '../i18n'

/**
 * Generic Error Fallback Component
 */
function ErrorFallback({ error, resetErrorBoundary, title }) {
  const { t } = useI18n()
  const displayTitle = title || t('error.defaultTitle')
  return (
    <div className="error-fallback">
      <div className="error-content">
        <h2>{displayTitle}</h2>
        <details className="error-details">
          <summary>{t('error.details')}</summary>
          <pre className="error-message">{error.message}</pre>
        </details>
        <div className="error-actions">
          <button 
            onClick={resetErrorBoundary}
            className="retry-button"
          >
            {t('error.tryAgain')}
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="reload-button"
          >
            {t('error.reload')}
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
  const { t } = useI18n()
  return (
    <div className="game-error-fallback">
      <div className="game-error-content">
        <h3>{t('error.gameTitle')}</h3>
        <p>{t('error.gameMessage')}</p>
        <details className="error-details">
          <summary>{t('error.technical')}</summary>
          <pre className="error-message">{error.message}</pre>
        </details>
        <div className="error-actions">
          <button 
            onClick={resetErrorBoundary}
            className="retry-button primary"
          >
            {t('error.tryAgain')}
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="home-button"
          >
            {t('error.goHome')}
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
  const { t } = useI18n()
  return (
    <div className="data-error-fallback">
      <div className="data-error-content">
        <h3>Unable to load {dataType}</h3>
        <p>We're having trouble loading the {dataType}. Please try again.</p>
        <details className="error-details">
          <summary>{t('error.whatHappened')}</summary>
          <pre className="error-message">{error.message}</pre>
        </details>
        <div className="error-actions">
          <button 
            onClick={resetErrorBoundary}
            className="retry-button primary"
          >
            {t('error.retry')}
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
  const { t } = useI18n()
  
  return (
    <div className="network-error-fallback">
      <div className="network-error-content">
        <h3>{isOffline ? t('error.offline') : t('error.connectionProblem')}</h3>
        <p>
          {isOffline 
            ? t('error.offlineMessage')
            : t('error.serverMessage')
          }
        </p>
        <details className="error-details">
          <summary>{t('error.technical')}</summary>
          <pre className="error-message">{error.message}</pre>
        </details>
        <div className="error-actions">
          <button 
            onClick={resetErrorBoundary}
            className="retry-button primary"
          >
            {t('error.tryAgain')}
          </button>
          {isOffline && (
            <p className="offline-note">
              {t('error.autoRetry')}
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