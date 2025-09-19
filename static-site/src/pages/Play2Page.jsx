import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { usePlaySEO } from '../hooks/useSEO'
import styles from '../styles/components/Play.module.css'

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
)

export default function Play2Page() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const gameUrl = searchParams.get('url')
  const [isIframeLoading, setIsIframeLoading] = useState(true)
  const [finalGameUrl, setFinalGameUrl] = useState('')

  // Set up SEO for play page
  usePlaySEO(gameUrl)

  // Handle ad attribution parameters
  useEffect(() => {
    if (gameUrl) {
      // Get current page parameters (except url parameter)
      const currentParams = new URLSearchParams(window.location.search)
      currentParams.delete('url') // Remove url parameter itself
      
      if (currentParams.toString()) {
        // Add ad attribution parameters to game URL
        const gameUrlObj = new URL(gameUrl)
        currentParams.forEach((value, key) => {
          gameUrlObj.searchParams.set(key, value)
        })
        setFinalGameUrl(gameUrlObj.toString())
      } else {
        setFinalGameUrl(gameUrl)
      }
    }
  }, [gameUrl])

  const handleMoreGames = () => {
    navigate('/game2')
  }

  if (!gameUrl) {    re
turn (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>游戏链接无效。</p>
          <button onClick={() => navigate('/game2')} className={styles.actionButton}>
            返回首页
          </button>
        </div>
      </div>
    )
  }

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
        {isIframeLoading && (
          <div className={styles.loadingOverlay}>
            <div className="emptyIcon" />
          </div>
        )}
        <iframe
          src={finalGameUrl}
          className={styles.iframe}
          title="Game"
          allow="autoplay; fullscreen; payment; display-capture; camera; microphone; geolocation; accelerometer; gyroscope; magnetometer; clipboard-read; clipboard-write"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          loading="eager"
          muted
          onLoad={() => setIsIframeLoading(false)}
        />
      </div>

      <div className={styles.adContainer}>
        <iframe 
          srcDoc={`
            <!DOCTYPE html>
            <html>
            <head>
                <script id="aclib" type="text/javascript" src="//acscdn.com/script/aclib.js"></script>
                <style>
                    body { margin: 0; padding: 0; overflow: hidden; }
                    * { max-width: 100% !important; max-height: 100px !important; }
                </style>
            </head>
            <body>
                <div>
                    <script type="text/javascript">
                        aclib.runBanner({
                            zoneId: '10422246'
                        });
                    </script>
                </div>
            </body>
            </html>
          `}
          sandbox="allow-scripts allow-same-origin allow-top-navigation-by-user-activation allow-popups"
          style={{
            width: '100%',
            height: '100px',
            border: 'none',
            maxHeight: '100px',
            overflow: 'hidden'
          }}
          title="Advertisement"
        />
      </div>
    </div>
  )
}