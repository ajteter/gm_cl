import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import useGames from '../useGames'

// Mock fetch globally
global.fetch = vi.fn()

// Mock setTimeout to avoid delays in tests
vi.mock('timers', () => ({
  setTimeout: vi.fn((fn) => fn())
}))

describe('useGames', () => {
  beforeEach(() => {
    fetch.mockClear()
    vi.clearAllTimers()
  })

  it('should fetch games successfully', async () => {
    const mockGames = [
      {
        id: '1',
        title: 'Test Game 1',
        url: 'https://example.com/game1',
        description: 'Test description'
      },
      {
        id: '2',
        title: 'Test Game 2',
        url: 'https://example.com/game2',
        description: 'Test description'
      }
    ]

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGames
    })

    const { result } = renderHook(() => useGames())

    // Initially loading
    expect(result.current.loading).toBe(true)
    expect(result.current.games).toEqual([])
    expect(result.current.error).toBe(null)

    // Wait for fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.games).toEqual(mockGames)
    expect(result.current.error).toBe(null)
    expect(fetch).toHaveBeenCalledWith('/games.json')
  })

  it('should handle fetch error', async () => {
    fetch.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useGames())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 5000 })

    expect(result.current.games).toEqual([])
    expect(result.current.error).toBe('Network error')
    expect(fetch).toHaveBeenCalledTimes(3) // Should retry 3 times
  })

  it('should handle HTTP error response', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404
    })

    const { result } = renderHook(() => useGames())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 5000 })

    expect(result.current.games).toEqual([])
    expect(result.current.error).toBe('HTTP 404: Failed to fetch games')
    expect(fetch).toHaveBeenCalledTimes(3) // Should retry 3 times
  })

  it('should handle invalid JSON data', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => 'invalid data'
    })

    const { result } = renderHook(() => useGames())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 5000 })

    expect(result.current.games).toEqual([])
    expect(result.current.error).toBe('Invalid games data: expected array')
    expect(fetch).toHaveBeenCalledTimes(3) // Should retry 3 times
  })

  it('should filter out invalid games', async () => {
    const mockData = [
      {
        id: '1',
        title: 'Valid Game',
        url: 'https://example.com/game1',
        description: 'Test description'
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
      {
        id: '4',
        title: 'Invalid Game - No URL'
      },
      null,
      undefined
    ]

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    const { result } = renderHook(() => useGames())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.games).toHaveLength(1)
    expect(result.current.games[0].id).toBe('1')
    expect(result.current.error).toBe(null)
  })

  it('should handle empty valid games', async () => {
    const mockData = [
      { id: '', title: 'Invalid', url: '' },
      { id: '2', title: '', url: 'test' },
      null
    ]

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData
    })

    const { result } = renderHook(() => useGames())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 5000 })

    expect(result.current.games).toEqual([])
    expect(result.current.error).toBe('No valid games found in data')
    expect(fetch).toHaveBeenCalledTimes(3) // Should retry 3 times
  })

  it('should refetch games when refetch is called', async () => {
    const mockGames = [
      {
        id: '1',
        title: 'Test Game',
        url: 'https://example.com/game1'
      }
    ]

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockGames
    })

    const { result } = renderHook(() => useGames())

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
})