import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import useRandomGame from '../useRandomGame'

// Mock fetch globally
global.fetch = vi.fn()

describe('useRandomGame', () => {
  const mockGames = [
    {
      id: '1',
      title: 'Game One',
      url: 'https://example.com/game1',
      description: 'First game'
    },
    {
      id: '2',
      title: 'Game Two',
      url: 'https://example.com/game2',
      description: 'Second game'
    },
    {
      id: '3',
      title: 'Game Three',
      url: 'https://example.com/game3',
      description: 'Third game'
    }
  ]

  beforeEach(() => {
    fetch.mockClear()
    vi.clearAllTimers()
  })

  it('should fetch and select a random game successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGames
    })

    const { result } = renderHook(() => useRandomGame())

    // Initially loading
    expect(result.current.loading).toBe(true)
    expect(result.current.game).toBe(null)
    expect(result.current.error).toBe(null)

    // Wait for fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.game).toBeTruthy()
    expect(result.current.game.id).toBeTruthy()
    expect(result.current.game.title).toBeTruthy()
    expect(result.current.game.url).toBeTruthy()
    expect(result.current.error).toBe(null)
    expect(fetch).toHaveBeenCalledWith('/games.json')
  })

  it('should select the same game for the same date', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockGames
    })

    const testDate = new Date('2024-01-15')

    // First hook with specific date
    const { result: result1 } = renderHook(() => useRandomGame(testDate))
    await waitFor(() => {
      expect(result1.current.loading).toBe(false)
    })

    // Second hook with same date
    const { result: result2 } = renderHook(() => useRandomGame(testDate))
    await waitFor(() => {
      expect(result2.current.loading).toBe(false)
    })

    // Should select the same game
    expect(result1.current.game.id).toBe(result2.current.game.id)
  })

  it('should select different games for different dates', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockGames
    })

    const date1 = new Date('2024-01-15')
    const date2 = new Date('2024-01-16')

    // First hook with date1
    const { result: result1 } = renderHook(() => useRandomGame(date1))
    await waitFor(() => {
      expect(result1.current.loading).toBe(false)
    })

    // Second hook with date2
    const { result: result2 } = renderHook(() => useRandomGame(date2))
    await waitFor(() => {
      expect(result2.current.loading).toBe(false)
    })

    // Should select different games (with high probability)
    // Note: There's a small chance they could be the same, but very unlikely with 3 games
    expect(result1.current.game.id).not.toBe(result2.current.game.id)
  })

  it('should handle fetch error with retry', async () => {
    fetch.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useRandomGame())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 5000 })

    expect(result.current.game).toBe(null)
    expect(result.current.error).toBe('Network error')
    expect(fetch).toHaveBeenCalledTimes(3) // Should retry 3 times
  })

  it('should handle HTTP error response', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404
    })

    const { result } = renderHook(() => useRandomGame())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 5000 })

    expect(result.current.game).toBe(null)
    expect(result.current.error).toBe('Failed to load games: 404')
    expect(fetch).toHaveBeenCalledTimes(3) // Should retry 3 times
  })

  it('should handle invalid JSON data', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => 'invalid data'
    })

    const { result } = renderHook(() => useRandomGame())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 5000 })

    expect(result.current.game).toBe(null)
    expect(result.current.error).toBe('Invalid games data: expected array')
  })

  it('should handle empty games array', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => []
    })

    const { result } = renderHook(() => useRandomGame())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 5000 })

    expect(result.current.game).toBe(null)
    expect(result.current.error).toBe('No games available')
  })

  it('should filter out invalid games', async () => {
    const mixedGames = [
      {
        id: '1',
        title: 'Valid Game',
        url: 'https://example.com/game1',
        description: 'Valid game'
      },
      {
        id: '',
        title: 'Invalid Game - Empty ID',
        url: 'https://example.com/game2'
      },
      {
        id: '3',
        title: '',
        url: 'https://example.com/game3'
      },
      null,
      undefined
    ]

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mixedGames
    })

    const { result } = renderHook(() => useRandomGame())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.game).toBeTruthy()
    expect(result.current.game.id).toBe('1')
    expect(result.current.game.title).toBe('Valid Game')
    expect(result.current.error).toBe(null)
  })

  it('should handle no valid games after filtering', async () => {
    const invalidGames = [
      { id: '', title: 'Invalid', url: '' },
      { id: '2', title: '', url: 'test' },
      null
    ]

    fetch.mockResolvedValue({
      ok: true,
      json: async () => invalidGames
    })

    const { result } = renderHook(() => useRandomGame())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 5000 })

    expect(result.current.game).toBe(null)
    expect(result.current.error).toBe('No valid games found')
  })

  it('should refetch when refetch is called', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockGames
    })

    const { result } = renderHook(() => useRandomGame())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const initialCallCount = fetch.mock.calls.length

    // Call refetch
    result.current.refetch()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(initialCallCount + 1)
    })
  })

  it('should use deterministic selection based on date', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockGames
    })

    // Test with a specific date multiple times
    const testDate = new Date('2024-12-25') // Christmas day
    const results = []

    for (let i = 0; i < 5; i++) {
      const { result } = renderHook(() => useRandomGame(testDate))
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      results.push(result.current.game.id)
    }

    // All results should be the same
    const firstResult = results[0]
    results.forEach(result => {
      expect(result).toBe(firstResult)
    })
  })
})