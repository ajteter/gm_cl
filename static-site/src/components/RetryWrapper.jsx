import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

/**
 * Retry Wrapper Component that provides retry functionality for failed operations
 */
function RetryWrapper({ 
  children, 
  onRetry, 
  maxRetries = 3, 
  retryDelay = 1000,
  exponentialBackoff = true,
  renderError,
  renderLoading
}) {
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const [lastError, setLastError] = useState(null)

  const handleRetry = useCallback(async () => {
    if (retryCount >= maxRetries) {
      return false
    }

    setIsRetrying(true)
    const currentRetryCount = retryCount
    setRetryCount(prev => prev + 1)

    try {
      // Calculate delay with exponential backoff if enabled
      const delay = exponentialBackoff 
        ? retryDelay * Math.pow(2, currentRetryCount)
        : retryDelay

      // Wait before retry
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }

      // Execute retry function
      if (onRetry) {
        await onRetry()
      }

      // Reset on successful retry
      setRetryCount(0)
      setLastError(null)
      setIsRetrying(false)
      return true

    } catch (error) {
      setLastError(error)
      setIsRetrying(false)
      
      // If we've reached max retries, don't continue
      if (currentRetryCount + 1 >= maxRetries) {
        return false
      }
      
      return false
    }
  }, [retryCount, maxRetries, retryDelay, exponentialBackoff, onRetry])

  const resetRetries = useCallback(() => {
    setRetryCount(0)
    setLastError(null)
    setIsRetrying(false)
  }, [])

  // Provide retry context to children
  const retryContext = {
    retry: handleRetry,
    reset: resetRetries,
    retryCount,
    maxRetries,
    isRetrying,
    canRetry: retryCount < maxRetries,
    lastError
  }

  // If we have a custom error renderer and there's an error
  if (lastError && renderError) {
    return renderError(lastError, retryContext)
  }

  // If we have a custom loading renderer and we're retrying
  if (isRetrying && renderLoading) {
    return renderLoading(retryContext)
  }

  // Render children with retry context
  if (typeof children === 'function') {
    return children(retryContext)
  }

  // Clone children and pass retry context as props
  return React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { retryContext })
    }
    return child
  })
}

RetryWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  onRetry: PropTypes.func,
  maxRetries: PropTypes.number,
  retryDelay: PropTypes.number,
  exponentialBackoff: PropTypes.bool,
  renderError: PropTypes.func,
  renderLoading: PropTypes.func
}

/**
 * Hook for using retry functionality
 */
function useRetry(operation, options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    exponentialBackoff = true,
    onError,
    onSuccess
  } = options

  const [state, setState] = useState({
    loading: false,
    error: null,
    retryCount: 0,
    data: null
  })

  const execute = useCallback(async (...args) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation(...args)
        
        setState({
          loading: false,
          error: null,
          retryCount: 0,
          data: result
        })

        if (onSuccess) {
          onSuccess(result)
        }

        return result

      } catch (error) {
        const isLastAttempt = attempt === maxRetries
        
        setState(prev => ({
          ...prev,
          loading: !isLastAttempt,
          error: isLastAttempt ? error : prev.error,
          retryCount: attempt + 1
        }))

        if (isLastAttempt) {
          if (onError) {
            onError(error)
          }
          throw error
        }

        // Wait before retry
        if (retryDelay > 0) {
          const delay = exponentialBackoff 
            ? retryDelay * Math.pow(2, attempt)
            : retryDelay
          
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
  }, [operation, maxRetries, retryDelay, exponentialBackoff, onError, onSuccess])

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      retryCount: 0,
      data: null
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
    canRetry: state.retryCount < maxRetries
  }
}

export default RetryWrapper
export { useRetry }