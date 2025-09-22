import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import useGames from '../hooks/useGames'
import { useGameSEO } from '../hooks/useSEO'
import GameClientUI2 from '../components/GameClientUI2'
import styles from '../styles/components/Play.module.css'

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
)

export default function Game2Page() {
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
    navigate('/game2')
  }

  const handleRetry = () => {
    window.location.reload()
  }

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.buttonGroup}>
            <button onClick={handleMoreGames} className={styles.actionButton}>
              <GridIcon />
              <span>More Games</span>
            </button>
          </div>
        </div>
        <div className={styles.mainContent}>
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
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.buttonGroup}>
            <button onClick={handleMoreGames} className={styles.actionButton}>
              <GridIcon />
              <span>More Games</span>
            </button>
          </div>
        </div>
        <div className={styles.error}>
          <p>{gameError || error || 'Game not available'}</p>
          <div style={{ marginTop: '1rem' }}>
            <button 
              onClick={handleRetry} 
              className={styles.actionButton}
              style={{ marginRight: '10px' }}
            >
              Retry
            </button>
            <button onClick={handleMoreGames} className={styles.actionButton}>
              More Games
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <GameClientUI2 
      game={selectedGame} 
      title={selectedGame.title}
      showTitle={true}
      adConfig={{ 
        type: 'magsrv', 
        zoneId: '5729202',
        width: 300,
        height: 250
      }}
      styles={styles}
      onMoreGames={handleMoreGames}
    />
  )
}