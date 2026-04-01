import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import ReviveAdModal from './ReviveAdModal'
import LeaderboardSystem from './LeaderboardSystem'
import { AdService } from '../services/AdService'
import { useI18n } from '../i18n'

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
 *
 * Adsterra Social Bar Revive Flow:
 * 1. Game sends PLAYER_DEAD_ASK_REVIVE → show ReviveAdModal
 * 2. User clicks "Watch Ad" → close modal, call AdService.showRewardedAd()
 * 3. AdService injects Social Bar + starts 6s countdown, reporting progress via onProgress
 * 4. After 6s → AdService resolves → executeRevive() sends EXECUTE_REVIVE to iframe
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
  const [adCountdown, setAdCountdown] = useState(null) // null = not watching, >0 = countdown, 0 = done
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  const [leaderboardScore, setLeaderboardScore] = useState(0)
  const [gameToken, setGameToken] = useState(null)
  const iframeRef = useRef(null)
  const navigate = useNavigate()
  const { t } = useI18n()

  // Early return if no game provided
  if (!game || !game.url) {
    return null
  }

  // Append current page's query parameters to the game URL for attribution
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.delete('id')

    if (params.toString()) {
      const newUrl = new URL(game.url, window.location.origin)
      params.forEach((value, key) => {
        newUrl.searchParams.set(key, value)
      })
      setGameUrl(newUrl.toString())
    }
  }, [game.url])

  // Fetch game session token on mount (for leaderboard anti-abuse)
  useEffect(() => {
    fetch('/api/game-token', { cache: 'no-store' })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setGameToken(data) })
      .catch(() => { /* token fetch failed, leaderboard will work without it */ })
  }, [])

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

  // Bottom ad config (disabled by default to avoid duplicate zones with top banner)
  const finalAdConfig = adConfig || null;

  // ---------------------------------------------------------------------------
  // Adsterra Social Bar: Revive Ad Flow
  // ---------------------------------------------------------------------------

  // Unified revive executor — sends EXECUTE_REVIVE to the game iframe
  const executeRevive = useCallback(() => {
    setAdCountdown(null);
    if (iframeRef.current && iframeRef.current.contentWindow && gameUrl) {
      try {
        const targetOrigin = new URL(gameUrl, window.location.origin).origin;
        iframeRef.current.contentWindow.postMessage({ type: 'EXECUTE_REVIVE' }, targetOrigin);
      } catch (e) {
        iframeRef.current.contentWindow.postMessage({ type: 'EXECUTE_REVIVE' }, '*');
      }
    }
  }, [gameUrl]);

  // Listen for game death message
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'PLAYER_DEAD_ASK_REVIVE') {
        setIsReviveModalOpen(true);
      } else if (e.data && e.data.type === 'GAME_OVER_LEADERBOARD') {
        setIsReviveModalOpen(false);
        setLeaderboardScore(e.data.score);
        setIsLeaderboardOpen(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  // User clicked "Watch Ad" — inject Adsterra Social Bar via AdService, show countdown
  const handleWatchAd = async () => {
    setIsReviveModalOpen(false);
    setAdCountdown(6); // Init countdown display immediately

    try {
      await AdService.showRewardedAd((remaining) => {
        setAdCountdown(remaining);
      });
    } catch (err) {
      console.warn('[GameClientUI] AdService failed, granting free revive:', err);
    }

    executeRevive();
  };

  // User declined revive
  const handleDeclineRevive = useCallback(() => {
    setIsReviveModalOpen(false);
    if (iframeRef.current && iframeRef.current.contentWindow && gameUrl) {
      try {
        const targetOrigin = new URL(gameUrl, window.location.origin).origin;
        iframeRef.current.contentWindow.postMessage({ type: 'SKIP_REVIVE' }, targetOrigin);
      } catch (e) {
        iframeRef.current.contentWindow.postMessage({ type: 'SKIP_REVIVE' }, '*');
      }
    }
  }, [gameUrl]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
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
                    script.setAttribute('data-cfasync', 'false');
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
          <span>{t('game.moreGames')}</span>
        </button>
      </div>

      <div className="w-full flex justify-center items-center bg-black border-t border-white/10 z-20 shrink-0 py-4">
        <iframe
          srcDoc={`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { margin: 0; padding: 0; overflow: hidden; background: transparent; display: flex; justify-content: center; align-items: center; }
                </style>
            </head>
            <body>
                <script async="async" data-cfasync="false" src="https://pl28930965.profitablecpmratenetwork.com/94dce533c4905a36ce0e031ab154baca/invoke.js"><\/script>
                <div id="container-94dce533c4905a36ce0e031ab154baca"></div>
            </body>
            </html>
          `}
          sandbox="allow-scripts allow-same-origin allow-top-navigation-by-user-activation allow-popups"
          style={{ width: '100%', maxWidth: '400px', height: '250px', border: 'none', overflow: 'hidden' }}
          title={t('game.adTitle.bottom')}
        />
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
                      // Delayed ad script loading
                      setTimeout(() => {
                          const script = document.createElement('script');
                          script.setAttribute('data-cfasync', 'false');
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
            title={t('game.adTitle.bottom')}
          />
        </div>
      )}

      <ReviveAdModal
        isOpen={isReviveModalOpen}
        onAccept={handleWatchAd}
        onDecline={handleDeclineRevive}
        adCountdown={adCountdown}
      />

      <LeaderboardSystem
        isOpen={isLeaderboardOpen}
        score={leaderboardScore}
        onClose={() => { setIsLeaderboardOpen(false); setLeaderboardScore(0); }}
        iframeRef={iframeRef}
        gameUrl={gameUrl}
        gameToken={gameToken}
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