import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { 
  ErrorFallback, 
  GameErrorFallback, 
  DataErrorFallback, 
  NetworkErrorFallback 
} from './ErrorBoundary'

/**
 * Determine the appropriate error fallback based on error type
 */
function getErrorFallback(error, fallbackType) {
  // Network-related errors
  if (error.message.includes('fetch') || 
      error.message.includes('network') || 
      error.message.includes('HTTP') ||
      error.message.includes('Failed to load')) {
    return NetworkErrorFallback
  }
  
  // Use specific fallback if provided
  switch (fallbackType) {
    case 'game':
      return GameErrorFallback
    case 'data':
      return DataErrorFallback
    case 'network':
      return NetworkErrorFallback
    default:
      return ErrorFallback
  }
}

/**
 * Error handler that logs errors and provides retry logic
 */
function handleError(error, errorInfo) {
  // Log error to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error caught by boundary:', error)
    console.error('Error info:', errorInfo)
  }
  
  // In production, you might want to send errors to a logging service
  // Example: logErrorToService(error, errorInfo)
}

/**
 * Higher-order component that wraps a component with an error boundary
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {Object} options - Configuration options
 * @param {string} options.fallbackType - Type of fallback UI ('game', 'data', 'network', or 'default')
 * @param {string} options.title - Custom title for error fallback
 * @param {Function} options.onError - Custom error handler
 * @param {Function} options.onReset - Custom reset handler
 * @returns {React.Component} - Wrapped component with error boundary
 */
function withErrorBoundary(WrappedComponent, options = {}) {
  const {
    fallbackType = 'default',
    title,
    onError,
    onReset,
    isolate = false
  } = options

  function WrappedWithErrorBoundary(props) {
    const handleReset = (details) => {
      // Custom reset logic
      if (onReset) {
        onReset(details)
      }
      
      // Default reset behavior - you might want to refresh data, reset state, etc.
      if (details.reason === 'retry') {
        // Force re-render by updating a key or triggering a refetch
        if (props.onRetry) {
          props.onRetry()
        }
      }
    }

    const handleErrorWithLogging = (error, errorInfo) => {
      handleError(error, errorInfo)
      if (onError) {
        onError(error, errorInfo)
      }
    }

    const FallbackComponent = ({ error, resetErrorBoundary }) => {
      const SpecificFallback = getErrorFallback(error, fallbackType)
      
      if (SpecificFallback === ErrorFallback && title) {
        return <SpecificFallback error={error} resetErrorBoundary={resetErrorBoundary} title={title} />
      }
      
      if (SpecificFallback === DataErrorFallback && options.dataType) {
        return <SpecificFallback error={error} resetErrorBoundary={resetErrorBoundary} dataType={options.dataType} />
      }
      
      return <SpecificFallback error={error} resetErrorBoundary={resetErrorBoundary} />
    }

    return (
      <ErrorBoundary
        FallbackComponent={FallbackComponent}
        onError={handleErrorWithLogging}
        onReset={handleReset}
        isolate={isolate}
      >
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }

  // Set display name for debugging
  WrappedWithErrorBoundary.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WrappedWithErrorBoundary
}

/**
 * Hook for manually triggering error boundary reset
 */
function useErrorHandler() {
  const [error, setError] = React.useState(null)
  
  const resetError = React.useCallback(() => {
    setError(null)
  }, [])
  
  const throwError = React.useCallback((error) => {
    setError(error)
  }, [])
  
  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])
  
  return { resetError, throwError }
}

export default withErrorBoundary
export { useErrorHandler, handleError }