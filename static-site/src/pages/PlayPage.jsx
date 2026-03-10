import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { usePlaySEO } from '../hooks/useSEO'

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
)

export default function PlayPage() {
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
    navigate('/game')
  }

  if (!gameUrl) {
    return (
      <div className="flex flex-col h-[100dvh] w-full bg-black overflow-hidden relative">
        <div className="flex flex-col items-center justify-center h-full text-white/50">
          <p className="mb-4">游戏链接无效。</p>
          <button onClick={() => navigate('/game')} className="px-6 py-2 bg-primary text-black font-bold rounded-lg border border-primary hover:bg-primary-hover">
            返回首页
          </button>
        </div>
      </div>
    )
  }

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

      <div className="flex-1 w-full relative pt-[60px] bg-black">
        {isIframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="w-10 h-10 rounded-full border-4 border-white/20 border-t-primary animate-spin-fast"></div>
          </div>
        )}
        <iframe
          src={finalGameUrl}
          className="w-full h-full border-none m-0 p-0 block"
          title="Game"
          allow="autoplay; fullscreen; payment; display-capture; camera; microphone; geolocation; accelerometer; gyroscope; magnetometer; clipboard-read; clipboard-write"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          loading="eager"
          muted
          onLoad={() => setIsIframeLoading(false)}
        />
      </div>

      <div className="w-full flex justify-center items-center bg-black border-t border-white/10 z-20 shrink-0">
        <iframe
          srcDoc={`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { margin: 0; padding: 0; overflow: hidden; background: transparent; }
                    * { max-width: 100% !important; max-height: 50px !important; }
                </style>
            </head>
            <body>
                <script type="text/javascript">
                    window.atOptions = {
                        'key': '9adddfc2b9f962e7595071bcbd5cc4e5',
                        'format': 'iframe',
                        'height': 50,
                        'width': 320,
                        'params': {}
                    };
                </script>
                <script type="text/javascript" src="//www.highperformanceformat.com/9adddfc2b9f962e7595071bcbd5cc4e5/invoke.js"></script>
            </body>
            </html>
          `}
          sandbox="allow-scripts allow-same-origin allow-top-navigation-by-user-activation allow-popups"
          style={{
            width: '100%',
            height: '50px',
            border: 'none',
            maxHeight: '50px',
            overflow: 'hidden'
          }}
          title="Advertisement"
        />
      </div>
    </div>
  )
}