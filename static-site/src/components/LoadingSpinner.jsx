import React from 'react'
import PropTypes from 'prop-types'

/**
 * Generic Loading Spinner Component
 */
function LoadingSpinner({ 
  size = 'medium', 
  color = 'primary', 
  text = null,
  className = '',
  inline = false 
}) {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium', 
    large: 'spinner-large'
  }
  
  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    white: 'spinner-white'
  }
  
  const spinnerClasses = [
    'loading-spinner',
    sizeClasses[size],
    colorClasses[color],
    className
  ].filter(Boolean).join(' ')
  
  const containerClasses = [
    'loading-spinner-container',
    inline ? 'inline' : 'block'
  ].join(' ')
  
  return (
    <div className={containerClasses}>
      <div className={spinnerClasses} role="status" aria-label="Loading">
        <div className="spinner-circle" />
        <div className="spinner-circle" />
        <div className="spinner-circle" />
      </div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  )
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'white']),
  text: PropTypes.string,
  className: PropTypes.string,
  inline: PropTypes.bool
}

/**
 * Pulsing Dot Loading Indicator
 */
function LoadingDots({ 
  count = 3, 
  color = 'primary',
  size = 'medium',
  className = '' 
}) {
  const sizeClasses = {
    small: 'dots-small',
    medium: 'dots-medium',
    large: 'dots-large'
  }
  
  const colorClasses = {
    primary: 'dots-primary',
    secondary: 'dots-secondary',
    white: 'dots-white'
  }
  
  const dotsClasses = [
    'loading-dots',
    sizeClasses[size],
    colorClasses[color],
    className
  ].filter(Boolean).join(' ')
  
  return (
    <div className={dotsClasses} role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, index) => (
        <div 
          key={index} 
          className="loading-dot" 
          style={{ animationDelay: `${index * 0.2}s` }}
        />
      ))}
    </div>
  )
}

LoadingDots.propTypes = {
  count: PropTypes.number,
  color: PropTypes.oneOf(['primary', 'secondary', 'white']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string
}

/**
 * Progress Bar Loading Indicator
 */
function LoadingProgressBar({ 
  progress = null, 
  indeterminate = true,
  color = 'primary',
  height = 'medium',
  className = '',
  showPercentage = false
}) {
  const heightClasses = {
    thin: 'progress-thin',
    medium: 'progress-medium',
    thick: 'progress-thick'
  }
  
  const colorClasses = {
    primary: 'progress-primary',
    secondary: 'progress-secondary',
    success: 'progress-success'
  }
  
  const progressClasses = [
    'loading-progress',
    heightClasses[height],
    colorClasses[color],
    indeterminate ? 'indeterminate' : 'determinate',
    className
  ].filter(Boolean).join(' ')
  
  const progressValue = progress !== null ? Math.max(0, Math.min(100, progress)) : 0
  
  return (
    <div className="loading-progress-container">
      <div className={progressClasses} role="progressbar" aria-valuenow={progressValue} aria-valuemin="0" aria-valuemax="100">
        <div 
          className="progress-bar" 
          style={!indeterminate ? { width: `${progressValue}%` } : {}}
        />
      </div>
      {showPercentage && progress !== null && (
        <span className="progress-percentage">{Math.round(progressValue)}%</span>
      )}
    </div>
  )
}

LoadingProgressBar.propTypes = {
  progress: PropTypes.number,
  indeterminate: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary', 'success']),
  height: PropTypes.oneOf(['thin', 'medium', 'thick']),
  className: PropTypes.string,
  showPercentage: PropTypes.bool
}

/**
 * Skeleton Loading Component for Text
 */
function LoadingSkeleton({ 
  lines = 1, 
  width = '100%',
  height = '1em',
  className = '',
  animated = true 
}) {
  const skeletonClasses = [
    'loading-skeleton',
    animated ? 'animated' : 'static',
    className
  ].filter(Boolean).join(' ')
  
  if (lines === 1) {
    return (
      <div 
        className={skeletonClasses}
        style={{ width, height }}
        role="status"
        aria-label="Loading content"
      />
    )
  }
  
  return (
    <div className="loading-skeleton-container">
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className={skeletonClasses}
          style={{ 
            width: index === lines - 1 ? '75%' : width, 
            height,
            marginBottom: index < lines - 1 ? '0.5em' : 0
          }}
          role="status"
          aria-label={`Loading content line ${index + 1}`}
        />
      ))}
    </div>
  )
}

LoadingSkeleton.propTypes = {
  lines: PropTypes.number,
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  animated: PropTypes.bool
}

export { 
  LoadingSpinner, 
  LoadingDots, 
  LoadingProgressBar, 
  LoadingSkeleton 
}
export default LoadingSpinner