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
    const playUrl = new URL('/play', window.location.origin)
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
    <li className="card">
      <div className="media">
        <button 
          onClick={() => handleGameClick(gameUrl)} 
          className={`thumbLink ${isLoading ? 'loading' : ''}`} 
          disabled={isLoading}
          aria-label={`打开 ${game.title}`}
        >
          <img src={game.thumb} alt={game.title} className="thumb" loading="lazy" />
        </button>
        <span className="badge" aria-label="分类">{game.category}</span>
      </div>
      <div className="content">
        <h2 className="gameTitle">{game.title}</h2>
        <p 
          className={descExpanded ? 'desc expanded' : 'desc'} 
          onClick={onToggleDesc} 
          role="button" 
          aria-expanded={descExpanded}
        >
          {game.description}
        </p>
        <div className="actions">
          <button 
            onClick={() => handleGameClick(gameUrl)} 
            className={`playBtn ${isLoading ? 'loading' : ''}`} 
            disabled={isLoading}
            aria-label={`开始 ${game.title}`}
          >
            PLAY
          </button>
        </div>
      </div>
    </li>
  )
}