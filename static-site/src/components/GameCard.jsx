import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function GameCard({ game }) {
  const [descExpanded, setDescExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const onToggleDesc = useCallback(() => setDescExpanded((v) => !v), [])

  // 直接使用原始链接，通过 referrer 头进行追踪
  const gameUrl = game.url

  // 添加点击处理函数，保持广告归因参数
  const handleGameClick = useCallback((url) => {
    setIsLoading(true)

    // 获取当前页面的广告归因参数
    const currentParams = new URLSearchParams(location.search)
    const playUrl = new URL('/game/play', window.location.origin)
    playUrl.searchParams.set('url', url)

    // 传递广告归因参数
    currentParams.forEach((value, key) => {
      if (key !== 'page') { // 排除分页参数
        playUrl.searchParams.set(key, value)
      }
    })

    navigate(playUrl.pathname + playUrl.search)
  }, [navigate, location.search])

  return (
    <li className="flex flex-col bg-card border border-card-border rounded-xl overflow-hidden hover:border-text-muted/30 hover:bg-card-border/50 transition-all duration-300 w-full group">
      <div className="relative w-full aspect-video sm:aspect-[4/3] bg-background/50 overflow-hidden">
        <button
          onClick={() => handleGameClick(gameUrl)}
          className={`block w-full h-full p-0 border-0 bg-transparent cursor-pointer transition-opacity ${isLoading ? 'opacity-60 pointer-events-none' : 'group-hover:opacity-90'}`}
          disabled={isLoading}
          aria-label={`打开 ${game.title}`}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full border-4 border-transparent border-t-white animate-spin-fast"></div>
            </div>
          )}
          <img
            src={game.thumb}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </button>
        <span
          className="absolute left-3 top-3 px-3 py-1 bg-black/60 text-white text-xs font-medium rounded-full border border-white/20 backdrop-blur-md shadow-sm pointer-events-none"
          aria-label="分类"
        >
          {game.category}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-base font-bold text-text-main mb-2 line-clamp-1">{game.title}</h2>
        <p
          className={`text-sm text-text-muted mb-4 cursor-pointer hover:text-text-main transition-colors ${descExpanded ? '' : 'line-clamp-2'}`}
          onClick={onToggleDesc}
          role="button"
          aria-expanded={descExpanded}
        >
          {game.description}
        </p>
        <div className="mt-auto pt-2">
          <button
            onClick={() => handleGameClick(gameUrl)}
            className="w-full relative flex items-center justify-center py-3.5 px-6 bg-primary hover:bg-primary-hover text-green-950 font-black text-lg rounded-xl border border-primary-hover shadow-[0_4px_0_#0e7a36] active:translate-y-1 active:shadow-none transition-all duration-150 disabled:opacity-70 disabled:pointer-events-none disabled:active:translate-y-0 disabled:active:shadow-[0_4px_0_#0e7a36]"
            disabled={isLoading}
            aria-label={`开始 ${game.title}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 rounded-full border-2 border-transparent border-t-green-950 animate-spin-fast"></div>
            ) : (
              'PLAY'
            )}
          </button>
        </div>
      </div>
    </li>
  )
}