import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import useGames from '../hooks/useGames'
import { useGameSEO } from '../hooks/useSEO'
import GameClientUI from '../components/GameClientUI'

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
  const { games, loading, error } = useGames()

  const gameId = searchParams.get('id')
  const [selectedGame, setSelectedGame] = useState(null)
  const [gameError, setGameError] = useState(null)

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
      setGameError('No game ID provided')
    }
  }, [games, loading, gameId])

  // Set up SEO for game page
  useGameSEO(selectedGame)

  const handleMoreGames = () => {
    navigate('/')
  }

  const handleRetry = () => {
    window.location.reload()
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-[100dvh] w-full bg-black overflow-hidden relative">
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/10 z-50 absolute top-0 left-0 w-full">
          <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
            <button onClick={handleMoreGames} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors border border-white/10 min-h-[44px]">
              <GridIcon />
              <span>More Games</span>
            </button>
          </div>
        </div>
        <div className="flex-1 w-full relative mt-[60px] bg-black">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'white'
          }}>
            Loading game...
          </div>
        </div>
      </div>
    )
  }

  // Error states
  if (error || gameError || !selectedGame) {
    return (
      <div className="flex flex-col h-[100dvh] w-full bg-black overflow-hidden relative">
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/10 z-50 absolute top-0 left-0 w-full">
          <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
            <button onClick={handleMoreGames} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors border border-white/10 min-h-[44px]">
              <GridIcon />
              <span>More Games</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-6 text-center text-white/50 h-full mt-[60px]">
          <p>{gameError || error || 'Game not available'}</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
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
  }

  // Ad configuration for game page (same as list page)
  const gamePageAdConfig = {
    key: '268fd9be7cb5acbc21f157c5611ba04f',
    height: 250,
    width: 300,
    maxHeight: '250px',
    script: '//www.highperformanceformat.com/268fd9be7cb5acbc21f157c5611ba04f/invoke.js',
    delay: 0 // No delay for game page ads
  }

  return (
    <GameClientUI
      game={selectedGame}
      title={selectedGame.title}
      showTitle={true}
      adConfig={gamePageAdConfig}
      onMoreGames={handleMoreGames}
    />
  )
}