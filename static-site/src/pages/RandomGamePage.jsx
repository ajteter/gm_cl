import { useNavigate } from 'react-router-dom'
import useRandomGame from '../hooks/useRandomGame'
import { useRandomGameSEO } from '../hooks/useSEO'
import GameClientUI from '../components/GameClientUI'
import LoadingStateManager from '../components/LoadingStateManager'
import LoadingSpinner from '../components/LoadingSpinner'

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
)

export default function RandomGamePage() {
  const { game, loading, error, refetch } = useRandomGame()
  const navigate = useNavigate()

  // Set up SEO for random game page
  useRandomGameSEO(game)

  const handleRetry = () => {
    refetch()
  }

  const handleMoreGames = () => {
    navigate('/')
  }

  // Custom loading component for random game page
  const RandomGameLoading = () => (
    <div className="flex flex-col h-[100dvh] w-full bg-black overflow-hidden relative">
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/10 z-50 absolute top-0 left-0 w-full">
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-emerald-400 text-black font-black rounded-full text-sm shadow-[0_0_15px_rgba(34,197,94,0.3)] min-h-[44px]">
            <span>1 DAY 1 GAME</span>
          </div>
          <button onClick={handleMoreGames} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors border border-white/10 min-h-[44px]">
            <GridIcon />
            <span>More Games</span>
          </button>
        </div>
      </div>
      <div className="flex-1 w-full relative pt-[60px] bg-black">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'white',
          gap: '1rem'
        }}>
          <LoadingSpinner color="white" size="large" />
          <span>Loading today's game...</span>
        </div>
      </div>
    </div>
  )

  // Custom error component for random game page
  const RandomGameError = () => (
    <div className="flex flex-col h-[100dvh] w-full bg-black overflow-hidden relative">
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/10 z-50 absolute top-0 left-0 w-full">
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-emerald-400 text-black font-black rounded-full text-sm shadow-[0_0_15px_rgba(34,197,94,0.3)] min-h-[44px]">
            <span>1 DAY 1 GAME</span>
          </div>
          <button onClick={handleMoreGames} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors border border-white/10 min-h-[44px]">
            <GridIcon />
            <span>More Games</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-6 text-center text-white/50 h-[calc(100dvh-60px)] pt-[60px]">
        <p>Could not load today's game.</p>
        {error && <p>Error: {error}</p>}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors border border-white/10 min-h-[44px]"
          >
            Retry
          </button>
          <button onClick={handleMoreGames} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors border border-white/10 min-h-[44px]">
            More Games
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <LoadingStateManager
      loading={loading}
      error={error}
      data={game}
      retryFunction={handleRetry}
      renderLoading={() => <RandomGameLoading />}
      renderError={() => <RandomGameError />}
      showLoadingDelay={100}
      minLoadingTime={300}
    >
      <GameClientUI
        game={game}
        title="1 DAY 1 GAME"
        showTitle={true}
      />
    </LoadingStateManager>
  )
}