import React from 'react'
import PropTypes from 'prop-types'
import { LoadingSkeleton } from './LoadingSpinner'

/**
 * Enhanced Skeleton Card Component for Game Loading
 */
function SkeletonGameCard({ className = '' }) {
  return (
    <li className={`flex flex-col bg-card border border-card-border rounded-xl overflow-hidden w-full ${className}`}>
      <div className="relative w-full aspect-video sm:aspect-[4/3] bg-background/50 overflow-hidden">
        <LoadingSkeleton width="100%" height="100%" />
      </div>
      <div className="p-4 flex flex-col flex-1 gap-3">
        <LoadingSkeleton width="80%" height="1.25rem" />
        <LoadingSkeleton width="100%" height="3rem" />
        <div className="mt-auto pt-2">
          <LoadingSkeleton width="100%" height="3rem" className="rounded-xl" />
        </div>
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
    <ul className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-0 m-0 list-none w-full ${className}`}>
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
    <div className={`flex flex-col h-[100dvh] w-full bg-black overflow-hidden relative ${className}`}>
      {/* Fake Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/10 z-50 absolute top-0 left-0 w-full">
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
          <LoadingSkeleton width="120px" height="2.5rem" className="rounded-full" />
        </div>
      </div>

      {/* Game Content Area */}
      <div className="flex-1 w-full relative mt-[60px] bg-black">
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="flex flex-col items-center gap-4 w-full h-full max-w-4xl max-h-[600px] p-4">
            <LoadingSkeleton width="100%" height="100%" />
          </div>
        </div>
      </div>

      {/* Bottom Ad Area */}
      <div className="w-full h-[50px] bg-black border-t border-white/10 flex items-center justify-center">
        <LoadingSkeleton width="320px" height="32px" />
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
    <nav className={`flex items-center justify-between p-4 bg-card border-b border-card-border ${className}`}>
      <LoadingSkeleton
        width="120px"
        height="2rem"
      />
      <div className="flex gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <LoadingSkeleton
            key={index}
            width="60px"
            height="1.25rem"
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
    <div className={`flex flex-col gap-3 ${className}`}>
      {title && (
        <LoadingSkeleton
          width="50%"
          height="1.5rem"
        />
      )}
      <LoadingSkeleton
        lines={lines}
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
      className={`rounded-xl ${className}`}
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
    <div className={`flex flex-col gap-4 ${className}`}>
      {Array.from({ length: fields }, (_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <LoadingSkeleton
            width="30%"
            height="1rem"
          />
          <LoadingSkeleton
            width="100%"
            height="3rem"
            className="rounded-lg"
          />
        </div>
      ))}
      {hasSubmitButton && (
        <SkeletonButton
          width="120px"
          className="mt-2"
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
    <div className={`flex items-center justify-between gap-3 py-6 mt-4 ${className}`}>
      <SkeletonButton width="48px" height="48px" className="rounded-xl" />
      <LoadingSkeleton width="160px" height="2.5rem" className="rounded-full" />
      <SkeletonButton width="48px" height="48px" className="rounded-xl" />
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