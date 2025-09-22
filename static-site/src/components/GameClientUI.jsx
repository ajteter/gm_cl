import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
)

/**
 * GameClientUI component for displaying games in fullscreen mode
 * Handles URL parameter forwarding for ad attribution and provides game embedding
 */
export default function GameClientUI({ 
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

  // Early return if no game provided
  if (!game || !game.url) {
    return null
  }

  useEffect(() => {
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
  }, [game.url])

  const handleMoreGames = () => {
    if (onMoreGames) {
      onMoreGames()
    } else {
      navigate('/game')
    }
  }

  const handleIframeLoad = () => {
    setIsIframeLoading(false)
  }

  const handleIframeError = () => {
    setIsIframeLoading(false)
    console.error('Failed to load game iframe:', gameUrl)
  }

  // Default ad configuration for random game page
  const defaultAdConfig = {
    key: '9adddfc2b9f962e7595071bcbd5cc4e5',
    height: 50,
    width: 320,
    maxHeight: '50px',
    script: '//www.highperformanceformat.com/9adddfc2b9f962e7595071bcbd5cc4e5/invoke.js',
    delay: 1000
  }

  const finalAdConfig = adConfig === null ? null : (adConfig || defaultAdConfig)

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

      {finalAdConfig && (
        <div className={styles.adContainer}>
          <iframe 
            srcDoc={`
              <!DOCTYPE html>
              <html>
              <head>
                  <style>
                      body { margin: 0; padding: 0; overflow: hidden; }
                      * { max-width: 100% !important; max-height: ${finalAdConfig.maxHeight} !important; }
                  </style>
              </head>
              <body>
                  <script>
                      // 延迟加载广告脚本
                      setTimeout(() => {
                          const script = document.createElement('script');
                          script.type = 'text/javascript';
                          script.src = '${finalAdConfig.script}';
                          
                          window.atOptions = {
                              'key': '${finalAdConfig.key}',
                              'format': 'iframe',
                              'height': ${finalAdConfig.height},
                              'width': ${finalAdConfig.width},
                              'params': {}
                          };
                          
                          document.body.appendChild(script);
                      }, ${finalAdConfig.delay});
                  </script>
              </body>
              </html>
            `}
            sandbox="allow-scripts allow-same-origin allow-top-navigation-by-user-activation allow-popups"
            style={{
              width: '100%',
              height: `${finalAdConfig.height}px`,
              border: 'none',
              maxHeight: finalAdConfig.maxHeight,
              overflow: 'hidden'
            }}
            title="Advertisement"
          />
        </div>
      )}
    </div>
  )
}

GameClientUI.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  title: PropTypes.string,
  showTitle: PropTypes.bool,
  adConfig: PropTypes.shape({
    key: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    maxHeight: PropTypes.string.isRequired,
    script: PropTypes.string.isRequired,
    delay: PropTypes.number
  }),
  styles: PropTypes.object.isRequired,
  onMoreGames: PropTypes.func
}