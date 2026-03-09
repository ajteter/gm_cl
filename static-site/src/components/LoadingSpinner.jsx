import React from 'react'
import PropTypes from 'prop-types'
import { cn } from '../utils/cn'

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
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  }

  const colorClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    white: 'border-white'
  }

  const containerClasses = cn(
    "flex flex-col items-center justify-center gap-2",
    inline ? 'inline-flex' : 'flex'
  )

  return (
    <div className={containerClasses}>
      <div
        className={cn("rounded-full border-t-transparent animate-spin", sizeClasses[size], colorClasses[color], className)}
        role="status"
        aria-label="Loading"
      />
      {text && <span className="text-sm text-white/70">{text}</span>}
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
    small: 'w-1 h-1',
    medium: 'w-2 h-2',
    large: 'w-3 h-3'
  }

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    white: 'bg-white'
  }

  return (
    <div className={cn("flex items-center gap-1", className)} role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={cn("rounded-full animate-bounce", sizeClasses[size], colorClasses[color])}
          style={{ animationDelay: `${index * 0.15}s` }}
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
    thin: 'h-1',
    medium: 'h-2',
    thick: 'h-4'
  }

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-emerald-500'
  }

  const progressValue = progress !== null ? Math.max(0, Math.min(100, progress)) : 0

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className={cn("w-full bg-white/10 overflow-hidden rounded-full", heightClasses[height], className)} role="progressbar" aria-valuenow={progressValue} aria-valuemin="0" aria-valuemax="100">
        <div
          className={cn("h-full transition-all duration-300", colorClasses[color], indeterminate ? "w-1/2 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" : "rounded-full")}
          style={!indeterminate ? { width: `${progressValue}%` } : {}}
        />
      </div>
      {showPercentage && progress !== null && (
        <span className="text-xs text-white/50 text-right">{Math.round(progressValue)}%</span>
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
  const skeletonClasses = cn(
    "bg-white/10 rounded",
    animated ? 'animate-pulse' : '',
    className
  )

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
    <div className="flex flex-col gap-2 w-full">
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className={skeletonClasses}
          style={{
            width: index === lines - 1 ? '75%' : width,
            height
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