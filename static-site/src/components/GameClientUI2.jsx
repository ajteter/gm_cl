import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import MagSrvIframeAd from './MagSrvIframeAd'

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
)

/**
 * GameClientUI2 component for displaying games in fullscreen mode with Game2 specific ad configuration
 * Handles URL parameter forwarding for ad attribution and provides game embedding
 */
export default function GameClientUI2({ 
  game, 
  title = "1 DAY 1 GAME", 
  showTitle = true,
  adConfig,
  styles,
  onMoreGames = null 
}) {
  const [gameUrl, setGameUrl] = useState(game?.url || '')
  const [isIframeLoading, setIsIframeLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!game?.url) return
    // Append current page's query parameters to the game URL for attribution
    const params = new URLSearchParams(window.location.search)
    
    // Remove navigation parameters that shouldn't be passed to the game
    params.delete('id')
    
    if (params.toString()) {
      const newUrl = new URL(game.url)
      params.forEach((value, key) => {
        newUrl.searchParams.set(key, value)
      })
      setGameUrl(newUrl.toString())
    }
  }, [game?.url])

  // Early return if no game provided
  if (!game || !game.url) {
    return null
  }

  const handleMoreGames = () => {
    if (onMoreGames) {
      onMoreGames()
    } else {
      navigate('/game2')
    }
  }

  const handleIframeLoad = () => {
    setIsIframeLoading(false)
  }

  const handleIframeError = () => {
    setIsIframeLoading(false)
    console.error('Failed to load game iframe:', gameUrl)
  }

  // Determine ad type based on adConfig
  const useAds = adConfig !== null

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.buttonGroup}>
          {showTitle && (
            <div className={styles.dailyTitle || styles.gameTitle}>
              <span>{title}</span>
            </div>
          )}
          <button onClick={handleMoreGames} className={styles.actionButtonSmall || styles.actionButton}>
            <GridIcon />
            <span>More Games</span>
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        {isIframeLoading && styles.loadingOverlay && (
          <div className={styles.loadingOverlay}>
            <div style={{ color: 'white' }}>Loading game...</div>
          </div>
        )}
        <iframe
          src={gameUrl}
          className={styles.iframe}
          title={game.title}
          allow="autoplay; fullscreen; payment; display-capture; camera; microphone; geolocation; accelerometer; gyroscope; magnetometer; clipboard-read; clipboard-write"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          loading="eager"
          muted
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>

      {useAds && (
        <div className={styles.adContainer}>
          <MagSrvIframeAd 
            zoneId={adConfig.zoneId || '5729198'} 
            width={adConfig.width || 300}
            height={adConfig.height || 50}
          />
        </div>
      )}
    </div>
  )
}

GameClientUI2.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  title: PropTypes.string,
  showTitle: PropTypes.bool,
  adConfig: PropTypes.shape({
    zoneId: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number
  }),
  styles: PropTypes.object.isRequired,
  onMoreGames: PropTypes.func
}