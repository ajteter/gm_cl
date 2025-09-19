import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import GameList2 from '../components/GameList2'
import SkeletonCard from '../components/SkeletonCard'
import LoadingStateManager from '../components/LoadingStateManager'
import { SkeletonGameList } from '../components/LoadingSkeletons'
import useGames from '../hooks/useGames'
import { useHomeSEO } from '../hooks/useSEO'

const PAGE_SIZE = 50

export default function HomePage2() {
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
    navigate(`/game2${newUrl}`, { replace: true })
  }
  
  // Handle retry on error
  const handleRetry = () => {
    refetch()
  }

  // Custom empty component for when no games are available
  const EmptyGamesComponent = () => (
    <div className="empty">
      <div className="emptyIcon" aria-hidden="true" />
      <p className="emptyText">暂时无法加载，请稍后重试</p>
      <button 
        onClick={handleRetry}
        className="retryBtn"
        type="button"
      >
        重试
      </button>
    </div>
  ) 
 return (
    <main className="container">
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
        <GameList2 items={currentGames} />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="pageBtn iconBtn"
              disabled={currentPage <= 1}
              aria-label="上一页"
              type="button"
            >
              ‹
            </button>
            
            <span className="pageDot" aria-hidden="true">
              第 {currentPage} 页 / 共 {totalPages} 页
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="pageBtn iconBtn"
              disabled={currentPage >= totalPages}
              aria-label="下一页"
              type="button"
            >
              ›
            </button>
          </div>
        )}
      </LoadingStateManager>
    </main>
  )
}