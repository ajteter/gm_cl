import { useNavigate } from 'react-router-dom'
import useRandomGame from '../hooks/useRandomGame'
import { useRandomGameSEO } from '../hooks/useSEO'
import GameClientUI3 from '../components/GameClientUI3'
import LoadingStateManager from '../components/LoadingStateManager'
import { SkeletonGamePage } from '../components/LoadingSkeletons'
import LoadingSpinner from '../components/LoadingSpinner'
import styles from '../styles/components/RandomGame.module.css'

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
)

export default function RandomGame3Page() {
  const { game, loading, error, refetch } = useRandomGame()
  const navigate = useNavigate()

  // Set up SEO for random game page
  useRandomGameSEO(game)

  const handleRetry = () => {
    refetch()
  }

  const handleMoreGames = () => {
    navigate('/game3')
  }

  // Custom loading component for random game page
  const RandomGameLoading = () => (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.buttonGroup}>
          <div className={styles.dailyTitle}>
            <span>1 DAY 1 GAME</span>
          </div>
          <button onClick={handleMoreGames} className={styles.actionButtonSmall}>
            <GridIcon />
            <span>More Games</span>
          </button>
        </div>
      </div>
      <div className={styles.mainContent}>
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
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.buttonGroup}>
          <div className={styles.dailyTitle}>
            <span>1 DAY 1 GAME</span>
          </div>
          <button onClick={handleMoreGames} className={styles.actionButtonSmall}>
            <GridIcon />
            <span>More Games</span>
          </button>
        </div>
      </div>
      <div className={styles.error}>
        <p>Could not load today's game.</p>
        {error && <p>Error: {error}</p>}
        <div className={styles.header}>
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
      <GameClientUI3 
        game={game} 
        title="1 DAY 1 GAME"
        showTitle={true}
        styles={styles}
      />
    </LoadingStateManager>
  )
}