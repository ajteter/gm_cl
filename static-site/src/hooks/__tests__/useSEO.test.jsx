import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import useSEO, { useGameSEO, useRandomGameSEO, useHomeSEO, usePlaySEO, usePrivacySEO, useNotFoundSEO } from '../useSEO'

// Wrapper component for React Router
const wrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('useSEO hooks', () => {
  describe('useSEO', () => {
    it('should render without errors', () => {
      const seoConfig = {
        title: 'Test Page',
        description: 'Test description'
      }

      expect(() => {
        renderHook(() => useSEO(seoConfig), { wrapper })
      }).not.toThrow()
    })

    it('should handle empty config', () => {
      expect(() => {
        renderHook(() => useSEO({}), { wrapper })
      }).not.toThrow()
    })
  })

  describe('useGameSEO', () => {
    it('should render without errors with game data', () => {
      const mockGame = {
        id: 'test-game',
        title: 'Test Game',
        description: 'A test game',
        namespace: 'test-game',
        thumb: 'https://example.com/thumb.png'
      }

      expect(() => {
        renderHook(() => useGameSEO(mockGame), { wrapper })
      }).not.toThrow()
    })

    it('should handle null game', () => {
      expect(() => {
        renderHook(() => useGameSEO(null), { wrapper })
      }).not.toThrow()
    })
  })

  describe('useRandomGameSEO', () => {
    it('should render without errors', () => {
      const mockGame = {
        id: 'random-game',
        title: 'Random Game',
        description: 'A random game'
      }

      expect(() => {
        renderHook(() => useRandomGameSEO(mockGame), { wrapper })
      }).not.toThrow()
    })

    it('should handle null game', () => {
      expect(() => {
        renderHook(() => useRandomGameSEO(null), { wrapper })
      }).not.toThrow()
    })
  })

  describe('useHomeSEO', () => {
    it('should render without errors', () => {
      expect(() => {
        renderHook(() => useHomeSEO(100, 1), { wrapper })
      }).not.toThrow()
    })

    it('should handle paginated home page', () => {
      expect(() => {
        renderHook(() => useHomeSEO(100, 2), { wrapper })
      }).not.toThrow()
    })
  })

  describe('usePlaySEO', () => {
    it('should render without errors', () => {
      expect(() => {
        renderHook(() => usePlaySEO('https://example.com/game'), { wrapper })
      }).not.toThrow()
    })
  })

  describe('usePrivacySEO', () => {
    it('should render without errors', () => {
      expect(() => {
        renderHook(() => usePrivacySEO(), { wrapper })
      }).not.toThrow()
    })
  })

  describe('useNotFoundSEO', () => {
    it('should render without errors', () => {
      expect(() => {
        renderHook(() => useNotFoundSEO(), { wrapper })
      }).not.toThrow()
    })
  })
})