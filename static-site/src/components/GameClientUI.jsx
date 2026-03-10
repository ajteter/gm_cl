import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import ReviveAdModal from './ReviveAdModal'

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
  onMoreGames = null
}) {
  const [gameUrl, setGameUrl] = useState(game?.url || '')
  const [isIframeLoading, setIsIframeLoading] = useState(true)
  const [isReviveModalOpen, setIsReviveModalOpen] = useState(false)
  const iframeRef = useRef(null)
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

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'PLAYER_DEAD_ASK_REVIVE') {
        setIsReviveModalOpen(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleWatchAd = () => {
    setIsReviveModalOpen(false);
    
    if (!document.querySelector('script[src="https://gizokraijaw.net/vignette.min.js"]')) {
      (function(s){
          s.dataset.zone='10706176';
          s.src='https://gizokraijaw.net/vignette.min.js';
      })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
    }

    if (iframeRef.current && iframeRef.current.contentWindow && gameUrl) {
      try {
        const targetOrigin = new URL(gameUrl, window.location.origin).origin;
        iframeRef.current.contentWindow.postMessage({ type: 'EXECUTE_REVIVE' }, targetOrigin);
      } catch (e) {
        iframeRef.current.contentWindow.postMessage({ type: 'EXECUTE_REVIVE' }, '*');
      }
    }
  };

  const handleDeclineRevive = () => {
    setIsReviveModalOpen(false);
    if (iframeRef.current && iframeRef.current.contentWindow && gameUrl) {
      try {
        const targetOrigin = new URL(gameUrl, window.location.origin).origin;
        iframeRef.current.contentWindow.postMessage({ type: 'SKIP_REVIVE' }, targetOrigin);
      } catch (e) {
        iframeRef.current.contentWindow.postMessage({ type: 'SKIP_REVIVE' }, '*');
      }
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-black overflow-hidden relative">
      <div className="w-full flex justify-center items-center bg-black border-b border-white/10 z-20 shrink-0 h-[50px]">
        <iframe
          srcDoc={`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { margin: 0; padding: 0; overflow: hidden; background: transparent; display: flex; justify-content: center; align-items: center; height: 100vh; }
                </style>
            </head>
            <body>
                <script>
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = 'https://www.highperformanceformat.com/866f788a538c789345f3c99981b528db/invoke.js';
                    
                    window.atOptions = {
                        'key': '866f788a538c789345f3c99981b528db',
                        'format': 'iframe',
                        'height': 50,
                        'width': 320,
                        'params': {}
                    };
                    
                    document.body.appendChild(script);
                </script>
            </body>
            </html>
          `}
          sandbox="allow-scripts allow-same-origin allow-top-navigation-by-user-activation allow-popups"
          style={{ width: '320px', height: '50px', border: 'none', overflow: 'hidden' }}
          title="Top Advertisement"
        />
      </div>

      {showTitle && (
        <div className="flex-shrink-0 flex items-center justify-center px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/10 z-50 w-full relative">
          <div className="text-white font-bold text-lg truncate">
            <span>{title}</span>
          </div>
        </div>
      )}

      <div className="flex-1 w-full relative bg-black">
        {isIframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-full border-4 border-white/20 border-t-primary animate-spin-fast"></div>
              <div className="text-white/80 text-sm font-medium">Loading game...</div>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={gameUrl}
          className="w-full h-full border-none m-0 p-0 block"
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

      <div className="w-full flex justify-center items-center bg-black border-t border-white/10 z-20 shrink-0 p-3">
        <button
          onClick={handleMoreGames}
          className="w-full max-w-sm flex items-center justify-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-xl text-base font-bold transition-colors cursor-pointer"
        >
          <GridIcon />
          <span>More Games</span>
        </button>
      </div>

      {finalAdConfig && (
        <div className="w-full flex justify-center items-center bg-black border-t border-white/10 z-20 shrink-0">
          <iframe
            srcDoc={`
              <!DOCTYPE html>
              <html>
              <head>
                  <style>
                      body { margin: 0; padding: 0; overflow: hidden; background: transparent; }
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

      <ReviveAdModal 
        isOpen={isReviveModalOpen}
        onAccept={handleWatchAd}
        onDecline={handleDeclineRevive}
      />
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
  onMoreGames: PropTypes.func
}