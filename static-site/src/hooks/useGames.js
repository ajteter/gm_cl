import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for fetching games data from static JSON file
 * @returns {Object} { games, loading, error, refetch }
 */
function useGames() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Fetch games with retry mechanism
   * @param {number} retries - Number of retry attempts
   * @param {number} baseDelay - Base delay for retries (for testing)
   */
  const fetchGames = useCallback(async (retries = 3, baseDelay = 1000) => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/games.json')
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch games`)
        }

        const data = await response.json()

        // Validate data structure
        if (!Array.isArray(data)) {
          throw new Error('Invalid games data: expected array')
        }

        // Validate each game object has required fields
        const validGames = data.filter(game => {
          return game && 
                 typeof game.id === 'string' && 
                 typeof game.title === 'string' && 
                 typeof game.url === 'string' &&
                 game.id.length > 0 &&
                 game.title.length > 0 &&
                 game.url.length > 0
        })

        if (validGames.length === 0) {
          throw new Error('No valid games found in data')
        }

        setGames(validGames)
        setLoading(false)
        return // Success, exit retry loop

      } catch (err) {
        console.error(`Attempt ${attempt + 1} failed:`, err)
        
        if (attempt === retries - 1) {
          // Last attempt failed
          setError(err.message)
          setLoading(false)
          setGames([])
        } else if (baseDelay > 0) {
          // Wait before retry (exponential backoff) - skip in tests
          await new Promise(resolve => setTimeout(resolve, baseDelay * (attempt + 1)))
        }
      }
    }
  }, [])

  // Refetch function for manual retry
  const refetch = useCallback(() => {
    const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test'
    fetchGames(3, isTest ? 0 : 1000)
  }, [fetchGames])

  // Initial fetch on mount
  useEffect(() => {
    // Use 0 delay in test environment
    const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test'
    fetchGames(3, isTest ? 0 : 1000)
  }, [fetchGames])

  return {
    games,
    loading,
    error,
    refetch
  }
}

export default useGames