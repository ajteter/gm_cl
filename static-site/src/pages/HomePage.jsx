import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import GameList from '../components/GameList'
import SkeletonCard from '../components/SkeletonCard'
import LoadingStateManager from '../components/LoadingStateManager'
import { SkeletonGameList } from '../components/LoadingSkeletons'
import useGames from '../hooks/useGames'
import { useHomeSEO } from '../hooks/useSEO'

const PAGE_SIZE = 50

export default function HomePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { games, loading, error, refetch } = useGames()

  // Get current page from URL params
  const currentPage = Number(searchParams.get('page')) || 1

  // Calculate pagination
  const totalPages = Math.ceil(games.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE
  const currentGames = games.slice(startIndex, endIndex)

  // Set up SEO for home page
  useHomeSEO(games.length, currentPage)

  // Handle page navigation
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return

    const newSearchParams = new URLSearchParams(searchParams)
    if (newPage === 1) {
      newSearchParams.delete('page')
    } else {
      newSearchParams.set('page', newPage.toString())
    }

    const newUrl = newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''
    navigate(`/${newUrl}`, { replace: true })
  }

  // Handle retry on error
  const handleRetry = () => {
    refetch()
  }

  // Custom empty component for when no games are available
  const EmptyGamesComponent = () => (
    <div className="py-12 px-6 text-center text-text-muted">
      <div className="w-10 h-10 mx-auto mb-2 rounded-full border-4 border-card border-t-text-muted animate-spin-fast" aria-hidden="true" />
      <p className="text-sm">暂时无法加载，请稍后重试</p>
      <button
        onClick={handleRetry}
        className="mt-4 px-6 py-2 bg-card hover:bg-card-border text-text-main rounded-md transition-colors"
        type="button"
      >
        重试
      </button>
    </div>
  )

  return (
    <main className="w-full max-w-6xl mx-auto px-4 pt-safe-top pb-12">
      <LoadingStateManager
        loading={loading}
        error={error}
        data={currentGames}
        loadingType="skeleton-games"
        retryFunction={handleRetry}
        emptyComponent={<EmptyGamesComponent />}
        showLoadingDelay={200}
        minLoadingTime={500}
      >
        <GameList items={currentGames} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 py-6 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="w-12 h-12 flex items-center justify-center bg-card border border-card-border rounded-xl hover:bg-card-border transition-colors disabled:opacity-50 disabled:pointer-events-none"
              disabled={currentPage <= 1}
              aria-label="上一页"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>

            <span className="text-sm text-text-muted px-4 py-2 bg-card/50 rounded-full border border-card-border/50" aria-hidden="true">
              第 {currentPage} 页 / 共 {totalPages} 页
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="w-12 h-12 flex items-center justify-center bg-card border border-card-border rounded-xl hover:bg-card-border transition-colors disabled:opacity-50 disabled:pointer-events-none"
              disabled={currentPage >= totalPages}
              aria-label="下一页"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        )}
      </LoadingStateManager>
    </main>
  )
}