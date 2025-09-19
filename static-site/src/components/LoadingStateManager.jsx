import React from 'react'
import PropTypes from 'prop-types'
import LoadingSpinner, { LoadingDots, LoadingProgressBar } from './LoadingSpinner'
import { 
  SkeletonGameList, 
  SkeletonGamePage, 
  SkeletonTextBlock 
} from './LoadingSkeletons'

/**
 * Loading State Manager Component
 * Handles different loading states and transitions
 */
function LoadingStateManager({
  loading = false,
  error = null,
  data = null,
  loadingType = 'spinner',
  loadingText = 'Loading...',
  errorComponent = null,
  emptyComponent = null,
  retryFunction = null,
  children,
  className = '',
  minLoadingTime = 0,
  showLoadingDelay = 0
}) {
  const [showLoading, setShowLoading] = React.useState(false)
  const [minTimeElapsed, setMinTimeElapsed] = React.useState(false)
  const loadingStartTime = React.useRef(null)

  // Handle loading delay and minimum loading time
  React.useEffect(() => {
    let delayTimer
    let minTimeTimer

    if (loading) {
      loadingStartTime.current = Date.now()
      
      // Show loading after delay
      if (showLoadingDelay > 0) {
        delayTimer = setTimeout(() => {
          setShowLoading(true)
        }, showLoadingDelay)
      } else {
        setShowLoading(true)
      }

      // Set minimum time flag
      if (minLoadingTime > 0) {
        minTimeTimer = setTimeout(() => {
          setMinTimeElapsed(true)
        }, minLoadingTime)
      } else {
        setMinTimeElapsed(true)
      }
    } else {
      // When loading stops, check if minimum time has elapsed
      if (loadingStartTime.current && minLoadingTime > 0) {
        const elapsed = Date.now() - loadingStartTime.current
        if (elapsed < minLoadingTime) {
          // Keep showing loading until minimum time is reached
          const remainingTime = minLoadingTime - elapsed
          setTimeout(() => {
            setShowLoading(false)
            setMinTimeElapsed(false)
          }, remainingTime)
          return
        }
      }
      
      // Reset immediately if no minimum time or time has elapsed
      setShowLoading(false)
      setMinTimeElapsed(false)
      loadingStartTime.current = null
    }

    return () => {
      if (delayTimer) clearTimeout(delayTimer)
      if (minTimeTimer) clearTimeout(minTimeTimer)
    }
  }, [loading, showLoadingDelay, minLoadingTime])

  // Determine if we should show loading
  const shouldShowLoading = loading && showLoading

  // Render loading component based on type
  const renderLoading = () => {
    const loadingProps = {
      text: loadingText,
      className: 'loading-state'
    }

    switch (loadingType) {
      case 'dots':
        return <LoadingDots {...loadingProps} />
      case 'progress':
        return <LoadingProgressBar {...loadingProps} />
      case 'skeleton-games':
        return <SkeletonGameList className={loadingProps.className} />
      case 'skeleton-game':
        return <SkeletonGamePage className={loadingProps.className} />
      case 'skeleton-text':
        return <SkeletonTextBlock className={loadingProps.className} />
      case 'spinner':
      default:
        return <LoadingSpinner {...loadingProps} />
    }
  }

  // Render error state
  const renderError = () => {
    if (errorComponent) {
      return errorComponent
    }

    return (
      <div className="error-state">
        <div className="error-content">
          <h3>Something went wrong</h3>
          <p>{error}</p>
          {retryFunction && (
            <button 
              onClick={retryFunction}
              className="retry-button"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    )
  }

  // Render empty state
  const renderEmpty = () => {
    if (emptyComponent) {
      return emptyComponent
    }

    return (
      <div className="empty-state">
        <div className="empty-content">
          <h3>No data available</h3>
          <p>There's nothing to show right now.</p>
          {retryFunction && (
            <button 
              onClick={retryFunction}
              className="retry-button"
            >
              Refresh
            </button>
          )}
        </div>
      </div>
    )
  }

  // Main render logic
  const containerClasses = [
    'loading-state-manager',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={containerClasses}>
      {shouldShowLoading && (
        <div className="loading-overlay">
          {renderLoading()}
        </div>
      )}
      
      {error && !loading && (
        <div className="error-overlay">
          {renderError()}
        </div>
      )}
      
      {!loading && !error && (!data || (Array.isArray(data) && data.length === 0)) && (
        <div className="empty-overlay">
          {renderEmpty()}
        </div>
      )}
      
      {!loading && !error && data && (
        <div className="content-container">
          {children}
        </div>
      )}
    </div>
  )
}

LoadingStateManager.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  data: PropTypes.any,
  loadingType: PropTypes.oneOf([
    'spinner', 
    'dots', 
    'progress', 
    'skeleton-games', 
    'skeleton-game', 
    'skeleton-text'
  ]),
  loadingText: PropTypes.string,
  errorComponent: PropTypes.node,
  emptyComponent: PropTypes.node,
  retryFunction: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  minLoadingTime: PropTypes.number,
  showLoadingDelay: PropTypes.number
}

/**
 * Hook for managing loading states with transitions
 */
function useLoadingState(initialState = {}) {
  const [state, setState] = React.useState({
    loading: false,
    error: null,
    data: null,
    ...initialState
  })

  const setLoading = React.useCallback((loading) => {
    setState(prev => ({ ...prev, loading, error: null }))
  }, [])

  const setError = React.useCallback((error) => {
    setState(prev => ({ ...prev, error, loading: false }))
  }, [])

  const setData = React.useCallback((data) => {
    setState(prev => ({ ...prev, data, loading: false, error: null }))
  }, [])

  const reset = React.useCallback(() => {
    setState({ loading: false, error: null, data: null })
  }, [])

  const execute = React.useCallback(async (asyncFunction) => {
    try {
      setLoading(true)
      const result = await asyncFunction()
      setData(result)
      return result
    } catch (error) {
      setError(error.message || 'An error occurred')
      throw error
    }
  }, [setLoading, setData, setError])

  return {
    ...state,
    setLoading,
    setError,
    setData,
    reset,
    execute
  }
}

/**
 * Higher-order component for adding loading states
 */
function withLoadingState(WrappedComponent, options = {}) {
  const {
    loadingType = 'spinner',
    loadingText = 'Loading...',
    minLoadingTime = 0,
    showLoadingDelay = 0
  } = options

  function ComponentWithLoading(props) {
    const { loading, error, data, onRetry, ...restProps } = props

    return (
      <LoadingStateManager
        loading={loading}
        error={error}
        data={data}
        loadingType={loadingType}
        loadingText={loadingText}
        retryFunction={onRetry}
        minLoadingTime={minLoadingTime}
        showLoadingDelay={showLoadingDelay}
      >
        <WrappedComponent {...restProps} data={data} />
      </LoadingStateManager>
    )
  }

  ComponentWithLoading.displayName = `withLoadingState(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return ComponentWithLoading
}

export default LoadingStateManager
export { useLoadingState, withLoadingState }