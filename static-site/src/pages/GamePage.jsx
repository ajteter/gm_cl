import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import useGames from '../hooks/useGames'
import { useGameSEO, useCollectionSEO } from '../hooks/useSEO'
import GameClientUI from '../components/GameClientUI'
import GameList from '../components/GameList'
import LoadingStateManager from '../components/LoadingStateManager'
import { useI18n } from '../i18n'

const PAGE_SIZE = 50

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
)

export default function GamePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { games, loading, error, refetch } = useGames()
  const { t } = useI18n()

  const gameId = searchParams.get('id')
  const [selectedGame, setSelectedGame] = useState(null)
  const [gameError, setGameError] = useState(null)

  // Game list pagination logic
  const currentPage = Number(searchParams.get('page')) || 1
  const totalPages = Math.ceil(games.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE
  const currentGames = games.slice(startIndex, endIndex)

  // Find the selected game
  useEffect(() => {
    if (!loading && games.length > 0 && gameId) {
      const game = games.find(g => g.id === gameId)
      if (game) {
        setSelectedGame(game)
        setGameError(null)
      } else {
        setGameError('Game not found')
        setSelectedGame(null)
      }
    } else if (!loading && !gameId) {
      // If no gameId, we don't set an error anymore because we will show the list
      setSelectedGame(null)
      setGameError(null)
    }
  }, [games, loading, gameId])

  // Set up SEO for game page or collection page
  useGameSEO(selectedGame, {
    enabled: Boolean(gameId),
    gameId,
    notFound: Boolean(gameId && !loading && gameError)
  })
  useCollectionSEO(currentGames, currentPage, { enabled: !gameId })

  const handleMoreGames = () => {
    navigate('/game')
  }

  const handleRetry = () => {
    if (gameId) {
      window.location.reload()
    } else {
      refetch()
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return

    const newSearchParams = new URLSearchParams(searchParams)
    if (newPage === 1) {
      newSearchParams.delete('page')
    } else {
      newSearchParams.set('page', newPage.toString())
    }

    const newUrl = newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''
    navigate(`/game${newUrl}`, { replace: true })
  }

  // --- RENDER SPECIFIC GAME ---
  if (gameId) {
    if (loading) {
      return (
        <div className="flex flex-col h-[100dvh] w-full bg-black overflow-hidden relative">
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/10 z-50 absolute top-0 left-0 w-full">
            <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
              <button onClick={handleMoreGames} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors border border-white/10 min-h-[44px]">
                <GridIcon />
                <span>{t('gamePage.moreGames')}</span>
              </button>
            </div>
          </div>
          <div className="flex-1 w-full relative pt-[60px] bg-black">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>
              {t('gamePage.loadingGame')}
            </div>
          </div>
        </div>
      )
    }

    if (error || gameError || !selectedGame) {
      return (
        <div className="flex flex-col h-[100dvh] w-full bg-black overflow-hidden relative">
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/10 z-50 absolute top-0 left-0 w-full">
            <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
              <button onClick={handleMoreGames} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors border border-white/10 min-h-[44px]">
                <GridIcon />
                <span>{t('gamePage.moreGames')}</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-6 text-center text-white/50 h-full pt-[60px]">
            <p>{gameError || error || t('gamePage.notAvailable')}</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
              <button onClick={handleRetry} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors border border-white/10 min-h-[44px]">
                {t('gamePage.retry')}
              </button>
              <button onClick={handleMoreGames} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors border border-white/10 min-h-[44px]">
                {t('gamePage.moreGamesButton')}
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <GameClientUI
        game={selectedGame}
        title={selectedGame.title}
        showTitle={true}
        adConfig={null}
        onMoreGames={handleMoreGames}
      />
    )
  }

  // --- RENDER GAME LIST (IF NO GAME ID) ---
  const EmptyGamesComponent = () => (
    <div className="py-12 px-6 text-center text-text-muted">
      <div className="w-10 h-10 mx-auto mb-2 rounded-full border-4 border-card border-t-text-muted animate-spin-fast" aria-hidden="true" />
      <p className="text-sm">{t('home.loadError')}</p>
      <button
        onClick={handleRetry}
        className="mt-4 px-6 py-2 bg-card hover:bg-card-border text-text-main rounded-md transition-colors"
        type="button"
      >
        {t('home.retry')}
      </button>
    </div>
  )

  return (
    <main className="w-full max-w-6xl mx-auto px-4 pt-safe-top pb-12 mt-[20px]">
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
              aria-label={t('home.prevPage')}
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>

            <span className="text-sm text-text-muted px-4 py-2 bg-card/50 rounded-full border border-card-border/50" aria-hidden="true">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="w-12 h-12 flex items-center justify-center bg-card border border-card-border rounded-xl hover:bg-card-border transition-colors disabled:opacity-50 disabled:pointer-events-none"
              disabled={currentPage >= totalPages}
              aria-label={t('home.nextPage')}
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
