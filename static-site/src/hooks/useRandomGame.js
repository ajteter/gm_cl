import { useState, useEffect, useCallback } from 'react'

/**
 * Generate a deterministic seed from a date string
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {number} - Deterministic seed
 */
function generateSeed(dateString) {
  let seed = 0
  for (let i = 0; i < dateString.length; i++) {
    seed = ((seed << 5) - seed) + dateString.charCodeAt(i)
    seed = seed & seed // Convert to 32bit integer
  }
  return seed
}

/**
 * Get today's date string in YYYY-MM-DD format
 * @param {Date} date - Optional date object (for testing)
 * @returns {string} - Date string
 */
function getTodayString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Custom hook for getting today's random game with deterministic daily selection
 * @param {Date} customDate - Optional custom date for testing
 * @returns {Object} { game, loading, error, refetch }
 */
function useRandomGame(customDate = null) {
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Fetch games and select today's game with retry mechanism
   * @param {number} retries - Number of retry attempts
   * @param {number} baseDelay - Base delay for retries (for testing)
   */
  const fetchRandomGame = useCallback(async (retries = 3, baseDelay = 1000) => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/games.json')
        
        if (!response.ok) {
          throw new Error(`Failed to load games: ${response.status}`)
        }

        const activeGames = await response.json()

        // Validate data structure
        if (!Array.isArray(activeGames)) {
          throw new Error('Invalid games data: expected array')
        }

        if (activeGames.length === 0) {
          throw new Error('No games available')
        }

        // Filter valid games
        const validGames = activeGames.filter(game => {
          return game && 
                 typeof game.id === 'string' && 
                 typeof game.title === 'string' && 
                 typeof game.url === 'string' &&
                 game.id.length > 0 &&
                 game.title.length > 0 &&
                 game.url.length > 0
        })

        if (validGames.length === 0) {
          throw new Error('No valid games found')
        }

        // Use the current date as a seed to ensure the same game is selected for the entire day
        const dateString = getTodayString(customDate || new Date())
        const seed = generateSeed(dateString)
        const gameIndex = Math.abs(seed) % validGames.length
        const selectedGame = validGames[gameIndex]

        if (!selectedGame?.url) {
          throw new Error('Invalid game data')
        }

        setGame(selectedGame)
        setLoading(false)
        return // Success, exit retry loop

      } catch (err) {
        console.error(`Attempt ${attempt + 1} failed:`, err)
        
        if (attempt === retries - 1) {
          // Last attempt failed
          setError(err.message)
          setLoading(false)
          setGame(null)
        } else if (baseDelay > 0) {
          // Wait before retry (exponential backoff) - skip in tests
          await new Promise(resolve => setTimeout(resolve, baseDelay * (attempt + 1)))
        }
      }
    }
  }, [customDate])

  // Refetch function for manual retry
  const refetch = useCallback(() => {
    const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test'
    fetchRandomGame(3, isTest ? 0 : 1000)
  }, [fetchRandomGame])

  // Initial fetch on mount
  useEffect(() => {
    const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test'
    fetchRandomGame(3, isTest ? 0 : 1000)
  }, [fetchRandomGame])

  return {
    game,
    loading,
    error,
    refetch
  }
}

export default useRandomGame