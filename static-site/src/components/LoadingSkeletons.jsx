import React from 'react'
import PropTypes from 'prop-types'
import { LoadingSkeleton } from './LoadingSpinner'

/**
 * Enhanced Skeleton Card Component for Game Loading
 */
function SkeletonGameCard({ className = '' }) {
  return (
    <li className={`card ${className}`}>
      <div className="media">
        <LoadingSkeleton 
          width="100%" 
          height="200px" 
          className="skeleton-thumb"
        />
      </div>
      <div className="content">
        <LoadingSkeleton 
          width="80%" 
          height="1.25rem" 
          className="skeleton-title"
        />
        <LoadingSkeleton 
          width="60%" 
          height="1rem" 
          className="skeleton-category"
        />
        <LoadingSkeleton 
          width="40%" 
          height="0.875rem" 
          className="skeleton-meta"
        />
      </div>
    </li>
  )
}

SkeletonGameCard.propTypes = {
  className: PropTypes.string
}

/**
 * Skeleton Game List Component
 */
function SkeletonGameList({ count = 10, className = '' }) {
  return (
    <ul className={`grid onecol ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonGameCard key={index} />
      ))}
    </ul>
  )
}

SkeletonGameList.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string
}

/**
 * Skeleton Game Page Component
 */
function SkeletonGamePage({ className = '' }) {
  return (
    <div className={`game-page-skeleton ${className}`}>
      <div className="game-header-skeleton">
        <LoadingSkeleton 
          width="60%" 
          height="2rem" 
          className="skeleton-game-title"
        />
        <LoadingSkeleton 
          width="40%" 
          height="1rem" 
          className="skeleton-game-meta"
        />
      </div>
      
      <div className="game-content-skeleton">
        <LoadingSkeleton 
          width="100%" 
          height="400px" 
          className="skeleton-game-frame"
        />
      </div>
      
      <div className="game-info-skeleton">
        <LoadingSkeleton 
          lines={3}
          className="skeleton-game-description"
        />
      </div>
    </div>
  )
}

SkeletonGamePage.propTypes = {
  className: PropTypes.string
}

/**
 * Skeleton Navigation Component
 */
function SkeletonNavigation({ className = '' }) {
  return (
    <nav className={`navigation-skeleton ${className}`}>
      <LoadingSkeleton 
        width="120px" 
        height="2rem" 
        className="skeleton-logo"
      />
      <div className="nav-items-skeleton">
        {Array.from({ length: 4 }, (_, index) => (
          <LoadingSkeleton 
            key={index}
            width="80px" 
            height="1.5rem" 
            className="skeleton-nav-item"
          />
        ))}
      </div>
    </nav>
  )
}

SkeletonNavigation.propTypes = {
  className: PropTypes.string
}

/**
 * Skeleton Text Block Component
 */
function SkeletonTextBlock({ 
  lines = 3, 
  title = true, 
  className = '' 
}) {
  return (
    <div className={`text-block-skeleton ${className}`}>
      {title && (
        <LoadingSkeleton 
          width="50%" 
          height="1.5rem" 
          className="skeleton-block-title"
        />
      )}
      <LoadingSkeleton 
        lines={lines}
        className="skeleton-block-content"
      />
    </div>
  )
}

SkeletonTextBlock.propTypes = {
  lines: PropTypes.number,
  title: PropTypes.bool,
  className: PropTypes.string
}

/**
 * Skeleton Button Component
 */
function SkeletonButton({ 
  width = '100px', 
  height = '2.5rem',
  className = '' 
}) {
  return (
    <LoadingSkeleton 
      width={width}
      height={height}
      className={`skeleton-button ${className}`}
    />
  )
}

SkeletonButton.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string
}

/**
 * Skeleton Form Component
 */
function SkeletonForm({ 
  fields = 3, 
  hasSubmitButton = true,
  className = '' 
}) {
  return (
    <div className={`form-skeleton ${className}`}>
      {Array.from({ length: fields }, (_, index) => (
        <div key={index} className="form-field-skeleton">
          <LoadingSkeleton 
            width="30%" 
            height="1rem" 
            className="skeleton-field-label"
          />
          <LoadingSkeleton 
            width="100%" 
            height="2.5rem" 
            className="skeleton-field-input"
          />
        </div>
      ))}
      {hasSubmitButton && (
        <SkeletonButton 
          width="120px" 
          className="skeleton-submit-button"
        />
      )}
    </div>
  )
}

SkeletonForm.propTypes = {
  fields: PropTypes.number,
  hasSubmitButton: PropTypes.bool,
  className: PropTypes.string
}

/**
 * Skeleton Pagination Component
 */
function SkeletonPagination({ className = '' }) {
  return (
    <div className={`pagination-skeleton ${className}`}>
      <SkeletonButton width="40px" height="40px" className="skeleton-page-btn" />
      <LoadingSkeleton width="120px" height="1rem" className="skeleton-page-info" />
      <SkeletonButton width="40px" height="40px" className="skeleton-page-btn" />
    </div>
  )
}

SkeletonPagination.propTypes = {
  className: PropTypes.string
}

export {
  SkeletonGameCard,
  SkeletonGameList,
  SkeletonGamePage,
  SkeletonNavigation,
  SkeletonTextBlock,
  SkeletonButton,
  SkeletonForm,
  SkeletonPagination
}

export default SkeletonGameCard