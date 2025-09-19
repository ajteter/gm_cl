import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useRandomGame from '../hooks/useRandomGame'

/**
 * DirectGpvRedirect component handles the /game/direct/gpv route
 * This route gets the daily game and redirects directly to the game URL
 * while preserving any URL parameters for ad attribution
 */
function DirectGpvRedirect() {
  const navigate = useNavigate()
  const { game, loading, error } = useRandomGame()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (loading || isRedirecting) return

    if (error || !game || !game.url) {
      // If there's an error or no game, redirect to main game page
      navigate('/game', { replace: true })
      return
    }

    setIsRedirecting(true)

    // Get current URL parameters for ad attribution
    const currentParams = new URLSearchParams(window.location.search)
    
    if (currentParams.toString()) {
      // If there are URL parameters, add them to the game URL
      const gameUrl = new URL(game.url)
      currentParams.forEach((value, key) => {
        gameUrl.searchParams.set(key, value)
      })
      window.location.replace(gameUrl.toString())
    } else {
      // No parameters, redirect directly to game
      window.location.replace(game.url)
    }
  }, [game, loading, error, navigate, isRedirecting])

  if (loading || isRedirecting) {
    return (
      <div className="container">
        <div className="loading-container">
          <div>Loading game...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <div>Failed to load game. Redirecting...</div>
        </div>
      </div>
    )
  }

  return null
}

export default DirectGpvRedirect